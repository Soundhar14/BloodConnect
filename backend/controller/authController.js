const User = require('../model/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const LoginHistory = require('../model/loginHistroyModel');

const registerUser = async (req, res) => {
   const {userName, userPhone, userEmail, userBloodGroup, userGender, userLocation, lastDonationDate, password, confirmPassword, availability } = req.body;

    try {
        const userExist = await User.findOne({ email: userEmail });

        if(userExist){
            return res.status(400).json({message : "User already registeed, please login"});
        }
        if (password != confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            Name: userName,             
            userEmail: userEmail,
            userPhone : userPhone,      
            userBloodGroup: userBloodGroup, 
            userGender: userGender,         
            userLocation: userLocation,     
            lastDonationDate: lastDonationDate, 
            userPassword: hashPassword,     
            availability: availability, 
            role: 'donor'           
});

        await newUser.save();
        res.status(201).json({ message : "User account created successfully , please login in to continue"});
    }
    catch (error){
        console.log(error);
        return res.status(500).json({message : "Error while Signing Up"});
    }
};


   const recordLogin = async (user, req, loginTime = new Date()) => {
        try {
                const ip =
                req.headers['x-forwarded-for']?.split(',').shift() ||
                req.socket?.remoteAddress ||
                req.ip;

            const userAgent = req.headers['user-agent'] || 'Unknown';

            await LoginHistory.create({
                userId: user._id,
                loginTime,
                ipAddress: ip,
                userAgent,
            });
        }   catch (err) {
            console.error('Failed to record login history:', err);
        }
    };


const loginUser = async (req, res) => {

    const { userLogin , password } = req.body;

    try {
        const user = await User.findOne({ 
            $or: [{ userEmail: userLogin }, { userPhone: userLogin }] 
        });

        console.log(user);
        if (!user) {
            return res.status(400).json({message : "user doesnt exist please create a account first"});
        }
        const passwordVerify = await bcrypt.compare(password, user.userPassword);

        if(!passwordVerify){
            return res.status(400).json({message : "Incorrect password "});
        }
        
        await recordLogin(user, req); 

        const token = jwt.sign(
            {
                userId: user._id,
                userDetail: user.userEmail || user.userPhone,
                Name: user.Name,
                role: user.role,              
            },
            process.env.SECRET_KEY,
            { expiresIn: "1h" }
        );

        return res.status(200).json({
            message: "User logged in successfully",
            token: token,
            userDetail: user.userEmail || user.userPhone,
            role: user.role
        });
    }
    catch (error){
        console.log(error);
        return res.status(400).json({ message : "Error while logging in"});
    }
};

const crypto = require('crypto');

const forgotPassword = async (req, res) => {
  const { userLogin } = req.body;

  try {
    // Find user by email or phone
    const user = await User.findOne({
      $or: [{ userEmail: userLogin }, { userPhone: userLogin }],
    });

    if (!user) {
      return res.status(400).json({ message: "User not found with this email or phone." });
    }


    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    user.resetToken = hashedToken;
    user.resetTokenExpiry = Date.now() + 1000 * 60 * 15; // 15 minutes
    await user.save();

    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;
    console.log(`Send this link to user: ${resetUrl}`);

    return res.status(200).json({ message: "Password reset link sent successfully." });

  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({ message: "Failed to process forgot password request." });
  }
};



module.exports = { registerUser , loginUser , forgotPassword};