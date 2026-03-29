// src/components/InfoPanel.jsx
import React from 'react';
import { componentData } from '../data/ComponentData.js';

const InfoPanel = ({ selectedComponent, onClose }) => {
  if (!selectedComponent || !componentData[selectedComponent]) {
    return null;
  }

  const component = componentData[selectedComponent];

  const getComponentIcon = (componentName) => {
    const icons = {
      motherboard: "🔌",
      cpu: "💿",
      cpuCooler: "❄️",
      ram: "💾",
      gpu: "🎮",
      storage: "💿",
      psu: "⚡",
      case: "📦",
      fans: "🌪️"
    };
    return icons[componentName] || "🔧";
  };

  const getPerformanceMetrics = (componentName) => {
    const metrics = {
      cpu: { score: 95, category: "Processing Power" },
      gpu: { score: 88, category: "Graphics Performance" },
      ram: { score: 92, category: "Memory Speed" },
      storage: { score: 85, category: "Data Access Speed" },
      psu: { score: 90, category: "Power Efficiency" },
      cpuCooler: { score: 87, category: "Cooling Performance" },
      motherboard: { score: 93, category: "Connectivity" },
      case: { score: 89, category: "Build Quality" },
      fans: { score: 84, category: "Airflow" }
    };
    return metrics[componentName];
  };

  const metrics = getPerformanceMetrics(selectedComponent);

  return (
    <div className="w-96 bg-gray-800 shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">{getComponentIcon(selectedComponent)}</span>
            <div>
              <h2 className="text-xl font-bold text-white">
                {component.name}
              </h2>
              <p className="text-blue-100 text-sm opacity-90">
                Hardware Component
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-white hover:text-red-300 transition-colors text-2xl font-bold"
            aria-label="Close panel"
          >
            ×
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 overflow-y-auto max-h-screen">
        {/* Performance Score */}
        {metrics && (
          <div className="mb-6 p-4 bg-gray-700 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-300">{metrics.category}</span>
              <span className="text-lg font-bold text-green-400">{metrics.score}/100</span>
            </div>
            <div className="w-full bg-gray-600 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${metrics.score}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Overview */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-green-400 mb-3 flex items-center">
            <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
            Overview
          </h3>
          <p className="text-gray-300 leading-relaxed">
            {component.description}
          </p>
        </div>

        {/* Technical Details */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-blue-400 mb-3 flex items-center">
            <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
            Technical Details
          </h3>
          <p className="text-gray-300 leading-relaxed">
            {component.details}
          </p>
        </div>

        {/* Specifications */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-purple-400 mb-3 flex items-center">
            <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
            Key Specifications
          </h3>
          <div className="space-y-2">
            {component.specifications.map((spec, index) => (
              <div key={index} className="flex items-start bg-gray-700 p-3 rounded-lg">
                <span className="text-purple-400 mr-3 text-sm">▶</span>
                <span className="text-gray-300 text-sm flex-1">{spec}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Fun Fact */}
        <div className="bg-gradient-to-r from-orange-500/20 to-yellow-500/20 p-4 rounded-lg border border-orange-500/30">
          <h4 className="text-orange-400 font-semibold mb-2 flex items-center">
            <span className="mr-2">💡</span>
            Did You Know?
          </h4>
          <p className="text-gray-300 text-sm leading-relaxed">
            {component.funFact}
          </p>
        </div>

        {/* Component Compatibility */}
        <div className="mt-6 p-4 bg-gray-700 rounded-lg">
          <h4 className="text-cyan-400 font-semibold mb-3 flex items-center">
            <span className="mr-2">🔗</span>
            Compatibility Notes
          </h4>
          <div className="text-sm text-gray-300 space-y-2">
            {selectedComponent === 'cpu' && (
              <p>• Must match motherboard socket type (LGA, AM4, AM5)</p>
            )}
            {selectedComponent === 'ram' && (
              <p>• Check motherboard QVL (Qualified Vendor List) for compatibility</p>
            )}
            {selectedComponent === 'gpu' && (
              <p>• Ensure PSU has sufficient wattage and PCIe connectors</p>
            )}
            {selectedComponent === 'psu' && (
              <p>• Calculate total system power draw plus 20% headroom</p>
            )}
            {selectedComponent === 'cpuCooler' && (
              <p>• Verify socket compatibility and case clearance</p>
            )}
            {selectedComponent === 'storage' && (
              <p>• M.2 slots may disable some SATA ports on motherboard</p>
            )}
            {selectedComponent === 'motherboard' && (
              <p>• Form factor must fit case size (ATX, Micro-ATX, Mini-ITX)</p>
            )}
            {selectedComponent === 'case' && (
              <p>• Check GPU length and CPU cooler height clearances</p>
            )}
            {selectedComponent === 'fans' && (
              <p>• Balance intake vs exhaust for optimal airflow</p>
            )}
          </div>
        </div>

        {/* Quick Tips */}
        <div className="mt-6 p-4 bg-indigo-900/30 rounded-lg border border-indigo-500/30">
          <h4 className="text-indigo-400 font-semibold mb-3 flex items-center">
            <span className="mr-2">⚡</span>
            Pro Tips
          </h4>
          <div className="text-sm text-gray-300 space-y-2">
            {selectedComponent === 'cpu' && (
              <>
                <p>• Higher core count = better multitasking</p>
                <p>• Higher clock speed = better single-thread performance</p>
              </>
            )}
            {selectedComponent === 'gpu' && (
              <>
                <p>• More VRAM needed for higher resolutions</p>
                <p>• Ray tracing requires RTX/RDNA2+ architecture</p>
              </>
            )}
            {selectedComponent === 'ram' && (
              <>
                <p>• 16GB is sweet spot for gaming in 2025</p>
                <p>• Enable XMP/DOCP for rated speeds</p>
              </>
            )}
            {selectedComponent === 'storage' && (
              <>
                <p>• NVMe M.2 for OS and frequently used programs</p>
                <p>• Large HDD for mass storage of media files</p>
              </>
            )}
            {selectedComponent === 'psu' && (
              <>
                <p>• 80+ Gold efficiency minimum recommended</p>
                <p>• Modular cables improve airflow and aesthetics</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoPanel;