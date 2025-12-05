const User = require('../model/userModel');
const bcrypt = require('bcrypt');

async function createAdmin() {
    const adminEmail = 'admin@test.com';
    const existingAdmin = await User.findOne({ userEmail: adminEmail });

    if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await User.create({
            Name: 'AdminUser',
            userPhone: '9999999999',
            userEmail: adminEmail,
            userBloodGroup: 'O+',
            userGender: 'Other',
            userLocation: 'Head Office',
            lastDonationDate: '2024-01-01',
            userPassword: hashedPassword,
            availability: true,
            role: 'admin'
        });
        console.log('Default admin created.');
    } else {
        console.log('Admin already exists.');
    }
}

module.exports = { createAdmin };
