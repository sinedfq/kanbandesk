import React, { useState, useEffect } from "react";
import Modal from "../../Modal/Modal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function CardDetails(props) {
  const {
    card = { id: null, title: "", description: "", participants: [], start_date: null, end_date: null, color: "#ffffff" },
    bid,
    updateCard,
    removeCard,
    onClose,
  } = props;

  const [title, setTitle] = useState(card.title || "");
  const [description, setDescription] = useState(card.description || "");
  const [participants, setParticipants] = useState(card.participants || []);
  const [startDate, setStartDate] = useState(card.start_date ? new Date(card.start_date) : new Date());
  const [endDate, setEndDate] = useState(card.end_date ? new Date(card.end_date) : new Date());
  const [color, setColor] = useState(card.color || "#ffffff");
  const [users, setUsers] = useState([]);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showCardDetailsModal, setShowCardDetailsModal] = useState(false);

  useEffect(() => {
    fetch("/api/auth/check")
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Network response was not ok");
      })
      .then(data => {
        setIsAuthorized(data.isAuthenticated);
        if (data.isAuthenticated) {
          setShowAuthModal(false);
          setShowCardDetailsModal(true);
        }
      })
      .catch(error => {
        console.error("Error fetching auth status:", error);
      });

    fetch("/api/users/")
      .then(response => {
        if (response.ok) {
          return response.json();
        } else if (response.status === 403) {
          setShowAuthModal(true);
          return [];
        }
        throw new Error("Network response was not ok");
      })
      .then(data => setUsers(data))
      .catch(error => {
        console.error("Error fetching users:", error);
      });
  }, []);

  const handleSave = () => {
    const updatedCardData = {
      ...card,
      title,
      description,
      participants,
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
      color,
      board: bid,
    };

    updateCard(bid, card.id, updatedCardData);
    onClose();
  };

  const handleAuthModalClose = () => {
    setShowAuthModal(false);
    setShowCardDetailsModal(false);
  };

  return (
    <>
      {isAuthorized && showCardDetailsModal && (
        <Modal onClose={onClose} isOpen={showCardDetailsModal}>
          <div className="cardDetails">
            <h2 className="card__edit">Редактирование</h2>
            <input
              type="text"
              placeholder="Заголовок"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              placeholder="Описание"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
            <div className="participants-dropdown">
              <select
                multiple
                value={participants}
                onChange={(e) =>
                  setParticipants([...e.target.selectedOptions].map(option => option.value))
                }
              >
                {users.map(user => (
                  <option key={user.id} value={user.user.username}>
                    {user.user.username}
                  </option>
                ))}
              </select>
            </div>
              <div className="date-picker-container">
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  dateFormat="yyyy-MM-dd"
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                />
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  dateFormat="yyyy-MM-dd"
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                />
              </div>
            <div className="color-picker">
              <label>Выберите цвет:</label>
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              />
              <button className="save__button" onClick={handleSave}>Сохранить</button>
            </div>
          </div>
        </Modal>
      )}

      {showAuthModal && (
        <Modal onClose={handleAuthModalClose}>
          <div className="auth-modal">
            <h2>Пожалуйста, авторизуйтесь</h2>
            <p>Вы должны быть авторизованы, чтобы редактировать карточки.</p>
            <button onClick={handleAuthModalClose}>Закрыть</button>
          </div>
        </Modal>
      )}
    </>
  );
}
