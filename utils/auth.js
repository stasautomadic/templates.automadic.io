import { useRouter } from 'next/router';
import { useEffect } from 'react';

export const withAuth = (WrappedComponent) => {
    return (props) => {
        const router = useRouter();
        
        useEffect(() => {
            // Check if user is authenticated (e.g., check for token in localStorage)
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/login');
            }
        }, []);

        return <WrappedComponent {...props} />;
    };
}; 