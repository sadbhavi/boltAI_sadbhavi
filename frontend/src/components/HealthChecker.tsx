import React, { useEffect, useState } from 'react';
import { Activity, Database, Clock } from 'lucide-react';

interface HealthStatus {
    status: string;
    timestamp: string;
    uptime: number;
    mongodb: string;
    environment: string;
}

const HealthChecker: React.FC = () => {
    const [health, setHealth] = useState<HealthStatus | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const checkHealth = async () => {
            try {
                const res = await fetch('/api/health');
                if (res.ok) {
                    const data = await res.json();
                    setHealth(data);
                    setError('');
                } else {
                    setError('Backend server not responding');
                }
            } catch (err) {
                setError('Could not connect to backend');
            } finally {
                setLoading(false);
            }
        };

        checkHealth();
        // Check every 30 seconds
        const interval = setInterval(checkHealth, 30000);
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="flex items-center space-x-2 text-sm text-stone-500">
                <Activity className="w-4 h-4 animate-pulse" />
                <span>Checking...</span>
            </div>
        );
    }

    if (error || !health) {
        return (
            <div className="flex items-center space-x-2 text-sm text-red-500">
                <Activity className="w-4 h-4" />
                <span title={error}>Offline</span>
            </div>
        );
    }

    const formatUptime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        return `${hours}h ${minutes}m`;
    };

    const isHealthy = health.status === 'OK' && health.mongodb === 'connected';

    return (
        <div className="flex items-center space-x-3 text-xs bg-white/50 backdrop-blur-sm px-3 py-1.5 rounded-full border border-stone-200">
            <div className="flex items-center space-x-1">
                <div className={`w-2 h-2 rounded-full ${isHealthy ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                <span className="text-stone-600 font-medium">{isHealthy ? 'Online' : 'Degraded'}</span>
            </div>

            <div className="flex items-center space-x-1 text-stone-500" title={`MongoDB: ${health.mongodb}`}>
                <Database className="w-3 h-3" />
                <span className={health.mongodb === 'connected' ? 'text-green-600' : 'text-red-600'}>
                    {health.mongodb === 'connected' ? '✓' : '✗'}
                </span>
            </div>

            <div className="flex items-center space-x-1 text-stone-500" title={`Uptime: ${formatUptime(health.uptime)}`}>
                <Clock className="w-3 h-3" />
                <span>{formatUptime(health.uptime)}</span>
            </div>
        </div>
    );
};

export default HealthChecker;
