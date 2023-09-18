const express=require("express")

const router=express.Router()
const {confirmparking,registerLocation, getAvailableParkingSpaces, mybookingDetails}=require("../controllers/parkingController")
router.route("/bookparking").post(confirmparking);
router.route("/registerlocation").post(registerLocation);
router.route("/availableparkings").post(getAvailableParkingSpaces);
router.route("/mybookingdetails").get(mybookingDetails);
module.exports= router