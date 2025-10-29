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
    try {
        const dataName = req.file.originalname;
        const userId = req.userId
        console.log(dataName + " uploaded successfully!")

        await prisma.storeddata.create({
            data: {
                dataName: dataName,
                user: {
                    connect: {
                        id: userId
                    }
                }
            }
        })

        res.send(dataName + " uploaded successfully!")
    } catch (e) {
        console.log(e.message)
    }
});

router.get("/download", express.static("./uploads"), async (req, res) => {
    try {
        const user = await prisma.user.findMany({
            include: { stored: true },
            where: {
                id: req.userId // id is decoded from the jwt during authMiddleware
            }
        })

        const userData = user[0].stored.map(x => `http://localhost:5000/data/download/${x.dataName}`)



        res.send({
            "userData": userData.length > 0 ? userData : "Your cloud storage is empty!"
        })
    } catch (e) {
        console.log(e.message)
    }

})

export default router;