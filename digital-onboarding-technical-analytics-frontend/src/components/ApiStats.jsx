import React from 'react';

const ApiStats = ({ stats }) => {
    return (
        <div style={{ marginTop: '50px', display: 'flex', flexWrap: 'wrap', gap: '30px', marginBottom: '80px' }}>
            <StatTable
                title="Top 5xx Error APIs"
                subtitle="Server Errors"
                data={stats.topErrors}
                valueSuffix="%"
                valueColor="#ef4444"
            />
            <StatTable
                title="Slowest APIs (P95)"
                subtitle="Response Time"
                data={stats.slowest}
                valueSuffix=""
                valueColor="#f59e0b"
            />
        </div>
    );
};

const StatTable = ({ title, subtitle, data, valueSuffix, valueColor }) => (
    <div style={{ flex: 1, background: 'var(--bg-card)', padding: '30px', borderRadius: '20px', border: '1px solid var(--border-subtle)', minWidth: 'min(100%, 450px)', boxShadow: 'var(--shadow-color)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <h3 style={{ fontSize: '17px', fontWeight: '900', color: 'var(--text-main)' }}>{title}</h3>
            <span style={{ fontSize: '12px', color: valueColor, fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{subtitle}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {data.map((item) => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', background: 'var(--bg-card-inner)', borderRadius: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '22px' }}>
                        <span style={{ background: 'var(--border-subtle)', color: 'var(--text-muted)', fontSize: '12px', fontWeight: '800', padding: '3px 10px', borderRadius: '6px', minWidth: '30px', textAlign: 'center' }}>
                            {item.id}
                        </span>
                        <span style={{ color: '#3b82f6', fontSize: '12px', fontWeight: '900' }}>{item.method}</span>
                        <span style={{ color: 'var(--text-main)', fontSize: '13px', fontWeight: '700' }}>{item.path}</span>
                    </div>
                    <span style={{ fontWeight: '900', color: valueColor, fontSize: '16px' }}>
                        {item.value}{valueSuffix}
                    </span>
                </div>
            ))}
        </div>
    </div>
);

export default ApiStats;
