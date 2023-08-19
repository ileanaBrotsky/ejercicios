import passport from "passport";
import local from 'passport-local'
import UserModel from '../dao/models/user.model.js'
import { createHash, isValidPassword } from "../utils.js";

const LocalStrategy = local.Strategy

const initializePassport = () => {

    // register Es el nomber para Registrar con Local
    passport.use('register', new LocalStrategy(
        {
            passReqToCallback: true,
            usernameField: 'email'
        },
        async (req, username, password, done) => {
           const {first_name,last_name, email, age, password}= req.body
    if(!first_name||!last_name||!email||!age||!password) return res.status(400).send({ status: "error", error: "Valores incompletos" })
              
            try {
                const user = await UserModel.findOne({ email: username })
                if (user) {
                    console.log('El usuario ya existe')
                    return done(null, false)
                }

                const newUser = {
                    first_name,
                    last_name,
                    email,
                    age: age,
                    password: createHash(password),
                    rol:"usuario"
                }
                const result = await UserModel.create(newUser)
                return done(null, result)
            } catch (e) {
                return done('Error de registro ' + error)
            }
        }
    ))

    // login Es el nomber para IniciarSesion con Local
    passport.use('login', new LocalStrategy( { usernameField: 'email' }, async (username, password, done) => {
            try {
                const user = await UserModel.findOne({ email: username }).lean().exec()
                if (!user) {
                    console.error('El usuario no existe')
                    return done(null, false)
                }
                if (!isValidPassword(user, password)) {
                    console.error('Password invalido')
                    return done(null, false)
                }
                return done(null, user)
            } catch (e) {
                return done('Error login ' + error)
            }
        }
    ))

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        const user = await UserModel.findById(id)
        done(null, user)
    })

}

export default initializePassport