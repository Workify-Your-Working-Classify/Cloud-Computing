const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes/route');
const userRoutes = require('./routes/userRoute');
const articleRoutes = require('./routes/articleRoute');
const modelController = require('./controllers/modelController');
const authenticate = require('./middleware/auth'); // Pastikan middleware diimport
const app = express();
const port = process.env.PORT || 8080;

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Welcome to Workify Backend');
});

// Gunakan rute dari routes/route.js
app.use('/', routes);

// Gunakan rute dari routes/userRoute.js
app.use('/api', userRoutes);

// Gunakan rute dari routes/articleRoute.js
app.use('/api/article', articleRoutes);

// Tambahkan middleware auth ke endpoint /api/predict
app.post('/api/predict', authenticate, modelController.processRequest); // Pastikan middleware diterapkan

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
