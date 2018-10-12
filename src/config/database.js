import mongoose from 'mongoose';

const urlConnection = {
  test: 'mongodb://mongo:27017/node-api-test',
  production: 'mongodb://mongo:27017/node-api'
};

const env = process.env.NODE_ENV || 'production';

export default {
  connect() {
    mongoose.connect(
      urlConnection[env],
      {
        useCreateIndex: true,
        useNewUrlParser: true
      },
      err => {
        if (err) console.error(err);
        else console.log('mongodb connected.');
      }
    );
  }
};
