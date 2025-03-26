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
  const [userRole, setUserRole] = useState(null);  // Состояние для роли пользователя
  const [username, setUsername] = useState(null);  // Состояние для имени пользователя
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showCardDetailsModal, setShowCardDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  // Загружаем авторизацию и проверяем статус
  useEffect(() => {
    fetch("/api/auth/check")
      .then(response => response.json())
      .then(data => {
        setIsAuthorized(data.isAuthenticated);
        setUserRole(data.role);  // Сохраняем роль пользователя
        setUsername(data.name);  // Сохраняем имя пользователя
        setShowCardDetailsModal(data.isAuthenticated);
      })
      .catch(error => console.error("Error fetching auth status:", error));
  }, []);

  // Загружаем комментарии для текущей карточки по её ID
  useEffect(() => {
    setComments([]);
    if (card.id) {
      fetch(`/api/comments/?card=${card.id}`)
        .then(response => response.json())
        .then(data => {
          setComments(data);
        })
        .catch(error => console.error("Error fetching comments:", error));
    }
  }, [card.id]);

  const handleClose = () => {
    setComments([]);
    onClose();
  };

  const handleDelete = () => {
    if (typeof removeCard === "function") {
      removeCard(bid, card.id);
    } else {
      console.error("removeCard is not a function");
    }

    setShowCardDetailsModal(false);
    setShowAuthModal(false);
    handleClose();
  };

  // Отправка нового комментария
  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const token = localStorage.getItem('authToken');
    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;

    fetch("/api/comments/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        "X-CSRFToken": csrfToken,
      },
      body: JSON.stringify({
        card: card.id,
        comment: newComment,
      }),
    })
      .then(response => response.json())
      .then(data => {
        setComments(prevComments => [...prevComments, data]);
        setNewComment("");
      })
      .catch(error => console.error("Error posting comment:", error));
  };

  // Функция для форматирования даты
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  // Проверка, является ли пользователь участником карточки
  const isParticipant = card.participants.includes(username);
  return (
    <>
      {isAuthorized && showCardDetailsModal && (
        <Modal onClose={handleClose} zIndex={1000}>
          <div className="modal-content">
            <div className="card-details-wrapper">
              <div className="cardDetails">
                <h2 className="card__view">Просмотр карточки</h2>
                <p><strong>Заголовок:</strong> {card.title}</p>
                <p><strong>Описание:</strong> {card.description}</p>
                <p><strong>Участники:</strong> {card.participants.join(", ")}</p>
                <p><strong>Дата начала:</strong> {card.start_date}</p>
                <p><strong>Дата окончания:</strong> {card.end_date}</p>

                {/* Показываем кнопку редактирования для админов, модераторов и участников карточки */}
                {(userRole === 'admin' || userRole === 'moderator' || isParticipant) && (
                  <button className="navigate__button" onClick={() => setShowEditModal(true)}>
                    Редактировать
                  </button>
                )}

                {/* Показываем кнопку удаления только для админов и модераторов */}
                {(userRole === 'admin' || userRole === 'moderator') && (
                  <button className="delete__button" onClick={handleDelete}>Удалить</button>
                )}
              </div>

              <div className="comments-section">
                <h3>Комментарии</h3>
                <div className="comments-list">
                  {comments.length > 0 ? (
                    comments.map(comment => (
                      <div key={comment.id} className="comment">
                        <strong>{comment.user || "Загрузка..."}:</strong> {comment.comment}
                        <br />
                        <small>{formatDate(comment.created_at)}</small>
                      </div>
                    ))
                  ) : (
                    <p>Нет комментариев</p>
                  )}
                </div>
                <form className="comment-form" onSubmit={handleCommentSubmit}>
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Добавить комментарий..."
                  />
                  <button type="submit">Отправить</button>
                </form>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Второе модальное окно (CardEdit) */}
      {showEditModal && (
        <Modal onClose={() => setShowEditModal(false)} zIndex={1100} closeOnClick={false}>
          <CardEdit
            card={card}
            onClose={() => setShowEditModal(false)}
            updateCard={updateCard}
            bid={bid}
          />
        </Modal>
      )}

      {showAuthModal && (
        <Modal onClose={() => setShowAuthModal(false)} zIndex={1200}>
          <div className="auth-modal">
            <h2>Пожалуйста, авторизуйтесь</h2>
            <p>Вы должны быть авторизованы, чтобы просматривать карточки.</p>
            <button onClick={() => setShowAuthModal(false)}>Закрыть</button>
          </div>
        </Modal>
      )}

      {showAuthModal && (
        <Modal onClose={() => setShowAuthModal(false)} zIndex={1200}>
          <div className="auth-notification">
            <div className="auth-notification__icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
              </svg>
            </div>
            <h2 className="auth-notification__title">Требуется авторизация</h2>
            <p className="auth-notification__message">
              Для просмотра этой карточки вам необходимо войти в систему.
            </p>
            <div className="auth-notification__actions">
              <button
                className="auth-notification__button auth-notification__button--primary"
                onClick={() => {
                  window.location.href = `/login?next=${encodeURIComponent(window.location.pathname)}`;
                }}
              >
                Войти
              </button>
              <button
                className="auth-notification__button"
                onClick={() => {
                  setShowAuthModal(false);
                  onClose();
                }}
              >
                Закрыть
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}