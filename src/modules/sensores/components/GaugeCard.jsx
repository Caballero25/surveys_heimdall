// En /components/GaugeCard.jsx
import React from 'react';
import ReactSpeedometer from 'react-d3-speedometer';

export default function GaugeCard({ title, value, unit, gaugeConfig }) {
  const currentValue = value ?? 0;
  const displayText = value !== null && value !== undefined ? Number(value).toFixed(2) : 'N/A';

  // 👇 AQUÍ ESTÁ LA NUEVA LÓGICA
  const { range, stops } = gaugeConfig;
  const min = range[0];
  const max = range[1];

  // Construimos los 6 puntos de parada para crear 5 segmentos de color
  const customSegmentStops = [min, stops[0], stops[1], stops[2], stops[3], max];
  
  // Definimos la secuencia de colores: Rojo, Amarillo, Verde, Amarillo, Rojo
  const segmentColors = ['#EA4228', '#F5CD19', '#5BE12C', '#F5CD19', '#EA4228'];

  return (
    <div className="col-lg-2 col-md-4 col-sm-6 mb-4">
      <div 
        className="card h-100 text-center" 
        style={{ backgroundColor: '#1e293b', color: '#e0e0e0', border: '1px solid #4a5568' }}
      >
        <div className="card-body p-2 d-flex flex-column justify-content-center align-items-center">
          
          <ReactSpeedometer
            width={150}
            height={100}
            ringWidth={20}
            minValue={min}
            maxValue={max}
            value={currentValue}
            
            // Pasamos la nueva configuración de segmentos y colores
            customSegmentStops={customSegmentStops}
            segmentColors={segmentColors}
            
            needleHeightRatio={0.7}
            needleColor="#708090"
            valueTextFontSize="0px"
            labelText=""
          />

          <div style={{marginTop: "-10px"}}>
            <h5 className="card-title m-0" style={{ fontSize: '1.2rem' }}>
              {displayText}
            </h5>
            <p className="card-text" style={{ fontSize: '0.8rem' }}>
              {title} ({unit})
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}