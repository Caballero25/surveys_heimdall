import React from 'react'
import '../styles/SurveysPage.css'
import SurveysGrid from '../components/SurveysGrid'

export default function SurveysPage() {
  return (
    <div className="surveys-page-container">
      <header className="surveys-page-header">
        <h1>Proyectos Disponibles.</h1>
        <p>Seleccionar un proyecto para ver información.</p>
      </header>

      <main className="surveys-content">
        <SurveysGrid />
      </main>
    </div>
  )
}
