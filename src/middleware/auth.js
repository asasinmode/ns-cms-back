import jwt from "jsonwebtoken"
import PresidentModel from "../database/President.js"

const protect = async (req, res, next) => {
   let token

   if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
      try {
         token = req.headers.authorization.split(" ")[1]
         const decoded = jwt.verify(token, process.env.JWT_SECRET)

         req.user = await PresidentModel.findById(decoded.id).select('-password')
         if(!req.user){
            throw new Error()
         }

         next()
      } catch(e){
         return res.status(401).json({ message: "not authorized" })
      }
   }

   if(!token){
      return res.status(403).json({ message: "forbidden" })
   }
}

export default protect
