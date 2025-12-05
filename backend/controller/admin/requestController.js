const Request = require('../../model/requestModel');

const getAllRequest = async (req, res) => {
    try {

        const requests = await Request.find().populate({
            path: 'donorId',
            select: 'Name userEmail userPhone userBloodGroup userLocation lastDonationDate'
        });

        res.status(200).json(requests);
    } catch (error) {
        console.error('Error fetching requests:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const updateRequestStatus = async (req, res) => {
    try {
        const { requestId } = req.query;
        const { status } = req.body;

        const allowedStatuses = ['pending', 'received', 'withdraw'];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status value' });
        }

        const updatedRequest = await Request.findByIdAndUpdate(
            requestId,
            { $set: { status } },
            { new: true, runValidators: true }
        );

        if (!updatedRequest) {
            return res.status(404).json({ message: 'Request not found' });
        }

        res.status(200).json({
            message: 'Request status updated successfully',
            request: updatedRequest
        });
    } catch (error) {
        console.error('Error updating request status:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { getAllRequest , updateRequestStatus };