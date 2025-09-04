require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fileRoutes = require('./routes/fileRoutes');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/files', fileRoutes);

// Static serve uploaded files for demo (do not expose in prod like this)
app.use('/uploads', express.static(path.resolve(__dirname, process.env.UPLOAD_DIR)));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
