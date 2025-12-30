import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export function useAdmin() {
    const { user } = useAuth();
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function checkAdmin() {
            if (!user) {
                setIsAdmin(false);
                setLoading(false);
                return;
            }

            // Check if user email is admin
            const adminEmails = [
                'admin@sygmaconsult.com',
                'contact@sygma-consult.com',
            ];

            setIsAdmin(adminEmails.includes(user.email || ''));
            setLoading(false);
        }

        checkAdmin();
    }, [user]);

    return { isAdmin, loading };
}
