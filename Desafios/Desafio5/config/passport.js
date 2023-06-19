import local from 'passport-local'; 
import passport from 'passport'; 
import { userModel } from '../models/Users.js';
import { createHash, validatePassword } from '../utils/bcrypt.js';

const LocalStrategy = local.Strategy;

const initializePassport = () => {
    passport.use('register', new LocalStrategy(
        {passReqToCallback: true, usernameField: 'email'}, async(req, username, password, done) => {
            const {first_name, last_name, email, gender} = req.body;

            const user = await userModel.findOne({email: email}); 

            if(user) {
                return done(null, false);
            }

            const passwordHash = createHash(password);
            const userCreated = await userModel.create({
                first_name: first_name,
                last_name: last_name,
                email: email,
                gender: gender,
                password: passwordHash
            });

            return done(null, userCreated);
        }
    ));

    
    passport.serializeUser((user, done) => {
        done(null, user._id)
    });

    
    passport.deserializeUser(async(id, done) => {
        const user = await userModel.findById(id);
        done(null, user);
    });

    passport.use('login', new LocalStrategy({usernameField: 'email'}, async(username, password, done) => {

        const user = await userModel.findOne({email: username});

        if (!user) {
            return (done, null);
        }

        if (validatePassword(password, user.password)) {
            return done(null, user);
        }

        return done(null, false)

    }))
}

export default initializePassport;