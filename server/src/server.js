import express from 'express'
import cors from 'cors'
import multer from 'multer'

const app = express()
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

const upload = multer({ storage: storage })

app.use(cors());
app.use(express.json());

app.use(express.static("./uploads"));

app.get("/", (req, res) => {
    res.send("Hello world")
})

app.post("/upload/photo", upload.single('photo'), (req, res) => {
    const data = req.file.filename;
    console.log(data + " uploaded successfully!") 
    console.log(req.file.originalname)  
    res.send(data + " uploaded successfully!")   

});

app.listen(5000, () => {
    console.log("Server started on PORT 5000")
})