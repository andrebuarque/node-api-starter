import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import validator from 'validator';

const schema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email',
      isAsync: false
    }
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

schema.pre('save', function(next) {
  const self = this;
  const salt = bcrypt.genSaltSync();
  self.password = bcrypt.hashSync(self.password, salt);
  next();
});

// schema.loadClass({
//   findByEmail: function() {

//   }
// });

const model = mongoose.model('User', schema);

export default model;
