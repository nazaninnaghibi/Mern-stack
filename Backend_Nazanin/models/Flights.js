var mongoose = require('mongoose');

var flightReservationSchema = mongoose.Schema({
    from: {
        type: String,
        required: true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
    },
});

var FlightReservation = module.exports = mongoose.model('flightReservation', flightReservationSchema);
module.exports.get = function (callback, limit) {
    FlightReservation.find(callback).limit(limit);
}