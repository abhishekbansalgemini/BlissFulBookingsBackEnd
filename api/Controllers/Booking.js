const jwt = require("jsonwebtoken");
const BookingModel = require("../models/Booking");
const PlaceModel = require("../models/Place");
require("dotenv").config();

const jwtSecret = process.env.jwtSecret;

function getUserDataFromRequest(req) {
  return new Promise((resolve, reject) => {
    jwt.verify(req.cookies.token, jwtSecret, {}, async (err, user) => {
      if (err) {
        reject(err); // Reject with the error if jwt verification fails
      }
      resolve(user);
    });
  });
}

const booking = async (req, res) => {
  try {
    const user = await getUserDataFromRequest(req);
    if (!user) {
      return res.status(422).json("Please Login first");
    }

    const { place, checkIn, checkOut, guests, name, phone, price, email } =
      req.body;

    const booking = await BookingModel.create({
      place,
      checkIn,
      checkOut,
      guests,
      name,
      phone,
      price,
      user: user.id,
      email,
    });

    res.json(booking);
  } catch (err) {
    res.status(500).json("Internal Server Error");
  }
};

const getBookings = async (req, res) => {
  try {
    const user = await getUserDataFromRequest(req);

    let bookings;
    if (user.isSuperAdmin) {
      bookings = await BookingModel.find().populate("place");
    } else {
      bookings = await BookingModel.find({ user: user.id }).populate("place");
    }

    res.json(bookings);
  } catch (err) {
    res.status(500).json("Internal Server Error");
  }
};

const getAllBookings = async (req, res) => {
  try {
    const bookings = await BookingModel.find();
    res.json(bookings);
  } catch (err) {
    res.status(500).json("Internal Server Error");
  }
};

const updateBooking = async (req, res) => {
  try {
    const {
      editBookingId,
      editCheckIn,
      editCheckOut,
      editGuests,
      editName,
      editEmail,
      editPhone,
      numberOfNights,
    } = req.body;

    const booking = await BookingModel.findById(editBookingId);
    const place = await PlaceModel.findById(booking.place);
    if (editGuests > place.maxGuests) {
      return res.status(422).json("Maximum Guest Limit Exceeded");
    }

    booking.set({
      place: booking.place,
      user: booking.user,
      checkIn: editCheckIn,
      checkOut: editCheckOut,
      guests: editGuests,
      name: editName,
      phone: editPhone,
      email: editEmail,
      price: numberOfNights * place.price,
    });

    await booking.save();
    res.json("BOOKING UPDATED");
  } catch (err) {
    res.status(500).json("Internal Server Error");
  }
};

const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBooking = await BookingModel.findByIdAndDelete(id);
    res.json(deletedBooking);
  } catch (err) {
    res.status(500).json("Internal Server Error");
  }
};

const getBookingInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const bookingInfo = await BookingModel.find({ place: id });
    if (bookingInfo.length === 0) {
      return res.status(422).json("No bookings");
    }
    res.status(200).json(bookingInfo);
  } catch (err) {
    res.status(500).json("Internal Server Error");
  }
};

const adminCancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBooking = await BookingModel.findByIdAndDelete(id);
    res.json(deletedBooking);
  } catch (err) {
    res.status(500).json("Internal Server Error");
  }
};

module.exports = {
  booking,
  getBookings,
  deleteBooking,
  updateBooking,
  getAllBookings,
  getBookingInfo,
  adminCancelBooking,
};
