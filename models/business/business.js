const mongoose = require("mongoose");

let schemaDefinition = {
    businessName: { type: String, required: true },
    menuID: { type: String, required: true }
};

let schemaObj = new mongoose.Schema(schemaDefinition);

module.exports = mongoose.model("business", schemaObj);