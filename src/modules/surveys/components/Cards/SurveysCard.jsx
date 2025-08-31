import React from 'react'
import { Link } from 'react-router-dom'
import '../../styles/Cards/SurveysCard.css'

export default function SurveysCard({ survey }) {
  const { id, name, XValue } = survey
  const dataPoints = XValue ? XValue.length : 0
  return (
    <div className="survey-card">
      <div className="survey-card-content">
        <h3 className="survey-card-title">{name}</h3>
        <p className="survey-card-description">
          Este levantamiento contiene {dataPoints} puntos de datos.
        </p>
      </div>
      <div className="survey-card-footer">
        <Link to={`/surveys/${id}`} className="survey-card-link">
          Visualizar Datos
        </Link>
      </div>
    </div>
  )
}
