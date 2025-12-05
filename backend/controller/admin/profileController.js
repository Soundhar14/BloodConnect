const User = require('../../model/userModel');

//get all the available donors (table display in frontend)
const getAllDonors = async (req, res) => {
    try {
        
        const donors = await User.find({ role: 'donor' }).select(
            'Name userEmail userPhone userBloodGroup userLocation lastDonationDate availability'
        );

        res.status(200).json(donors);
    } catch (error) {
        console.error('Error fetching donors:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

//update the profile details of the donor (edit option for each profile in the table i.e frontend display)
const updateDonorProfile = async (req, res) => {
    const targetUserId = req.query.userId; 

    if (!targetUserId) {
        return res.status(400).json({ message: 'Target userId is required in query.' });
    }

    try {
        const disallowedFields = ['_id', 'userPassword', 'role']; 
        disallowedFields.forEach(field => delete req.body[field]);

        const updatedUser = await User.findByIdAndUpdate(
            targetUserId,
            { $set: req.body },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found.' });
        }

        return res.status(200).json({
            message: 'User profile updated successfully.',
            user: updatedUser
        });

    } catch (error) {
        console.error('User profile update error:', error);
        return res.status(500).json({ message: 'Server error while updating user profile.' });
    }
};


//delete donor from the db using delete button in the frontend 
const deleteDonorById = async (req, res) => {
    try {
        const { donorId } = req.query;

        if (!donorId) {
            return res.status(400).json({ message: 'donorId query parameter is required.' });
        }

        const donor = await User.findById(donorId);

        if (!donor || donor.role !== 'donor') {
            return res.status(404).json({ message: 'Donor not found or is not a donor account.' });
        }

        await User.findByIdAndDelete(donorId);

        return res.status(200).json({
            message: 'Donor profile deleted successfully.',
            deletedDonorId: donorId
        });

    } catch (error) {
        console.error('Error deleting donor:', error);
        return res.status(500).json({
            message: 'Server error while deleting donor profile.',
            error: error.message
        });
    }
};


module.exports = {getAllDonors , updateDonorProfile , deleteDonorById };