import React, { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import { Calendar, CheckSquare, Edit3 } from "react-feather";
import Dropdown from "../Dropdown/Dropdown";
import Modal from "../Modal/Modal";
import Tag from "../Tags/Tag";
import "./Card.css";
import CardDetails from "./CardDetails/CardDetails.jsx";

const Card = (props) => {
  const [dropdown, setDropdown] = useState(false);
  const [modalShow, setModalShow] = useState(false);

  return (
    <Draggable
      key={props.id.toString()}
      draggableId={props.id.toString()}
      index={props.index}
    >
      {(provided) => (
        <>
          {modalShow && (
            <CardDetails
              updateCard={props.updateCard}
              removeCard={props.removeCard}
              onClose={() => setModalShow(false)}
              card={props.card}
              bid={props.bid}
            />
          )}

          <div
            className="custom__card"
            onClick={() => {
              setModalShow(true);
            }}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
          >
            <div className="card__text">
              <p>{props.card.title}</p>
              <Edit3
                color="#000000"
                className="car__more"
                onClick={(e) => {
                  e.stopPropagation();
                  setDropdown(true);
                }}
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
      )}
    </Draggable>
  );
};

export default Card;
