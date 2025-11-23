/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { WolframFeatures } from '../services/wolframService';

interface FeatureChecklistProps {
  features: WolframFeatures;
}

const REQUIRED_FEATURES = [
  { path: 'rostro.forma', label: 'Forma del rostro' },
  { path: 'ojos.color', label: 'Color de ojos' },
  { path: 'ojos.forma', label: 'Forma de ojos' },
  { path: 'cejas.tipo', label: 'Tipo de cejas' },
  { path: 'nariz.forma', label: 'Forma de nariz' },
  { path: 'boca.labios', label: 'Tipo de labios' },
];

const getValue = (obj: any, path: string) => {
  return path.split('.').reduce((acc: any, part: string) => acc && acc[part], obj);
};

export const FeatureChecklist: React.FC<FeatureChecklistProps> = ({ features }) => {
  const presentFeatures = REQUIRED_FEATURES.filter(f => {
    const val = getValue(features, f.path);
    return val && val.trim() !== '';
  });

  const missingFeatures = REQUIRED_FEATURES.filter(f => {
    const val = getValue(features, f.path);
    return !val || val.trim() === '';
  });

  return (
    <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-4 space-y-4">
      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
        Checklist de Características
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Present Features */}
        <div>
          <h4 className="text-sm font-medium text-green-400 mb-2 flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            Detectadas
          </h4>
          {presentFeatures.length > 0 ? (
            <ul className="space-y-1">
              {presentFeatures.map((f) => (
                <li key={f.path} className="text-sm text-gray-300 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                  {f.label}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-gray-500 italic">No se han detectado características principales.</p>
          )}
        </div>

        {/* Missing Features */}
        <div>
          <h4 className="text-sm font-medium text-yellow-400 mb-2 flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            Recomendadas para mejor resultado
          </h4>
          {missingFeatures.length > 0 ? (
            <ul className="space-y-1">
              {missingFeatures.map((f) => (
                <li key={f.path} className="text-sm text-gray-400 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-500/50"></span>
                  {f.label}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-green-500 italic">¡Excelente! Tienes todas las características recomendadas.</p>
          )}
        </div>
      </div>
    </div>
  );
};
