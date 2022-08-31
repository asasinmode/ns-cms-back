import express from "express"
const router = express.Router()

router.get("/", (_req, res) => {
   return res.send("here be ns-cms api")
})

export default router
