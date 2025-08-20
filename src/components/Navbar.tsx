import React from 'react'

interface NavbarProps {
  user?: any
  onSignOut?: () => void
  onSignIn?: () => void
}

const Navbar: React.FC<NavbarProps> = ({ user, onSignOut, onSignIn }) => {
  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
      zIndex: 1000,
      padding: '0'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 2rem',
        height: '70px'
      }}>
        {/* Logo */}
        <div style={{
          fontSize: '1.8rem',
          fontWeight: '800',
          background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          letterSpacing: '-0.5px'
        }}>
          Zlyzer
        </div>

        {/* Navigation Links */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '2rem'
        }}>
          {!user && (
            <>
              <a href="#" style={{
                color: '#6b7280',
                textDecoration: 'none',
                fontWeight: '500',
                transition: 'color 0.2s ease'
              }}>
                Home
              </a>
              <a href="#" style={{
                color: '#6b7280',
                textDecoration: 'none',
                fontWeight: '500',
                transition: 'color 0.2s ease'
              }}>
                Product
              </a>
              <a href="#" style={{
                color: '#6b7280',
                textDecoration: 'none',
                fontWeight: '500',
                transition: 'color 0.2s ease'
              }}>
                FAQ
              </a>
              <a href="#" style={{
                color: '#6b7280',
                textDecoration: 'none',
                fontWeight: '500',
                transition: 'color 0.2s ease'
              }}>
                Blog
              </a>
              <a href="#" style={{
                color: '#6b7280',
                textDecoration: 'none',
                fontWeight: '500',
                transition: 'color 0.2s ease'
              }}>
                About Us
              </a>
            </>
          )}

          {/* Auth Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {user ? (
              <>
                <span style={{
                  color: '#374151',
                  fontWeight: '500'
                }}>
                  {user.user_metadata?.full_name || user.email}
                </span>
                <button
                  onClick={onSignOut}
                  style={{
                    padding: '0.5rem 1rem',
                    background: 'transparent',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    color: '#374151',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <button style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#6b7280',
                  fontWeight: '500',
                  cursor: 'pointer',
                  padding: '0.5rem 1rem'
                }}>
                  Login
                </button>
                <button
                  onClick={onSignIn}
                  style={{
                    background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white',
                    fontWeight: '600',
                    cursor: 'pointer',
                    padding: '0.75rem 1.5rem',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
