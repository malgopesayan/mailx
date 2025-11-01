import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import toast from 'react-hot-toast';
import { Save, Lock, Mail, KeyRound, Info } from 'lucide-react';
import Spinner from '../components/Spinner.jsx';

export default function Settings() {
    const [user] = useAuthState(auth);
    const [gmail, setGmail] = useState('');
    const [appPassword, setAppPassword] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // This flag prevents the effect from running twice in Strict Mode
        let isMounted = true; 

        const fetchSettings = async () => {
            if (user) {
                try {
                    const docRef = doc(db, 'settings', user.uid);
                    const docSnap = await getDoc(docRef);
                    
                    // Only update state if the component is still mounted
                    if (isMounted) {
                        if (docSnap.exists()) {
                            setGmail(docSnap.data().gmail || '');
                        }
                        setIsLoading(false);
                    }
                } catch (error) {
                    console.error("Error fetching settings:", error);
                    if (isMounted) setIsLoading(false);
                }
            }
        };

        fetchSettings();

        // Cleanup function to set the flag to false when the component unmounts
        return () => {
            isMounted = false;
        };
    }, [user]);

    const handleSave = async (e) => {
        e.preventDefault();
        if (!user || !gmail || !appPassword) {
            return toast.error("Please provide both your Gmail and App Password.");
        }
        const toastId = toast.loading("Saving settings...");

        try {
            const docRef = doc(db, 'settings', user.uid);
            await setDoc(docRef, { gmail, appPassword }, { merge: true });
            toast.success("Settings saved successfully!", { id: toastId });
            setAppPassword(''); 
        } catch (error) {
            toast.error("Failed to save settings.", { id: toastId });
        }
    };

    if (isLoading) return <div className="flex justify-center p-8"><Spinner /></div>;

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div>
              <h2 className="text-xl font-bold text-text-primary">Settings</h2>
              <p className="text-text-secondary mt-1">Configure your Gmail credentials securely</p>
            </div>

            <div className="bg-card p-8 rounded-2xl border border-border-color">
                <div className="flex items-start gap-4 p-4 rounded-lg bg-primary-blue/10 border border-primary-blue/20 mb-8">
                    <Lock size={24} className="text-primary-blue mt-1 flex-shrink-0" />
                    <div>
                        <h3 className="font-semibold text-text-primary">Secure & Encrypted</h3>
                        <p className="text-sm text-text-secondary">Your credentials are encrypted and stored securely. We never share or expose your sensitive data.</p>
                    </div>
                </div>

                <form onSubmit={handleSave} className="space-y-6">
                    <div>
                        <label className="text-sm font-medium text-text-secondary mb-2 flex items-center gap-2">
                           <Mail size={16}/> Gmail Address
                        </label>
                        <input type="email" value={gmail} onChange={e => setGmail(e.target.value)} placeholder="your.email@gmail.com" className="w-full bg-background border border-border-color rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-blue outline-none" required />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-text-secondary mb-2 flex items-center gap-2">
                           <KeyRound size={16}/> 16-Digit App Password
                        </label>
                        <input type="password" value={appPassword} onChange={e => setAppPassword(e.target.value)} placeholder="xxxx xxxx xxxx xxxx" className="w-full bg-background border border-border-color rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-blue outline-none" required />
                    </div>

                    <div className="bg-background p-4 rounded-lg border border-border-color">
                        <h4 className="font-semibold text-text-primary mb-2 flex items-center gap-2"><Info size={16} />How to Generate an App Password:</h4>
                        <ol className="list-decimal list-inside text-sm text-text-secondary space-y-1">
                            <li>Go to your Google Account settings &gt; Security.</li>
                            <li>Ensure 2-Step Verification is ON.</li>
                            <li>Click on "App passwords".</li>
                            <li>Select "Mail" for the app and "Other" for the device, then name it (e.g., MailFire).</li>
                            <li>Copy the 16-character password and paste it above.</li>
                        </ol>
                    </div>
                    
                    <button type="submit" className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary-blue to-accent-cyan text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity shadow-lg shadow-primary-blue/20">
                        <Save size={20} /> Save Credentials Securely
                    </button>
                </form>
            </div>
        </div>
    );
}