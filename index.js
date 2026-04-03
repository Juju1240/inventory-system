require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

const productRoutes = require('./routes/products');
const authRoutes = require('./routes/auth');
const protect = require('./middleware/auth');

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB successfully!'))
  .catch((err) => console.log('Connection failed:', err));

app.get('/', (req, res) => {
  res.send('Inventory API is running');
});

app.use('/auth', authRoutes);
app.use('/products', protect, productRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});