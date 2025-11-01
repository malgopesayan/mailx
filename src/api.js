import axios from 'axios';
import toast from 'react-hot-toast';

// The base URL for your Spring Boot backend.
const API_BASE_URL = 'http://localhost:8081';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

/**
 * Sends the email data, including a parsed list of recipients and an optional attachment,
 * to the backend for instant sending.
 * @param {object} emailData - Contains subject, body, and sender credentials.
 * @param {string[]} recipients - An array of email addresses parsed from the CSV.
 * @param {File} attachmentFile - The optional attachment file.
 */
export const sendInstantEmailViaBackend = async (emailData, recipients, attachmentFile) => {
  const formData = new FormData();

  // Append all the text-based data
  formData.append('subject', emailData.subject);
  formData.append('body', emailData.htmlBody);
  formData.append('senderEmail', emailData.senderEmail);
  formData.append('senderPassword', emailData.senderPassword); // This is the encrypted password
  
  // Spring Boot can accept a list of strings by appending them with the same key.
  recipients.forEach(email => {
    formData.append('recipients', email);
  });

  // Append the attachment file if it exists
  if (attachmentFile) {
    // The key 'attachmentFile' must match the @RequestParam name in your Java controller
    formData.append('attachmentFile', attachmentFile);
  }

  try {
    const response = await apiClient.post('/send-emails-instant', formData, {
      headers: {
        // Axios sets the correct 'multipart/form-data' header automatically when using FormData
      },
    });
    toast.success(response.data || 'Email sending process started!');
    return response.data;
  } catch (error) {
    console.error('Error sending request to backend:', error);
    const errorMessage = error.response?.data || 'Failed to connect to the backend.';
    toast.error(`Backend Error: ${errorMessage}`);
    throw error;
  }
};