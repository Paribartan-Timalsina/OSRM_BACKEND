const mongoose = require("mongoose");
const parkingSpaceSchema = new mongoose.Schema({
    spaceNumber: {
      type: Number,
      required: true,
    },
    isOccupied: {
      type: Boolean,
      default: false,
    },
    vehicleType: {
      type: String,
      required: true,
    },
    // You can add more attributes here specific to a parking space.
  });
  
  // Schema for a Parking Location
  const parkingLocationSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    latitude:{
      type: Number,
      required: false,
    },
    longitude:{
      type: Number,
      required: false,
    },
    // Embed the parking spaces within the location
    parkingSpaces: [parkingSpaceSchema],
    // You can add more attributes here, such as capacity, operating hours, etc.
  });
  
  // Model for Parking Location
  module.exports= mongoose.model('ParkingLocation', parkingLocationSchema);
  