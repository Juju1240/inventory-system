require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

const productRoutes = require('./routes/products');
const authRoutes = require('./routes/auth');
const protect = require('./middleware/auth');

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Inventory API is running');
});

app.use('/auth', authRoutes);
app.use('/products', protect, productRoutes);

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  if (!process.env.MONGO_URI) {
    console.error('MONGO_URI is not configured. Add it to your .env file.');
    process.exit(1);
  }

  if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET is not configured. Add it to your .env file.');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB successfully!');

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Connection failed:', err.message);
    process.exit(1);
  }
};

startServer();
