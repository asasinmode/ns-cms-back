import express from "express"
const router = express.Router()

router.get("/", (_req, res) => {
   res.send("here be ns-cms api")
})

export default router
