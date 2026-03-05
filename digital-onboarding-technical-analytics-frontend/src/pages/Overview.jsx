import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const Overview = () => {
    const { journeyName } = useParams();
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState('');
    const [searchedData, setSearchedData] = useState(null);

    // Mock data simulation based on user request
    const handleSearch = (e) => {
        e.preventDefault();
        if (!searchTerm) return;

        // Simulate finding a specific customer journey
        setSearchedData({
            id: searchTerm.startsWith('JID') ? searchTerm : `JID-${Math.random().toString(36).substring(2, 10)}`,
            phone: searchTerm.startsWith('JID') ? '+91 98765 43210' : searchTerm,
            status: Math.random() > 0.3 ? 'Completed' : 'Dropped',
            timestamp: new Date().toLocaleString(),
            steps: [
                { name: 'Initiate Request', status: 'Success', time: '10:00 AM' },
                { name: 'OTP Verification', status: 'Success', time: '10:02 AM' },
                { name: 'Document Upload', status: 'Success', time: '10:05 AM' },
                { name: 'Final Approval', status: Math.random() > 0.3 ? 'Success' : 'Failed', time: '10:10 AM' }
            ]
        });
    };

    return (
        <div style={{ padding: '20px 0', maxWidth: '1000px', margin: '0 auto' }}>
            <button
                onClick={() => navigate('/')}
                className="hover-lift"
                style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-subtle)',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    marginBottom: '20px',
                    fontWeight: '600',
                    color: 'var(--text-muted)'
                }}
            >
                ← Back to Dashboard
            </button>

            <div style={{ background: 'var(--bg-card)', padding: '40px', borderRadius: '16px', boxShadow: 'var(--shadow-color)' }}>
                <h1 style={{ fontSize: '28px', color: 'var(--text-main)', marginBottom: '8px' }}>
                    {decodeURIComponent(journeyName)} - Drill-down
                </h1>
                <p style={{ color: 'var(--text-muted)', marginBottom: '40px' }}>
                    Track specific customer journeys by Phone Number or Journey ID.
                </p>

                <form onSubmit={handleSearch} style={{ display: 'flex', gap: '12px', marginBottom: '40px' }}>
                    <input
                        type="text"
                        placeholder="Enter Phone Number or JID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            flex: 1,
                            padding: '14px 20px',
                            fontSize: '16px',
                            borderRadius: '8px',
                            border: '1px solid var(--border-subtle)',
                            background: 'var(--app-bg)',
                            color: 'var(--text-main)',
                            outline: 'none'
                        }}
                    />
                    <button
                        type="submit"
                        className="hover-lift"
                        style={{
                            background: '#0ea5e9',
                            color: 'white',
                            border: 'none',
                            padding: '0 30px',
                            borderRadius: '8px',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            cursor: 'pointer'
                        }}
                    >
                        Track Journey
                    </button>
                </form>

                {searchedData && (
                    <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '30px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                            <div>
                                <p style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 'bold' }}>Journey ID</p>
                                <p style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text-main)' }}>{searchedData.id}</p>
                            </div>
                            <div>
                                <p style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 'bold' }}>Phone / Identifier</p>
                                <p style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text-main)' }}>{searchedData.phone}</p>
                            </div>
                            <div>
                                <p style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 'bold' }}>Status</p>
                                <p style={{
                                    fontSize: '18px',
                                    fontWeight: '800',
                                    color: searchedData.status === 'Completed' ? '#10b981' : '#ef4444'
                                }}>
                                    {searchedData.status}
                                </p>
                            </div>
                        </div>

                        <h3 style={{ fontSize: '18px', color: 'var(--text-main)', marginBottom: '16px', marginTop: '30px' }}>Journey Steps Timeline</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {searchedData.steps.map((step, idx) => (
                                <div key={idx} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    background: 'var(--bg-card-inner)',
                                    padding: '16px',
                                    borderRadius: '12px',
                                    borderLeft: `4px solid ${step.status === 'Success' ? '#10b981' : '#ef4444'}`
                                }}>
                                    <div style={{ flex: 1, fontWeight: '600', color: 'var(--text-main)' }}>{step.name}</div>
                                    <div style={{ background: 'var(--bg-card)', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', border: `1px solid ${step.status === 'Success' ? '#bbf7d0' : '#fecaca'}`, color: step.status === 'Success' ? '#166534' : '#991b1b' }}>
                                        {step.status}
                                    </div>
                                    <div style={{ width: '80px', textAlign: 'right', fontSize: '13px', color: 'var(--text-muted)' }}>{step.time}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default Overview;
