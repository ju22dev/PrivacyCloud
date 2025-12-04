import express from 'express'
import prisma from '../prismaClient.js'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
                dataName: dataName.trim(),
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

router.get("/download", async (req, res) => {
    try {
        const user = await prisma.user.findMany({
            include: { stored: true },
            where: { id: req.userId }
        })

        const userData = user[0].stored

        res.send({
            "userData": userData.length > 0 ? userData : "Your cloud storage is empty!"
        })
    } catch (e) {
        console.log(e.message)
    }

})

router.get("/file/:filename", async (req, res) => {
    try {
        const user = await prisma.user.findMany({
            include: { stored: true },
            where: { id: req.userId }
        })

        const userData = user[0].stored.map(x => `/file/${x.dataName}`)
        if (!userData.includes(req.path))
            res.status(403).send("No such file was found!")

        const filePath = path.join(__dirname, "../../uploads", req.params.filename.trim())
        console.log("Looking for: " + filePath)
        res.sendFile(filePath);

    } catch (e) {
        console.log(e.message)
        res.status(500).send(e.message)
    }
})

router.get("/delete/:fileid", async (req, res) => {
    try {
        const deletedFile = await prisma.storeddata.delete({
            where: {
                userId: req.userId,
                id: Number(req.params.fileid)
            }
        })
        console.log(deletedFile)
        res.status(200).send("Deletion success")

    } catch (e) {
        console.log(e.message)
        res.status(500).send(e.message)
    }
})

export default router;