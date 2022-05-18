const Order = require('../models/Order')
const OrderInfo = require('../models/OrderInfo')
const makeID = require('../utils/makeID')


const newOrder = async (req, res, next) => {

    const { orderList, name, phone, address, subTotal, shipping, total } = req.body
    
    console.log({
        ...req.body,
        ...req.headers
    })

    const newOrderInfo = await OrderInfo.insertMany(orderList)

    const listId = newOrderInfo.map(item => item._id)

    const newOrder = new Order({
        code: makeID(7).toLocaleUpperCase(),
        user: req.user._id,
        name,
        phone,
        address,
        ordersInfo: listId,
        subTotal,
        shipping,
        total
    })
    await newOrder.save()

    return res.status(201).json({ 
        success: true,
        message: 'Order Success'
    })
}

module.exports = {
    newOrder
}