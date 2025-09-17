import React from "react";
import "../styles/SurveysPage.css";
import RealTimeRedireccion from "../../sensores/pages/redireccionPage";
import SurveysGrid from "../components/SurveysGrid";
import SecurityCamerasCard from "../../sensores/pages/securityCamerasPage";

export default function SurveysPage() {
  return (
    <div className="surveys-page-container">
      <header className="surveys-page-header">
        <h1>Proyectos Disponibles.</h1>
      </header>

      <main className="surveys-content">
        <header className="surveys-page-header">
          <p className="title">Seleccione un pozo para ver sus sensores en tiempo real.</p>
          <div className="row d-flex">
            <div className="col-md-6 col-sm-12">
              <RealTimeRedireccion />
            </div>
            <div className="col-md-6 col-sm-12 d-flex justify-content-end">
              <div>
                <SecurityCamerasCard />
              </div>
            </div>
          </div>
        </header>
        <header className="surveys-page-header">
          <p className="title">Seleccione un proyecto para ver su trayectoria gráfica.</p>
          <SurveysGrid />
        </header>
      </main>
    </div>
  );
}
