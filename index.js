import dotenv from "dotenv"
dotenv.config()

import connect from "./src/database/index.js"
connect().then(() => {
   console.log("successfully connected to database")
})

import app from "./src/app.js"
const port = process.env.PORT || 8000

app.listen(port, () => {
   console.log(`listening on http://localhost:${ port }/`)
})
