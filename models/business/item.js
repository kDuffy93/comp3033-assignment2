const mongoose = require("mongoose");

let schemaDefinition = {
    businessID: { type: String, required: true },
    categoryID: { type: String, required: true },
    name: { type: String, required: true },
    sizes: { type: Array, required: true },
    prices: { type: Array, required: true }
};

let schemaObj = new mongoose.Schema(schemaDefinition);

module.exports = mongoose.model("business", schemaObj);