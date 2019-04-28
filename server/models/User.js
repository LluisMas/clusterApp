const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const Role = require('./Roles');

const { Schema } = mongoose;

const UsersSchema = new Schema({
  email: { type: String, unique: true, dropDups: true },
  name: { type: String },
  subjects: [{
    type: Schema.Types.ObjectId, required: false, ref: 'Subject'
  }],
  dni: {
    type: String,
    default: "DNI"
  },
  role: {
    type: Role,
    default: Role.Estudiante
  },
  hash: String,
  salt: String,

});

UsersSchema.methods.setPassword = function(password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

UsersSchema.methods.validatePassword = function(password) {
  const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
  return this.hash === hash;
};

UsersSchema.methods.generateJWT = function() {
  const today = new Date();
  const expirationDate = new Date(today);
  expirationDate.setDate(today.getDate() + 60);

  return jwt.sign({
    email: this.email,
    id: this._id,
    exp: parseInt(expirationDate.getTime() / 1000, 10),
  }, 'secret');
};

UsersSchema.methods.toAuthJSON = function() {
  return {
    _id: this._id,
    email: this.email,
    name: this.name,
    dni: this.dni,
    token: this.generateJWT(),
    role: this.role,
    subjects: this.subjects
  };
};

module.exports = mongoose.model('User', UsersSchema);
