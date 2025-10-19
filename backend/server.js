const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// --- 1. INITIALIZE EXPRESS APP ---
const app = express();
app.use(express.json()); // Middleware to parse JSON bodies
app.use(cors())

// --- 2. DATABASE CONNECTION ---
// Using the connection string you provided.
const MONGO_URI = 'mongodb+srv://ionode:ionode@ionode.qgqbadm.mongodb.net/ConveyorBeltBreakdownSys?retryWrites=true&w=majority&appName=ionode';

mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB connected successfully.'))
    .catch(err => console.error('MongoDB connection error:', err));

// --- 3. MONGOOSE SCHEMA DEFINITION ---
// Defines the structure for the conveyor belt data in the database.
const conveyorBeltSchema = new mongoose.Schema({
    operationalMetrics: {
        wind: { type: Number, default: 0 },
        beltWidth: { type: Number, default: 0 },
        speed: { type: Number, default: 0 },
        torque: { type: Number, default: 0 },
        beltTemp: { type: Number, default: 0 },
        motorTemp: { type: Number, default: 0 },
        voltage: { type: Number, default: 0 },
        current: { type: Number, default: 0 },
    },
    maintenanceLog: {
        lastService: { type: Date, default: null },
        cause: { type: String, default: 'N/A' },
    },
    conditionMonitoring: {
        vibration: { type: Number, default: 0 },
        lubricant: { type: String, default: 'Optimal' },
        tension: { type: Number, default: 0 },
    }
}, {
    // Automatically add `createdAt` and `updatedAt` timestamps
    timestamps: true
});

// --- 4. MONGOOSE MODEL CREATION ---
// A model is a class with which we construct documents.
const ConveyorBelt = mongoose.model('ConveyorBelt', conveyorBeltSchema);


// --- 5. API ROUTES ---

// Welcome Route
app.get("/", (req, res) => {
    res.status(200).json({ message: "Server is working. Use /data to get or update conveyor belt information." });
});

/*
 * @route   GET /data
 * @desc    Fetch the latest conveyor belt data OR update it using query parameters.
 * @access  Public
 *
 * @example To FETCH data:
 * GET http://localhost:62887/data
 *
 * @example To UPDATE data:
 * GET http://localhost:62887/data?speed=5.5&vibration=0.75&cause=Overload
 */
app.get('/data', async (req, res) => {
    // Check if there are any query parameters in the URL
    const hasQueryParams = Object.keys(req.query).length > 0;

    if (hasQueryParams) {
        // --- UPDATE LOGIC ---
        try {
            const updateData = {};

            // Map query parameters to the nested schema structure
            for (const key in req.query) {
                if (Object.hasOwnProperty.call(req.query, key)) {
                    const value = req.query[key];
                    // You can add more specific validation here if needed
                    if (['wind', 'beltWidth', 'speed', 'torque', 'beltTemp', 'motorTemp', 'voltage', 'current'].includes(key)) {
                        updateData[`operationalMetrics.${key}`] = Number(value);
                    } else if (['lastService', 'cause'].includes(key)) {
                        updateData[`maintenanceLog.${key}`] = key === 'lastService' ? new Date(value) : value;
                    } else if (['vibration', 'lubricant', 'tension'].includes(key)) {
                        updateData[`conditionMonitoring.${key}`] = isNaN(Number(value)) ? value : Number(value);
                    }
                }
            }
            
            if (Object.keys(updateData).length === 0) {
                 return res.status(400).json({ message: "No valid fields provided for update." });
            }

            // Find the single document representing the conveyor belt's state and update it.
            // `findOneAndUpdate` with `upsert: true` will create the document if it doesn't exist.
            const updatedBeltData = await ConveyorBelt.findOneAndUpdate({}, { $set: updateData }, {
                new: true, // Return the modified document rather than the original
                upsert: true, // Create a new document if one doesn't exist
                setDefaultsOnInsert: true // Apply schema defaults if creating a new doc
            });

            res.status(200).json({
                message: "Data updated successfully.",
                data: updatedBeltData
            });

        } catch (error) {
            console.error("Error updating data:", error);
            res.status(500).json({ message: "Failed to update data.", error: error.message });
        }

    } else {
        // --- FETCH LOGIC ---
        try {
            // Find the most recently updated document
            const beltData = await ConveyorBelt.findOne().sort({ updatedAt: -1 });

            if (!beltData) {
                return res.status(404).json({ message: "No data found. Please send a request with query parameters to create an entry." });
            }

            res.status(200).json({
                message: "Data fetched successfully.",
                data: beltData
            });

        } catch (error) {
            console.error("Error fetching data:", error);
            res.status(500).json({ message: "Failed to fetch data.", error: error.message });
        }
    }
});


// --- 6. START SERVER ---
const port = 62887;
app.listen(port, () => {
    console.log(`Server is live on port: ${port}`);
});
