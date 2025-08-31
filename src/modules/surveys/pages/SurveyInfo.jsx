import React, { useState, useContext, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { SurveysContext } from '../context/SurveysContext'
import { SurveyChart } from '../components/SurveyChart'
import SurveyNavBar from '../components/SurveyNavBar'
import '../styles/SurveyInfo.css'
export default function SurveyInfo() {
  const [is3D, setIs3D] = useState(true)
  const { surveyId } = useParams()
  const { surveys } = useContext(SurveysContext)
  const [survey, setSurvey] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (surveys) {
      const foundSurvey = surveys.find((s) => s.id === surveyId)
      if (foundSurvey) {
        setSurvey(foundSurvey)
      }
      setIsLoading(false)
    }
  }, [surveyId, surveys])

  if (isLoading) {
    return (
      <div className="loading-container">
        Cargando datos del levantamiento...
      </div>
    )
  }

  if (!survey) {
    return <div className="loading-container">Levantamiento no encontrado.</div>
  }

  return (
    <div className="survey-info-layout">
      <aside className="filters-sidebar">
        <div className="filter-card">
          <h2>Filtros de Reporte</h2>
          <div className="form-group">
            <label htmlFor="start-date">Fecha Inicio</label>
            <input type="text" id="start-date" value="01/08/2025" disabled />
          </div>
          <div className="form-group">
            <label htmlFor="end-date">Fecha Fin</label>
            <input type="text" id="end-date" value="31/08/2025" disabled />
          </div>
          <button className="report-button" disabled>
            Generar Reporte
          </button>
          <button className="toggle-view-button" onClick={() => setIs3D(!is3D)}>
            Cambiar a {is3D ? '2D' : '3D'}
          </button>
        </div>
      </aside>

      <main className="main-content">
        <div className="chart-header">
          <h2>Visualización: Pozo {survey.name}</h2>
        </div>
        <SurveyNavBar />
        <div className="chart-container">
          <SurveyChart data={survey} is3D={is3D} />
        </div>
      </main>
    </div>
  )
}
