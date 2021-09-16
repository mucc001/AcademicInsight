const { mustBeSignedIn } = require('./auth.js');

let aboutMessage = 'Academic Insight v1.5. v2.0 will release this October!';


function setMessage(_, { message }) {
  aboutMessage = message;
  return aboutMessage;
}

function getMessage() {
  return aboutMessage;
}

module.exports = { getMessage, setMessage: mustBeSignedIn(setMessage) };
