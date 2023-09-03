import express from 'express'
import passport from 'passport'
import handlebars from 'express-handlebars'
import __dirname from './utils.js'
import mongoose from 'mongoose'
import session from 'express-session'
import initializePassport from './config/passport.config.js'

import sessionRouter from './router/session.router.js'
import cookieParser from 'cookie-parser'

const app= express()

// Motores de plantilla
app.engine('handlebars',handlebars.engine());
app.set('views',__dirname + '/views');
app.set('view engine','handlebars');


// Config session
 app.use(cookieParser())

 app.use(session({
    secret: 'secret', 
    resave: true,
    saveUninitialized: true,
  }));

initializePassport()
app.use(passport.initialize())
app.use(passport.session())

app.use('/', sessionRouter)

 //url DB
 const MONGO_URL="mongodb+srv://ileanabrotsky:siv6iKzPaIw9nxR8@cluster0.kfytoyf.mongodb.net/"
 const MONGO_DB_NAME = 'clase13_01'
mongoose.connect(MONGO_URL, { dbName: MONGO_DB_NAME })
    .then(() => {
        console.log('DB connected 👌 ')
        app.listen(8080, () => console.log('Listening ... 🏃'))
    })
    .catch(e => console.error(e))