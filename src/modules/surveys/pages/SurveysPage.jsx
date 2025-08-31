import React from 'react'
import '../styles/SurveysPage.css'
import SurveysGrid from '../components/SurveysGrid'

export default function SurveysPage() {
  return (
    <div className="surveys-page-container">
      <header className="surveys-page-header">
        <h1>Avaible surveys.</h1>
        <p>Select a survey to inspect.</p>
      </header>

      <main className="surveys-content">
        <SurveysGrid />
      </main>
    </div>
  )
}
