import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Scene3D } from './utils/Scene3D.js';
import InfoPanel from './components/InfoPanel.jsx';
import { componentData, componentCategories } from './data/ComponentData.js';
import './styles/global.css';

const Computer3DExplorer = () => {
  const mountRef = useRef(null);
  const scene3DRef = useRef(null);

  const [selectedComponent, setSelectedComponent] = useState(null);
  const [hoveredComponent, setHoveredComponent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleResize = useCallback(() => {
    if (scene3DRef.current) {
      scene3DRef.current.onWindowResize();
    }
  }, []);

  useEffect(() => {
    if (!mountRef.current) return;

    const el = mountRef.current;
    scene3DRef.current = new Scene3D(el);
    setIsLoading(false);

    const handlePointerDown = (event) => {
      if (scene3DRef.current) {
        scene3DRef.current.onPointerDown(event);
      }
    };

    const handlePointerMove = (event) => {
      if (scene3DRef.current) {
        const hoveredComp = scene3DRef.current.onPointerMove(event);
        setHoveredComponent(hoveredComp);
      }
    };

    const handlePointerUp = (event) => {
      if (scene3DRef.current) {
        const picked = scene3DRef.current.onPointerUp(event);
        if (picked) {
          setSelectedComponent(picked);
        }
      }
    };

    const handlePointerLeave = () => {
      if (scene3DRef.current) {
        scene3DRef.current.onPointerLeave();
        if (!scene3DRef.current.isPressed()) {
          setHoveredComponent(null);
        }
      }
    };

    const handlePointerCancel = (event) => {
      if (scene3DRef.current) {
        scene3DRef.current.onPointerUp(event);
      }
    };

    const pointerMoveOptions = { passive: false };
    el.addEventListener('pointerdown', handlePointerDown);
    el.addEventListener('pointermove', handlePointerMove, pointerMoveOptions);
    el.addEventListener('pointerup', handlePointerUp);
    el.addEventListener('pointerleave', handlePointerLeave);
    el.addEventListener('pointercancel', handlePointerCancel);

    window.addEventListener('resize', handleResize);
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleResize);
    }

    return () => {
      el.removeEventListener('pointerdown', handlePointerDown);
      el.removeEventListener('pointermove', handlePointerMove, pointerMoveOptions);
      el.removeEventListener('pointerup', handlePointerUp);
      el.removeEventListener('pointerleave', handlePointerLeave);
      el.removeEventListener('pointercancel', handlePointerCancel);
      window.removeEventListener('resize', handleResize);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleResize);
      }
      if (scene3DRef.current) {
        scene3DRef.current.dispose();
      }
    };
  }, [handleResize]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedComponent(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <div
      className="explorer-page"
      style={{ background: '#2d3748', color: 'white' }}
    >
      <header
        className="explorer-header"
        style={{
          background: 'linear-gradient(to right, #4a5568, #2d3748, #4a5568)',
          padding: 'clamp(0.75rem, 2vw, 1.5rem)',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          borderBottom: '1px solid #718096',
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div
            className="explorer-header-inner"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: 'clamp(1.35rem, 4vw, 2.25rem)',
                  fontWeight: 'bold',
                  background: 'linear-gradient(135deg, #60a5fa, #a78bfa)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Computer Hardware Explorer
              </h1>
              <p
                style={{
                  color: '#e2e8f0',
                  marginTop: '0.5rem',
                  fontSize: 'clamp(0.9375rem, 2.5vw, 1.125rem)',
                }}
              >
                Interactive 3D exploration of PC components and architecture
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>
                🖥️
              </div>
              <div style={{ fontSize: '0.875rem', color: '#a0aec0' }}>
                Educational Platform
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="explorer-main">
        <div className="viewer-wrap">
          {isLoading && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#2d3748',
                zIndex: 10,
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.25rem', marginBottom: '1rem' }}>
                  🖥️
                </div>
                <div
                  style={{
                    fontSize: '1.25rem',
                    color: '#60a5fa',
                    marginBottom: '0.5rem',
                  }}
                >
                  Loading 3D Computer Model...
                </div>
                <div style={{ fontSize: '0.875rem', color: '#a0aec0' }}>
                  Assembling components...
                </div>
                <div
                  style={{
                    marginTop: '1rem',
                    width: '12rem',
                    background: '#4a5568',
                    borderRadius: '9999px',
                    height: '0.5rem',
                  }}
                >
                  <div
                    style={{
                      background: '#3b82f6',
                      height: '0.5rem',
                      borderRadius: '9999px',
                      width: '75%',
                      animation: 'pulse 1s infinite',
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          <div
            ref={mountRef}
            className="viewer-mount"
            style={{
              cursor: 'grab',
              background: 'linear-gradient(to bottom, #4a5568, #2d3748)',
            }}
          />

          <div
            className="quick-access-panel"
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              background: 'rgba(45, 55, 72, 0.95)',
              padding: '1rem',
              borderRadius: '0.5rem',
              border: '1px solid #718096',
              maxWidth: '20rem',
              backdropFilter: 'blur(10px)',
            }}
          >
            <h3
              style={{
                color: '#60a5fa',
                fontWeight: '600',
                marginBottom: '0.75rem',
              }}
            >
              Quick Access
            </h3>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
            >
              {Object.entries(componentCategories).map(([category, components]) => (
                <div key={category}>
                  <h4
                    style={{
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: '#a0aec0',
                      textTransform: 'capitalize',
                      marginBottom: '0.25rem',
                    }}
                  >
                    {category}
                  </h4>
                  <div
                    style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}
                  >
                    {components.map((comp) => (
                      <button
                        key={comp}
                        type="button"
                        onClick={() => setSelectedComponent(comp)}
                        style={{
                          padding: '0.4rem 0.65rem',
                          minHeight: '44px',
                          minWidth: '44px',
                          fontSize: '0.75rem',
                          background: '#4a5568',
                          color: '#e2e8f0',
                          border: 'none',
                          borderRadius: '0.25rem',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                        }}
                        onMouseOver={(e) => {
                          e.target.style.background = '#2563eb';
                          e.target.style.color = 'white';
                        }}
                        onMouseOut={(e) => {
                          e.target.style.background = '#4a5568';
                          e.target.style.color = '#e2e8f0';
                        }}
                      >
                        {componentData[comp]?.name.split(' ')[0]}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {hoveredComponent && (
            <div
              style={{
                position: 'absolute',
                top: '5rem',
                left: '1rem',
                right: 'auto',
                maxWidth: 'min(92vw, 24rem)',
                background: 'rgba(45, 55, 72, 0.98)',
                padding: '1rem',
                borderRadius: '0.5rem',
                border: '2px solid #60a5fa',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.2)',
                backdropFilter: 'blur(10px)',
                pointerEvents: 'none',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  marginBottom: '0.5rem',
                }}
              >
                <span style={{ fontSize: '1.5rem' }}>
                  {hoveredComponent === 'motherboard' && '🔌'}
                  {hoveredComponent === 'cpu' && '🧠'}
                  {hoveredComponent === 'cpuCooler' && '❄️'}
                  {hoveredComponent === 'ram' && '💾'}
                  {hoveredComponent === 'gpu' && '🎮'}
                  {hoveredComponent === 'storage' && '💿'}
                  {hoveredComponent === 'psu' && '⚡'}
                  {hoveredComponent === 'case' && '📦'}
                  {hoveredComponent === 'fans' && '🌪️'}
                </span>
                <div>
                  <div style={{ color: '#60a5fa', fontWeight: '600' }}>
                    {componentData[hoveredComponent]?.name}
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: '#e2e8f0' }}>
                    Tap to open details
                  </div>
                </div>
              </div>
              <div style={{ fontSize: '0.875rem', color: '#e2e8f0' }}>
                {componentData[hoveredComponent]?.description}
              </div>
            </div>
          )}

          <div
            className="controls-guide"
            style={{
              position: 'absolute',
              bottom: '1rem',
              left: '1rem',
              maxWidth: 'min(92vw, 20rem)',
              background: 'rgba(45, 55, 72, 0.95)',
              padding: '1rem',
              borderRadius: '0.5rem',
              border: '1px solid #718096',
              backdropFilter: 'blur(10px)',
            }}
          >
            <h3
              style={{
                color: '#60a5fa',
                fontWeight: '600',
                marginBottom: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <span>🎮</span>
              Controls
            </h3>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
            >
              {[
                {
                  color: '#3b82f6',
                  text: 'Drag (or one finger) to rotate the model',
                },
                {
                  color: '#10b981',
                  text: 'Point / hover to highlight a part',
                },
                {
                  color: '#8b5cf6',
                  text: 'Tap or click a part for full details',
                },
                {
                  color: '#f59e0b',
                  text: 'Use Quick Access or Esc to close details',
                },
              ].map((item, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '0.875rem',
                  }}
                >
                  <span
                    style={{
                      width: '1rem',
                      height: '1rem',
                      flexShrink: 0,
                      background: item.color,
                      borderRadius: '0.25rem',
                      marginRight: '0.5rem',
                    }}
                  />
                  <span style={{ color: '#e2e8f0' }}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div
            className="stats-overlay"
            style={{
              position: 'absolute',
              bottom: '1rem',
              right: '1rem',
              background: 'rgba(45, 55, 72, 0.95)',
              padding: '1rem',
              borderRadius: '0.5rem',
              border: '1px solid #718096',
              backdropFilter: 'blur(10px)',
            }}
          >
            <h3
              style={{ color: '#34d399', fontWeight: '600', marginBottom: '0.75rem' }}
            >
              System Overview
            </h3>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                fontSize: '0.875rem',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: '2rem',
                }}
              >
                <span style={{ color: '#a0aec0' }}>Components:</span>
                <span style={{ color: 'white' }}>9 main parts</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: '2rem',
                }}
              >
                <span style={{ color: '#a0aec0' }}>Interactions:</span>
                <span style={{ color: 'white' }}>Touch &amp; mouse</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: '2rem',
                }}
              >
                <span style={{ color: '#a0aec0' }}>Learning Mode:</span>
                <span style={{ color: '#34d399' }}>Active</span>
              </div>
              {selectedComponent && (
                <div
                  style={{
                    marginTop: '0.75rem',
                    paddingTop: '0.75rem',
                    borderTop: '1px solid #4b5563',
                  }}
                >
                  <div style={{ color: '#60a5fa', fontSize: '0.75rem' }}>
                    Currently viewing:
                  </div>
                  <div
                    style={{
                      color: 'white',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                    }}
                  >
                    {componentData[selectedComponent]?.name}
                  </div>
                </div>
              )}
            </div>
          </div>

          {!selectedComponent && !hoveredComponent && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none',
                padding: '1rem',
              }}
            >
              <div
                style={{
                  textAlign: 'center',
                  background: 'rgba(45, 55, 72, 0.8)',
                  padding: 'clamp(1rem, 4vw, 2rem)',
                  borderRadius: '0.75rem',
                  border: '1px solid #718096',
                  backdropFilter: 'blur(10px)',
                  maxWidth: '28rem',
                }}
              >
                <div style={{ fontSize: 'clamp(2rem, 8vw, 3.75rem)', marginBottom: '1rem' }}>
                  🖥️
                </div>
                <h2
                  style={{
                    fontSize: 'clamp(1.1rem, 3.5vw, 1.5rem)',
                    fontWeight: 'bold',
                    color: '#60a5fa',
                    marginBottom: '0.5rem',
                  }}
                >
                  Welcome to PC Hardware Explorer
                </h2>
                <p style={{ color: '#e2e8f0', fontSize: 'clamp(0.875rem, 2.5vw, 1rem)' }}>
                  Drag with your finger or mouse to rotate. Point at parts to see what they are,
                  then tap for full details. Tap the dimmed area or <strong>Back to model</strong>{' '}
                  when you are done reading.
                </p>
              </div>
            </div>
          )}
        </div>

        {selectedComponent && (
          <InfoPanel
            selectedComponent={selectedComponent}
            onClose={() => setSelectedComponent(null)}
          />
        )}
      </div>
    </div>
  );
};

export default Computer3DExplorer;
