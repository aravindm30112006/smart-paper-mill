const mongoose = require("mongoose");

const productionSchema = new mongoose.Schema(
    {
        batchId: {
            type: String,
            required: true,
            unique: true
        },

        paperType: {
            type: String,
            required: true
        },

        quantity: {
            type: Number,
            required: true,
            min: 0
        },

        productionDate: {
            type: Date,
            required: true
        },

        machine: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Machine",
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Production", productionSchema);