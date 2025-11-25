// This file is the entry point for Vercel serverless functions
const { app } = require('./dist/src/main');
module.exports = app;
