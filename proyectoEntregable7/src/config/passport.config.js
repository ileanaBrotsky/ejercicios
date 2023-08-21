import passport from "passport";
import GitHubStrategy from 'passport-github2'
import local from 'passport-local'
import {UserModel} from '../dao/models/user.model.js'
import { createHash, isValidPassword } from "../utils.js";

/*for github app
Owned by: @ileanaBrotsky
App ID: 378289
Client ID: Iv1.1c687d8abada1fd5
secret: 307230f9a9f6f79c61e3e57ff87681a350415593
*/

const LocalStrategy = local.Strategy

const initializePassport = () => {

    passport.use('github', new GitHubStrategy(
        {
            clientID:'Iv1.1c687d8abada1fd5',
            clientSecret:'307230f9a9f6f79c61e3e57ff87681a350415593',
            callbackURL:'http://localhost:8080/api/sessions/githubcallback'
        },
        async (accessToken, refreshToken, profile, done)=>{

            console.log(profile)
            try{
                const user= await  UserModel.findOne({email: profile._json.email})
            if(user){
                console.log("el usuario existe"+ email)
                return done(null, user)
            }
            const newUser= {
                    first_name: profile._json.email,
                    last_name:profile._json.last_name,
                    email:profile._json.email,
                    age: profile._json.age,
                    password: '',
                    rol:"usuario"
            }
            const result= await  UserModel.create(newUser)
            return done(null, newUser)
            }catch(e){
        
                return done('Error de login con github ' + error)
            }
           
        }
    ))

    // register Es el nomber para Registrar con Local
    passport.use('register', new LocalStrategy(
        {
            passReqToCallback: true,
            usernameField: 'email'
        },
        async (req, username, password, done) => {
           const {first_name,last_name, email, age}= req.body
    if(!first_name||!last_name||!email||!age) return res.status(400).send({ status: "error", error: "Valores incompletos" })
              
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