const mongoose = require("mongoose");

const PublicationSchema = mongoose.Schema({
        id: Number,
        names: String,
        books: [String],
});

//publication model

const PublicationModel = mongoose.model("publications",PublicationSchema);
module.exports = PublicationModel;