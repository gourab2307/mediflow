
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Patient = require('./models/Patient');
const authRoutes = require('./routes/auth');
const { protect, authorize } = require('./middleware/authMiddleware');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());
app.use('/api/auth', authRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('MediFlow backend is running!');
});

// Health-check API
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'MediFlow API is healthy',
  });
});


app.post('/api/patients', protect, authorize('admin'), async (req, res) => {
  try {
    const { name, age, gender, phone } = req.body;

    const patient = await Patient.create({
      name,
      age,
      gender,
      phone,
    });

    res.status(201).json({
      success: true,
      message: 'Patient created successfully',
      data: patient,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

 // Get all patients
app.get('/api/patients', protect, authorize('admin', 'doctor'), async (req, res) => {
  try {
    const patients = await Patient.find();

    res.status(200).json({
      success: true,
      count: patients.length,
      data: patients,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});


 // Update a patient by ID
app.put('/api/patients/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Patient updated successfully',
      data: patient,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

 // Delete a patient by ID
app.delete('/api/patients/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const patient = await Patient.findByIdAndDelete(
      req.params.id
    );

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Patient deleted successfully',
      data: patient,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});


// Connect to MongoDB before starting the server
async function startServer() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log('MongoDB connected successfully!');

    app.listen(PORT, () => {
      console.log(`MediFlow server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
}

startServer();
