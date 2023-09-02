const formatDateTime = (date: Date) =>
  `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;

const wait = (ms: number) =>
  new Promise((resolve) => window.setTimeout(resolve, ms));

export { formatDateTime, wait };
