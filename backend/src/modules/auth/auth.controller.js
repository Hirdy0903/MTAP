const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')

const User=require('./auth.model.js')
const asyncHandler = require('../../utils/asyncHandler');



const signup = asyncHandler(async (req, res) => {
      const { name, email, password } = req.body;

      const existingUser = await User.findOne({ email });

        if (existingUser) {
        return res.status(400).json({
            success: false,
            message: 'User already exists'
        });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({
        name,
        email,
        password: hashedPassword
    });
        const token = jwt.sign(
        {
            id: user._id
        },
        process.env.JWT_SECRET,
        {
            expiresIn: '7d'
        }
    );
res.status(201).json({
        success: true,
        message: 'User created successfully',
        token
    });

});
const login = asyncHandler(async (req, res) => {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        return res.status(400).json({
            success: false,
            message: 'Invalid credentials'
        });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return res.status(400).json({
            success: false,
            message: 'Invalid credentials'
        });
    }

    const token = jwt.sign(
        {
            id: user._id
        },
        process.env.JWT_SECRET,
        {
            expiresIn: '7d'
        }
    );

    res.status(200).json({
        success: true,
        message: 'Login successful',
        token
    });

});
const getMe = asyncHandler(async (req, res) => {

    const user = await User.findById(req.user.id).select('-password');

    res.status(200).json({
        success: true,
        user
    });

});
module.exports = {
    signup, login, getMe
};






