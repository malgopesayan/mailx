import { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import { collection, query, where, doc, deleteDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { FilePlus, Edit, Trash2, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { PageLoader } from '../components/Spinner';
import Modal from '../components/Modal';

const TemplateCard = ({ id, subject, body, onDelete }) => (
    <div className="bg-card p-6 rounded-xl border border-border-color flex flex-col justify-between hover:border-primary-blue transition-colors">
        <div>
            <h3 className="font-semibold text-text-primary mb-2 truncate">{subject}</h3>
            <p className="text-sm text-text-secondary line-clamp-4">{body}</p>
        </div>
        <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-border-color">
            <button className="p-2 rounded-md text-text-secondary hover:bg-primary-blue/20 hover:text-primary-blue transition-colors"><Edit size={16} /></button>
            <button onClick={() => onDelete(id)} className="p-2 rounded-md text-text-secondary hover:bg-red-500/20 hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
        </div>
    </div>
);

export default function Templates() {
  const [user] = useAuthState(auth);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTemplateSubject, setNewTemplateSubject] = useState('');
  const [newTemplateBody, setNewTemplateBody] = useState('');
  
  const templatesQuery = user ? query(collection(db, 'templates'), where('userId', '==', user.uid)) : null;
  const [snapshot, loading] = useCollection(templatesQuery);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this template?")) {
        try {
            await deleteDoc(doc(db, 'templates', id));
            toast.success('Template deleted!');
        } catch (error) {
            toast.error('Failed to delete template.');
        }
    }
  };

  const handleSaveTemplate = async (e) => {
    e.preventDefault();
    if (!newTemplateSubject || !newTemplateBody) {
        return toast.error("Subject and body cannot be empty.");
    }

    try {
        await addDoc(collection(db, 'templates'), {
            userId: user.uid,
            subject: newTemplateSubject,
            body: newTemplateBody,
            createdAt: serverTimestamp(),
        });
        toast.success("Template saved successfully!");
        setNewTemplateSubject('');
        setNewTemplateBody('');
        setIsModalOpen(false);
    } catch (error) {
        toast.error("Failed to save template.");
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-text-primary">Mail Templates</h2>
            <p className="text-text-secondary mt-1">Create and manage reusable email templates</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-primary-blue text-white font-semibold py-2 px-4 rounded-lg hover:bg-primary-blue-light transition-colors"
          >
            <FilePlus size={18} /> New Template
          </button>
        </div>

        {loading && <PageLoader />}

        {!loading && snapshot?.empty && (
          <div className="text-center py-16">
              <p className="text-text-secondary">You haven't created any templates yet.</p>
              <p className="text-sm text-text-secondary">Click "New Template" to get started.</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {snapshot?.docs.map((doc) => (
              <TemplateCard 
                  key={doc.id} 
                  id={doc.id}
                  subject={doc.data().subject} 
                  body={doc.data().body} 
                  onDelete={handleDelete}
              />
          ))}
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Template">
        <form onSubmit={handleSaveTemplate} className="space-y-4">
           <div>
            <label className="text-sm font-medium text-text-secondary mb-2 block">Template Subject</label>
            <input 
              type="text" 
              placeholder="Enter template subject..." 
              value={newTemplateSubject}
              onChange={(e) => setNewTemplateSubject(e.target.value)}
              className="w-full bg-background border border-border-color rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-blue outline-none" 
            />
          </div>
          <div>
            <label className="text-sm font-medium text-text-secondary mb-2 block">Template Body</label>
            <textarea 
              placeholder="Compose your template message..." 
              value={newTemplateBody}
              onChange={(e) => setNewTemplateBody(e.target.value)}
              rows={6} 
              className="w-full bg-background border border-border-color rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-blue outline-none resize-none" 
            />
          </div>
          <div className="flex justify-end">
            <button type="submit" className="flex items-center gap-2 bg-primary-blue text-white font-semibold py-2 px-4 rounded-lg hover:bg-primary-blue-light transition-colors">
              <Save size={18} /> Save Template
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}