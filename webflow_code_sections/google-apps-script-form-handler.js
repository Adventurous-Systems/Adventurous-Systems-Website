/**
 * AI Readiness Assessment - Google Apps Script Form Handler
 * 
 * SETUP INSTRUCTIONS:
 * 1. Create a new Google Sheet for "AI Readiness Assessments"
 * 2. Create a new Google Apps Script project (Extensions > Apps Script)
 * 3. Copy this entire code into Code.gs
 * 4. Update SHEET_ID constant with your Google Sheet ID
 * 5. Update NOTIFICATION_EMAIL with your email
 * 6. Deploy as Web App:
 *    - Click Deploy > New deployment
 *    - Type: Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 7. Copy the Web App URL to use in your form
 */

// ===== CONFIGURATION =====
const SHEET_ID = '1-gUrKLVikX5EpP5Lc6XGhZOZtYsz5NKye0UUKjEOn4c'; // Replace with your Sheet ID
const NOTIFICATION_EMAIL = 'systems@adventurous.systems';
const SHEET_NAME = 'Submissions';

// ===== MAIN FORM HANDLER =====
/**
 * Handles POST requests from the assessment form
 */
function doPost(e) {
  try {
    // Parse the JSON data from request
    const data = JSON.parse(e.postData.contents);
    
    // Open the spreadsheet
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      return createResponse(false, 'Sheet not found. Please check SHEET_NAME configuration.');
    }
    
    // Check if this email already exists
    const existingRowIndex = findEmailRow(sheet, data.email);
    
    if (existingRowIndex > 0) {
      // Update existing row
      updateRow(sheet, existingRowIndex, data);
    } else {
      // Add new row
      addNewRow(sheet, data);
    }
    
    // If status is "complete", send notification email
    if (data.status === 'complete') {
      sendNotificationEmail(data);
    }
    
    return createResponse(true, 'Form data saved successfully');
    
  } catch (error) {
    Logger.log('Error in doPost: ' + error.toString());
    return createResponse(false, 'Error: ' + error.toString());
  }
}

// ===== SHEET OPERATIONS =====
/**
 * Find row with matching email
 */
function findEmailRow(sheet, email) {
  const emailColumn = 2; // Column B (Email)
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) { // Start at 1 to skip header
    if (data[i][emailColumn - 1] === email) {
      return i + 1; // Return 1-based row index
    }
  }
  return -1; // Not found
}

/**
 * Update existing row with new data
 */
function updateRow(sheet, rowIndex, data) {
  const row = formatDataRow(data);
  sheet.getRange(rowIndex, 1, 1, row.length).setValues([row]);
  Logger.log('Updated row ' + rowIndex + ' for email: ' + data.email);
}

/**
 * Add new row to sheet
 */
function addNewRow(sheet, data) {
  const row = formatDataRow(data);
  sheet.appendRow(row);
  Logger.log('Added new row for email: ' + data.email);
}

/**
 * Format data object into array matching sheet columns
 */
function formatDataRow(data) {
  return [
    new Date(), // Timestamp
    data.email || '',
    data.status || 'partial',
    data.currentSection || 1,
    data.companyName || '',
    data.yourName || '',
    data.roleTitle || '',
    data.phone || '',
    data.companyWebsite || '',
    data.primarySector || '',
    data.companySize || '',
    data.annualRevenue || '',
    Array.isArray(data.designSoftware) ? data.designSoftware.join(', ') : data.designSoftware || '',
    Array.isArray(data.pmTools) ? data.pmTools.join(', ') : data.pmTools || '',
    Array.isArray(data.dataStorage) ? data.dataStorage.join(', ') : data.dataStorage || '',
    data.integrationLevel || '',
    Array.isArray(data.topChallenges) ? data.topChallenges.join(', ') : data.topChallenges || '',
    data.timeMoneyLoss || '',
    data.failedInitiatives || '',
    Array.isArray(data.aiPriorities) ? data.aiPriorities.join(', ') : data.aiPriorities || '',
    data.currentAiUsage || '',
    data.digitalTwinInterest || '',
    data.budgetRange || '',
    data.implementationTimeline || '',
    data.decisionMaking || '',
    data.otherStakeholders || '',
    Array.isArray(data.assessmentGoals) ? data.assessmentGoals.join(', ') : data.assessmentGoals || '',
    data.specificQuestions || '',
    data.heardAbout || ''
  ];
}

// ===== EMAIL FUNCTIONS =====
/**
 * Send notification email when form is completed
 */
function sendNotificationEmail(data) {
  try {
    const subject = '🎯 New AI Readiness Assessment Submission';
    const body = createNotificationEmailBody(data);
    
    MailApp.sendEmail({
      to: NOTIFICATION_EMAIL,
      subject: subject,
      htmlBody: body
    });
    
    Logger.log('Notification email sent to: ' + NOTIFICATION_EMAIL);
  } catch (error) {
    Logger.log('Error sending notification email: ' + error.toString());
  }
}

/**
 * Create HTML email body for notification
 */
function createNotificationEmailBody(data) {
  return `
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #2D8659;">New AI Readiness Assessment Completed</h2>
        
        <h3>Contact Information</h3>
        <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; background: #f6f7f9;">Company:</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${data.companyName || 'N/A'}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; background: #f6f7f9;">Name:</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${data.yourName || 'N/A'}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; background: #f6f7f9;">Role:</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${data.roleTitle || 'N/A'}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; background: #f6f7f9;">Email:</td>
            <td style="padding: 8px; border: 1px solid #ddd;"><a href="mailto:${data.email}">${data.email}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; background: #f6f7f9;">Phone:</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${data.phone || 'N/A'}</td>
          </tr>
        </table>
        
        <h3>Company Details</h3>
        <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; background: #f6f7f9;">Sector:</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${data.primarySector || 'N/A'}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; background: #f6f7f9;">Company Size:</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${data.companySize || 'N/A'}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; background: #f6f7f9;">Annual Revenue:</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${data.annualRevenue || 'N/A'}</td>
          </tr>
        </table>
        
        <h3>Implementation Details</h3>
        <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; background: #f6f7f9;">Timeline:</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${data.implementationTimeline || 'N/A'}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; background: #f6f7f9;">Budget Range:</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${data.budgetRange || 'N/A'}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; background: #f6f7f9;">Decision Making:</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${data.decisionMaking || 'N/A'}</td>
          </tr>
        </table>
        
        <h3>Top Challenges</h3>
        <p style="padding: 12px; background: #f6f7f9; border-left: 4px solid #2D8659; margin: 16px 0;">
          ${Array.isArray(data.topChallenges) ? data.topChallenges.join(', ') : (data.topChallenges || 'N/A')}
        </p>
        
        <h3>Where They Lose Time/Money</h3>
        <p style="padding: 12px; background: #fff3cd; border-left: 4px solid #ffc107; margin: 16px 0;">
          ${data.timeMoneyLoss || 'N/A'}
        </p>
        
        <p style="margin-top: 24px; padding-top: 24px; border-top: 2px solid #e5e7eb;">
          <strong>View full submission in <a href="https://docs.google.com/spreadsheets/d/${SHEET_ID}">Google Sheets</a></strong>
        </p>
      </body>
    </html>
  `;
}

/**
 * Send form reminder email (for calendar integration)
 */
function sendFormReminder(email, name) {
  try {
    const subject = 'Complete Your AI Readiness Assessment - Adventurous Systems';
    const formUrl = 'https://www.adventurous.systems/aec-ai-readiness-assessment-form';
    
    const body = `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #2D8659;">Thank You for Booking Your Strategy Session!</h2>
          
          <p>Hi ${name || 'there'},</p>
          
          <p>Thank you for scheduling a strategy session with Adventurous Systems. We're excited to discuss how we can help transform your AEC firm's digital capabilities.</p>
          
          <p>To make our session as productive as possible, please complete the <strong>AI Readiness Assessment</strong> before our call. This will help us understand your specific challenges and prepare tailored recommendations.</p>
          
          <div style="margin: 32px 0; text-align: center;">
            <a href="${formUrl}" style="display: inline-block; padding: 16px 32px; background: #111; color: #fff; text-decoration: none; border-radius: 10px; font-weight: bold;">Complete Assessment Now</a>
          </div>
          
          <p>The assessment takes approximately 10-15 minutes and covers:</p>
          <ul>
            <li>Your current technology landscape</li>
            <li>Data integration challenges</li>
            <li>AI and automation priorities</li>
            <li>Implementation timeline and budget</li>
          </ul>
          
          <p>Looking forward to our conversation!</p>
          
          <p style="margin-top: 32px;">
            <strong>The Adventurous Systems Team</strong><br>
            <a href="mailto:systems@adventurous.systems">systems@adventurous.systems</a>
          </p>
        </body>
      </html>
    `;
    
    MailApp.sendEmail({
      to: email,
      subject: subject,
      htmlBody: body
    });
    
    Logger.log('Form reminder sent to: ' + email);
    return true;
  } catch (error) {
    Logger.log('Error sending form reminder: ' + error.toString());
    return false;
  }
}

/**
 * Check for new calendar bookings and send form reminders
 * Run this on a time-based trigger (e.g., every hour)
 */
function checkAndSendFormReminder(email, name) {
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
    const existingRowIndex = findEmailRow(sheet, email);
    
    // If email not found or status is "partial", send reminder
    if (existingRowIndex === -1) {
      sendFormReminder(email, name);
      Logger.log('Reminder sent to new email: ' + email);
      return true;
    } else {
      const statusColumn = 3; // Column C (Status)
      const status = sheet.getRange(existingRowIndex, statusColumn).getValue();
      
      if (status !== 'complete') {
        sendFormReminder(email, name);
        Logger.log('Reminder sent to incomplete email: ' + email);
        return true;
      } else {
        Logger.log('Form already complete for: ' + email);
        return false;
      }
    }
  } catch (error) {
    Logger.log('Error in checkAndSendFormReminder: ' + error.toString());
    return false;
  }
}

// ===== UTILITY FUNCTIONS =====
/**
 * Create JSON response
 */
function createResponse(success, message) {
  return ContentService
    .createTextOutput(JSON.stringify({ success: success, message: message }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Initialize the spreadsheet with headers (run once manually)
 */
function initializeSheet() {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
  
  if (!sheet) {
    SpreadsheetApp.openById(SHEET_ID).insertSheet(SHEET_NAME);
  }
  
  const headers = [
    'Timestamp',
    'Email',
    'Status',
    'Current_Section',
    'Company_Name',
    'Your_Name',
    'Role_Title',
    'Phone',
    'Company_Website',
    'Primary_Sector',
    'Company_Size',
    'Annual_Revenue',
    'Design_Software',
    'PM_Tools',
    'Data_Storage',
    'Integration_Level',
    'Top_Challenges',
    'Time_Money_Loss',
    'Failed_Initiatives',
    'AI_Priorities',
    'Current_AI_Usage',
    'Digital_Twin_Interest',
    'Budget_Range',
    'Implementation_Timeline',
    'Decision_Making',
    'Other_Stakeholders',
    'Assessment_Goals',
    'Specific_Questions',
    'Heard_About'
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  sheet.getRange(1, 1, 1, headers.length).setBackground('#D4F4DD');
  
  Logger.log('Sheet initialized with headers');
}

/**
 * Test the doPost function (for debugging)
 */
function testDoPost() {
  const testData = {
    email: 'test@example.com',
    status: 'partial',
    currentSection: 1,
    companyName: 'Test Company',
    yourName: 'John Doe',
    roleTitle: 'CTO',
    phone: '123-456-7890',
    primarySector: 'Architecture'
  };
  
  const e = {
    postData: {
      contents: JSON.stringify(testData)
    }
  };
  
  const response = doPost(e);
  Logger.log(response.getContent());
}

