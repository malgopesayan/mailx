import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Send, CalendarClock, FileText, Settings, LogOut, ShieldCheck, Mail } from 'lucide-react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion'; // 👈 added for animation

const navLinks = [
  { icon: LayoutDashboard, text: 'Dashboard', path: '/' },
  { icon: Send, text: 'Mail Sender', path: '/mail-sender' },
  { icon: CalendarClock, text: 'Scheduler', path: '/scheduler' },
  { icon: FileText, text: 'Templates', path: '/templates' },
  { icon: Settings, text: 'Settings', path: '/settings' },
];

export default function Sidebar() {
  const handleLogout = async () => {
    await signOut(auth);
    toast.success("Logged out successfully");
  };

  return (
    <aside className="w-64 bg-sidebar flex-shrink-0 flex flex-col">
      
      {/* 🔹 Animated Logo Section */}
      <div className="h-24 flex items-center justify-center border-b border-border-color overflow-hidden">
        {/* Mail icon first */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <Mail className="w-10 h-10 text-blue-500" />
        </motion.div>

        {/* Sliding MailX text */}
        <motion.h1
          className="text-4xl font-bold ml-3 flex items-center"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
        >
          <span className="text-white">Mail</span>
          <motion.span
            className="text-[3rem] text-blue-500 leading-none ml-1"
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            X
          </motion.span>
        </motion.h1>
      </div>

      {/* 🔹 Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navLinks.map((link) => (
          <NavLink
            key={link.text}
            to={link.path}
            end={link.path === '/'}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-lg text-text-secondary transition-colors duration-200 hover:bg-card hover:text-white ${
                isActive ? 'bg-primary-blue text-white shadow-lg' : ''
              }`
            }
          >
            <link.icon className="h-5 w-5 mr-3" />
            <span>{link.text}</span>
          </NavLink>
        ))}
      </nav>

      {/* 🔹 Footer Section */}
      <div className="p-4 border-t border-border-color">
        <div className="bg-card p-4 rounded-lg text-center mb-4">
          <ShieldCheck className="mx-auto h-8 w-8 text-accent-green mb-2" />
          <h3 className="font-semibold text-text-primary">Secure Connection</h3>
          <p className="text-xs text-text-secondary">End-to-end encrypted</p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center px-4 py-3 rounded-lg text-text-secondary transition-colors duration-200 hover:bg-red-500/20 hover:text-red-400"
        >
          <LogOut className="h-5 w-5 mr-3" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
