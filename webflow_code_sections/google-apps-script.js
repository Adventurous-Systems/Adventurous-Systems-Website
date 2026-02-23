/**
 * Google Apps Script for Join Our Community Form
 * This script receives form submissions and writes them to a Google Sheet
 * 
 * SETUP INSTRUCTIONS:
 * 1. Create a new Google Sheet
 * 2. Go to Extensions > Apps Script
 * 3. Delete any existing code and paste this script
 * 4. Click "Deploy" > "New deployment"
 * 5. Select "Web app" as deployment type
 * 6. Set "Execute as" to "Me"
 * 7. Set "Who has access" to "Anyone"
 * 8. Click "Deploy" and copy the web app URL
 * 9. Paste the URL into your Webflow embed HTML (replace YOUR_SCRIPT_URL)
 */

// Configuration
const SHEET_NAME = 'Community Signups'; // Name of the sheet to write to

/**
 * Handles POST requests from the form
 */
function doPost(e) {
  try {
    // Parse the incoming data
    const data = JSON.parse(e.postData.contents);
    const email = data.email;
    
    // Validate email
    if (!email || !isValidEmail(email)) {
      return createResponse(false, 'Please provide a valid email address.');
    }
    
    // Get or create the spreadsheet sheet
    const sheet = getOrCreateSheet();
    
    // Check for duplicate email
    if (isDuplicateEmail(sheet, email)) {
      return createResponse(false, 'This email is already registered.');
    }
    
    // Add the data to the sheet
    const timestamp = new Date();
    sheet.appendRow([timestamp, email]);
    
    // Return success response
    return createResponse(true, 'Thank you for joining our community!');
    
  } catch (error) {
    console.error('Error processing form:', error);
    return createResponse(false, 'An error occurred. Please try again later.');
  }
}

/**
 * Handles GET requests (for testing)
 */
function doGet(e) {
  return ContentService.createTextOutput(
    JSON.stringify({
      status: 'success',
      message: 'Adventurous Systems Community Form API is running!'
    })
  ).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Validates email format
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Gets the sheet or creates it if it doesn't exist
 */
function getOrCreateSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);
  
  // Create sheet if it doesn't exist
  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
    // Add headers
    sheet.appendRow(['Timestamp', 'Email']);
    // Format headers
    const headerRange = sheet.getRange(1, 1, 1, 2);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#4285f4');
    headerRange.setFontColor('#ffffff');
  }
  
  return sheet;
}

/**
 * Checks if email already exists in the sheet
 */
function isDuplicateEmail(sheet, email) {
  const data = sheet.getDataRange().getValues();
  const emailLower = email.toLowerCase();
  
  // Skip header row (index 0)
  for (let i = 1; i < data.length; i++) {
    if (data[i][1] && data[i][1].toString().toLowerCase() === emailLower) {
      return true;
    }
  }
  
  return false;
}

/**
 * Creates a JSON response
 */
function createResponse(success, message) {
  const response = {
    success: success,
    message: message
  };
  
  return ContentService.createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

