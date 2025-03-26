import React, { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import { Calendar, Edit3 } from "react-feather";
import { toast } from "react-toastify";
import CardDetails from "./CardDetails/CardDetails.jsx";
import "./Card.css";

const Card = (props) => {
  const [dropdown, setDropdown] = useState(false);
  const [modalShow, setModalShow] = useState(false);

  // Проверяем, прошла ли дата окончания
  const isExpired = props.card.end_date && new Date(props.card.end_date) < new Date();

  // Применяем цвет, если он задан, иначе устанавливаем дефолтный цвет
  const cardColor = isExpired ? "#808080" : (props.card.color ? props.card.color : "#ffffff");

  const handleCardClick = () => {
    if (!props.isAuthenticated) {
      toast.error(
        <div>
          <h4>Доступ ограничен</h4>
          <p>Для просмотра и редактирования карточки необходимо войти в систему</p>
        </div>,
        {
          autoClose: 5000,
          closeButton: true,
        }
      );
      return;
    }
    setModalShow(true);
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    
    if (!props.isAuthenticated) {
      toast.error(
        <div>
          <h4>Редактирование недоступно</h4>
          <p>Для изменения карточки необходимо авторизоваться</p>
        </div>,
        {
          autoClose: 5000,
          closeButton: true,
        }
      );
      return;
    }
    setDropdown(true);
  };

  return (
    <Draggable
      key={props.id.toString()}
      draggableId={props.id.toString()}
      index={props.index}
    >
      {(provided, snapshot) => {
        const isDragging = snapshot.isDragging;

        return (
          <>
            {modalShow && (
              <CardDetails
                updateCard={props.updateCard}
                removeCard={props.removeCard}
                onClose={() => setModalShow(false)}
                card={props.card}
                bid={props.bid}
                currentUser={props.currentUser}
              />
            )}
            <div
              className={`custom__card ${isDragging ? 'dragging' : ''} ${isExpired ? 'expired' : ''}`}
              onClick={handleCardClick}
              {...provided.draggableProps}           
              {...provided.dragHandleProps}          
              ref={provided.innerRef}               
              style={{
                backgroundColor: `${cardColor}99`,
                ...provided.draggableProps.style,
                cursor: 'pointer',
              }}
            >
              <div className="card__text">
                <p>{props.card.title}</p>
                <Edit3
                  color="#000000"
                  className="car__more"
                  onClick={handleEditClick}
                />
              </div>
              <div className="card__footer">
                {props.card?.end_date && (
                  <div className="time">
                    <Calendar />
                    <span>{new Date(props.card.end_date).toLocaleDateString()}</span>
                  </div>
                )}
                {props.card?.participants && (
                  <div className="participants">
                    <span>{props.card.participants.join(", ")}</span>
                  </div>
                )}
              </div>

              {provided.placeholder}
            </div>
          </>
        );
      }}
    </Draggable>
  );
};

export default Card;