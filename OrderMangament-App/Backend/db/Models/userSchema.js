const { Schema, model } = require('mongoose');

const userSchema = Schema(
  {
    fname: { type: String, required: true },
    lname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

const User = model('usersignup', userSchema);

module.exports = User;
