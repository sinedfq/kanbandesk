import React, { useState, useEffect } from "react";
import Modal from "../../Modal/Modal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./CardDetails.css";

export default function CardDetails(props) {
  const {
    card = { id: null, title: "", description: "", participants: [], start_date: null, end_date: null },
    bid,
    updateCard,
    onClose,
  } = props;

  const [title, setTitle] = useState(card.title || "");
  const [description, setDescription] = useState(card.description || "");
  const [participants, setParticipants] = useState(card.participants || []);
  const [startDate, setStartDate] = useState(card.start_date ? new Date(card.start_date) : new Date());
  const [endDate, setEndDate] = useState(card.end_date ? new Date(card.end_date) : new Date());

  // Добавим useEffect для отладки
  useEffect(() => {
    console.log("Current card:", card);
    console.log("Current description state:", description);
  }, [card, description]);

  const handleSave = () => {
    const updatedCardData = {
      ...card,
      title,
      description,
      participants,
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
      board: bid,
    };

    updateCard(bid, card.id, updatedCardData);
    onClose();
  };

  return (
    <Modal onClose={onClose}>
      <div className="cardDetails">
        <h2>Редактирование</h2>
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
            <option value="participant1">Пользователь 1</option>
            <option value="participant2">Пользователь 2</option>
            <option value="participant3">Пользователь 3</option>
          </select>
        </div>
        <div className="date-picker">
          <label>Дата начала и дата окончания:</label>
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
        </div>
        <button onClick={handleSave}>Сохранить</button>
      </div>
    </Modal>
  );
}
