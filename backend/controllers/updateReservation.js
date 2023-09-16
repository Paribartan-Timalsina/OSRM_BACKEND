const cron = require('node-cron');
const UserReservation = require('../models/parkingModel');
const ParkingLocation = require('../models/locationModel');

// Function to check and update expired reservations
const updateExpiredReservations = async () => {
  try {
    console.log("hey 1 minut happened")
    const currentTime = new Date();
    
    // Find expired reservations
    const expiredReservations = await UserReservation.find({
      expirationTime: { $lte: currentTime },
      isOccupied: true, // Only update if the reservation is still active
    });

    // Update parking spaces and reservations
    for (const reservation of expiredReservations) {
      const parkingSpace = await ParkingLocation.findById(reservation.locationId)
        .select('parkingSpaces')
        .elemMatch('parkingSpaces', { spaceNumber: reservation.reservedSpaceNumber });

      if (parkingSpace) {
        parkingSpace.parkingSpaces[0].isOccupied = false;
        await parkingSpace.save();
      }

      reservation.isOccupied = false;
      await reservation.save();
    }
  } catch (error) {
    console.error('Error updating expired reservations:', error);
  }
};

// Schedule the task to run every minute (adjust as needed)
//cron.schedule('* * * * *', updateExpiredReservations);
module.exports=updateExpiredReservations;
