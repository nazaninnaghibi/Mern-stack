var mongoose = require('mongoose');

var ReservationSchema = mongoose.Schema({
    from: {
        type: String,
        required: true
    },
    to: {
        type: String,
        required: true
    },
    no: {
        type: String,
        required: true
    },
    dateStart: {
        type: String,
        required: true
    },
    dateEnd: {
        type: String,
        required: true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
    },
});

module.exports = mongoose.model('Reservation', ReservationSchema);
