const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');

const { createAdmin } = require('./config/createAdminConfig');

dotenv.config();

const app = express();

app.use(cors({
  origin: 'http://localhost:5173', // Your React dev server
  credentials: true
}));
app.use(express.json());

const authRoute = require('./routes/authRoute');
app.use('/api/auth' , authRoute);

const donorRoute = require('./routes/donorRoute');
app.use('/api/donor' , donorRoute);

const recipientRoute = require('./routes/recipientRoute');
app.use('/api/recipient' , recipientRoute);

const donationRoute = require('./routes/donationRoute');
app.use('/api/donations', donationRoute);

const adminRoute = require('./routes/admin/contactusRoute');
app.use('/api/admin/contact-us' , adminRoute);

const profileRoute = require('./routes/admin/profileRoute');
app.use('/api/admin/donor-profiles' , profileRoute);

const dashboardRoute = require('./routes/admin/dashboardRoute');
app.use('/api/admin/dashboard' , dashboardRoute);

const requestRoute = require('./routes/admin/requestRoute');
app.use('/api/admin/request' , requestRoute);

const notificationRoute = require('./routes/admin/notificationRoute');
app.use('/api/notify' , notificationRoute);

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('connected to the server sucessfully'))
.catch((err) => console.log('Error connected to the server' , err));

const port = process.env.PORT || 5000;
app.listen(port , () => {
    console.log(`Server is running on port ${port}`);

    createAdmin();
});