import { useState, useEffect } from 'react'; // Import useState and useEffect
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import { LogOut } from 'lucide-react';
import { signOut } from 'firebase/auth';

export default function Header() {
    const [user] = useAuthState(auth);
    // Create a local state to hold the avatar URL
    const [avatarUrl, setAvatarUrl] = useState('');

    // This effect runs when the user object changes
    useEffect(() => {
        if (user) {
            // If photoURL exists, use it.
            if (user.photoURL) {
                setAvatarUrl(user.photoURL);
            } else {
                // Otherwise, construct the fallback URL.
                const fallbackUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || 'User')}&background=3B82F6&color=fff`;
                setAvatarUrl(fallbackUrl);
            }
        }
    }, [user]); // Re-run this effect whenever the user object is updated

    // Guard clause: Don't render anything until the user object is available.
    if (!user) {
        return null;
    }

    return (
        <header className="h-20 bg-background flex-shrink-0 flex items-center justify-between px-6 lg:px-8 border-b border-border-color">
            <div>
                <h2 className="text-xl font-bold text-text-primary">Dashboard</h2>
                <p className="text-sm text-text-secondary">Manage your email campaigns securely</p>
            </div>
            <div className="flex items-center space-x-4">
                <div className="text-right">
                    <p className="font-semibold text-text-primary">{user.displayName}</p>
                    <p className="text-xs text-text-secondary">{user.email}</p>
                </div>
                {/* Only render the image if the avatarUrl state is not empty */}
                {avatarUrl && (
                    <img
                        src={avatarUrl}
                        alt="User Avatar"
                        className="h-10 w-10 rounded-full border-2 border-primary-blue"
                    />
                )}
                <button onClick={() => signOut(auth)} className="p-2 rounded-full hover:bg-card text-text-secondary hover:text-white transition-colors">
                    <LogOut size={20} />
                </button>
            </div>
        </header>
    );
}