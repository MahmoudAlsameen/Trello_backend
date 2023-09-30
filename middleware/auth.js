
import jwt from 'jsonwebtoken'
const auth = (req, res, next) => {

    let { token } = req.headers;

    if(!token){
      return res.status(401).json({ message: "please provide a token" });
    }
    if (token) {
            let decoded = jwt.verify(token, "bl7 5ales");
            if (decoded) {
              next();
            } else {
              res.status(401).json({ message: "invalid token" });
            }
    }



}


export default auth;