import { Bell, Search, UserCircle } from 'lucide-react';

const Topbar = () => {
  return (
    <div style={{
      height: '70px',
      backgroundColor: 'var(--bg-dark)',
      borderBottom: '1px solid var(--border-color)',
      padding: '0 2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 10
    }}>
      <div style={{ position: 'relative', width: '300px' }}>
        <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
        <input 
          type="text" 
          placeholder="Search..." 
          style={{
            width: '100%',
            padding: '0.6rem 1rem 0.6rem 2.5rem',
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '100px',
            color: 'var(--text-primary)',
            outline: 'none'
          }}
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <button style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', position: 'relative' }}>
          <Bell size={20} />
          <span style={{ 
            position: 'absolute', top: '-2px', right: '-2px', 
            width: '8px', height: '8px', 
            backgroundColor: 'var(--danger)', borderRadius: '50%' 
          }}></span>
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.875rem', fontWeight: '600' }}>Admin User</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>admin@openclaw.com</div>
          </div>
          <UserCircle size={36} color="var(--text-secondary)" />
        </div>
      </div>
    </div>
  );
};

export default Topbar;
