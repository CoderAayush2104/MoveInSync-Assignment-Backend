const Ticket = require("../models/ticket");
const Bus = require("../models/bus");

// Create booking
exports.createBooking = async (req, res, next) => {
  try {
    const { userId, busId, seatNumber, date } = req.body;
    const ticket = new Ticket({ user: userId, bus: busId, seatNumber, date });
    const bus = await Bus.findById(busId);
    if (bus.currentOccupancy >= bus.totalSeats) {
      return res.status(400).json({ message: "Bus is full." });
    }
    bus.currentOccupancy += 1; // Increment occupancy
    await bus.save();
    await ticket.save();
    res.status(201).json(ticket);
  } catch (error) {
    next(error);
  }
};
//getBookingByID
exports.getBookingsByUserId = async (req, res, next) => {
  try {
    const userId = req.params.id; // Assuming the user ID is passed as a URL parameter
    
    const bookings = await Ticket.find({ user: userId }).populate("bus");
    console.log(bookings)
    if (!bookings || bookings.length === 0) {
      return res.status(404).json({ message: "No bookings found for this user." });
    }

    // Optionally, format the response to include bus details
    if(bookings && bookings.length !== 0){
      const formattedBookings = bookings.map((booking) => ({
        ticketId: booking._id,
        busName: booking.bus ? booking.bus.name : "Unknown Bus",
        seatNumber: booking.seatNumber,
        date: booking.date,
      }));
      res.status(200).json(formattedBookings);
    }
    res.status(204).json({message : "No booking found"})

   
  } catch (error) {
    next(error);
  }
};
// Cancel booking
exports.cancelBooking = async (req, res, next) => {
  const { id } = req.params;
  console.log('Received ID:', id);
  try {
    const ticket = await Ticket.findById(id).populate("bus");
    if (!ticket) return res.status(404).json({ message: "Ticket not found." });
    
    ticket.bus.currentOccupancy -= 1; // Decrement occupancy
    await ticket.bus.save();
    await ticket.deleteOne({_id : id});
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
