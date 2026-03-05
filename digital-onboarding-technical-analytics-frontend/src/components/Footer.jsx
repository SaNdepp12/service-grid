import React from 'react';
import hdfcLogo from '../assets/hdfclogo.png';
import dicgcQr from '../assets/dicgcqr.png';

const Footer = () => {
    return (
        <footer style={{
            background: 'var(--bg-card)',
            width: '100%',
            borderTop: '1px solid var(--border-subtle)',
            padding: '24px 0 16px 0',
            marginTop: 0,
            color: 'var(--text-muted)',
            fontSize: '13px'
        }}>
            <div style={{ maxWidth: '1800px', margin: '0 auto', padding: '0 40px' }}>

                {/* TOP ROW: Logos */}
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '20px',
                    paddingBottom: '20px',
                    borderBottom: '1px solid var(--border-subtle)',
                    gap: '20px'
                }}>
                    {/* Main HDFC Logo */}
                    <img src={hdfcLogo} alt="HDFC Bank" style={{ height: '36px' }} />

                    {/* Right Side Trust Badges */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '40px' }}>

                        {/* DICGC Badge Group */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '16px' }}>
                            {/* QR Code */}
                            <img src={dicgcQr} alt="DICGC QR Code" style={{
                                height: '48px',
                                background: 'white',
                                padding: '4px',
                                border: '2px solid white',
                                borderRadius: '4px'
                            }} />

                            {/* DICGC Logo Mock */}
                            <div style={{ display: 'flex', flexDirection: 'column', color: '#09533f', fontWeight: '900', fontSize: '22px', lineHeight: '0.9', paddingRight: '12px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', letterSpacing: '-0.5px' }}>
                                    <span>DIC</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', letterSpacing: '-0.5px' }}>
                                    <span>GC</span>
                                </div>
                            </div>

                            <div style={{ lineHeight: '1.3' }}>
                                <div style={{ fontWeight: '800', color: 'var(--header-bg)', fontSize: '15px' }}>HDFC Bank is registered with DICGC</div>
                                <div style={{ color: '#0066cc', fontWeight: '600', fontSize: '14px' }}>https://www.dicgc.org.in</div>
                            </div>
                        </div>

                        {/* Secure Banking Badge */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            background: 'white',
                            border: '2px solid #1d4ed8',
                            borderRadius: '50px',
                            padding: '4px',
                            height: '42px',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}>
                            <div style={{
                                width: '30px',
                                height: '30px',
                                borderRadius: '50%',
                                border: '2px solid #ef4444',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: 'white',
                                zIndex: 1
                            }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                </svg>
                            </div>
                            <div style={{
                                background: '#1d4ed8',
                                color: 'white',
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                padding: '0 12px 0 16px',
                                marginLeft: '-12px',
                                borderTopRightRadius: '50px',
                                borderBottomRightRadius: '50px',
                                fontSize: '10px',
                                fontWeight: '800',
                                lineHeight: '1.1',
                                letterSpacing: '0.5px'
                            }}>
                                <span>SECURE</span>
                                <span>BANKING</span>
                            </div>
                        </div>

                    </div>
                </div>

                {/* BOTTOM ROW: Copyright, Links, Socials */}
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '24px' }}>

                    {/* Links */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '15px' }}>
                        <span>© Copyright HDFC Bank Ltd. 2026</span>
                        <span style={{ color: 'var(--border-subtle)' }}>|</span>
                        <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Cookie Policy</a>
                        <span style={{ color: 'var(--border-subtle)' }}>|</span>
                        <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Terms & Conditions</a>
                        <span style={{ color: 'var(--border-subtle)' }}>|</span>
                        <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Privacy</a>
                        <span style={{ color: 'var(--border-subtle)' }}>|</span>
                        <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Consent Connect Portal</a>
                        <span style={{ color: 'var(--border-subtle)' }}>|</span>
                        <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Website Usage Terms</a>
                        <span style={{ color: 'var(--border-subtle)' }}>|</span>
                        <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Glossary</a>
                    </div>

                    {/* Social Icons (using simple CSS circles as placeholders to match design) */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        {['f', 'ig', 'yt', 'x', 'p', 'in'].map(icon => (
                            <div key={icon} style={{
                                width: '28px',
                                height: '28px',
                                borderRadius: '50%',
                                backgroundColor: 'var(--header-bg)',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '12px',
                                fontWeight: 'bold',
                                cursor: 'pointer'
                            }}>
                                {icon}
                            </div>
                        ))}
                    </div>

                </div>

            </div>
        </footer>
    );
};

export default Footer;
