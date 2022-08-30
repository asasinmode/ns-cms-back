import jwt from "jsonwebtoken"
import PresidentModel from "../database/President.js"

const protect = async (req, res, next) => {
   let token

   if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
      try {
         token = req.headers.authorization.split(" ")[1]
         const decoded = jwt.verify(token, process.env.JWT_SECRET)

         req.user = await PresidentModel.findById(decoded.id).select('-password')

         // president doesn't exist so we throw error to return 401
         if(!req.user){ throw new Error() }

         return next()
      } catch(e){
         return res.status(401).json({ message: "not authorized" })
      }
   }

   // no token was found
   return res.status(401).json({ message: "authorization token is required" })
}

export default protect
