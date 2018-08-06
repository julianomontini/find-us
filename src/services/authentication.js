const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');
const passport = require('passport');
const bcrypr = require('bcrypt');
const jwt = require('jwt-simple');

const UsuarioRepository = require('../repository/usuario');

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: 'JAIFJASIOFJOIASJ99401230948190248910240'
};

exports.jwtOptions = jwtOptions;

function tokenForUser(user){
    const timestamp = new Date().getTime();
    return jwt.encode({ sub: user.id, iat: timestamp }, jwtOptions.secretOrKey);
}

const localStrategy = new LocalStrategy({usernameField: 'email'}, ( email, password, done) => {
    UsuarioRepository
        .findUsuarioByEmail(email)
        .then(usr => {
            if(!usr)
                done(null, false);
            else if(bcrypr.compareSync(password, usr.senha)){
                const payload = tokenForUser(usr);
                done(null, payload);
            }
            else
                done(null, false);
        }).catch(err => done(err))
})

const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
    UsuarioRepository
        .findUsuarioById(payload.sub)
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

const login = ({email, senha, req}) => {
    return new Promise((resolve, reject) => {
        passport.authenticate('local', (err, usuario) => {
          if(!usuario) reject('Credenciais inválidas')
          else req.login({email, password: senha}, () => resolve(usuario))
        })({body: {email, password: senha}});
    })
}

module.exports = { login }