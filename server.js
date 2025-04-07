const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const cors = require('cors');  // Import CORS

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for all routes
app.use(cors());

// Middleware to parse JSON data
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/vistara-news', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Define User schema
const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  password: String,
  country: String,
  agreeToTerms: Boolean,
  saved: { type: [String], default: [] },
  liked: { type: [String], default: [] },
});

// Encrypt password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// User model
const User = mongoose.model('User', userSchema);

// POST route for signup
app.post('/signup', async (req, res) => {
  const { firstName, lastName, email, password, country, agreeToTerms } = req.body;

  if (!agreeToTerms) {
    return res.status(400).json({ message: 'You must agree to the Terms and Conditions.' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email.' });
    }

    const newUser = new User({
      firstName,
      lastName,
      email,
      password,
      country,
      agreeToTerms,
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});


// POST route for login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Invalid email or password.' });
      }
  
      // Compare entered password with the hashed password in the database
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid email or password.' });
      }
  
      res.status(200).json({ message: 'Login successful', user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error. Please try again later.' });
    }
  });
  

  // POST route for Google login
app.post('/google-login', async (req, res) => {
    const { email } = req.body;
  
    try {
      const user = await User.findOne({ email });
  
      if (!user) {
        // User not found, you can handle as a new user (e.g., create a new user)
        return res.status(404).json({ message: 'User not found, please sign up.' });
      }
  
      // If the user is found, respond with login success
      res.status(200).json({ message: 'Login successful', user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error. Please try again later.' });
    }
  });

  
  app.get('/profile', async (req, res) => {
    const { email } = req.query;
  
    try {
      const user = await User.findOne({ email }).select('-password'); // exclude password
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
  
      res.status(200).json({ user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error. Please try again later.' });
    }
  });


  
// Start server
app.listen(PORT, () => {
  console.log('Server is running on port ${PORT}');
});
