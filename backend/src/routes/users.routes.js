import { Router } from 'express'
import { getCurrentUser, loginUser } from '../controllers/user.controller.js'
import { verifyUser } from '../middlewares/verifyUser.js'


const router = Router()

router.post('/login', loginUser)

router.put('/logout', (req, res) => {
    res.clearCookie('Token')
    res.status(200).json({ success: true, message: "Logged out successfully" })
})

router.get('/current-user', verifyUser, getCurrentUser)

export default router