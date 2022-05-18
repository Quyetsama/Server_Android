const Product = require('../models/Product')
const multer = require('multer')
const { v4: uuidv4 } = require('uuid')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './src/publics/images')
      },
    filename: function (req, file, cb) {
        cb(null, uuidv4() + '.png')
    }
})

const uploadImg = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
            return cb(null, true);
        }
        
        req.fileValidationError = 'Error';
        return cb(null, false, new Error('goes wrong on the mimetype'));
    }
}).single('image')

const upload = (req, res, next) => {
    uploadImg(req, res, function (err) {
        if(req.fileValidationError) {
            return res.status(400).json({
                success: false,
                message: req.fileValidationError
            })
        }
        next()
    })
}


const index = async (req, res, next) => {
    const products = await Product.find({}).populate('category', 'name')

    // return res.status(200).json({ 
    //     success: true,
    //     data: products
    // })
    return res.status(200).json([...products])
}

const getProductById = async (req, res, next) => {
    const { _id } = req.params

    const product = await Product.findById(_id, { createdAt: 0, updatedAt: 0, __v: 0 }).populate('category', 'name')

    return res.status(200).json(product)
}

const newProduct = async (req, res, next) => {
    const { name, price, description, size, color, category } = req.body
    const { filename } = req.file

    const newProduct = await Product.create(new Product({
        name,
        price,
        description,
        size,
        color,
        category,
        image: filename
    }))

    return res.status(201).json({ success: true, data: newProduct })
}



module.exports = { 
    index,
    getProductById,
    upload,
    newProduct
}