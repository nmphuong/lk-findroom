const mongoose = require("mongoose")
const MONGO_URI = "mongodb+srv://findroom:findroom@cluster0-hhb4y.gcp.mongodb.net/FindRoom?retryWrites=true&w=majority"
const connectDB = async() => {
    const conn = await mongoose.connect(MONGO_URI, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    })
    console.log(`MongoDB Connected`)
}
module.exports = connectDB