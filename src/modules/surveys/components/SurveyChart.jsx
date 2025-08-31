import React, { useMemo } from 'react'
import Plot from 'react-plotly.js'
import '../styles/SurveyChart.css'

/**
 * SurveyChart
 * * Renderiza un gráfico de Plotly optimizado para alto rendimiento mediante downsampling y React.memo.
 * @param {{ data: object, is3D: boolean }} props
 */
const SurveyChartComponent = ({ data, is3D }) => {
  if (!data) return null

  const { name } = data

  // --- OPTIMIZACIÓN #2: DOWNSAMPLING MÁS AGRESIVO ---
  // Submuestreamos los datos para mejorar el rendimiento al mover/rotar el gráfico.
  const sampledData = useMemo(() => {
    // Aumentamos el factor. Un valor más alto significa menos puntos y más rendimiento.
    // Puedes ajustar este valor para encontrar el balance perfecto.
    const DOWNSAMPLING_FACTOR = 10

    if (data.XValue.length < 200) {
      return { XValue: data.XValue, YValue: data.YValue, ZValue: data.ZValue }
    }

    const sampledX = []
    const sampledY = []
    const sampledZ = []

    for (let i = 0; i < data.XValue.length; i += DOWNSAMPLING_FACTOR) {
      sampledX.push(data.XValue[i])
      sampledY.push(data.YValue[i])
      sampledZ.push(data.ZValue[i])
    }

    const lastIndex = data.XValue.length - 1
    if (lastIndex % DOWNSAMPLING_FACTOR !== 0) {
      sampledX.push(data.XValue[lastIndex])
      sampledY.push(data.YValue[lastIndex])
      sampledZ.push(data.ZValue[lastIndex])
    }

    return { XValue: sampledX, YValue: sampledY, ZValue: sampledZ }
  }, [data])

  const { XValue, YValue, ZValue } = sampledData

  const chartData = useMemo(() => {
    if (is3D) {
      return [
        {
          x: XValue,
          y: YValue,
          z: ZValue,
          type: 'scatter3d',
          mode: 'lines',
          line: { color: '#fe972b', width: 4 },
        },
      ]
    }
    return [
      {
        x: XValue,
        y: YValue,
        type: 'scattergl',
        mode: 'lines',
        line: { color: '#fe972b', width: 3 },
      },
    ]
  }, [XValue, YValue, ZValue, is3D])

  // Memorizamos el layout
  const layout = useMemo(() => {
    const baseLayout = {
      autosize: true,
      margin: { l: 40, r: 40, b: 40, t: 80 },
      paper_bgcolor: '#1e293b',
      plot_bgcolor: '#1e293b', // Asegura que el fondo del gráfico también sea oscuro
      font: { color: '#cbd5e1' },
      title: {
        text: `Trayectoria de ${name} (${is3D ? '3D' : '2D'})`,
        font: { size: 18, color: '#f1f5f9' },
      },
    }

    if (is3D) {
      return {
        ...baseLayout,
        scene: {
          xaxis: {
            title: 'Coordenada X',
            gridcolor: '#334155',
            color: '#cbd5e1',
          },
          yaxis: {
            title: 'Coordenada Y',
            gridcolor: '#334155',
            color: '#cbd5e1',
          },
          zaxis: {
            title: 'Profundidad (Z)',
            gridcolor: '#334155',
            color: '#cbd5e1',
          },
        },
      }
    } else {
      return {
        ...baseLayout,
        xaxis: { title: 'Coordenada X', gridcolor: '#334155' },
        yaxis: { title: 'Coordenada Y', gridcolor: '#334155' },
      }
    }
  }, [name, is3D])

  return (
    <div className="survey-chart-wrapper">
      <Plot
        data={chartData}
        layout={layout}
        useResizeHandler={true}
        style={{ width: '100%', height: '100%' }}
        config={{ responsive: true, displaylogo: false }}
      />
    </div>
  )
}

// --- OPTIMIZACIÓN #1: React.memo ---
// Esta es la clave: evita que el componente se vuelva a renderizar innecesariamente
// si sus props (data, is3D) no han cambiado, lo que es crucial para el rendimiento.
export const SurveyChart = React.memo(SurveyChartComponent)
