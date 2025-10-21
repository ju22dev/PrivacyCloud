import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../prismaClient.js'

const router = express.Router()

router.post('/signup', async (req,res) => {
    const {email, password} = req.body

    const hashedPassword = bcrypt.hashSync(password, 8)

    try {
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword
            }
            
        })

        /*
        FIXME(DO INITIAL SETUP FOR A NEW ACCOUNT)

        /* NO NEED TO SET UP THE ACCOUNT FURTHER THAN THE ACTUAL ACCOUNT CREATION UNTIL THE USER DECIDES TO UPLOAD THE DATA.
            - THEN SET UP BOTH THE STORED AND THE META DATA
        */

        // Create a Token
        const token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: '24h'})
        res.json({token})

    } catch(err) {
        console.log(err.message)
        res.sendStatus(503)
    }
})

router.post('/login', async (req,res) => {
    
    const {email, password} = req.body

    try {
        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        })
        if (!user) {
            return res.status(404).send({message: "User not found!"})
        }

        const passwordIsValid = bcrypt.compareSync(password, user.password)
        if(!passwordIsValid) {
            return res.status(401).send({message: "Invalid password!"})
        }
        console.log(user)
        const token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: '24h'})
        res.json({token})
        


    } catch(err) {
        console.log(err.message)
        res.sendStatus(503)
    }
})

export default router;