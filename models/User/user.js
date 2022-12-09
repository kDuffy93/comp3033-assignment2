const { ObjectId } = require("mongoose");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;


let schemaDefinition = {
    name: { type: String, required: true },
    role: { type: String, required: true },
    customItems: { type: Array },
    customOrders: { type: Array }
};


let schemaObj = new mongoose.Schema(schemaDefinition);

module.exports = mongoose.model('user', schemaObj);