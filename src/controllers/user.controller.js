const User = require('../models/User')
const JWT = require('../utils/jwt')


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
    if(foundUser) return res.status(403).json({ error: { message: 'Email is already in use' } })

    // New user
    const newUser = await User.create({ fullName, email, password })

    const token = JWT.encodedToken(newUser._id)
    res.setHeader('Authorization', 'bearer ' + token)

    return res.status(201).json({ success: true, token: 'bearer ' + token })
}

const signIn = async (req, res, next) => {
    const token = JWT.encodedToken(req.user._id)

    const profile = {
        _id: req.user._id,
        fullName: req.user.fullName,
        email: req.user.email,
        role: req.user.role
    }

    res.setHeader('Authorization', 'bearer ' + token)
    return res.status(200).json({ success: true, profile })
}


module.exports = { 
    index,
    signUp,
    signIn
}