import { useCollection } from 'react-firebase-hooks/firestore';
import { collection, query, where, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { format } from 'date-fns';
import { Trash2, Clock, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import Spinner from '../components/Spinner.jsx';

export default function Scheduler() {
  const [user] = useAuthState(auth);

  const q = user ? query(
    collection(db, 'scheduledEmails'),
    where('userId', '==', user.uid),
    orderBy('scheduleTime', 'desc')
  ) : null;
  const [snapshot, loading] = useCollection(q);

  const handleDelete = async (id) => {
    if(window.confirm("Are you sure you want to delete this scheduled task?")) {
      await deleteDoc(doc(db, 'scheduledEmails', id));
      toast.success("Scheduled task deleted.");
    }
  }

  const StatusBadge = ({ status }) => {
    const isPending = status.toLowerCase() === 'pending';
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full ${
        isPending ? 'bg-yellow-500/10 text-status-pending' : 'bg-green-500/10 text-status-sent'
      }`}>
        {isPending ? <Clock size={14} /> : <CheckCircle size={14} />}
        {status}
      </span>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-bold text-text-primary">Mail Scheduler</h2>
        <p className="text-text-secondary mt-1">Manage your scheduled and sent emails</p>
      </div>
      
      {loading && <div className="flex justify-center p-8"><Spinner /></div>}
      
      {!loading && snapshot?.empty && <p className="text-center text-text-secondary py-16">No scheduled emails found.</p>}

      <div className="space-y-4">
        {snapshot?.docs.map(docData => {
            const data = docData.data();
            return (
                <div key={docData.id} className="bg-card p-5 rounded-xl border border-border-color hover:border-primary-blue transition-colors">
                    <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                               <StatusBadge status={data.status} />
                               <h3 className="font-semibold text-text-primary truncate">{data.subject}</h3>
                            </div>
                            <p className="text-sm text-text-secondary line-clamp-2">{data.htmlBody}</p>
                            <p className="text-xs text-text-secondary mt-3">{format(data.scheduleTime.toDate(), 'MMM d, yyyy @ h:mm a')}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={() => handleDelete(docData.id)} className="p-2 rounded-md text-text-secondary hover:bg-red-500/20 hover:text-red-400 transition-colors">
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            )
        })}
      </div>
    </div>
  );
}