const jwt = require("jsonwebtoken");
const PlaceModal = require("../models/Place");
const BookingModel = require("../models/Booking");
require("dotenv").config();

const jwtSecret = process.env.jwtSecret;

const addPlaces = async (req, res) => {
  try {
    const { token } = req.cookies;
    const {
      title,
      address,
      addedPhotos,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
      price,
    } = req.body;
    const user = jwt.verify(token, jwtSecret);
    const place = await PlaceModal.create({
      owner: user.id,
      title,
      address,
      photos: addedPhotos,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
      price,
    });
    res.json(place);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getUserPlaces = async (req, res) => {
  try {
    const { token } = req.cookies;
    const user = jwt.verify(token, jwtSecret);
    const { id, isSuperAdmin } = user;
    let places;
    if (isSuperAdmin) {
      places = await PlaceModal.find();
    } else {
      places = await PlaceModal.find({ owner: id });
    }
    res.json(places);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getParticularPlace = async (req, res) => {
  try {
    const { id } = req.params;
    const place = await PlaceModal.findById(id);
    if (!place) {
      return res.status(404).json({ error: "Place not found" });
    }
    res.json(place);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updatePlace = async (req, res) => {
  try {
    const { token } = req.cookies;
    const {
      id,
      title,
      address,
      addedPhotos,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
      price,
    } = req.body;
    const user = jwt.verify(token, jwtSecret);
    const place = await PlaceModal.findById(id);
    if (user.id === place?.owner.toString()) {
      place.set({
        title,
        address,
        photos: addedPhotos,
        description,
        perks,
        extraInfo,
        checkIn,
        checkOut,
        maxGuests,
        price,
      });
      await place.save();
      res.json("ok");
    } else {
      res.status(403).json({ error: "Unauthorized" });
    }
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllPlaces = async (req, res) => {
  try {
    const places = await PlaceModal.find();
    res.json(places);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deletePlace = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPlace = await PlaceModal.findByIdAndDelete(id);
    const findBooking = await BookingModel.find({ place: id });
    if (findBooking.length > 0) {
      await BookingModel.deleteMany({ place: id });
    }
    res.json(deletedPlace);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  addPlaces,
  getUserPlaces,
  getParticularPlace,
  updatePlace,
  getAllPlaces,
  deletePlace,
};
