const mongoose = require("mongoose");

let schemaDefinition = {
    businessId: { type: String, required: true },
    category: { type: String, required: true },
};

let schemaObj = new mongoose.Schema(schemaDefinition);

module.exports = mongoose.model("category", schemaObj);