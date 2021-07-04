require("dotenv").config();

const express = require("express");

const  mongoose = require("mongoose");



//Microservices Router
const Books = require("./API/Book");
const Authors = require("./API/Author");
const Publications = require("./API/Publication");

//initialization
const booky = express();

//configuration
booky.use(express.json())

//establish database connection
mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}
)
.then(()=>console.log("CONNECTION ESTABLISHED!!!!"));


// Initiallizing Microservices

booky.use("/book", Books);
booky.use("/author", Authors);
booky.use("/book", Publications);

;


booky.listen(2000,() => console.log("hey server is running"));