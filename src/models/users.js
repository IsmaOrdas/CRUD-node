const mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 7,
    trim: true,
    validate (value) {
      if (value.toLowerCase().trim().includes('password')) {
        throw new Error('Password cannot contain "password"')
      }
    }
  }
})

// Custom method
userSchema.statics.findByCredentials = async (name, password) => {
  const user = await User.findOne({ name });
  console.log(user)
  if (!user) {
    throw new Error('User not found');
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    throw new Error('Unable to login.');
  }

  return user
}

userSchema.pre('save', async function(next) {
  const user = this // this refers to the document about to be save

  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
})

const User = mongoose.model('User', userSchema);

module.exports = User;