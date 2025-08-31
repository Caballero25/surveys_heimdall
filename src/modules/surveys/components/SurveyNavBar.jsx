import React, { useState } from 'react'
import '../styles/SurveyNavBar.css'
export default function SurveyNavBar() {
  const [selectedAnalysis, setSelectedAnalysis] = useState(
    'quimica-solida-liquida',
  )

  return (
    <nav className="survey-detail-nav">
      <div className="nav-buttons">
        <button className="nav-button active">Información y datos</button>
        <button className="nav-button">
          Diagrama Mecánico y Trayectoria Survey
        </button>
        <button className="nav-button">
          Análisis Perfil químico a) Corrosión
        </button>
      </div>
      <div className="nav-select-wrapper">
        <select
          className="nav-select"
          value={selectedAnalysis}
          onChange={(e) => setSelectedAnalysis(e.target.value)}
        >
          <option value="quimica-solida-liquida">
            Análisis Química Sólida y Líquida
          </option>
          <option value="completacion-quimica">
            Completacion Quimica - Configuracion
          </option>
          <option value="monitoreo-consumo">
            Monitoreo Consumo - trazabilidad
          </option>
          <option value="historico-teardown">Historico TearDown</option>
        </select>
      </div>
    </nav>
  )
}
