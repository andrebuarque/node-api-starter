import HttpStatus from 'http-status';
import User from '../../models/User';
import jwt from 'jsonwebtoken';
import properties from '../../config/properties';

describe('User Routes', () => {
  const userDefault = {
    name: 'Any User',
    username: 'anyusername',
    password: '123455678',
    email: 'mail@mail.com'
  };

  beforeEach(async () => {
    await User.deleteMany({});
  });

  after(async () => {
    await User.deleteMany({});
  });

  describe('GET /users', () => {
    it('should return a array of users', done => {
      User.create(userDefault).then(user => {
        const token = jwt.sign({ id: user._id }, properties.jwtSecret);

        request
          .get('/users')
          .set('Authorization', `Bearer ${token}`)
          .expect(HttpStatus.OK)
          .expect(res => {
            const user = res.body[0];

            assert.isObject(user);
            assert.property(user, '_id');
            assert.equal(user.name, userDefault.name);
            assert.equal(user.username, userDefault.username);
            assert.equal(user.email, userDefault.email);
            assert.isOk(user.createdAt);
          })
          .end(done);
      });
    });

    it('should return a "Unauthorized" error', done => {
      User.create(userDefault).then(() => {
        request
          .get('/users')
          .expect(HttpStatus.UNAUTHORIZED)
          .end(done);
      });
    });
  });

  describe('POST /users', () => {
    it('should register a user', done => {
      userDefault.email = 'andre.mail@gmail.com';

      request
        .post('/users')
        .send(userDefault)
        .expect(HttpStatus.CREATED)
        .expect(res => {
          const result = res.body;

          assert.isObject(result);
          assert.property(result, 'user');
          assert.property(result, 'token');

          const user = result.user;

          assert.equal(user.name, userDefault.name);
          assert.equal(user.username, userDefault.username);
          assert.equal(user.email, userDefault.email);
        })
        .end(done);
    });

    it('should not register a user because is invalid mail', done => {
      const newUser = Object.assign({}, userDefault);
      newUser.email = 'asd.asd';
      newUser.password = '12345678';

      request
        .post('/users')
        .send(newUser)
        .expect(HttpStatus.BAD_REQUEST)
        .expect(res => {
          const result = res.body;

          assert.isObject(result);
          assert.property(result, 'error');
          assert.include(result.error, 'is not a valid email');
        })
        .end(done);
    });
  });

  describe('POST /users/authenticate', () => {
    it('should authenticate the user', done => {
      const params = {
        email: userDefault.email,
        password: userDefault.password
      };

      User.create(userDefault).then(() => {
        request
          .post('/users/authenticate')
          .send(params)
          .expect(HttpStatus.OK)
          .expect(res => {
            const user = res.body;

            assert.isObject(user);
            assert.property(user, 'name');
            assert.property(user, 'email');
            assert.property(user, 'token');
          })
          .end(done);
      });
    });

    it('should not authenticate the user with email not registered', done => {
      const params = {
        email: 'dasl',
        password: userDefault.password
      };

      User.create(userDefault).then(() => {
        request
          .post('/users/authenticate')
          .send(params)
          .expect(HttpStatus.UNAUTHORIZED)
          .end(done);
      });
    });

    it('should not authenticate the user with invalid password', done => {
      const params = {
        email: userDefault.email,
        password: 'other-password'
      };

      User.create(userDefault).then(() => {
        request
          .post('/users/authenticate')
          .send(params)
          .expect(HttpStatus.UNAUTHORIZED)
          .end(done);
      });
    });

    it('should not authenticate the user if params is empty', done => {
      User.create(userDefault).then(() => {
        request
          .post('/users/authenticate')
          .expect(HttpStatus.BAD_REQUEST)
          .end(done);
      });
    });
  });
});
