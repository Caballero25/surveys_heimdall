import React from "react";
import "../styles/SurveysPage.css";
import RealTimeRedireccion from "../../sensores/pages/redireccionPage";
import SurveysGrid from "../components/SurveysGrid";

export default function SurveysPage() {
  return (
    <div className="surveys-page-container">
      <header className="surveys-page-header">
        <h1>Proyectos Disponibles.</h1>
      </header>

      <main className="surveys-content">
        <header className="surveys-page-header">
          <p className="title">Seleccione un pozo para ver sus sensores en tiempo real.</p>
          <RealTimeRedireccion />
        </header>
        <header className="surveys-page-header">
          <p className="title">Seleccione un proyecto para ver su trayectoria gráfica.</p>
          <SurveysGrid />
        </header>
      </main>
    </div>
  );
}
