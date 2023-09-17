const ParkingLocation = require("../models/locationModel");
const UserReservation = require("../models/parkingModel");
const ErrorHandler = require("../utils/errorHandler");
const tryCatchAsync = require("../middleware/catchAsyncError");

exports.registerLocation = tryCatchAsync(async (req, res, next) => {
  const { name, address, latitude, longitude, parkingSpaces } = req.body;
  // Create a new parking location
  const newLocation = new ParkingLocation({
    name,
    address,
    latitude,
    longitude,
    parkingSpaces,
  });

  // Save the new location to the database
  await newLocation.save();
  res.json({ message: "Location saved successfully" });
});

exports.confirmparking = tryCatchAsync(async (req, res, next) => {
  const {
    userId,
    locationId,
    vehicleType,
    startTime,
    parkingtime,
    reservedSpaceNumber,
  } = req.body;
  console.log(startTime);
  console.log(parkingtime);
  // Calculate the expiration time based on the start time and duration
  const startTimehere = new Date(req.body.startTime); // Convert the provided startTime to a Date object
  const durationInMinuteshere = req.body.parkingtime;

  // Calculate the expiration time by adding the duration in minutes to the start time
  const expirationTime = new Date(
    startTimehere.getTime() + parkingtime * 60000
  );

  console.log(expirationTime);

  console.log(startTimehere);
  console.log(expirationTime);
  try {
    // Check if the requested parking space is available
    const parkingLocation = await ParkingLocation.findById(locationId);

    if (!parkingLocation) {
      return next(new ErrorHandler("Parking location not found", 404));
    }

    const parkingSpace = parkingLocation.parkingSpaces.find(
      (space) => space.spaceNumber === reservedSpaceNumber
    );
    console.log(parkingSpace);
    if (!parkingSpace || parkingSpace.isOccupied) {
      return next(new ErrorHandler("No parking space is available", 400));
    }

    // Update the parking space status to occupied
    parkingSpace.isOccupied = true;
    await parkingLocation.save();

    // Create a new UserReservation document
    const reservation = new UserReservation({
      userId,
      locationId,
      vehicleType,
      startTime,
      expirationTime,
      reservedSpaceNumber,
    });

    await reservation.save();

    return res.status(201).json({ message: "Booking successful." });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

exports.getAvailableParkingSpaces = tryCatchAsync(async (req, res, next) => {
  const { locationId, vehicleType } = req.body;

  try {
    // Check if the requested parking location exists
    const parkingLocation = await ParkingLocation.findById(locationId);

    if (!parkingLocation) {
      return next(new ErrorHandler("Parking location not found", 404));
    }

    // Filter the parking spaces based on vehicle type and occupancy status
    const availableSpaces = parkingLocation.parkingSpaces.filter(
      (space) => space.vehicleType === vehicleType && space.isOccupied == false
    );

    return res.status(200).json({ availableSpaces });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

exports.mybookingDetails = tryCatchAsync(async (req, res, next) => {
  const { userId } = req.body;
  UserReservation.find({ userId: userId })
    .populate("userId")
    .then((p) => console.log(p));
});
