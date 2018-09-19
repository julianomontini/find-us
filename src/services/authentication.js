const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');
const passport = require('passport');
const bcrypr = require('bcrypt');

const Customer = require('../../models').Customer;

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: 'JAIFJASIOFJOIASJ99401230948190248910240'
};

exports.jwtOptions = jwtOptions;

const localStrategy = new LocalStrategy({usernameField: 'email'}, ( email, password, done) => {
    Customer
        .findOne({where: {email}})
        .then(user => {
            if(!user)
                done(null, false);
            else if(bcrypr.compareSync(password, user.password)){
                done(null, user);
            }
            else
                done(null, false);
        })
        .catch(err => done(err));
})

const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
    Customer
        .findById(payload.sub)
        .then(user => {
            if(user) 
                done(null, user)
            else
                done(null, false); 
        })
        .catch(err => done(err, false));
})

passport.use(localStrategy);
passport.use(jwtLogin);

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});