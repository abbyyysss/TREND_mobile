// services/notificationService.js
import api from './Api';
import { BASE_URL, ACCESS_TOKEN } from './Constants';

// Fetch all notifications
export async function getNotifications() {
  const res = await api.get('notifications/');
  return res.data;
}

// Mark single notification as read
export async function markNotificationAsRead(notifId) {
  const res = await api.post(`notifications/${notifId}/mark-as-read/`);
  return res.data;
}

// Mark single notification as unread
export async function markNotificationAsUnread(notifId) {
  const res = await api.post(`notifications/${notifId}/mark-as-unread/`);
  return res.data;
}

// Bulk mark as read
export async function bulkMarkAsRead(ids) {
  const res = await api.post(`notifications/bulk-mark-as-read/`, { ids });
  return res.data;
}

// Delete a room type
export const deleteNotifications = (token) =>
  api.delete(`/notifications/${token}/`).then((res) => res.data)

/**
 * Create an auto-reconnecting WebSocket connected to the notifications endpoint.
 * Returns a cleanup function that closes the socket and cancels reconnect attempts.
 *
 * token: JWT string (raw, not "Bearer ...")
 * onMessage: function(data) - called with parsed message object
 * onError: function(err)
 * options: { initialDelay, maxDelay, maxRetries, heartbeatInterval }
 */
export function createAutoReconnectSocket(
  token,
  onMessage,
  onError,
  options = {}
) {
  if (!token) {
    console.error('createAutoReconnectSocket: no token provided');
    return () => {};
  }

  const {
    initialDelay = 1000,
    maxDelay = 30000,
    maxRetries = Infinity,
    heartbeatInterval = 20000,
  } = options;

  // Build ws/wss URL from BASE_URL
  // Examples:
  // BASE_URL = "http://127.0.0.1:8000" -> ws://127.0.0.1:8000
  // BASE_URL = "https://api.example.com" -> wss://api.example.com
  let base = (typeof BASE_URL === 'string' && BASE_URL) || window.location.origin;
  base = base.replace(/\/$/, ''); // remove trailing slash
  let wsBase;
  if (base.startsWith('https://')) wsBase = base.replace(/^https:/, 'wss:');
  else if (base.startsWith('http://')) wsBase = base.replace(/^http:/, 'ws:');
  else {
    // fallback to location origin
    const { protocol, host } = window.location;
    wsBase = (protocol === 'https:' ? 'wss:' : 'ws:') + '//' + host;
  }

  const encodedToken = encodeURIComponent(token);
  const wsPath = `${wsBase}/ws/notifications/?token=${encodedToken}`;

  let socket = null;
  let shouldReconnect = true;
  let reconnectAttempts = 0;
  let reconnectTimer = null;
  let heartbeatTimer = null;
  let manuallyClosed = false;

  const clearTimers = () => {
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }
    if (heartbeatTimer) {
      clearInterval(heartbeatTimer);
      heartbeatTimer = null;
    }
  };

  const startHeartbeat = () => {
    clearTimers();
    if (heartbeatInterval && socket && socket.readyState === WebSocket.OPEN) {
      heartbeatTimer = setInterval(() => {
        try {
          // simple heartbeat - adjust if your server expects different ping format
          socket.send(JSON.stringify({ type: 'ping' }));
        } catch (err) {
          // ignore send errors; socket will likely close and trigger reconnect
        }
      }, heartbeatInterval);
    }
  };

  const connect = () => {
    if (!shouldReconnect || (reconnectAttempts > maxRetries)) return;
    reconnectAttempts += 1;

    try {
      console.log(`🔌 [notifications] connecting to ${wsPath} (attempt ${reconnectAttempts})`);
      socket = new WebSocket(wsPath);

      socket.onopen = () => {
        console.log('✅ [notifications] WebSocket connected');
        reconnectAttempts = 0; // reset on successful connect
        startHeartbeat();
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          onMessage?.(data);
        } catch (err) {
          console.error('Failed to parse notification message:', err);
        }
      };

      socket.onerror = (err) => {
        console.error('❌ [notifications] WebSocket error', err);
        onError?.(err);
      };

      socket.onclose = (e) => {
        clearTimers();
        if (manuallyClosed) {
          console.log('🔒 [notifications] WebSocket manually closed; no reconnect.');
          return;
        }

        if (!shouldReconnect) {
          console.log('🔌 [notifications] shouldReconnect false, not reconnecting.');
          return;
        }

        // exponential backoff
        const delay = Math.min(initialDelay * 2 ** (reconnectAttempts - 1), maxDelay);
        console.warn(`🔌 [notifications] closed. reconnecting in ${delay / 1000}s...`, e);
        reconnectTimer = setTimeout(() => {
          connect();
        }, delay);
      };
    } catch (err) {
      console.error('🔌 [notifications] connect caught error', err);
      onError?.(err);
    }
  };

  // start connecting
  connect();

  // return cleanup function that stops reconnection attempts and closes socket
  const cleanup = () => {
    console.log('🧹 [notifications] cleanup called - closing socket and stopping reconnects');
    shouldReconnect = false;
    manuallyClosed = true;
    clearTimers();
    try {
      socket?.close();
    } catch (err) {
      // ignore
    }
  };

  return cleanup;
}
