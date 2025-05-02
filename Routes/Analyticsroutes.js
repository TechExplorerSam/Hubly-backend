const AnalyticsController = require('../Controllers/AnalyticsController');
const express = require('express');
const app = express.Router();

// Route to get the analytics data
app.get('/getanalytics', AnalyticsController.getAnalytics);

// Route to generate and store the analytics snapshot
app.post('/generateanalyticsnapshot', AnalyticsController.generateAnalyticsSnapshot);


module.exports = app;