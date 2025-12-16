import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '../supabase';

interface AnalyticsContextType {
    trackEvent: (eventName: string, category: string, action: string, label?: string, metadata?: any) => Promise<void>;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

export const AnalyticsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const location = useLocation();
    const [session, setSession] = useState<any>(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    useEffect(() => {
        const trackPageView = async () => {
            try {
                await supabase.from('analytics_page_views').insert({
                    user_id: session?.user?.id || null,
                    path: location.pathname,
                    metadata: {
                        search: location.search,
                        hash: location.hash,
                    },
                });
            } catch (error) {
                console.error('Error tracking page view:', error);
            }
        };

        trackPageView();
    }, [location.pathname, session]);

    const trackEvent = async (eventName: string, category: string, action: string, label?: string, metadata: any = {}) => {
        try {
            await supabase.from('analytics_events').insert({
                user_id: session?.user?.id || null,
                event_name: eventName,
                category,
                action,
                label,
                metadata,
            });
        } catch (error) {
            console.error('Error tracking event:', error);
        }
    };

    return (
        <AnalyticsContext.Provider value={{ trackEvent }}>
            {children}
        </AnalyticsContext.Provider>
    );
};

export const useAnalytics = () => {
    const context = useContext(AnalyticsContext);
    if (context === undefined) {
        throw new Error('useAnalytics must be used within an AnalyticsProvider');
    }
    return context;
};
