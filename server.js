require('dotenv').config()
const express = require('express')
const PORT = process.env.PORT || 3000
const logger = require('morgan')
const route = require('./src/routes')
const secureApp = require("helmet")
const db = require("./src/db")


const app = express()

app.use(express.json())
// app.use(express.urlencoded({ extended: true }))
// app.use(express.urlencoded({ extended: true }))
app.use(logger('dev'))
app.use(secureApp())
app.use(express.static('./src/publics'))

db.connect()

route(app)

app.listen(PORT, () => console.log(`Server running at port ${PORT}`))