const Request = require('../model/requestModel');
const User = require('../model/userModel');
const Contact = require('../model/contactUsModel');

const searchDonors = async (req, res) => {
    const { userBloodGroup, userLocation } = req.body;

    if (!userBloodGroup || !userLocation) {
        return res.status(400).json({
            message: "Both blood group and location are required."
        });
    }

    try {
        const matchingDonors = await User.find({
            userBloodGroup,
            userLocation,
            role: 'donor'
        }).select('Name userBloodGroup userLocation lastDonationDate userPhone userEmail'); 

        if (matchingDonors.length === 0) {
            return res.status(200).json({ message: "No matching donors found." });
        }

        return res.status(200).json({
            message: `${matchingDonors.length} donor(s) found.`,
            donors: matchingDonors
        });
    } catch (error) {
        console.error("Donor search error:", error);
        return res.status(500).json({ message: "Server error while searching for donors." });
    }
};

const getAvailableBloodGroups = async (req, res) => {
  try {
    const bloodGroups = await User.distinct('userBloodGroup');
    res.json({ availableBloodGroups: bloodGroups });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

const getAvailableLocations = async (req, res) => {
  try {
    const locations = await User.distinct('userLocation');
    res.json({ availableLocations: locations });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};


const newRequest = async (req, res) => {
    try {
        // Extract fields from the request body
        const { requesterName, bloodGroup, location, contact } = req.body;

        // Validate input fields
        if (!requesterName || !bloodGroup || !location || !contact) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Create a new request object
        const newRequest = new Request({
            requesterName,
            bloodGroup,
            location,
            contact,
            status: 'pending', // default status
        });

        // Save the request to the database
        await newRequest.save();

        // Send success response
        res.status(201).json({
            message: 'Request created successfully',
            data: newRequest,
        });
    } catch (error) {
        // Log the error and send a server error response
        console.error('Error creating request:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


const submitContactForm = async (req, res) => {
    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const newContact = await Contact.create({
            name,
            email,
            message,
        });

        res.status(201).json({
            message: 'Contact form submitted successfully',
            contactId: newContact._id,
        });

    } catch (err) {
        console.error('Error submitting contact form:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const countTotalDonors = async (req, res) => {
    try {
        const totalDonors = await User.countDocuments({ role: 'donor' });
        res.status(200).json({ totalDonors });
    } catch (err) {
        console.error('Error counting donors:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const countRequestFullfiled = async (req, res) => {
    try {
        const requestFullfiled = await Request.countDocuments({ status: 'received' });
        res.status(200).json({ requestFullfiled });
    } catch (err) {
        console.error('Error counting the fullfiled request:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const getAvailableLocationCount = async (req, res) => {
  try {
    const locations = await User.distinct('userLocation');
    const count = locations.length;
    res.json({ citiesCovered: count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};



module.exports = { searchDonors , getAvailableBloodGroups ,getAvailableLocations , newRequest , submitContactForm , countRequestFullfiled , 
    countTotalDonors , getAvailableLocationCount };
