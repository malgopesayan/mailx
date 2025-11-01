import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import { auth, db } from '../firebase';
import { collection, doc, getDoc, query, where } from 'firebase/firestore';
import { Send, Calendar, Upload, Paperclip } from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import toast from 'react-hot-toast';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../quill-dark.css';
import { sendInstantEmailViaBackend } from '../api';
import Papa from 'papaparse';
import { encrypt } from '../utils/encryption'; // <-- IMPORT THE ENCRYPT FUNCTION

function MailSender() {
  const [user] = useAuthState(auth);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [csvFile, setCsvFile] = useState(null);
  const [attachmentFile, setAttachmentFile] = useState(null);
  const [sendOption, setSendOption] = useState('now');
  const [scheduleTime, setScheduleTime] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState(null);

  const templatesQuery = user ? query(collection(db, 'templates'), where('userId', '==', user.uid)) : null;
  const [templatesSnapshot] = useCollection(templatesQuery);

  useEffect(() => {
    let isMounted = true; 
    const fetchSettings = async () => {
      if (user) {
        const docRef = doc(db, 'settings', user.uid);
        const docSnap = await getDoc(docRef);
        if (isMounted && docSnap.exists()) {
          setSettings(docSnap.data());
        }
      }
    };
    fetchSettings();
    return () => {
      isMounted = false;
    };
  }, [user]);

  const handleTemplateChange = (e) => {
    const templateId = e.target.value;
    if (!templateId) {
        setSubject('');
        setBody('');
        return;
    }
    const selectedTemplate = templatesSnapshot.docs.find(doc => doc.id === templateId);
    if (selectedTemplate) {
        setSubject(selectedTemplate.data().subject);
        setBody(selectedTemplate.data().body);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!settings || !settings.gmail || !settings.appPassword) {
      return toast.error("Please configure your credentials in Settings first.");
    }
    if (!user || !csvFile || !subject || !body || body === '<p><br></p>') {
      return toast.error("Please fill all required fields and upload a CSV file.");
    }
    setIsLoading(true);

    Papa.parse(csvFile, {
      complete: async (results) => {
        const recipients = results.data.flat().filter(email => email && email.includes('@'));

        if (recipients.length === 0) {
            toast.error("No valid email addresses found in the CSV file.");
            setIsLoading(false);
            return;
        }

        try {
          // Encrypt the password before sending it to the backend
          const encryptedPassword = encrypt(settings.appPassword);

          const emailData = {
              subject: subject,
              htmlBody: body,
              senderEmail: settings.gmail,
              // Send the ENCRYPTED password instead of the plaintext one
              senderPassword: encryptedPassword, 
          };
          
          await sendInstantEmailViaBackend(emailData, recipients, attachmentFile);

          setSubject(''); setBody(''); setCsvFile(null); setAttachmentFile(null);
        } catch (error) {
          console.error("Failed to submit request to backend:", error);
        } finally {
          setIsLoading(false);
        }
      },
      error: (error) => {
        toast.error("Failed to parse CSV file.");
        console.error("CSV Parsing Error:", error);
        setIsLoading(false);
      }
    });
  };
  
  const FileInput = ({ icon: Icon, title, file, setFile, accept }) => (
    <div className="bg-background rounded-lg p-4 border border-border-color">
      <label htmlFor={`${title}-upload`} className="cursor-pointer flex items-center space-x-3">
        <Icon className="h-5 w-5 text-text-secondary" />
        <div className="flex-1">
          <p className="font-medium text-text-primary">{title}</p>
          <p className="text-xs text-text-secondary truncate">{file ? file.name : "No file selected"}</p>
        </div>
        <div className="px-4 py-2 bg-card text-sm font-semibold rounded-md hover:bg-card-hover">
            Choose File
        </div>
      </label>
      <input id={`${title}-upload`} type="file" accept={accept} onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)} className="hidden"/>
    </div>
  );

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline','strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image'],
      ['clean']
    ],
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-card p-8 rounded-2xl border border-border-color">
        <h2 className="text-xl font-bold text-text-primary mb-1">Mail Sender</h2>
        <p className="text-text-secondary mb-6">Compose and send emails instantly or schedule for later</p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-sm font-medium text-text-secondary mb-2 block">Quick Start with Template</label>
            <select
                onChange={handleTemplateChange}
                className="w-full bg-background border border-border-color rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-blue outline-none text-text-primary"
            >
                <option value="">Select a template...</option>
                {templatesSnapshot?.docs.map(doc => (
                    <option key={doc.id} value={doc.id}>
                        {doc.data().subject}
                    </option>
                ))}
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FileInput icon={Upload} title="Recipient Emails (.csv)" file={csvFile} setFile={setCsvFile} accept=".csv" />
            <FileInput icon={Paperclip} title="File Attachment (Optional)" file={attachmentFile} setFile={setAttachmentFile} accept=".pdf, image/*" />
          </div>
          <div>
            <label className="text-sm font-medium text-text-secondary mb-2 block">Subject</label>
            <input type="text" placeholder="Enter email subject..." value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full bg-background border border-border-color rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-blue outline-none" />
          </div>
          <div>
            <label className="text-sm font-medium text-text-secondary mb-2 block">Message Body</label>
            <ReactQuill 
              theme="snow" 
              value={body} 
              onChange={setBody}
              modules={quillModules}
              placeholder="Compose your message..."
            />
          </div>
          <button type="submit" disabled={isLoading} className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary-blue to-accent-cyan text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary-blue/20">
            {isLoading ? 'Processing...' : <><Send size={20} /> Send Now</>}
          </button>
        </form>
      </div>
    </div>
  );
}

export default MailSender;