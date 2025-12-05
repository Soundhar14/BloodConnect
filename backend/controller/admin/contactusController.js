const Request = require('../../model/requestModel');
const User = require('../../model/userModel');
const LoginHistory = require('../../model/loginHistroyModel');
const Contact = require('../../model/contactUsModel');



const getLoginHistory = async (req, res) => {
    try {
        const userId = req.query.userId;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });
                
        const history = await LoginHistory.find({ userId }).sort({ loginTime: -1 });

        res.status(200).json({
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
        },
            loginHistory: history,
        });
    }   catch (err) {
            console.error('Error fetching login history:', err);
            res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getAllContacts = async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ submittedAt: -1 });
        res.status(200).json(contacts);
    } catch (err) {
        console.error('Error fetching contacts:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const updateIsReadStatus = async (req, res) => {
    try {
        const { contactId } = req.query;

        if (!contactId) {
            return res.status(400).json({ error: 'Missing contactId query parameter' });
        }

        const contact = await Contact.findById(contactId);
        if (!contact) {
            return res.status(404).json({ error: 'Contact message not found' });
        }

        contact.isRead = !contact.isRead;

        await contact.save();

        res.status(200).json(contact);

    } catch (err) {
        console.error('Error toggling isRead status:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};



module.exports = { getLoginHistory , getAllContacts , updateIsReadStatus  };
