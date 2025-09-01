import React, { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { SurveysContext } from "../context/SurveysContext";
import { SurveyChart } from "../components/SurveyChart";
import Sidebar from "../components/SurveyNavigation";
import "../styles/SurveyInfo.css";

export default function SurveyInfo() {
  const [is3D, setIs3D] = useState(true);
  const { surveyId } = useParams();
  const { surveys } = useContext(SurveysContext);
  const [survey, setSurvey] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentView, setCurrentView] = useState(
    "Ningún submódulo seleccionado"
  );

  // Define the navigation structure for the sidebar
  const navigationModules = {
    "Informacion y datos": [
      "Estado Mecanico",
      "Análisis Fisico-Quimicos",
      "Condiciones Levantamiento Artificial",
    ],
    "Diagrama Mecanico y Trayectoria Survey": [
      "Survey Coordenadas",
      "Perfil DogLeg",
      "Sarta rigida",
      "Completion 3D",
    ],
    "Análisis Perfil Químico": [
      "Corrosión",
      "Escala",
      "Asfaltenos",
      "Emulsion - lubricidad",
    ],
    "Análisis Química Sólida y Líquida": [
      "Completacion Quimica - Configuracion",
      "Monitoreo Consumo - trazabilidad",
      "Historico TearDown",
      "Cros-plot Comparativo de Resultados"
    ],
  };

  // Handler for submodule clicks
  const handleAction = (module, submodule) => {
    console.log(`Vista cambiada a: ${module} > ${submodule}`);
    setCurrentView(`Módulo: ${module} > Submódulo: ${submodule}`);
    // Here you would typically set state to render a different component in the main content area
  };

  useEffect(() => {
    if (surveys) {
      const foundSurvey = surveys.find((s) => s.id === surveyId);
      if (foundSurvey) {
        setSurvey(foundSurvey);
      }
      setIsLoading(false);
    }
  }, [surveyId, surveys]);

  if (isLoading) {
    return (
      <div className="loading-container">
        Cargando datos del levantamiento...
      </div>
    );
  }

  if (!survey) {
    return (
      <div className="loading-container">Levantamiento no encontrado.</div>
    );
  }

  return (
    <div className="survey-info-layout">
      {/* The new left column contains both the Sidebar and the filter card */}
      <aside className="left-column">
        <Sidebar modules={navigationModules} onSubmoduleClick={handleAction} />

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
            Cambiar a {is3D ? "2D" : "3D"}
          </button>
        </div>
      </aside>

      <main className="main-content">
        <div className="chart-header">
          <h2>Visualización: Pozo {survey.name}</h2>
          <p className="current-view-indicator">{currentView}</p>
        </div>
        {/* SurveyNavBar is now removed */}
        <div className="chart-container">
          <SurveyChart data={survey} is3D={is3D} />
        </div>
      </main>
    </div>
  );
}
