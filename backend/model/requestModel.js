const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
    requesterName: { type: String, required: true, trim: true },
    bloodGroup: {
        type: String,
        required: true, 
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Other'], 
    },
    location: { type: String, required: true, trim: true},
    contact: {
        type: String,
        required: true,  
        match: [/^\d{10}$/, 'Please enter a valid 10-digit phone number'] 
    },
    status: {
        type: String,
        enum: ['pending', 'received', 'withdraw'], 
        default: 'pending'
    },
    donorId: {
        type: mongoose.Schema.Types.ObjectId,  
        ref: 'Donor',  
        required: false
    },
    requestTime: { type: Date, default: Date.now  }
});

module.exports = mongoose.model('Request' , requestSchema);
