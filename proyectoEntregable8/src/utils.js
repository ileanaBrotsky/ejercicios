import { fileURLToPath } from 'url'
import { dirname } from 'path'
import multer from 'multer'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const PRIVATE_KEY= 'secretCookie'

//middleware MULTER para cargar archivo
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    //ubicacion del archivo
    cb(null, __dirname + "/public/img");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

//hash password
export const createHash = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
}

export const isValidPassword = (user, password) => {
  return bcrypt.compareSync(password, user.password) // true o false
}

export const uploader = multer({ storage });
export default __dirname

// JWT Generamos el token
export const generateToken = (user) => {
  const token = jwt.sign( {user}, PRIVATE_KEY, {expiresIn: '24h'})

  return token
}

// JWT Extraemos el token del header
export const authToken = (req, res, next) => {

  // Buscamos el token en el header o en la cookie
  let authHeader = req.headers.auth
  if(!authHeader) {
    authHeader = req.cookies['secretCookie'] 
    if(!authHeader) {
      return res.status(401).send({
          error: 'Not auth'
      })
    }
  }

  // Verificamos y desencriptamos la informacion 
  const token = authHeader
  jwt.verify(token, PRIVATE_KEY, (error, credentials) => {
      if(error) return res.status(403).send({error: 'Not authroized'})

      req.user = credentials.user
      next()
  })
}
export const extractCookie = req => {
  return (req?.cookies) ? req.cookies['secretCookieForJWT'] : null

}