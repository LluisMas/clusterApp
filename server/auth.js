const jwt = require('express-jwt');
const jwt2 = require('jsonwebtoken');


const getTokenFromHeaders = (req) => {
  const { headers: { authorization } } = req;

  if(authorization){
    return authorization;
  }

  console.log("unauthorized");
  return null;
};

const auth = {
  required: jwt({
    secret: 'secret',
    userProperty: 'payload',
    getToken: getTokenFromHeaders,
  }),
  optional: jwt({
    secret: 'secret',
    userProperty: 'payload',
    getToken: getTokenFromHeaders,
    credentialsRequired: false,
  }),
};

module.exports = auth;
