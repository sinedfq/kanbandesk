import React, { useState, useEffect } from "react";
import Modal from "../../Modal/Modal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./CardDetails.css"; // Подключаем стили

export default function CardEdit(props) {
  const {
    card = { id: null, title: "", description: "", participants: [], start_date: null, end_date: null, color: "#ffffff" },
    bid,
    updateCard,
    onClose,
  } = props;

  const [title, setTitle] = useState(card.title || "");
  const [description, setDescription] = useState(card.description || "");
  const [participants, setParticipants] = useState(card.participants || []);
  const [startDate, setStartDate] = useState(card.start_date ? new Date(card.start_date) : new Date());
  const [endDate, setEndDate] = useState(card.end_date ? new Date(card.end_date) : new Date());
  const [color, setColor] = useState(card.color || "#ffffff");
  const [users, setUsers] = useState([]);

  // Определяем набор цветов
  const colors = [
    { name: "Синий", value: "#0000FF" },
    { name: "Красный", value: "#FF0000" },
    { name: "Жёлтый", value: "#FFFF00" },
    { name: "Зелёный", value: "#00FF00" },
    { name: "Фиолетовый", value: "#800080" },
  ];

  useEffect(() => {
    fetch("/api/users/")
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => console.error("Error fetching users:", error));
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

  return (
    <Modal onClose={onClose}>
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
          <label>Цвет:</label>
          <div className="color-options">
            {colors.map((colorOption) => (
              <button
                key={colorOption.value}
                className="color-button"
                style={{ backgroundColor: colorOption.value }}
                onClick={() => setColor(colorOption.value)}
              >
                {color === colorOption.value && "✔"} {/* Показываем галочку, если цвет выбран */}
              </button>
            ))}
          </div>
          <button className="save__button" onClick={handleSave}>Сохранить</button>
        </div>
      </div>
    </Modal>
  );
}