import React, { useRef, useState, useEffect } from 'react';
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

  useEffect(() => {
    if (!mountRef.current) return;

    scene3DRef.current = new Scene3D(mountRef.current);
    setIsLoading(false);

    const handleMouseDown = (event) => {
      if (scene3DRef.current) {
        scene3DRef.current.onMouseDown(event);
      }
    };

    const handleMouseUp = (event) => {
      if (scene3DRef.current) {
        scene3DRef.current.onMouseUp(event);
      }
    };

    const handleMouseMove = (event) => {
      if (scene3DRef.current) {
        const hoveredComp = scene3DRef.current.onMouseMove(event);
        setHoveredComponent(hoveredComp);
      }
    };

    const handleClick = (event) => {
      if (scene3DRef.current) {
        const clickedComp = scene3DRef.current.onMouseClick(event);
        if (clickedComp) {
          setSelectedComponent(clickedComp);
        }
      }
    };

    const handleResize = () => {
      if (scene3DRef.current) {
        scene3DRef.current.onWindowResize();
      }
    };

    // Add event listeners for click and drag
    mountRef.current.addEventListener('mousedown', handleMouseDown);
    mountRef.current.addEventListener('mouseup', handleMouseUp);
    mountRef.current.addEventListener('mousemove', handleMouseMove);
    mountRef.current.addEventListener('click', handleClick);
    
    // Add global mouse up listener for when mouse leaves the area
    document.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      if (mountRef.current) {
        mountRef.current.removeEventListener('mousedown', handleMouseDown);
        mountRef.current.removeEventListener('mouseup', handleMouseUp);
        mountRef.current.removeEventListener('mousemove', handleMouseMove);
        mountRef.current.removeEventListener('click', handleClick);
      }
      document.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('resize', handleResize);
      
      if (scene3DRef.current) {
        scene3DRef.current.dispose();
      }
    };
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#2d3748', color: 'white' }}>
      {/* Header */}
      <header style={{ 
        background: 'linear-gradient(to right, #4a5568, #2d3748, #4a5568)',
        padding: '1.5rem',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        borderBottom: '1px solid #718096'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h1 style={{ 
                fontSize: '2.25rem', 
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #60a5fa, #a78bfa)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Computer Hardware Explorer
              </h1>
              <p style={{ color: '#e2e8f0', marginTop: '0.5rem', fontSize: '1.125rem' }}>
                Interactive 3D exploration of PC components and architecture
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>🖥️</div>
              <div style={{ fontSize: '0.875rem', color: '#a0aec0' }}>Educational Platform</div>
            </div>
          </div>
        </div>
      </header>

      <div style={{ display: 'flex', position: 'relative' }}>
        {/* 3D Viewer */}
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
          {isLoading && (
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#2d3748',
              zIndex: 10
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.25rem', marginBottom: '1rem' }}>🖥️</div>
                <div style={{ fontSize: '1.25rem', color: '#60a5fa', marginBottom: '0.5rem' }}>
                  Loading 3D Computer Model...
                </div>
                <div style={{ fontSize: '0.875rem', color: '#a0aec0' }}>
                  Assembling components...
                </div>
                <div style={{ 
                  marginTop: '1rem', 
                  width: '12rem', 
                  background: '#4a5568', 
                  borderRadius: '9999px', 
                  height: '0.5rem' 
                }}>
                  <div style={{
                    background: '#3b82f6',
                    height: '0.5rem',
                    borderRadius: '9999px',
                    width: '75%',
                    animation: 'pulse 1s infinite'
                  }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div 
            ref={mountRef} 
            style={{
              width: '100%',
              height: '100vh',
              cursor: 'grab',
              background: 'linear-gradient(to bottom, #4a5568, #2d3748)',
              userSelect: 'none' // Prevent text selection during drag
            }}
          />

          {/* Quick Access Panel */}
          <div style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'rgba(45, 55, 72, 0.95)',
            padding: '1rem',
            borderRadius: '0.5rem',
            border: '1px solid #718096',
            maxWidth: '20rem',
            backdropFilter: 'blur(10px)'
          }}>
            <h3 style={{ color: '#60a5fa', fontWeight: '600', marginBottom: '0.75rem' }}>
              Quick Access
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {Object.entries(componentCategories).map(([category, components]) => (
                <div key={category}>
                  <h4 style={{ 
                    fontSize: '0.875rem', 
                    fontWeight: '500', 
                    color: '#a0aec0',
                    textTransform: 'capitalize',
                    marginBottom: '0.25rem'
                  }}>
                    {category}
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                    {components.map(comp => (
                      <button
                        key={comp}
                        onClick={() => setSelectedComponent(comp)}
                        style={{
                          padding: '0.25rem 0.5rem',
                          fontSize: '0.75rem',
                          background: '#4a5568',
                          color: '#e2e8f0',
                          border: 'none',
                          borderRadius: '0.25rem',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
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

          {/* Hover Tooltip */}
          {hoveredComponent && (
            <div style={{
              position: 'absolute',
              top: '5rem',
              left: '1rem',
              background: 'rgba(45, 55, 72, 0.98)',
              padding: '1rem',
              borderRadius: '0.5rem',
              border: '1px solid #60a5fa',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              maxWidth: '24rem',
              backdropFilter: 'blur(10px)',
              pointerEvents: 'none' // Prevent interfering with drag
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
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
                  <div style={{ fontSize: '0.75rem', color: '#a0aec0' }}>
                    Click to learn more
                  </div>
                </div>
              </div>
              <div style={{ fontSize: '0.875rem', color: '#e2e8f0' }}>
                {componentData[hoveredComponent]?.description}
              </div>
            </div>
          )}

          {/* Controls Guide */}
          <div style={{
            position: 'absolute',
            bottom: '1rem',
            left: '1rem',
            background: 'rgba(45, 55, 72, 0.95)',
            padding: '1rem',
            borderRadius: '0.5rem',
            border: '1px solid #718096',
            backdropFilter: 'blur(10px)'
          }}>
            <h3 style={{ 
              color: '#60a5fa', 
              fontWeight: '600', 
              marginBottom: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <span>🎮</span>
              Controls
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[
                { color: '#3b82f6', text: 'Click and drag to rotate model' },
                { color: '#10b981', text: 'Hover to highlight components' },
                { color: '#8b5cf6', text: 'Click components for details' },
                { color: '#f59e0b', text: 'Use quick access panel' }
              ].map((item, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', fontSize: '0.875rem' }}>
                  <span style={{
                    width: '1rem',
                    height: '1rem',
                    background: item.color,
                    borderRadius: '0.25rem',
                    marginRight: '0.5rem'
                  }}></span>
                  <span style={{ color: '#e2e8f0' }}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stats Overlay */}
          <div style={{
            position: 'absolute',
            bottom: '1rem',
            right: '1rem',
            background: 'rgba(45, 55, 72, 0.95)',
            padding: '1rem',
            borderRadius: '0.5rem',
            border: '1px solid #718096',
            backdropFilter: 'blur(10px)'
          }}>
            <h3 style={{ color: '#34d399', fontWeight: '600', marginBottom: '0.75rem' }}>
              System Overview
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '2rem' }}>
                <span style={{ color: '#a0aec0' }}>Components:</span>
                <span style={{ color: 'white' }}>9 main parts</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '2rem' }}>
                <span style={{ color: '#a0aec0' }}>Interactions:</span>
                <span style={{ color: 'white' }}>Click & Drag</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '2rem' }}>
                <span style={{ color: '#a0aec0' }}>Learning Mode:</span>
                <span style={{ color: '#34d399' }}>Active</span>
              </div>
              {selectedComponent && (
                <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #4b5563' }}>
                  <div style={{ color: '#60a5fa', fontSize: '0.75rem' }}>Currently viewing:</div>
                  <div style={{ color: 'white', fontSize: '0.875rem', fontWeight: '500' }}>
                    {componentData[selectedComponent]?.name}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Welcome Message */}
          {!selectedComponent && !hoveredComponent && (
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none'
            }}>
              <div style={{
                textAlign: 'center',
                background: 'rgba(45, 55, 72, 0.8)',
                padding: '2rem',
                borderRadius: '0.75rem',
                border: '1px solid #718096',
                backdropFilter: 'blur(10px)'
              }}>
                <div style={{ fontSize: '3.75rem', marginBottom: '1rem' }}>🖥️</div>
                <h2 style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: '#60a5fa',
                  marginBottom: '0.5rem'
                }}>
                  Welcome to PC Hardware Explorer
                </h2>
                <p style={{ color: '#e2e8f0', maxWidth: '28rem' }}>
                  Click and drag to rotate the computer model. 
                  Hover over components to learn about them, 
                  and click for detailed information.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Information Panel */}
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