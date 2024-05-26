import { useEffect, useState } from "react";
import axios from 'axios'; 
import "./App.css";
import Navbar from "../components/Navbar/Navbar";
import Board from "../components/Board/Board";
import { DragDropContext } from "react-beautiful-dnd";
import { v4 as uuidv4 } from "uuid";
import Editable from "../components/Editable/Editable";
import "../bootstrap.css";

function App() {
  const [data, setData] = useState([]);
  const defaultDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const [theme, setTheme] = useState(defaultDark ? "dark" : "light");

  // Загружаем доски и карточки из API при монтировании компонента
  useEffect(() => {
    axios.get('http://localhost:8000/api/boards/')
      .then(response => {
        const boardsData = response.data;
        const formattedData = boardsData.map(board => ({
          id: board.id,
          boardName: board.board_name,
          card: (board.cards || []).map(card => ({
            id: card.id,
            title: card.title,
            description: card.description,
            index: card.index
          }))
        }));
        setData(formattedData);
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  }, []);

  const switchTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const setName = (title, bid) => {
    const index = data.findIndex((item) => item.id === bid);
    const tempData = [...data];
    tempData[index].boardName = title;
    setData(tempData);
    axios.put(`http://localhost:8000/api/boards/${bid}/`, tempData[index])
      .catch(error => console.error('There was an error!', error));
  };

  const dragCardInBoard = (source, destination) => {
    let tempData = [...data];
    const destinationBoardIdx = tempData.findIndex(
      (item) => item.id.toString() === destination.droppableId
    );
    const sourceBoardIdx = tempData.findIndex(
      (item) => item.id.toString() === source.droppableId
    );
    tempData[destinationBoardIdx].card.splice(
      destination.index,
      0,
      tempData[sourceBoardIdx].card[source.index]
    );
    tempData[sourceBoardIdx].card.splice(source.index, 1);

    return tempData;
  };

  const addCard = (title, bid) => {
    const index = data.findIndex((item) => item.id === bid);
    const tempData = [...data];
    const newCard = {
      id: uuidv4(),
      title: title,
      tags: [],
      task: [],
      board: bid,
    };
    tempData[index].card.push(newCard);
    setData(tempData);
    axios.post('http://localhost:8000/api/cards/', newCard)
      .catch(error => console.error('There was an error!', error));
  };

  const removeCard = (boardId, cardId) => {
    const index = data.findIndex((item) => item.id === boardId);
    const tempData = [...data];
    const cardIndex = data[index].card.findIndex((item) => item.id === cardId);

    tempData[index].card.splice(cardIndex, 1);
    setData(tempData);
    axios.delete(`http://localhost:8000/api/cards/${cardId}/`)
      .catch(error => console.error('There was an error!', error));
  };

  const addBoard = (title) => {
    axios.post('http://localhost:8000/api/boards/', { board_name: title })
      .then(response => {
        const newBoard = {
          id: response.data.id,
          boardName: response.data.board_name,
          card: []
        };
        setData(prevData => [...prevData, newBoard]);
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  };

  const removeBoard = (bid) => {
    const tempData = [...data];
    const index = data.findIndex((item) => item.id === bid);
    tempData.splice(index, 1);
    setData(tempData);
    axios.delete(`http://localhost:8000/api/boards/${bid}/`)
      .catch(error => console.error('There was an error!', error));
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    if (source.droppableId === destination.droppableId) return;

    setData(dragCardInBoard(source, destination));
  };

  const updateCard = (bid, cid, card) => {
    const index = data.findIndex((item) => item.id === bid);
    if (index < 0) return;

    const tempBoards = [...data];
    const cards = tempBoards[index].card;

    const cardIndex = cards.findIndex((item) => item.id === cid);
    if (cardIndex < 0) return;

    tempBoards[index].card[cardIndex] = card;
    setData(tempBoards);
    axios.put(`http://localhost:8000/api/cards/${cid}/`, card)
      .catch(error => console.error('There was an error!', error));
  };

  useEffect(() => {
    localStorage.setItem("kanban-board", JSON.stringify(data));
  }, [data]);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="App" data-theme={theme}>
        <Navbar switchTheme={switchTheme} />
        <div className="app_outer">
          <div className="app_boards">
            {data.map((item) => (
              <Board
                key={item.id}
                id={item.id}
                name={item.boardName}
                card={item.card}
                // Остальные props
              />
            ))}
            <Editable
              class={"add__board"}
              name={"Add Board"}
              btnName={"Add Board"}
              onSubmit={addBoard}
              placeholder={"Enter Board Title"}
            />
          </div>
        </div>
      </div>
    </DragDropContext>
  );
}

export default App;
