const mongoose = require("mongoose");

const PublicationSchema = mongoose.Schema({
        id: Number,
        names: String,
        books: [String],
});

//author model

const PublicationModel = mongoose.model(publicationSchema);
module.exports = PublicationModel;