// (app) route-group layout — wraps every authenticated screen.
// Desktop: centers in a phone-shaped frame with visible outline.
// Mobile: fills full width.

import { NavBar } from './nav-bar';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', background: '#060503', paddingTop: '0px' }}>
      {/* Phone frame outline */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '430px',
          minHeight: '100vh',
          background: '#1A1713',
          borderLeft:  '1px solid rgba(201,130,42,0.25)',
          borderRight: '1px solid rgba(201,130,42,0.25)',
          boxShadow: '-8px 0 40px rgba(0,0,0,0.6), 8px 0 40px rgba(0,0,0,0.6), 0 0 80px rgba(201,130,42,0.04)',
        }}
      >
        <div style={{ paddingBottom: 80 }}>
          {children}
        </div>
        <NavBar />
      </div>
    </div>
  );
}
