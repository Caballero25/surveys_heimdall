import React from 'react';
import { useNavigate } from 'react-router-dom';

// Importa el archivo CSS para los estilos personalizados si aún no lo has hecho
import './RealTimeCard.css'; 

export default function RealTimeRedireccion() {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate('/sensores');
  };

  return (
    <div className="container d-flex mb-3">
      <div 
        className="card text-center shadow-lg border-0 real-time-card" 
        style={{ 
          width: '25rem', 
          cursor: 'pointer', 
          backgroundColor: '#0A0A2A', /* Azul oscuro para la card, similar al fondo del manual de marca */
          color: '#FFFFFF', /* Texto en blanco */
          marginLeft: "-10px"
        }}
        onClick={handleCardClick}
      >
        <div className="card-body p-4">
          {/* Icono en blanco para contrastar con el fondo oscuro */}
          <i className="bi bi-activity" style={{ fontSize: '4rem', color: '#FFFFFF' }}></i>
          
          <h5 className="card-title mt-3 fw-bold">
            Monitor de Sensores
          </h5>
          
          <p className="card-text" style={{ color: 'rgba(255, 255, 255, 0.7)' /* Texto secundario en un blanco más tenue */ }}>
            Acceda al dashboard para visualizar los datos del pozo en tiempo real.
          </p>

          <div className="d-flex justify-content-center align-items-center mt-3">
            {/* El indicador en vivo lo mantengo en un tono que contraste pero sea visible */}
            <div className="live-indicator-dark-theme"></div> 
            <span className="ms-2 fw-bold" style={{ color: '#00BFFF' /* Un azul cielo para el texto EN VIVO */ }}>EN VIVO</span>
          </div>
        </div>
      </div>
    </div>
  );
}