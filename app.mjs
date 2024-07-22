import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import session from 'express-session'
import passport from 'passport'
import { Strategy  as LocalStrategy } from 'passport-local'
import flash from 'connect-flash'
import bodyParser from 'body-parser'
import userRoutes from './src/routes/userRoutes.mjs'
import { errorHandler } from './src/middlewares/errorMiddleware.mjs'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const fakeUser = {
  id: '123',
  username: 'admin',
  password: 'password'
}

const sessionOptions = {
  secret: 'secret_key',
  resave: false,
  saveUninitialized: false
}
passport.use(
  new LocalStrategy(( username, password, done ) => {
    if ( username === fakeUser.username && password === fakeUser.password ) {
      return done( null, fakeUser )
    } else {
      return done( null, false, { message: 'Невірні дані' } )
    }
  })
)

app.use(
  session({
    secret: 'secret_key',
    resave: false,
    saveUninitialized: false
  })
)

app.use(flash())
app.use(passport.initialize())
app.use(passport.session())

passport.serializeUser((user, done) => {
  done( null, user.id )
})

passport.deserializeUser(( id, done ) => {
  if ( id === fakeUser.id ) {
    done( null, fakeUser )
  } else {
    done( new Error('Невірний ID користувача') )
  }
})

// app.post(
//   '/login',
//   passport.authenticate('local', {
//     failureRedirect: '/login',
//     failureFlash: true
//   }),
//   (req, res) => {
//     res.redirect('/protected')
//   }
// )

app.use(express.urlencoded({ extended: true }))
app.set('view engine', 'pug')
app.set('views', './views')

app.use(express.static(path.join(__dirname, 'public')))

app.use(bodyParser.json())
app.use('/', userRoutes)
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`)
})