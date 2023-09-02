const formatDateTime = (date: Date) =>
  `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;

export default formatDateTime;
