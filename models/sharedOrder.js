const mongoose = require("mongoose");

let schemaDefinition = {
    recipient: { type: String, required: true },
    shareMethod: { type: String, required: true },
    orderOwner: { type: String, required: true },
    orderID: { type: String, required: true },
};

let schemaObj = new mongoose.Schema(schemaDefinition);

module.exports = mongoose.model("sharedOrder", schemaObj);