import passport from 'passport';
import passportJwt from 'passport-jwt';
import User from '../models/User';
import properties from './properties';

const ExtractJwt = passportJwt.ExtractJwt;
const Strategy = passportJwt.Strategy;
const params = {
  secretOrKey: properties.jwtSecret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
};

const strategy = new Strategy(params, (payload, done) => {
  User.findById(payload.id)
    .then(user => done(null, { user: user.id }))
    .catch(() => done(new Error('User not found'), null));
});

passport.use(strategy);

export default {
  initialize: () => passport.initialize(),
  authenticate: () => passport.authenticate('jwt', properties.jwtSession)
};
