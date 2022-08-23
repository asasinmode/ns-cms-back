export default function (err, _req, res, _next){
   console.error(err)
   const rv = { message: err.message }

   res.status(500).json(rv)
}
