const Category = require('../models/Category')


const index = async (req, res, next) => {
    const categories = await Category.find({}, { _id: 1, name: 1 })

    return res.status(200).json([...categories])
}

const newCategory = async (req, res, next) => {
    const { name } = req.body

    const newCategory = await Category.create({ name })

    return res.status(201).json({ success: true, data: newCategory })
}



module.exports = { 
    index,
    newCategory
}