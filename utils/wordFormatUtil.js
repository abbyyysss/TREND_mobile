export function capitalizeWords(str = '') {
  if (!str) return '';

  return str
    .toLowerCase()
    .split(' ')
    .map((word) =>
      word.length > 0
        ? word.charAt(0).toUpperCase() + word.slice(1)
        : ''
    )
    .join(' ');
}
