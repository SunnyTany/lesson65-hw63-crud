import express from 'express'
import session from 'express-session'
import passport from 'passport'
import { Strategy  as LocalStrategy } from 'passport-local'
import flash from 'connect-flash'

const app = express()
const port = 3000

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

app.use(express.urlencoded({ extended: true }))

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

app.post(
  '/login',
  passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true
  }),
  (req, res) => {
    res.redirect('/protected')
  }
)

app.get('/', (req, res) => {
  if ( req.isAuthenticated() ) {
    res.send(`<h1>ГОЛОВНА</h1><p>Ви вже залогінені та маєте повний доступ до всіх сторінок.</p>`)
  } else {
    res.redirect('/login')
  }
})

app.get('/login', (req, res) => {
  if ( req.isAuthenticated() ) {
    res.redirect('/protected')
  } else {
    const form = `
      <h1>Форма входу</h1>
      <form method="POST" action="/login">
        <input type="text" name="username" value="admin" placeholder="Ім'я користувача" required="required">
        <input type="password" name="password" value="password" placeholder="Пароль" required="required" />
        <button type="submit">Вхід</button>
      </form>
      <h2>${req.flash('error')}</h2>`
    res.send(form)
  }
})

app.get('/protected', (req, res) => {
  if ( req.isAuthenticated() ) {
    res.send(`<h1>ЗАХИЩЕНА СТОРІНКА</h1><p>Ви залогінені та маєте доступ до захищеної сторінки.</p>`)
  } else {
    res.redirect('/login')
  }
})

app.listen( port, () => {
  console.log( 'The server has started on port 3000' )
})