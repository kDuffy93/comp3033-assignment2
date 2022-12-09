const mongoose = require("mongoose");

let schemaDefinition = {
    businessID: { type: String, required: true },
    items: { type: Array }
};

let schemaObj = new mongoose.Schema(schemaDefinition);

module.exports = mongoose.model("menu", schemaObj);