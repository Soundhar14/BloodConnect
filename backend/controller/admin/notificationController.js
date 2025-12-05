const Notification = require('../../model/notificationModel'); 

const sendEmergencyNotification = async (req, res) => {
  const { bloodGroup, location, message } = req.body;

  if (!bloodGroup || !location || !message) {
    return res.status(400).json({ message: 'Blood group, location, and message are required.' });
  }

  try {
    const newNotification = new Notification({
      bloodGroup: bloodGroup,
      location: location,
      message,
      status: 'active',

    });

    await newNotification.save();

    res.status(201).json({ message: 'Emergency notification sent successfully!', notification: newNotification });
  } catch (error) {
    console.error('Error sending emergency notification:', error);
    res.status(500).json({ message: 'Failed to send emergency notification.', error: error.message });
  }
};

// Controller for Users to fetch relevant Notifications
const getUserNotifications = async (req, res) => {
  const userBloodGroup = req.query.bloodGroup;
  const userLocation = req.query.location;

  if (!userBloodGroup || !userLocation) {
    return res.status(400).json({ message: 'User blood group and location are required to fetch notifications.' });
  }

  try {
    const notifications = await Notification.find({
      bloodGroup: userBloodGroup.toUpperCase(),
      location: userLocation.toLowerCase(),
      status: 'active',
    }).sort({ timestamp: -1 });

    res.status(200).json({ notifications });
  } catch (error) {
    console.error('Error fetching user notifications:', error);
    res.status(500).json({ message: 'Failed to fetch user notifications.', error: error.message });
  }
};

module.exports = {
  sendEmergencyNotification,
  getUserNotifications,
};
