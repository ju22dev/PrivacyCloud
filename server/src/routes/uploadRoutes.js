import express from 'express'
import prisma from '../prismaClient.js'
import multer from 'multer'

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

const upload = multer({ storage: storage })

const router = express.Router()

router.post("/", upload.single('file'), (req, res) => {
    const data = req.file.filename;
    console.log(data + " uploaded successfully!") 
    console.log(req.file.originalname)  
    res.send(data + " uploaded successfully!")   

});

export default router;