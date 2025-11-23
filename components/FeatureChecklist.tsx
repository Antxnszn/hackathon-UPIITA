// import React from 'react';

// interface FeatureChecklistProps {
//   features: {
//     nose: string;
//     eyebrows: string;
//     eyes: string;
//     lips: string;
//     additional: string;
//   };
//   onChange: (field: string, value: string) => void;
// }

// export const FeatureChecklist: React.FC<FeatureChecklistProps> = ({ features, onChange }) => {
//   const fields = [
//     { key: 'nose', label: 'Tipo de Nariz' },
//     { key: 'eyebrows', label: 'Cejas' },
//     { key: 'eyes', label: 'Ojos' },
//     { key: 'lips', label: 'Labios' },
//     { key: 'additional', label: 'Facciones Adicionales (Barba, lunares, etc.)' },
//   ];

//   return (
//     <div className="bg-gray-900 p-6 rounded-lg shadow-lg border border-gray-700">
//       <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
//         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
//         Verificación de Características
//       </h3>
//       <div className="space-y-4">
//         {fields.map((field) => (
//           <div key={field.key} className="flex flex-col">
//             <label className="text-sm font-medium text-gray-300 mb-1">{field.label}</label>
//             <div className="relative">
//               <input
//                 type="text"
//                 value={(features as any)[field.key]}
//                 onChange={(e) => onChange(field.key, e.target.value)}
//                 placeholder={`Describa ${field.label.toLowerCase()}...`}
//                 className={`w-full bg-gray-800 text-white border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
//                   (features as any)[field.key] ? 'border-green-500/50' : 'border-gray-600'
//                 }`}
//               />
//               {(features as any)[field.key] && (
//                 <div className="absolute right-3 top-2.5 text-green-500">
//                   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
//                 </div>
//               )}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };
