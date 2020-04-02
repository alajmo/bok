export { fullDateFormat, monthDateFormat };

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

function fullDateFormat(date) {
  const d = new Date(date);
  return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

function monthDateFormat(date) {
  const d = new Date(date);
  return `${MONTHS[d.getMonth()]} ${d.getDate()}`;
}
