const { ObjectId } = require("mongoose");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let customorderchemaDefinition = {
    ownerID: { type: String, required: true },
    customItemsIds: { type: Array, required: true },
};

let schemaObj = new mongoose.Schema(customorderchemaDefinition);

module.exports = mongoose.model("customOrder", schemaObj);