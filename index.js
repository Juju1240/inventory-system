require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

const productRoutes = require('./routes/products');

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB successfully!'))
  .catch((err) => console.log('Connection failed:', err));

app.get('/', (req, res) => {
  res.send('Inventory API is running');
});

app.use('/products', productRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});