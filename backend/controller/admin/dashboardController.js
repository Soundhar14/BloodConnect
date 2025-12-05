const Request = require('../../model/requestModel');
const User = require('../../model/userModel');

const getDashboardStats = async (req, res) => {
    try {
        const donorCountPromise = User.countDocuments({ role: 'donor' });
        const fullfiledRequestsPromise = Request.countDocuments({status: 'received'});
        const pendingRequestsPromise = Request.countDocuments({ status: 'pending' });
        const withdrawRequestsPromise = Request.countDocuments({status: 'withdraw'});

        const [donorCount, fullfiledRequests, pendingRequests , withdrawRequests] = await Promise.all([
            donorCountPromise,
            fullfiledRequestsPromise,
            pendingRequestsPromise,
            withdrawRequestsPromise
        ]);

    res.status(200).json({
        donor_count: donorCount,
        fullfiled_requests: fullfiledRequests,
        pending_requests: pendingRequests,
        withdraw_requests: withdrawRequests
    });
    }   catch (err) {
            console.error('Error fetching dashboard stats:', err);
            res.status(500).json({ error: 'Internal Server Error' });
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

const countRequestPending = async (req, res) => {
    try {
        const requestPending = await Request.countDocuments({ status: 'pending' });
        res.status(200).json({ requestPending });
    } catch (err) {
        console.error('Error counting the fpending request:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}


module.exports = { getDashboardStats ,  countTotalDonors , countRequestFullfiled , countRequestPending }