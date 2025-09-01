import React from 'react'
import { Link } from 'react-router-dom'
import '../../styles/Cards/CreateSurveyCard.css'

export default function CreateSurveyCard() {
  return (
    <Link to="/surveys/new" className="create-survey-card">
      <div className="create-survey-card-content">
        <div className="plus-icon">+</div>
        <span className="create-survey-card-text">Crear nuevo proyecto</span>
      </div>
    </Link>
  )
}
