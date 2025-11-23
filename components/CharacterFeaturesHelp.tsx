import React from 'react';

export const CharacterFeaturesHelp = () => {
  // Datos completos basados en tu código Wolfram (Anteriores + Nuevos)
  const featureGroups = [
    {
      category: "Rostro y Piel",
      items: [
        "Cara ovalada", "Cara cuadrada", "Cara redonda", "Cara diamante",
        "Piel morena", "Piel clara", "Piel con pecas", "Piel arrugada"
      ]
    },
    {
      category: "Vello Facial",
      items: [
        "Barba abundante", "Barba cerrada", "Barba rala", "Sin barba",
        "Bigote poblado", "Bigote fino", "Perilla", "Patillas largas"
      ]
    },
    {
      category: "Ojos y Mirada",
      items: [
        "Ojos grandes", "Ojos rasgados", "Ojos almendrados", "Ojos caídos",
        "Ojos cafés", "Ojos azules", "Ojos verdes", "Cejas pobladas", "Cejas rectas"
      ]
    },
    {
      category: "Cabello",
      items: [
        "Cabello negro", "Cabello rubio", "Cabello café claro",
        "Cabello rizado", "Cabello lacio", "Cabello ondulado",
        "Cabello largo", "Cabello corto"
      ]
    },
    {
      category: "Rasgos (Nariz/Boca/Orejas)",
      items: [
        "Nariz aguileña", "Nariz respingada", "Nariz ancha",
        "Boca grande", "Labios gruesos", "Labios delgados",
        "Orejas grandes", "Orejas pegadas", "Barbilla partida"
      ]
    },
    {
      category: "Cicatrices y Marcas",
      items: [
        "Cicatriz en mejilla", "Cicatriz en ceja", "Cicatriz en labio",
        "Cicatriz vertical", "Cicatriz grande",
        "Tiene lunares", "Tiene pecas"
      ]
    },
    {
      category: "Complexión y Expresión",
      items: [
        "Complexión delgada", "Robusto", "Atlético", "Corpulento",
        "Expresión seria", "Sonriente", "Enojado", "Triste"
      ]
    },
    {
      category: "Accesorios y Edad",
      items: [
        "Usa lentes", "Usa gafas", "Tiene aretes", "Tiene piercing", "Usa gorra",
        "Adolescente", "Adulto mayor", "Niño"
      ]
    }
  ];

  return (
    <div className="features-container" style={{ 
      backgroundColor: '#0C111C', 
      padding: '1.5rem', 
      borderRadius: '12px',
      fontFamily: 'sans-serif'
    }}>
      <h3 style={{ color: '#D5E2FF', marginBottom: '1rem', fontSize: '1.1rem' }}>
      Guía de características reconocibles
      </h3>
      
      <div className="grid grid-cols-4" style={{ 
        gap: '1rem' 
      }}>
        {featureGroups.map((group, index) => (
          <div key={index} style={{  
            padding: '1rem', 
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h4 style={{ 
              color: '#93B4FF', 
              margin: '0 0 0.5rem 0', 
              fontSize: '0.9rem', 
              borderBottom: '2px solid #e5e7eb',
              paddingBottom: '4px'
            }}>
              {group.category}
            </h4>
            <div className="grid grid-cols-2">
              {group.items.map((tag, idx) => (
                <span key={idx} style={{ 
                  fontSize: '0.75rem', 
                  color: '#6b7280',
                  
                  padding: '2px 6px',
                  
                }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// export default CharacterFeaturesHelp;