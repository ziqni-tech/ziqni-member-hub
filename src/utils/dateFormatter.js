export const dateFormatter = (val, timeStyle = null) => {
  if(!val) return '';
  const date = new Date(val);
  return date.toLocaleString('en-GB', {
    timeZone: 'UTC',
    dateStyle: 'short',
    timeStyle: 'short',
  });
};