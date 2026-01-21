import express from 'express'
import prisma from '../prismaClient.js'
import multer from 'multer'
import supabase from '../supabaseClient.js'

const upload = multer({ storage: multer.memoryStorage() })

const router = express.Router()

router.post("/upload", upload.single('file'), async (req, res) => {
    try {
        const dataName = req.file.originalname
        const userId = req.userId

        const { error } = await supabase.storage
            .from('uploads')
            .upload(`${userId}/${dataName}`, req.file.buffer, {
                contentType: req.file.mimetype,
                upsert: false
            })

        if (error) throw error

        await prisma.storeddata.create({
            data: {
                dataName: dataName.trim(),
                user: {
                    connect: { id: userId }
                }
            }
        })

        res.send(dataName + " uploaded successfully!")
    } catch (e) {
        console.log(e.message)
        res.status(500).send(e.message)
    }
})


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

        const allowedFiles = user[0].stored.map(x => x.dataName)
        const filename = req.params.filename.trim()

        if (!allowedFiles.includes(filename)) {
            return res.status(403).send("No such file was found!")
        }

        const { data, error } = await supabase.storage
            .from('uploads')
            .download(`${req.userId}/${filename}`)

        if (error) throw error

        res.setHeader("Content-Type", "application/octet-stream")
        res.setHeader("Cache-Control", "no-store")

        const buffer = Buffer.from(await data.arrayBuffer())
        res.send(buffer)

    } catch (e) {
        console.log(e.message)
        res.status(500).send(e.message)
    }
})


router.get("/delete/:fileid", async (req, res) => {
    try {
        const file = await prisma.storeddata.findFirst({
            where: {
                id: Number(req.params.fileid),
                userId: req.userId
            }
        })

        if (!file) {
            return res.status(404).send("File not found")
        }

        const { error } = await supabase.storage
            .from('uploads')
            .remove([`${req.userId}/${file.dataName}`])

        if (error) throw error

        await prisma.storeddata.delete({
            where: { id: file.id }
        })

        res.status(200).send("Deletion success")

    } catch (e) {
        console.log(e.message)
        res.status(500).send(e.message)
    }
})


export default router;