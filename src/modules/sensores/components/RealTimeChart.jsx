import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import { TOPIC_CONFIG } from '../services/mqttClient';

/**
 * Componente de gráfica en tiempo real.
 * Utiliza subplots para mostrar métricas con diferentes unidades (PSI y PCD)
 * de forma clara y profesional.
 */
export default function RealTimeChart({ history }) {
  // `revision` es una técnica de optimización de Plotly para actualizaciones eficientes.
  const [revision, setRevision] = useState(0);

  // Cada vez que el historial cambia, incrementamos `revision` para indicarle
  // a Plotly que debe redibujar de manera optimizada (usando Plotly.react).
  useEffect(() => {
    setRevision(r => r + 1);
  }, [history]);

  const traces = [
    // Traza para Presión Casing
    {
      x: history["/Gae/PCasing/"]?.x,
      y: history["/Gae/PCasing/"]?.y,
      name: TOPIC_CONFIG["/Gae/PCasing/"].name,
      type: 'scatter',
      mode: 'lines',
      yaxis: 'y1', // Asignado al primer eje Y (Presiones)
      line: { color: TOPIC_CONFIG["/Gae/PCasing/"].color, width: 2 },
    },
    // Traza para Presión Tubing
    {
      x: history["/Gae/PTubing/"]?.x,
      y: history["/Gae/PTubing/"]?.y,
      name: TOPIC_CONFIG["/Gae/PTubing/"].name,
      type: 'scatter',
      mode: 'lines',
      yaxis: 'y1', // Asignado al primer eje Y (Presiones)
      line: { color: TOPIC_CONFIG["/Gae/PTubing/"].color, width: 2 },
    },
    // Traza para Flujo
    {
      x: history["/Gae/FlowCount/"]?.x,
      y: history["/Gae/FlowCount/"]?.y,
      name: TOPIC_CONFIG["/Gae/FlowCount/"].name,
      type: 'scatter',
      mode: 'lines',
      yaxis: 'y2', // Asignado al segundo eje Y (Flujo)
      line: { color: TOPIC_CONFIG["/Gae/FlowCount/"].color, width: 2 },
    },
  ];

  return (
    <Plot
      data={traces}
      // El layout define la apariencia profesional del gráfico.
      layout={{
        // revision: activa la actualización optimizada.
        datarevision: revision,
        // Responsive: se adapta al tamaño del contenedor.
        autosize: true,
        // Tema oscuro y moderno.
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: '#282c34',
        font: { color: '#ffffff' },
        // Título del gráfico.
        title: {
          text: 'Monitoreo de Sensores en Tiempo Real',
          font: { size: 18 },
        },
        // Configuración de la leyenda.
        legend: {
          orientation: 'h', // Horizontal
          yanchor: 'bottom',
          y: 1.02,
          xanchor: 'right',
          x: 1
        },
        margin: { l: 60, r: 40, b: 50, t: 80, pad: 4 },
        // Configuración de los subplots
        grid: {
            rows: 2,
            columns: 1,
            pattern: 'independent' // Cada subplot tiene sus propios ejes
        },
        // Eje X compartido para todas las gráficas.
        xaxis: {
            title: 'Tiempo',
            gridcolor: '#444',
            type: 'date'
        },
        // Eje Y para las Presiones (arriba)
        yaxis: {
            title: 'Presión (PSI)',
            domain: [0.55, 1.0], // Ocupa la parte superior
            gridcolor: '#444',
        },
        // Eje Y para el Flujo (abajo)
        yaxis2: {
            title: 'Flujo (PCD)',
            domain: [0, 0.45], // Ocupa la parte inferior
            gridcolor: '#444',
        }
      }}
      // Le indicamos a Plotly que use el div contenedor completo.
      style={{ width: '100%', height: '100%' }}
      // Habilita el manejo automático del redimensionamiento.
      useResizeHandler={true}
      config={{ responsive: true }}
    />
  );
}
