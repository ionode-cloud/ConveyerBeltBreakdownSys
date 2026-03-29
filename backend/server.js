require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// --- 1. INITIALIZE EXPRESS APP ---
const app = express();
app.use(express.json());
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

// --- 2. DATABASE CONNECTION ---
const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB connected successfully.'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// --- 3. MONGOOSE SCHEMA DEFINITION ---
const conveyorBeltSchema = new mongoose.Schema({
  operationalMetrics: {
    wind:      { type: Number, default: 0 },
    beltWidth: { type: Number, default: 0 },
    speed:     { type: Number, default: 0 },
    torque:    { type: Number, default: 0 },
    beltTemp:  { type: Number, default: 0 },
    motorTemp: { type: Number, default: 0 },
    voltage:   { type: Number, default: 0 },
    current:   { type: Number, default: 0 },
  },
  maintenanceLog: {
    lastService: { type: Date,   default: null  },
    cause:       { type: String, default: 'N/A' },
  },
  conditionMonitoring: {
    vibration: { type: Number, default: 0         },
    lubricant: { type: String, default: 'Optimal' },
    tension:   { type: String, default: 'Good'    },
  }
}, { timestamps: true });

// --- 4. MONGOOSE MODEL ---
const ConveyorBelt = mongoose.model('ConveyorBelt', conveyorBeltSchema);

// ====================================================================
// --- 5. API ROUTES ---
// ====================================================================

// ✅ Welcome Route
app.get('/', (req, res) => {
  res.status(200).json({ message: 'ConveyorBelt Breakdown System API is running.' });
});

// =====================
// GET /data
// Fetch the latest conveyor belt record
// =====================
app.get('/data', async (req, res) => {
  try {
    const beltData = await ConveyorBelt.findOne().sort({ updatedAt: -1 });
    if (!beltData) {
      return res.status(404).json({ message: 'No data found. Use POST /data to create a record.' });
    }
    res.status(200).json({ message: 'Data fetched successfully.', data: beltData });
  } catch (error) {
    console.error('GET /data error:', error);
    res.status(500).json({ message: 'Failed to fetch data.', error: error.message });
  }
});

// =====================
// POST /data
// Create a new conveyor belt record
// Body: full sensor JSON object
// =====================
app.post('/data', async (req, res) => {
  try {
    const {
      operationalMetrics = {},
      maintenanceLog = {},
      conditionMonitoring = {}
    } = req.body;

    const newRecord = new ConveyorBelt({
      operationalMetrics,
      maintenanceLog,
      conditionMonitoring
    });

    const savedRecord = await newRecord.save();
    res.status(201).json({ message: 'Record created successfully.', data: savedRecord });
  } catch (error) {
    console.error('POST /data error:', error);
    res.status(500).json({ message: 'Failed to create record.', error: error.message });
  }
});

// =====================
// PUT /data/:id
// Update a specific record by its MongoDB _id
// Body: partial or full sensor JSON
// =====================
app.put('/data/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      operationalMetrics,
      maintenanceLog,
      conditionMonitoring
    } = req.body;

    // Build the $set object dynamically to support partial updates
    const updateData = {};
    if (operationalMetrics) {
      Object.entries(operationalMetrics).forEach(([k, v]) => {
        updateData[`operationalMetrics.${k}`] = v;
      });
    }
    if (maintenanceLog) {
      Object.entries(maintenanceLog).forEach(([k, v]) => {
        updateData[`maintenanceLog.${k}`] = k === 'lastService' ? new Date(v) : v;
      });
    }
    if (conditionMonitoring) {
      Object.entries(conditionMonitoring).forEach(([k, v]) => {
        updateData[`conditionMonitoring.${k}`] = v;
      });
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: 'No valid fields provided for update.' });
    }

    const updatedRecord = await ConveyorBelt.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedRecord) {
      return res.status(404).json({ message: `No record found with id: ${id}` });
    }

    res.status(200).json({ message: 'Record updated successfully.', data: updatedRecord });
  } catch (error) {
    console.error('PUT /data/:id error:', error);
    res.status(500).json({ message: 'Failed to update record.', error: error.message });
  }
});

// =====================
// DELETE /data/:id
// Delete a specific record by its MongoDB _id
// =====================
app.delete('/data/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRecord = await ConveyorBelt.findByIdAndDelete(id);

    if (!deletedRecord) {
      return res.status(404).json({ message: `No record found with id: ${id}` });
    }

    res.status(200).json({ message: 'Record deleted successfully.', data: deletedRecord });
  } catch (error) {
    console.error('DELETE /data/:id error:', error);
    res.status(500).json({ message: 'Failed to delete record.', error: error.message });
  }
});

// ====================================================================
// --- 6. START SERVER ---
// ====================================================================
const PORT = process.env.PORT || 62887;
app.listen(PORT, () => {
  console.log(`🚀 Server is live on http://localhost:${PORT}`);
});