import express from "express"
import cors from "cors"
import "express-async-errors"
import errorHandler from "./middleware/errorHandler.js"

import indexRouter from "./routes/index.js"
import presidentRouter from "./routes/presidents.js"
import satellitesRouter from "./routes/satellites.js"

const app = express()

// MIDDLEWARE
app.use(express.json())
app.use(cors())

// ROUTES
app.use('/', indexRouter)
app.use('/president', presidentRouter)
app.use('/satellites', satellitesRouter)

app.use(errorHandler)

export default app
