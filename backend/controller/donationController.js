const Donation = require('../model/donorDonations');


const getDonations = async (req, res) => {
  try {
    const donations = await Donation.find({ donorId : req.user.userId }).sort({ date: -1 });
    res.json(donations);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};


const addDonation = async (req, res) => {
  const { date, recipient, location, status } = req.body;

  try {
    const newDonation = new Donation({
      date,
      recipient,
      location,
      status,
      donorId : req.user.userId,
      });


    const donation = await newDonation.save();
    res.status(201).json(donation);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

const updateDonation = async (req, res) => {
  const { date, recipient, location, status } = req.body;

  const donationFields = {};
  if (date) donationFields.date = date;
  if (recipient) donationFields.recipient = recipient;
  if (location) donationFields.location = location;
  if (status) donationFields.status = status;

  try {
    let donation = await Donation.findById(req.params.id);

    if (!donation) return res.status(404).json({ msg: 'Donation record not found' });


    donation = await Donation.findByIdAndUpdate(
      req.params.id,
      { $set: donationFields },
      { new: true }
    );

    res.json(donation);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

module.exports = { getDonations , addDonation, updateDonation };