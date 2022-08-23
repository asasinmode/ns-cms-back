import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config()

const connect = async () => {
   try {
      await mongoose.connect(process.env.DATABASE_URI)
      console.log("successfully connected to database")
   } catch(e){
      console.error(e)
      process.exit(1)
   }
}

export default connect
