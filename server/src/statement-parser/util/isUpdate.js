export default function isRead(statement) {
  return statement.hasOwnProperty('update');
}