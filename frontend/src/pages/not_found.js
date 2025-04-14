import React from 'react'

const NotFound = () => {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh', 
      textAlign: 'center', 
      padding: '20px', 
      backgroundColor: '#0a1929' 
    }}>
      <h1 style={{ 
        fontSize: '120px', 
        fontWeight: 'bold', 
        marginBottom: '10px', 
        color: '#ffffff',
        textShadow: '0 0 20px rgba(66, 153, 225, 0.6)' 
      }}>404</h1>
      
      <span style={{ 
        fontSize: '28px', 
        marginBottom: '24px', 
        color: '#90cdf4',
        fontWeight: '300',
        display: 'block'
      }}>Oops! Page Not Found</span>
      
      <span style={{
        fontSize: '16px',
        maxWidth: '500px',
        marginBottom: '36px',
        color: '#a0aec0',
        display: 'block'
      }}>
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </span>

      <a href="/" style={{ 
        padding: '14px 32px', 
        backgroundColor: '#1e4976', 
        color: '#ffffff', 
        textDecoration: 'none', 
        borderRadius: '8px', 
        fontSize: '16px',
        fontWeight: '500',
        letterSpacing: '1px',
        transition: 'all 0.3s ease',
        border: '1px solid #2d6cb5',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
        display: 'inline-block'
      }}
      onMouseOver={(e) => {
        e.target.style.backgroundColor = '#2d6cb5';
        e.target.style.transform = 'translateY(-2px)';
      }}
      onMouseOut={(e) => {
        e.target.style.backgroundColor = '#1e4976';
        e.target.style.transform = 'translateY(0)';
      }}>
        RETURN HOME
      </a>

      <div style={{ marginTop: '40px' }}>
        <span style={{ 
          color: '#a0aec0', 
          display: 'block',
          fontSize: '14px'
        }}>
          Developed by <span style={{ 
            color: '#63b3ed', 
            fontWeight: '500'
          }}>InkSpire Team</span>
        </span>
      </div>
    </div>
  )
}

export default NotFound