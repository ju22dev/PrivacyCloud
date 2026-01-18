import express from 'express'
import cors from 'cors'
import authMiddleware from './src/middlewares/authMiddleware.js'
import dataRoutes from './src/routes/dataRoutes.js'
import authRoutes from './src/routes/authRoutes.js'

const app = express()

app.use(cors({
  origin: "https://privacy-cloud-client.vercel.app/",
  methods: ["GET", "POST", "PUT", "DELETE","PATCH", "OPTIONS"],
  credentials: true // allow cookies
}));
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello world")
})

app.use("/auth", authRoutes)
app.use("/data", authMiddleware, dataRoutes)

app.listen(5000, () => {
    console.log("Server started on PORT 5000")
})