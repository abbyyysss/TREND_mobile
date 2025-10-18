export async function extractFileInfo(url) {
  if (!url) return { name: "N/A", type: null, size: "N/A" };
  
  const name = url.split("/").pop();
  const type = name?.split(".").pop();
  let size = "N/A";
  
  try {
    // In React Native, we can try to fetch with HEAD method
    // Note: Some servers may not support HEAD requests
    const res = await fetch(url, { method: "HEAD" });
    const sizeBytes = res.headers.get("Content-Length");
    if (sizeBytes) {
      size = (sizeBytes / (1024 * 1024)).toFixed(2) + " MB";
    }
  } catch (err) {
    console.warn("Failed to fetch file size:", err);
    // Alternative: If HEAD doesn't work, you could fetch with range header
    // or just skip size calculation in React Native
  }
  
  return { name, type, size };
}