import { toast } from "react-toastify";

export const notify = (type, message) => {
  const params = {
    position: "bottom-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    theme: "colored",
  };

  if (type === "success") toast.success(message, params);
  if (type === "error") toast.error(message, params);
  if (type === "warn") toast.warn(message, params);
  if (type === "info") toast.info(message, params);

};
// Advertencia offline
const OfflineWarningContent = () => (
  <div className="offline-warning-toast">
    <div className="d-flex align-items-center">
      <i className="bi bi-exclamation-triangle-fill text-danger fs-3 me-3"></i>
      <div>
        <h4 className="mb-1 fw-bold">¡Advertencia! Modo Offline</h4>
        <p className="mb-2">
          Si recargas o cierras esta página, 
          podrías <strong>perder todos los datos</strong> que no se han sincronizado.
        </p>
        <button 
          type="button" 
          className="btn btn-primary btn-sm w-100"
          onClick={() => {
            // Cerrar todos los toasts activos
            toast.dismiss();
          }}
        >
          Entendido
        </button>
      </div>
    </div>
  </div>
);

// Mostrar advertencia de offline como un toast modal
export const showOfflineWarning = () => {
  toast.error(
    <OfflineWarningContent />,
    {
      position: "top-center",
      autoClose: false,
      hideProgressBar: true,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: false,
      theme: "colored",
      className: "offline-warning-modal",
      style: { 
        backgroundColor: "#fff",
        color: "#000",
        boxShadow: "0 0 10px rgba(0,0,0,0.3)",
        borderLeft: "6px solid #dc3545",
        width: "360px",
        maxWidth: "90%"
      },
    }
  );
};