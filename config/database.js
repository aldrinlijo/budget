const mongoose = require('mongoose')
const configureDB = () => {
    mongoose.connect('mongodb+srv://aldrin:Aldrin6991@cluster0.y7oevpt.mongodb.net/')
        .then((res) => {
            console.log('connect to db')
        })
        .catch((err) => {
            console.log('error connecting to db')
        })
}

module.exports = configureDB