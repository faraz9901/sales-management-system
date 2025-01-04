import { User } from "../models/User.model.js"
import { env } from "../utils/index.js"
import { userValidation } from "../utils/validation.js"
import jwt from 'jsonwebtoken'

export const createUsersforTesting = async () => {
    try {

        const users = await User.find({})

        if (users.length === 0) {
            const dummyUsers = [{ name: "admin", email: "admin@sales.com", password: "admin", role: 'admin' }, { name: "staff", email: "staff@sales.com", password: "staff", role: "staff" }]
            await User.insertMany(dummyUsers)
        }

    } catch (error) {
        console.log(error)
    }

}

export async function loginUser(req, res) {
    try {

        const { email, password } = req.body

        const { error } = userValidation.validate({ email, password });

        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            })
        }

        const user = await User.findOne({ email, password })

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        const token = jwt.sign({ id: user._id, role: user.role }, env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('Token', token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: "strict"
        });

        res.status(202).json({
            success: true,
            message: "User Logged In",
            content: user
        })

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Unable to log User in",
        })
    }


}

export const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.user.id })

        res.status(200).json({
            success: true,
            content: user
        })

    } catch (error) {
        res.status(500).json({ success: false })
    }
}



