import React, { useEffect, useState } from "react";
import Modal from "../../Modal/Modal";
import CardEdit from "./CardEdit";
import "./CardDetails.css";


export default function CardDetails(props) {
  const {
    card = { id: null, title: "", description: "", participants: [], start_date: null, end_date: null },
    bid,
    updateCard,
    removeCard,
    onClose,
  } = props;

  const [isAuthorized, setIsAuthorized] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showCardDetailsModal, setShowCardDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetch("/api/auth/check")
      .then(response => response.json())
      .then(data => {
        setIsAuthorized(data.isAuthenticated);
        setShowCardDetailsModal(data.isAuthenticated);
      })
      .catch(error => console.error("Error fetching auth status:", error));
  }, []);

  const handleAuthModalClose = () => {
    setShowAuthModal(false);
    setShowCardDetailsModal(false);
  };

  const handleDelete = () => {
    console.log(`Removing card with ID: ${card.id} from board with ID: ${bid}`);
    console.log(typeof removeCard); // Проверка типа
  
    if (typeof removeCard === "function") {
      removeCard(bid, card.id);
    } else {
      console.error("removeCard is not a function");
    }
  
    // Закрываем все модальные окна
    setShowCardDetailsModal(false);
    setShowAuthModal(false);
  
    // Закрываем окно с карточкой
    onClose();
  };

  return (
    <>
      {isAuthorized && showCardDetailsModal && (
        <Modal onClose={onClose} isOpen={showCardDetailsModal}>
          <div className="cardDetails">
            <h2 className="card__view">Просмотр карточки</h2>
            <p><strong>Заголовок:</strong> {card.title}</p>
            <p><strong>Описание:</strong> {card.description}</p>
            <p><strong>Участники:</strong> {card.participants.join(", ")}</p>
            <p><strong>Дата начала:</strong> {card.start_date}</p>
            <p><strong>Дата окончания:</strong> {card.end_date}</p>
            <button className="navigate__button" onClick={() => setShowEditModal(true)}>Редактировать</button>
            <button className="delete__button" onClick={handleDelete}>Удалить</button>
          </div>
        </Modal>
      )}

      {showEditModal && (
        <Modal onClose={() => setShowEditModal(false)} isOpen={showEditModal}>
          <CardEdit 
            card={card} 
            onClose={() => setShowEditModal(false)} 
            updateCard={updateCard} // Пробрасываем updateCard
            bid={bid} // Пробрасываем ID доски
          />
        </Modal>
      )}

      {showAuthModal && (
        <Modal onClose={handleAuthModalClose}>
          <div className="auth-modal">
            <h2>Пожалуйста, авторизуйтесь</h2>
            <p>Вы должны быть авторизованы, чтобы просматривать карточки.</p>
            <button onClick={handleAuthModalClose}>Закрыть</button>
          </div>
        </Modal>
      )}
    </>
  );
}
