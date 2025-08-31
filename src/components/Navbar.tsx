import React, { useState } from 'react';

interface NavbarProps {
  user?: any
  onSignOut?: () => void
  onSignIn?: () => void
}

const Navbar: React.FC<NavbarProps> = ({ user, onSignOut, onSignIn }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isAuthenticated = !!user;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleAuthAction = () => {
    if (isAuthenticated) {
      onSignOut?.();
    } else {
      onSignIn?.();
    }
  };

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 50,
      padding: '1.5rem 1rem',
      background: 'rgba(26, 0, 51, 0.95)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
      <div style={{
        margin: '0 auto',
        maxWidth: '1280px'
      }}>
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {/* Logo */}
          <div style={{
            fontSize: 'clamp(1.875rem, 4vw, 3rem)',
            fontWeight: '400',
            color: '#ffffff',
            fontFamily: 'Galindo, cursive'
          }}>
            Zlyzer
          </div>

          {/* Desktop Navigation */}
          <div className="desktop-nav" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2rem'
          }}>
            {['Home', 'Product', 'FAQ', 'Blog', 'About Us'].map((item, index) => (
              <button 
                key={item}
                style={{
                  fontSize: index === 0 ? '1.125rem' : '1rem',
                  fontWeight: '500',
                  color: index === 0 ? '#000000' : '#a3a3a3',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'color 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#10b981'}
                onMouseLeave={(e) => e.currentTarget.style.color = index === 0 ? '#ffffff' : '#cccccc'}
              >
                {item}
              </button>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="desktop-auth" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            {isAuthenticated ? (
              <>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}>
                  <div style={{
                    width: '2rem',
                    height: '2rem',
                    backgroundColor: '#10b981',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <span style={{
                      color: 'white',
                      fontWeight: '600',
                      fontSize: '0.875rem',
                      fontFamily: 'Nunito Sans, sans-serif'
                    }}>
                      {user?.user_metadata?.full_name?.charAt(0)?.toUpperCase() || 
                       user?.email?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <span style={{
                    fontSize: '1rem',
                    fontWeight: '500',
                    color: '#000000',
                    fontFamily: 'Nunito Sans, sans-serif'
                  }}>
                    {user?.user_metadata?.full_name || user?.email || 'User'}
                  </span>
                </div>
                <button
                  onClick={handleAuthAction}
                  style={{
                    padding: '0.5rem 1rem',
                    border: '1px solid #10b981',
                    color: '#10b981',
                    fontSize: '1rem',
                    fontWeight: '500',
                    borderRadius: '0.5rem',
                    background: 'transparent',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s ease',
                    fontFamily: 'Nunito Sans, sans-serif'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0fdf4'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleAuthAction}
                  style={{
                    fontSize: '1rem',
                    fontWeight: '500',
                    color: '#a3a3a3',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'color 0.2s ease',
                    fontFamily: 'Nunito Sans, sans-serif'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#10b981'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#a3a3a3'}
                >
                  Login
                </button>
                <button
                  onClick={handleAuthAction}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#10b981',
                    color: '#f9fafb',
                    fontSize: '1rem',
                    fontWeight: '500',
                    borderRadius: '0.5rem',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s ease',
                    fontFamily: 'Nunito Sans, sans-serif'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#059669'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#10b981'}
                >
                  Sign Up
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="mobile-menu-btn"
            style={{
              display: 'block',
              padding: '0.5rem',
              color: '#000000',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              transition: 'color 0.2s ease'
            }}
            onClick={toggleMenu}
            onMouseEnter={(e) => e.currentTarget.style.color = '#10b981'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#000000'}
          >
            <svg style={{ width: '1.5rem', height: '1.5rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </nav>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="mobile-nav" style={{
            display: 'block',
            marginTop: '1rem',
            paddingBottom: '1rem',
            borderTop: '1px solid #e5e7eb'
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              paddingTop: '1rem'
            }}>
              {['Home', 'Product', 'FAQ', 'Blog', 'About Us'].map((item, index) => (
                <button 
                  key={item}
                  style={{
                    fontSize: index === 0 ? '1.125rem' : '1rem',
                    fontWeight: '500',
                    color: index === 0 ? '#000000' : '#a3a3a3',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'color 0.2s ease',
                    textAlign: 'left'
                  }}
                >
                  {item}
                </button>
              ))}
              
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                paddingTop: '0.5rem'
              }}>
                {isAuthenticated ? (
                  <>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      marginBottom: '0.5rem'
                    }}>
                      <div style={{
                        width: '2rem',
                        height: '2rem',
                        backgroundColor: '#10b981',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <span style={{
                          color: 'white',
                          fontWeight: '600',
                          fontSize: '0.875rem'
                        }}>
                          {user?.user_metadata?.full_name?.charAt(0)?.toUpperCase() || 
                           user?.email?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                      </div>
                      <span style={{
                        fontSize: '1rem',
                        fontWeight: '500',
                        color: '#000000'
                      }}>
                        {user?.user_metadata?.full_name || user?.email || 'User'}
                      </span>
                    </div>
                    <button
                      onClick={handleAuthAction}
                      style={{
                        width: 'fit-content',
                        padding: '0.5rem 1rem',
                        border: '1px solid #10b981',
                        color: '#10b981',
                        fontSize: '1rem',
                        fontWeight: '500',
                        borderRadius: '0.5rem',
                        background: 'transparent',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s ease'
                      }}
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleAuthAction}
                      style={{
                        fontSize: '1rem',
                        fontWeight: '500',
                        color: '#a3a3a3',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'color 0.2s ease',
                        textAlign: 'left'
                      }}
                    >
                      Login
                    </button>
                    <button
                      onClick={handleAuthAction}
                      style={{
                        width: 'fit-content',
                        padding: '0.5rem 1rem',
                        backgroundColor: '#10b981',
                        color: '#f9fafb',
                        fontSize: '1rem',
                        fontWeight: '500',
                        borderRadius: '0.5rem',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s ease'
                      }}
                    >
                      Sign Up
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
