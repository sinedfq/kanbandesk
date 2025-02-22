import React, { useState, useEffect } from "react";
import "./Modal.css";

const Modal = ({ onClose, children, zIndex = 1000 }) => {
  const [closing, setClosing] = useState(false);

  const handleClose = (event) => {
    // Закрываем модальное окно только при клике на фон (custom__modal)
    if (event.target === event.currentTarget) {
      setClosing(true);
      setTimeout(() => {
        onClose(false);
      }, 300);
    }
  };

  useEffect(() => {
    setClosing(false);
  }, []);

  return (
    <div
      className={`custom__modal ${closing ? "hidden" : ""}`}
      style={{ zIndex }}
      onClick={handleClose} // Закрытие при клике на фон
    >
      <div
        className="modal__content"
        style={{ zIndex: zIndex + 1 }}
        onClick={(event) => event.stopPropagation()} // Останавливаем всплытие события
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;