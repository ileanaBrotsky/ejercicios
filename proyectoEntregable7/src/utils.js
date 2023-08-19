import {fileURLToPath} from 'url'
import { dirname } from 'path'
import multer from 'multer'
import bcrypt from 'bcrypt'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

//middleware MULTER para cargar archivo
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      //ubicacion del archivo
      cb(null, __dirname +"/public/img");
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