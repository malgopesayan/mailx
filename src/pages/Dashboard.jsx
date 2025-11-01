import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import { collection, query, where, orderBy, limit } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { BarChart, Send, Calendar, FileText, CheckCircle, Clock, FilePlus, BarChart2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageLoader } from '../components/Spinner'; // Import PageLoader

const StatCard = ({ icon: Icon, title, value, description, color }) => (
  <div className="bg-card p-6 rounded-xl flex flex-col justify-between hover:bg-card-hover transition-colors">
    <div className="flex justify-between items-start">
      <div className={`p-3 rounded-lg bg-gray-700/50`}>
        <Icon className={`h-6 w-6 ${color}`} />
      </div>
    </div>
    <div>
      <p className="text-3xl font-bold mt-4 text-text-primary">{value}</p>
      <p className="text-sm text-text-secondary">{title}</p>
    </div>
  </div>
);

const ActivityItem = ({ icon: Icon, title, description, time, color }) => (
  <div className="flex items-start space-x-4 py-3">
    <div className={`p-2 rounded-full bg-gray-700/50`}>
      <Icon className={`h-5 w-5 ${color}`} />
    </div>
    <div>
      <p className="font-semibold text-text-primary">{title}</p>
      <p className="text-sm text-text-secondary">{description}</p>
      <p className="text-xs text-text-secondary mt-1">{time}</p>
    </div>
  </div>
);

const ActionCard = ({ icon: Icon, title, description, path, color }) => (
    <Link to={path} className={`bg-card p-6 rounded-xl flex items-start space-x-4 hover:bg-card-hover hover:scale-105 transition-all duration-200`}>
        <div className={`p-3 rounded-lg bg-gray-700/50`}>
            <Icon className={`h-6 w-6 ${color}`} />
        </div>
        <div>
            <p className="font-semibold text-text-primary">{title}</p>
            <p className="text-sm text-text-secondary">{description}</p>
        </div>
    </Link>
);

export default function Dashboard() {
  const [user] = useAuthState(auth);

  const emailsQuery = user ? query(
    collection(db, 'scheduledEmails'), 
    where('userId', '==', user.uid),
    orderBy('createdAt', 'desc'),
    limit(3)
  ) : null;
  const [emailsSnapshot, loadingEmails] = useCollection(emailsQuery);

  const templatesQuery = user ? query(collection(db, 'templates'), where('userId', '==', user.uid)) : null;
  const [templatesSnapshot, loadingTemplates] = useCollection(templatesQuery);
  
  if (loadingEmails || loadingTemplates) {
    return <PageLoader />; // Use the new PageLoader
  }

  const sentCount = emailsSnapshot?.docs.filter(doc => doc.data().status === 'SENT').length || 0;
  const scheduledCount = emailsSnapshot?.docs.filter(doc => doc.data().status === 'PENDING').length || 0;
  const totalEmails = sentCount + scheduledCount;
  const successRate = totalEmails > 0 ? Math.round((sentCount / totalEmails) * 100) : 0;
  const templateCount = templatesSnapshot?.docs.length || 0;

  return (
    <div className="space-y-8">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={Send} title="Total Emails Sent" value={sentCount} color="text-primary-blue" />
        <StatCard icon={Calendar} title="Scheduled Emails" value={scheduledCount} color="text-pink-400" />
        <StatCard icon={FileText} title="Active Templates" value={templateCount} color="text-accent-green" />
        <StatCard icon={BarChart} title="Success Rate" value={`${successRate}%`} color="text-orange-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-card p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Recent Activity</h3>
          <div className="space-y-2">
            {emailsSnapshot?.docs.map(doc => {
              const data = doc.data();
              const isSent = data.status === 'SENT';
              return (
                <ActivityItem 
                  key={doc.id}
                  icon={isSent ? CheckCircle : Clock} 
                  title={`Email ${isSent ? 'Sent' : 'Scheduled'}`}
                  description={data.subject} 
                  time={new Date(data.createdAt?.toDate()).toLocaleString()}
                  color={isSent ? "text-accent-green" : "text-status-pending"} />
              );
            })}
            {emailsSnapshot?.empty && <p className="text-text-secondary text-sm">No recent activity.</p>}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-card p-6 rounded-xl">
           <h3 className="text-lg font-semibold text-text-primary mb-4">Quick Actions</h3>
           <div className="space-y-4">
                <ActionCard icon={Send} title="Send Email" description="Compose and send instantly" path="/mail-sender" color="text-primary-blue" />
                <ActionCard icon={Calendar} title="Schedule Campaign" description="Plan your next campaign" path="/scheduler" color="text-pink-400" />
                <ActionCard icon={FilePlus} title="Create Template" description="Build reusable templates" path="/templates" color="text-accent-green" />
                <ActionCard icon={BarChart2} title="View Analytics" description="Track performance" path="/" color="text-orange-400" />
           </div>
        </div>
      </div>
    </div>
  );
}