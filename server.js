import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import OpenAI from 'openai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const mockDbPath = path.join(__dirname, 'mockDb.json');

dotenv.config();

const app = express();

// Configure CORS to allow requests from the frontend
app.use(cors({
  origin: ['http://localhost:8088', 'http://127.0.0.1:8088', 'http://localhost:8082', 'http://127.0.0.1:8082'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: false // Ensure this is false for server-side usage
});

// MongoDB Connection
let usingMockDatabase = true; // Set to true by default to ensure data persistence

// Mock database for demonstration purposes
const mockDb = {
  appointments: [],
  medications: []
};

// Load any existing data from local storage if available
try {
  if (fs.existsSync(mockDbPath)) {
    const data = fs.readFileSync(mockDbPath, 'utf8');
    const savedData = JSON.parse(data);
    mockDb.appointments = savedData.appointments || [];
    mockDb.medications = savedData.medications || [];
    console.log('Loaded existing data from mockDb.json');
  }
} catch (error) {
  console.error('Error loading mock database:', error);
}

// Function to save mock database to file
const saveMockDb = () => {
  try {
    fs.writeFileSync(mockDbPath, JSON.stringify(mockDb, null, 2), 'utf8');
    console.log('Saved data to mockDb.json');
  } catch (error) {
    console.error('Error saving mock database:', error);
  }
};

// Appointment Schema
const appointmentSchema = new mongoose.Schema({
  doctorId: String,
  doctorName: String,
  date: String,
  time: String,
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Medication Schema
const medicationSchema = new mongoose.Schema({
  name: String,
  dosage: String,
  frequency: String,
  time: String,
  taken: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Appointment = mongoose.model('Appointment', appointmentSchema);
const Medication = mongoose.model('Medication', medicationSchema);

// Routes
app.post('/api/appointments', async (req, res) => {
  try {
    if (usingMockDatabase) {
      const appointment = { ...req.body, id: mockDb.appointments.length + 1 };
      mockDb.appointments.push(appointment);
      saveMockDb();
      res.status(201).json(appointment);
    } else {
      const appointment = new Appointment(req.body);
      await appointment.save();
      res.status(201).json(appointment);
    }
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/appointments', async (req, res) => {
  try {
    if (usingMockDatabase) {
      res.json(mockDb.appointments);
    } else {
      const appointments = await Appointment.find().sort({ createdAt: -1 });
      res.json(appointments);
    }
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete appointment endpoint
app.delete('/api/appointments/:id', async (req, res) => {
  try {
    if (usingMockDatabase) {
      const id = parseInt(req.params.id);
      const index = mockDb.appointments.findIndex(appointment => appointment.id === id);
      if (index !== -1) {
        mockDb.appointments.splice(index, 1);
        saveMockDb();
        res.json({ message: 'Appointment deleted successfully' });
      } else {
        res.status(404).json({ error: 'Appointment not found' });
      }
    } else {
      const id = req.params.id;
      console.log('Attempting to delete appointment with ID:', id);
      
      // Check if id is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        console.error('Invalid ObjectId format:', id);
        return res.status(400).json({ error: 'Invalid appointment ID format' });
      }

      const appointment = await Appointment.findByIdAndDelete(id);
      
      if (!appointment) {
        console.error('Appointment not found with ID:', id);
        return res.status(404).json({ error: 'Appointment not found' });
      }
      
      console.log('Successfully deleted appointment:', appointment);
      res.json({ message: 'Appointment deleted successfully' });
    }
  } catch (error) {
    console.error('Error deleting appointment:', error);
    res.status(500).json({ error: error.message });
  }
});

// Medication endpoints
app.post('/api/medications', async (req, res) => {
  try {
    if (usingMockDatabase) {
      const medication = { ...req.body, id: mockDb.medications.length + 1 };
      mockDb.medications.push(medication);
      saveMockDb();
      res.status(201).json(medication);
    } else {
      const medication = new Medication(req.body);
      await medication.save();
      res.status(201).json(medication);
    }
  } catch (error) {
    console.error('Error creating medication:', error);
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/medications', async (req, res) => {
  try {
    if (usingMockDatabase) {
      res.json(mockDb.medications);
    } else {
      const medications = await Medication.find().sort({ createdAt: -1 });
      res.json(medications);
    }
  } catch (error) {
    console.error('Error fetching medications:', error);
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/medications/:id', async (req, res) => {
  try {
    if (usingMockDatabase) {
      const id = parseInt(req.params.id);
      const index = mockDb.medications.findIndex(medication => medication.id === id);
      if (index !== -1) {
        mockDb.medications[index] = { ...mockDb.medications[index], ...req.body };
        saveMockDb();
        res.json(mockDb.medications[index]);
      } else {
        res.status(404).json({ error: 'Medication not found' });
      }
    } else {
      const id = req.params.id;
      console.log('Updating medication with ID:', id, 'Data:', req.body);
      
      if (!mongoose.Types.ObjectId.isValid(id)) {
        console.error('Invalid ObjectId format:', id);
        return res.status(400).json({ error: 'Invalid medication ID format' });
      }
      
      const medication = await Medication.findByIdAndUpdate(
        id, 
        req.body, 
        { new: true }
      );
      
      if (!medication) {
        console.error('Medication not found with ID:', id);
        return res.status(404).json({ error: 'Medication not found' });
      }
      
      console.log('Successfully updated medication:', medication);
      res.json(medication);
    }
  } catch (error) {
    console.error('Error updating medication:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/medications/:id', async (req, res) => {
  try {
    if (usingMockDatabase) {
      const id = parseInt(req.params.id);
      const index = mockDb.medications.findIndex(medication => medication.id === id);
      if (index !== -1) {
        mockDb.medications.splice(index, 1);
        saveMockDb();
        res.json({ message: 'Medication deleted successfully' });
      } else {
        res.status(404).json({ error: 'Medication not found' });
      }
    } else {
      const id = req.params.id;
      console.log('Attempting to delete medication with ID:', id);
      
      if (!mongoose.Types.ObjectId.isValid(id)) {
        console.error('Invalid ObjectId format:', id);
        return res.status(400).json({ error: 'Invalid medication ID format' });
      }

      const medication = await Medication.findByIdAndDelete(id);
      
      if (!medication) {
        console.error('Medication not found with ID:', id);
        return res.status(404).json({ error: 'Medication not found' });
      }
      
      console.log('Successfully deleted medication:', medication);
      res.json({ message: 'Medication deleted successfully' });
    }
  } catch (error) {
    console.error('Error deleting medication:', error);
    res.status(500).json({ error: error.message });
  }
});

// AI Assistant endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    console.log('Received chat message:', message);
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    // Call OpenAI API
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful health assistant for elderly care. Provide concise, accurate information about health, medications, wellness, and elderly care. Keep responses friendly, clear, and focused on health topics. Avoid giving specific medical advice that should come from a doctor. If asked about emergencies, always recommend contacting emergency services or a healthcare provider."
          },
          {
            role: "user",
            content: message
          }
        ],
        max_tokens: 300,
        temperature: 0.7,
      });

      console.log('OpenAI response received');
      
      const response = completion.choices[0].message.content;
      res.json({ response });
    } catch (openaiError) {
      console.error('OpenAI API error:', openaiError);
      
      // Fallback to keyword-based responses if OpenAI fails
      const responses = {
        'medication': "It's essential to take your medications as prescribed. If you're experiencing side effects, please consult with your doctor before making any changes.",
        'pain': "For minor pain, you might try a warm compress or gentle stretching. If pain persists, please consult with your healthcare provider.",
        'sleep': "Establishing a regular sleep schedule can help improve sleep quality. Try avoiding screens before bedtime and create a comfortable sleep environment.",
        'hello': "Hello! How are you feeling today? Is there something specific I can help you with?",
        'hi': "Hi there! How can I assist you with your health needs today?",
        'appointment': "I can help you schedule an appointment with your doctor. Would you like me to do that for you?",
        'medicine': "Regular medication intake is crucial for managing chronic conditions. Is there a specific medication you'd like to know more about?",
        'exercise': "Regular exercise is beneficial for seniors. Even light activities like walking or gentle stretching can improve mobility and overall health.",
        'diet': "A balanced diet rich in fruits, vegetables, and whole grains is essential for maintaining good health in older adults.",
        'memory': "Memory exercises and staying mentally active can help maintain cognitive function. Activities like puzzles, reading, or learning new skills are great options."
      };
      
      // Find a matching keyword
      const keyword = Object.keys(responses).find(key => 
        message.toLowerCase().includes(key)
      );
      
      const fallbackResponse = keyword 
        ? responses[keyword]
        : "I'm here to help with health-related questions. Could you provide more details about what you'd like to know?";
      
      console.log('Using fallback response');
      res.json({ response: fallbackResponse });
    }
  } catch (error) {
    console.error('Error processing chat message:', error);
    res.status(500).json({ error: error.message || 'Failed to get response from AI service' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
