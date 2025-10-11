import React from 'react';

const clouds = [
  {
    name: 'AWS',
    value: 'aws',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg'
  },
  {
    name: 'Azure',
    value: 'azure',
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg'
  },
  {
    name: 'GCP',
    value: 'gcp',
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/googlecloud/googlecloud-original.svg'
  },
  {
    name: 'Oracle',
    value: 'oracle',
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/oracle/oracle-original.svg'
  }
];

export default function CloudSelector({ selectedCloud, onChange }) {
  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-white/20 p-8 mb-4">
      <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
        <span className="mr-2">☁️</span>
        Selecciona la nube
      </h2>
      <div className="flex gap-6 justify-center items-center">
        {clouds.map(cloud => (
          <button
            key={cloud.value}
            type="button"
            className={`flex flex-col items-center gap-2 px-4 py-2 rounded border transition-colors duration-200 font-medium w-28 h-28 focus:outline-none ${selectedCloud === cloud.value ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-blue-100'}`}
            onClick={() => onChange(cloud.value)}
          >
            <img src={cloud.logo} alt={cloud.name + ' logo'} className="w-10 h-10 mb-1" />
            <span>{cloud.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
