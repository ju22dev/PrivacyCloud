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

router.post("/upload", upload.single('file'), async (req, res) => {
    const dataName = req.file.originalname;
    const userId = 0 // FIXME() : HOW CAN I GET THIS ID WITHOUT EXPOSING THE ID 
    console.log(dataName + " uploaded successfully!")

    await prisma.storedData.create({
        data: {
                dataName,
                userId
            }
    })

    res.send(dataName + " uploaded successfully!")
});

router.get("/download", express.static("./uploads"), (req, res) => {
    // get all of the specific user's data from the storeddata table then
    //      - check if the requested file is actually the user's
    //      - then allow the user to get the file
    // get the data
    // but i think i gotta know the req comes from the owner
    // we can identify the user using the session token instead of their actual cred for extra measure???
    // lets worry about this later, for now lets just make sure that the route is serving data of its users properly
})

export default router;