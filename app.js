const express = require("express");
const { badPath } = require("./controllers/app.controllers");
const {
  handleCustomErrors,
  handlePsqlErrors,
  handleServerErrors,
} = require("./errors");
const apiRouter = require("./routes/api-router");
const cors = require('cors');

// app setup
const app = express();
app.use(cors());
app.use(express.json());

// Endpoints
app.use('/api', apiRouter);
app.all("/*", badPath);

// Error Handling
app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

// Export
module.exports = app;
