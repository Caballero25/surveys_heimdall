import React, { useContext } from 'react'
import { SurveysContext } from '../context/SurveysContext'
import SurveysCard from './Cards/SurveysCard'
import CreateSurveyCard from './Cards/CreateSurveyCard'
import '../styles/SurveysGrid.css'

export default function SurveysGrid() {
  const { surveys } = useContext(SurveysContext)
  if (surveys === null) {
    return <p className="loading-message">Loading surveys...</p>
  }
  if (surveys.length === 0) {
    return (
      <p className="no-surveys-message">There are not any survey to show...</p>
    )
  }
  return (
    <div className="surveys-grid">
      <CreateSurveyCard></CreateSurveyCard>
      {surveys.map((survey) => (
        <SurveysCard key={survey.id} survey={survey} />
      ))}
    </div>
  )
}
