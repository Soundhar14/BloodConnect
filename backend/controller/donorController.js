const User = require('../model/userModel');

const updateProfile = async (req, res) => {
    const userId = req.user.userId;

    try {
        const disallowedFields = ['_id', 'userPassword', 'role', 'userEmail', 'userPhone'];
        disallowedFields.forEach(field => delete req.body[field]);

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: req.body },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found.' });
        }

        return res.status(200).json({
            message: 'Your profile was updated successfully.',
            user: updatedUser
        });

    } catch (error) {
        console.error('Donor profile update error:', error);
        return res.status(500).json({ message: 'Server error while updating your profile.' });
    }
};


const adminUpdateUserProfile = async (req, res) => {
    const requesterRole = req.user.role;
    const targetUserId = req.params.userId;

    if (requesterRole !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    if (!targetUserId) {
        return res.status(400).json({ message: 'Target userId is required.' });
    }

    try {
        const disallowedFields = ['_id', 'userPassword'];
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
            message: 'User profile updated by admin successfully.',
            user: updatedUser
        });

    } catch (error) {
        console.error('Admin profile update error:', error);
        return res.status(500).json({ message: 'Server error while updating user profile.' });
    }
};


const getProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await User.findById(userId).select('-userPassword'); 

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        return res.status(200).json({
            message: "User profile fetched successfully.",
            user
        });
    } catch (error) {
        console.error('User profile fetch error:', error);
        return res.status(500).json({
            message: "Server error while fetching profile.",
            error: error.message
        });
    }
};


const toggleAvailability = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Toggle availability between 'available' and 'unavailable'
    if (user.availability === 'available') {
      user.availability = 'unavailable';
    } else {
      user.availability = 'available';
    }

    await user.save();

    res.json({ message: 'Availability updated', availability: user.availability });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};


const lastDonationDate = async (req, res) => {
 
    const userId = req.user.userId;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

  try {
    const user = await User.findById(userId).select('lastDonationDate');
    if (!user || !user.lastDonationDate) {
      return res.status(404).json({ error: 'User or donation date not found' });
    }

    const nextDonationDate = new Date(user.lastDonationDate);
    nextDonationDate.setDate(nextDonationDate.getDate() + 7);

    return res.status(200).json({ nextDonationDate });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
};



module.exports = { getProfile , updateProfile , toggleAvailability , lastDonationDate }