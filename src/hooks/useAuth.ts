import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useAuthStore } from '../store/authStore';
import { useEffect } from 'react';

export const useAuth = () => {
    const { user, setUser, setLoading } = useAuthStore();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
                if (userDoc.exists()) {
                    setUser({ id: firebaseUser.uid, email: firebaseUser.email || '', ...userDoc.data() } as any);
                } else {
                    // Used for mock tests
                    setUser({ id: firebaseUser.uid, email: firebaseUser.email || '', role: firebaseUser.email?.includes('admin') ? 'admin' : 'manager', name: 'User', createdAt: Date.now(), lastLogin: Date.now(), isActive: true });
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });
        return unsubscribe;
    }, [setUser, setLoading]);

    return { user, loading: useAuthStore((s) => s.loading) };
};
