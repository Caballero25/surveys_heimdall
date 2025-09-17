import React from 'react';
import Swal from 'sweetalert2'; // 1. Importa SweetAlert2

// Importa el archivo CSS para los estilos de la tarjeta
import './RealTimeCard.css'; 

export default function SecurityCamerasCard() {

  const handleCardClick = () => {
    // 2. Lanza la alerta con SweetAlert2 en lugar de notify
    Swal.fire({
      title: 'Próximamente',
      text: 'Nuestro equipo de desarrollo está trabajando en esto.',
      icon: 'info',
      // Estilos para que coincida con tu tema oscuro
      background: '#1e293b',
      color: '#e0e0e0',
      confirmButtonColor: '#5D409C', // Color de acento de tu app
      confirmButtonText: 'Entendido'
    });
  };

  return (
    <div className="container-fluid d-flex mb-3">
      <div 
        className="card text-center shadow-lg border-0 real-time-card" 
        style={{ 
          width: '25rem', 
          cursor: 'pointer', 
          backgroundColor: '#0A0A2A',
          color: '#FFFFFF', 
          marginLeft: "-10px"
        }}
        onClick={handleCardClick}
      >
        <div className="card-body p-4">
          <i className="bi bi-camera-video-fill" style={{ fontSize: '4rem', color: '#FFFFFF' }}></i>
          
          <h5 className="card-title mt-3 fw-bold">
            Cámaras de Seguridad [ Garita 1 ]
          </h5>
          
          <p className="card-text" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Visualice las transmisiones de las cámaras de seguridad en tiempo real.
          </p>

          <div className="d-flex justify-content-center align-items-center mt-3">
            <div className="live-indicator-dark-theme"></div> 
            <span className="ms-2 fw-bold" style={{ color: '#00BFFF' }}>EN VIVO</span>
          </div>
        </div>
      </div>
    </div>
  );
}