import React from 'react';

/**
 * Un componente simple de spinner para indicar estados de carga.
 * Utiliza clases de Bootstrap.
 */
export default function Spinner() {
  return (
    <div className="d-flex justify-content-center align-items-center">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
}
