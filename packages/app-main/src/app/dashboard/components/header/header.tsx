'use client';

import { useState, useEffect } from 'react';
import { getAuthUser } from '@/lib/auth';
import { LoadingSpinner } from '@/components/loading-spinner/loading-spinner';
import './header.css';

export function Header() {
    const [userEmail, setUserEmail] = useState<string>('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const user = getAuthUser();
        if (user?.email) {
            setUserEmail(user.email);
        }
        setLoading(false);
    }, []);

    return (
        <header className="header-container">
            <span className="header-email">
                {loading ? (
                    <LoadingSpinner size="small" />
                ) : (
                    userEmail || 'Email não encontrado'
                )}
            </span>
        </header>
    );
}
