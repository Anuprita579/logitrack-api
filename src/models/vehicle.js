const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema({
    vehicleNumber: {
        type: String,
        required: true,
        unique: true,
        length: 10,
    },
    vehicleType:{
        enum: ["truck", "van", "ship", "bike"],
        type: String,
        required: true
    },
    capacity: {
        type: Number,
        required: true,
        min: 1 // in tons
    },
    status:{
        enum: ["available", "in_transit", "maintenance", "out_of_service"],
        type: String,
        default: "available"
    },
    driverId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    // currentLocation: {
    //     type: {
    //         latitude: {type: Number},
    //         longitude: {type: Number}
    //     }
    // },
    // speed
},
{
    timestamps: true
});

module.exports = mongoose.model("Vehicle", vehicleSchema);