import { useEffect, useState } from "react";
import axios from 'axios';
import "./App.css";
import Navbar from "../components/Navbar/Navbar";
import Board from "../components/Board/Board";
import { DragDropContext } from "react-beautiful-dnd";
import Editable from "../components/Editable/Editable";
import useLocalStorage from "use-local-storage";
import "../bootstrap.css";
import { v4 as uuidv4 } from "uuid";

function App() {
  const [data, setData] = useState([]);
  const defaultDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const [theme, setTheme] = useLocalStorage("theme", defaultDark ? "dark" : "light");

  useEffect(() => {
    axios.all([
      axios.get('http://localhost:8000/api/boards/'),
      axios.get('http://localhost:8000/api/cards/')
    ])
    .then(axios.spread((boardsResponse, cardsResponse) => {
      const boardsData = boardsResponse.data;
      const cardsData = cardsResponse.data;

      const formattedData = boardsData.map(board => ({
        id: board.id,
        boardName: board.board_name,
        cards: cardsData
          .filter(card => card.board === board.id)
          .map(card => ({
            id: card.id,
            title: card.title,
            description: card.description,
            start_date: card.start_date, // Добавляем проверку на существование
            end_date: card.end_date,     // Добавляем проверку на существование
          })),
      }));

      setData(formattedData);
    }))
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
    tempData[destinationBoardIdx].cards.splice(
      destination.index,
      0,
      tempData[sourceBoardIdx].cards[source.index]
    );
    tempData[sourceBoardIdx].cards.splice(source.index, 1);

    return tempData;
  };

  const addCard = (title, bid) => {
    const index = data.findIndex((item) => item.id === bid);
    if (index < 0) return;
  
    // Получаем текущую дату
    const currentDate = new Date();
  
    // Создаем новую дату на следующий день
    const nextDay = new Date(currentDate);
    nextDay.setDate(currentDate.getDate() + 1);
  
    const newCard = {
      title: title,
      description: "No description",
      board: bid,
      start_date: currentDate.toISOString(), // Преобразуем в формат ISO 8601
      end_date: nextDay.toISOString(), // Преобразуем в формат ISO 8601
    };
  
    axios.post('http://localhost:8000/api/cards/', newCard)
      .then(response => {
        newCard.id = response.data.id;
        const tempData = [...data];
        tempData[index].cards.push(newCard);
        setData(tempData);
      })
      .catch(error => {
        console.error('There was an error!', error);
        if (error.response) {
          console.error('Response data:', error.response.data);
        }
      });
  };

  const removeCard = (boardId, cardId) => {
    const index = data.findIndex((item) => item.id === boardId);
    const tempData = [...data];
    const cardIndex = data[index].cards.findIndex((item) => item.id === cardId);

    tempData[index].cards.splice(cardIndex, 1);
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
          cards: []
        };
        setData(prevData => [...prevData, newBoard]);
      })
      .catch(error => {
        console.error('There was an error!', error);
        if (error.response) {
          console.error('Response data:', error.response.data);
        }
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

    const sourceBoardIdx = data.findIndex(board => board.id.toString() === source.droppableId);
    const destBoardIdx = data.findIndex(board => board.id.toString() === destination.droppableId);

    if (sourceBoardIdx === -1 || destBoardIdx === -1) return;

    const sourceBoard = data[sourceBoardIdx];
    const destBoard = data[destBoardIdx];

    const [movedCard] = sourceBoard.cards.splice(source.index, 1);
    destBoard.cards.splice(destination.index, 0, movedCard);
    movedCard.board = destBoard.id;

    setData([...data]);

    axios.put(`http://localhost:8000/api/cards/${movedCard.id}/`, movedCard)
      .catch(error => console.error('There was an error!', error));
  };

  const updateCard = (bid, cid, updatedCardData) => {
    console.log(`Updating card with ID: ${cid} in board with ID: ${bid}`);
    console.log('Updated Card Data:', updatedCardData);
  
    const boardIndex = data.findIndex((board) => board.id === bid);
    if (boardIndex === -1) {
      console.error(`Board with ID ${bid} not found.`);
      return;
    }
  
    const cardIndex = data[boardIndex].cards.findIndex((item) => item.id === cid);
    if (cardIndex === -1) {
      console.error(`Card with ID ${cid} not found in board ${bid}.`);
      return;
    }
  
    const updatedBoards = [...data];
    updatedBoards[boardIndex].cards[cardIndex] = {
      ...updatedBoards[boardIndex].cards[cardIndex],
      ...updatedCardData,
    };
    setData(updatedBoards);
  
    axios.put(`http://localhost:8000/api/cards/${cid}/`, updatedCardData)
      .then(() => {
        console.log(`Card with ID ${cid} successfully updated.`);
      })
      .catch(error => {
        console.error(`Failed to update card with ID ${cid}.`, error);
        if (error.response) {
          console.error('Response data:', error.response.data);
        }
      });
  };
  
  const updateCardDate = (bid, cid, startDate) => {
    const boardIndex = data.findIndex((item) => item.id === bid);
    if (boardIndex === -1) {
      console.error(`Board with ID ${bid} not found.`);
      return;
    }
  
    const cardIndex = data[boardIndex].cards.findIndex((item) => item.id === cid);
    if (cardIndex === -1) {
      console.error(`Card with ID ${cid} not found in board ${bid}.`);
      return;
    }
  
    const updatedBoards = [...data];
    updatedBoards[boardIndex].cards[cardIndex] = {
      ...updatedBoards[boardIndex].cards[cardIndex],
      start_date: startDate,
      board: bid,
    };
    setData(updatedBoards);
  
    axios.put(`http://localhost:8000/api/cards/${cid}/`, {
      ...updatedBoards[boardIndex].cards[cardIndex],
      start_date: startDate,
    })
    .then(() => {
      console.log(`Card with ID ${cid} successfully updated.`);
    })
    .catch(error => {
      console.error(`Failed to update card with ID ${cid}.`, error);
      if (error.response) {
        console.error('Response data:', error.response.data);
      }
    });
  };
  
  const updateCardEndDate = (bid, cid, endDate) => {
    const boardIndex = data.findIndex((item) => item.id === bid);
    if (boardIndex === -1) {
      console.error(`Board with ID ${bid} not found.`);
      return;
    }
  
    const cardIndex = data[boardIndex].cards.findIndex((item) => item.id === cid);
    if (cardIndex === -1) {
      console.error(`Card with ID ${cid} not found in board ${bid}.`);
      return;
    }
  
    const updatedBoards = [...data];
    updatedBoards[boardIndex].cards[cardIndex] = {
      ...updatedBoards[boardIndex].cards[cardIndex],
      end_date: endDate,
      board: bid,
    };
    setData(updatedBoards);
  
    axios.put(`http://localhost:8000/api/cards/${cid}/`, {
      ...updatedBoards[boardIndex].cards[cardIndex],
      end_date: endDate,
    })
    .then(() => {
      console.log(`Card with ID ${cid} successfully updated.`);
    })
    .catch(error => {
      console.error(`Failed to update card with ID ${cid}.`, error);
      if (error.response) {
        console.error('Response data:', error.response.data);
      }
    });
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
                  card={item.cards.map(card => ({
                    ...card,
                    start_date: card.start_date || null,
                    end_date: card.end_date || null
                  }))}
                  setName={setName}
                  addCard={addCard}
                  removeCard={removeCard}
                  updateCard={(bid, cid, updatedCardData) => updateCard(bid, cid, updatedCardData)}
                  updateCardDate={updateCardDate}
                  updateCardEndDate={updateCardEndDate}
                  removeBoard={removeBoard}
                />
              ))}
            <Editable
              class={"add__board"}
              name={"Добавить столбец"}
              btnName={"Добавить"}
              onSubmit={addBoard}
              placeholder={"Введите заголовок столбца"}
            />
          </div>
        </div>
      </div>
    </DragDropContext>
  );
}

export default App;
