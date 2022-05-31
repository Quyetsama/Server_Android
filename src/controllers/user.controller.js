const User = require('../models/User')
const JWT = require('../utils/jwt')
const bcrypt = require('bcryptjs') 


const index = async (req, res, next) => {
    const users = await User.find({})

    return res.status(200).json({ 
        success: true,
        data: users
    })
}

const signUp = async (req, res, next) => {
    const { fullName, email, password } = req.value.body
    // Check email same
    const foundUser = await User.findOne({ email })
    if(foundUser) return res.status(403).json({
        success: false,
        message: 'Email is already in use',
    })

    // New user
    const newUser = await User.create({ fullName, email, password })

    const token = JWT.encodedToken(newUser._id)
    res.setHeader('Authorization', 'bearer ' + token)

    return res.status(201).json({ success: true, message: 'Register successfully!' })
    // return res.status(201).json({ success: true, token: 'bearer ' + token })
}

const signIn = async (req, res, next) => {
    const { tokenDevice } = req.body
    await User.updateOne(
        { _id: req.user._id },
        { $addToSet: { tokenDevices: tokenDevice } }
    )

    const token = JWT.encodedToken(req.user._id)

    const profile = {
        _id: req.user._id,
        fullName: req.user.fullName,
        email: req.user.email
    }

    res.setHeader('Authorization', 'bearer ' + token)
    return res.status(200).json({...profile})
}

const logout = async (req, res, next) => {
    const { tokenDevice } = req.body

    await User.updateOne(
        { _id: req.user._id },
        { $pull: { tokenDevices: tokenDevice } }
    )

    return res.status(200).json({ success: true })
}

const getProfile = async (req, res, next) => {

    const profile = await User.findById(req.user._id, { _id: 1, fullName: 1, email: 1 })

    return res.status(200).json(profile)
}

const updateProfile = async (req, res, next) => {
    const { fullName, currentPassword, newPassword1, newPassword2 } = req.body
    let passwordHashed


    if(currentPassword && newPassword1 && newPassword2) {
        const isCorrectPassword = await req.user.isValidPassword(currentPassword)
        if(!isCorrectPassword) {
            return res.status(403).json({
                success: false,
                message: "Current password is incorrect"
            })
        }
        else if(newPassword1 !== newPassword2) {
            return res.status(403).json({
                success: false,
                message: "New password and confirm password not same"
            })
        }
        else {
            // Generate a satl
            const satl = await bcrypt.genSalt(10)
            // Generate a password hash (satl + hash)
            passwordHashed = await bcrypt.hash(newPassword1, satl)
        }
    }

    await User.updateOne(
        { _id: req.user._id },
        {
            ...(fullName && { fullName: fullName }),
            ...(passwordHashed && { password: passwordHashed })
        }
    )

    return res.status(201).json({
        success: true,
        message: "Update profile successfully"
    })

}



module.exports = { 
    index,
    signUp,
    signIn,
    logout,
    getProfile,
    updateProfile
}