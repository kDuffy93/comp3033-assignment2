const { ObjectId } = require("mongoose");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let customItemSchemaDefinition = {
    ownerID: { type: String, required: true },
    businessID: { type: String, required: true },
    menuItemID: { type: String, required: true },
    customizations: { type: Array, required: true }
};

let schemaObj = new mongoose.Schema(customItemSchemaDefinition);

module.exports = mongoose.model("customItem", schemaObj);