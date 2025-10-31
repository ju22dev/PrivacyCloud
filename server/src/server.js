import express from 'express'
import cors from 'cors'
import authMiddleware from './middlewares/authMiddleware.js'
import dataRoutes from './routes/dataRoutes.js'
import authRoutes from './routes/authRoutes.js'

const app = express()

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello world")
})

app.use("/auth", authRoutes)
app.use("/data", authMiddleware, dataRoutes)

app.listen(5000, () => {
    console.log("Server started on PORT 5000")
})