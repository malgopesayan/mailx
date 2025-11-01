import axios from 'axios';
import toast from 'react-hot-toast';

// The base URL for your Spring Boot backend.
// It runs on port 8080 by default.
const API_BASE_URL = 'http://localhost:8081';

// We will use the 'axios' library for making HTTP requests.
// It's a popular and easy-to-use choice. Let's install it.
// In your terminal, run: npm install axios

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

/**
 * This function will replace the direct Firestore 'addDoc' call.
 * It sends all the data and files to your Spring Boot backend API.
 * 
 * @param {object} emailData - Contains subject, body, and scheduleTime.
 * @param {File} csvFile - The CSV file with recipient emails.
 * @param {File} attachmentFile - The optional PDF or image file.
 * @returns {Promise<object>} - The response from the backend.
 */
export const scheduleEmailViaBackend = async (emailData, csvFile, attachmentFile) => {
  // FormData is necessary for sending files (multipart/form-data).
  const formData = new FormData();

  // Add the email data fields. Note that the keys ('subject', 'body', etc.)
  // must match the @RequestParam names in your Java EmailController.
  formData.append('subject', emailData.subject);
  formData.append('body', emailData.htmlBody);
  formData.append('senderEmail', emailData.senderEmail);
  formData.append('senderPassword', emailData.senderPassword);
  
  // Format the scheduleTime to a string that Spring Boot can parse.
  if (emailData.scheduleTime) {
      // toISOString() produces a format like "2023-10-31T10:00:00.000Z"
      // We slice it to get "2023-10-31T10:00:00", which LocalDateTime.parse can handle.
      const formattedTime = emailData.scheduleTime.toISOString().slice(0, 19);
      formData.append('scheduleTime', formattedTime);
  }

  // Add the files. The keys 'csvFile' and 'resumeFile' must match the Java controller.
  formData.append('csvFile', csvFile);
  if (attachmentFile) {
    formData.append('resumeFile', attachmentFile);
  }

  try {
    const response = await apiClient.post('/send-emails', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    toast.success('Request sent to backend successfully!');
    return response.data;
  } catch (error) {
    console.error('Error sending request to backend:', error);
    // Provide a more helpful error message to the user
    const errorMessage = error.response?.data || 'Failed to connect to the backend.';
    toast.error(`Backend Error: ${errorMessage}`);
    throw error;
  }
};