import React, { useState } from 'react';

const BusinessJourneys = ({ categories }) => {
    const [filter, setFilter] = useState('All');

    const counts = {
        All: categories.reduce((acc, cat) => acc + cat.journeys.length, 0),
        Stable: categories.reduce((acc, cat) => acc + cat.journeys.filter(j => j.status === 'Stable').length, 0),
        Degraded: categories.reduce((acc, cat) => acc + cat.journeys.filter(j => j.status === 'Degraded').length, 0),
        Critical: categories.reduce((acc, cat) => acc + cat.journeys.filter(j => j.status === 'Critical').length, 0),
    };

    const visibleCategories = categories
        .map((category) => ({
            ...category,
            filteredJourneys: filter === 'All'
                ? category.journeys
                : category.journeys.filter((j) => j.status === filter)
        }))
        .filter((category) => category.filteredJourneys.length > 0);

    const isSingleCategory = visibleCategories.length === 1;

    return (
        <div style={{ padding: '0' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h2 style={{ fontSize: 'clamp(17px, 1.8vw, 20px)', fontWeight: '800', color: 'var(--text-main)' }}>Business Journeys</h2>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                    {['All', 'Stable', 'Degraded', 'Critical'].map((f) => {
                        const isActive = filter === f;
                        const count = counts[f];

                        // Figma-like Pill Styles
                        const baseStyle = {
                            padding: 'clamp(6px, 1vw, 8px) clamp(12px, 2vw, 20px)',
                            borderRadius: '30px',
                            fontSize: 'clamp(11px, 1.2vw, 13px)',
                            fontWeight: '700',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            border: '1px solid transparent',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                        };

                        const activeStyles = {
                            All: { backgroundColor: '#73a8da', color: '#465e75', borderColor: '#8bb4db'},
                            Stable: { backgroundColor: '#73a8da', color: '#465e75', borderColor: '#8bb4db'},
                            Degraded: { backgroundColor: '#73a8da', color: '#465e75', borderColor: '#8bb4db'},
                            Critical: { backgroundColor: '#73a8da', color: '#465e75', borderColor: '#8bb4db'}
                        };

                        const inactiveStyle = {
                            backgroundColor: '#d9e5f3',
                            color: '#5f7591',
                            borderColor: '#d9e5f3'
                        };

                        return (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                style={{
                                    ...baseStyle,
                                    ...(isActive ? activeStyles[f] : inactiveStyle),
                                    boxShadow: isActive ? '0 4px 12px rgba(0,0,0,0.1)' : 'none'
                                }}
                            >
                                <span>{f}</span>
                                <span style={{
                                    opacity: 0.8,
                                    fontSize: 'clamp(11px, 1.2vw, 13px)',
                                    backgroundColor: isActive ? 'rgba(168, 197, 227, 0.9)' : 'rgba(120, 146, 175, 0.14)',
                                    padding: '1px 6px',
                                    borderRadius: '10px'
                                }}>
                                    {count}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {counts[filter] === 0 ? (
                <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: '15px', fontWeight: '600', background: 'var(--bg-card)', borderRadius: '20px', border: '1px dashed var(--border-subtle)', boxShadow: 'var(--shadow-color)' }}>
                    No journey found
                </div>
            ) : (
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: isSingleCategory
                            ? 'repeat(2, minmax(0, 1fr))'
                            : 'repeat(auto-fit, minmax(min(100%, 520px), 1fr))',
                        justifyContent: 'start',
                        alignItems: 'start',
                        gap: 'clamp(16px, 2vw, 32px)'
                    }}
                >
                    {visibleCategories.map((category) => {
                        // Sort to prioritize Gold Loan
                        const sortedJourneys = [...category.filteredJourneys].sort((a, b) => {
                            if (a.name === 'Gold Loan') return -1;
                            if (b.name === 'Gold Loan') return 1;
                            return 0;
                        });

                         return (
                            <div key={category.name} style={{ background: 'var(--bg-card)', padding: 'clamp(14px, 1.6vw, 24px)', borderRadius: '20px', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-color)' }}>
                                <h3 style={{ fontSize: 'clamp(15px, 1.3vw, 18px)', color: 'var(--text-muted)', fontWeight: '900', letterSpacing: '0.08em', marginBottom: 'clamp(14px, 1.6vw, 22px)', textTransform: 'uppercase' }}>
                                    {category.name}
                                </h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                    {sortedJourneys.map((j) => (
                                        <div key={j.name} style={{ width: '100%' }}>
                                            <JourneyCard journey={j} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

import { useNavigate } from 'react-router-dom';

const JourneyCard = ({ journey }) => {
    const navigate = useNavigate();
    const statusColor = journey.status === 'Critical' ? '#ef4444' : (journey.status === 'Degraded' ? '#f59e0b' : '#10b981');
    const statusBg = journey.status === 'Critical' ? '#fee2e2' : (journey.status === 'Degraded' ? '#ffedd5' : '#ecfdf5');

    let successColor = '#10b981';
    let failureColor = 'var(--text-main)';

    if (journey.status === 'Degraded') {
        successColor = 'var(--text-main)';
        failureColor = '#f59e0b';
    } else if (journey.status === 'Critical') {
        successColor = 'var(--text-main)';
        failureColor = '#ef4444';
    }

    const handleDrilldown = () => {
        navigate(`/techops/journey/${encodeURIComponent(journey.name)}`);
    };

    return (
        <div
            className="hover-lift"
            onClick={handleDrilldown}
            style={{
                border: '1px solid var(--border-subtle)',
                borderRadius: '16px',
                padding: 'clamp(12px, 1.4vw, 18px)',
                background: 'var(--bg-card)',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                minHeight: '220px',
                boxShadow: '0 1px 4px rgba(0,0,0,0.02)'
            }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                <span style={{ fontWeight: '800', color: statusColor, fontSize: 'clamp(15px, 1.4vw, 18px)' }}>{journey.name}</span>
                <span style={{
                    backgroundColor: statusBg,
                    color: statusColor,
                    fontSize: 'clamp(11px, 1vw, 13px)',
                    padding: '3px 12px',
                    borderRadius: '8px',
                    fontWeight: '800',
                    textTransform: 'capitalize'
                }}>
                    {journey.status === 'Stable' ? 'Healthy' : journey.status}
                </span>
            </div>

            <div style={{ borderTop: '1px solid #94a3b8', marginBottom: '12px' }} />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '10px', marginBottom: '20px' }}>
                <Metric label="Total Volume" value={journey.volume} />
                <Metric label="Success Rate" value={`${journey.success}%`} color={successColor} />
                <Metric label="Abandon Rate" value={`${journey.abandon}%`} />
                <Metric label="Failure Rate" value={`${journey.failure}%`} color={failureColor} />
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                gap: '12px',
                backgroundColor: 'var(--bg-card-inner)',
                padding: '14px',
                borderRadius: '12px',
                marginTop: 'auto'
            }}>
                <Metric label="Uptime" value={`${journey.uptime}%`} />
                <Metric label="P95" value={`${journey.p95}ms`} />
                <Metric label="Services" value={journey.services} />
            </div>
        </div>
    );
};

const Metric = ({ label, value, color = 'var(--text-main)' }) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <p style={{ fontSize: 'clamp(10px, 0.9vw, 13px)', color: '#94a3b8', marginBottom: '8px', fontWeight: '600', minHeight: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {label}
        </p>
        <p style={{ fontSize: 'clamp(14px, 1.5vw, 20px)', fontWeight: '900', color }}>{value}</p>
    </div>
);

export default BusinessJourneys;
