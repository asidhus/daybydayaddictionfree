const format = require('pg-format');
const { query } = require('./index');

const insertSmoker = (({ name, userNum, email }) =>
  query('INSERT INTO smokers (name, phone, email, progress, responded) VALUES ($1, $2, $3, $4, $5) RETURNING id, email', [name, userNum, email, 0, false]));

const insertFriends = ((friends) => {
  const sql = format('INSERT INTO friends(name, phone, id_smokers) VALUES %L', friends);
  return query(sql);
});

const insertMessage = (message =>
  query('INSERT INTO messages(text, timestamp, id_smokers, id_friends) VALUES ($1, $2, $3, $4)', message));

const checkEmail = (email =>
  query('SELECT * FROM smokers WHERE email=$1', [email]));

const checkCookie = (token =>
  query('SELECT id_smokers FROM cookies WHERE token=$1', [token]));

const insertCookie = (({ token, email, id }) =>
  query('INSERT INTO cookies(token, email, id_smokers) VALUES ($1, $2, $3)', [token, email, id]));

const retrieveUserInfo = (id =>
  query('SELECT * FROM smokers WHERE id=$1', [id]));

const retrieveMessages = (id =>
  query('SELECT * from messages INNER JOIN friends ON friends.id=messages.id_friends WHERE messages.id_smokers=$1', [id]));

const removeCookie = (token =>
  query('DELETE from cookies WHERE token=$1', [token]));


module.exports.insertSmoker = insertSmoker;
module.exports.insertFriends = insertFriends;
module.exports.insertMessage = insertMessage;
module.exports.checkEmail = checkEmail;
module.exports.checkCookie = checkCookie;
module.exports.insertCookie = insertCookie;
module.exports.retrieveUserInfo = retrieveUserInfo;
module.exports.retrieveMessages = retrieveMessages;
module.exports.removeCookie = removeCookie;
