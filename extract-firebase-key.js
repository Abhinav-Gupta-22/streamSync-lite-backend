#!/usr/bin/env node

/**
 * Script to extract Firebase Admin SDK credentials from JSON key file
 * and format them for .env file
 * 
 * Usage: node extract-firebase-key.js path/to/firebase-key.json
 */

const fs = require('fs');
const path = require('path');

// Get JSON file path from command line argument
const jsonPath = process.argv[2];

if (!jsonPath) {
  console.error('❌ Error: Please provide path to Firebase JSON key file');
  console.log('\nUsage: node extract-firebase-key.js path/to/firebase-key.json\n');
  process.exit(1);
}

if (!fs.existsSync(jsonPath)) {
  console.error(`❌ Error: File not found: ${jsonPath}`);
  process.exit(1);
}

try {
  // Read and parse JSON file
  const jsonContent = fs.readFileSync(jsonPath, 'utf8');
  const json = JSON.parse(jsonContent);

  // Validate required fields
  const requiredFields = [
    'project_id',
    'private_key_id',
    'private_key',
    'client_email',
    'client_id',
    'auth_uri',
    'token_uri',
  ];

  const missingFields = requiredFields.filter(field => !json[field]);
  if (missingFields.length > 0) {
    console.error(`❌ Error: Missing required fields: ${missingFields.join(', ')}`);
    process.exit(1);
  }

  // Format private key: replace actual newlines with \n
  const formattedPrivateKey = json.private_key.replace(/\n/g, '\\n');

  // Output formatted .env variables
  console.log('\n✅ Firebase credentials extracted successfully!\n');
  console.log('📋 Copy these lines to your .env file:\n');
  console.log('# Firebase Admin SDK (for Push Notifications)');
  console.log(`FIREBASE_PROJECT_ID=${json.project_id}`);
  console.log(`FIREBASE_PRIVATE_KEY_ID=${json.private_key_id}`);
  console.log(`FIREBASE_PRIVATE_KEY="${formattedPrivateKey}"`);
  console.log(`FIREBASE_CLIENT_EMAIL=${json.client_email}`);
  console.log(`FIREBASE_CLIENT_ID=${json.client_id}`);
  console.log(`FIREBASE_AUTH_URI=${json.auth_uri}`);
  console.log(`FIREBASE_TOKEN_URI=${json.token_uri}`);
  console.log('\n✨ Done! Paste these into your .env file.\n');

} catch (error) {
  if (error instanceof SyntaxError) {
    console.error('❌ Error: Invalid JSON file');
    console.error(error.message);
  } else {
    console.error('❌ Error:', error.message);
  }
  process.exit(1);
}
