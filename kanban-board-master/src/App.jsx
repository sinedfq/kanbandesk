import { useEffect, useState } from "react";
import axios from 'axios'; 
import "./App.css";
import Navbar from "../components/Navbar/Navbar";
import Board from "../components/Board/Board";
import { DragDropContext } from "react-beautiful-dnd";
import Editable from "../components/Editable/Editable";
import "../bootstrap.css";

function App() {
  const [data, setData] = useState([]);
  const defaultDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const [theme, setTheme] = useState(defaultDark ? "dark" : "light");

  useEffect(() => {
    axios.all([
      axios.get('http://localhost:8000/api/boards/'),
      axios.get('http://localhost:8000/api/cards/')
    ])
    .then(axios.spread((boardsResponse, cardsResponse) => {
      const boardsData = boardsResponse.data;
      const cardsData = cardsResponse.data;
  
      console.log('Boards data from API:', boardsData);
      console.log('Cards data from API:', cardsData);
  
      // Распределение карточек по доскам
      const formattedData = boardsData.map(board => ({
        id: board.id,
        boardName: board.board_name,
        cards: cardsData.filter(card => card.board === board.id).map(card => ({
          id: card.id,
          title: card.title,
          description: card.description,
        }))
      }));
  
      console.log('Formatted data:', formattedData);
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
    const tempData = [...data];
    const newCard = {
      title: title,
      description: "No description",
      board: bid,
    };

    axios.post('http://localhost:8000/api/cards/', newCard)
      .then(response => {
        newCard.id = response.data.id;
        const tempData = [...data];
        if (!Array.isArray(tempData) || tempData.length <= index || !Array.isArray(tempData[index].cards)) {
          console.error('Error: Invalid data structure or index');
          return;
        }
        
        // Теперь мы можем безопасно добавить новую карточку в массив
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
          cards: [] // Поправлено на "cards"
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

    const [movedCard] = sourceBoard.cards.splice(source.index, 1); // Поправлено на "cards"
    destBoard.cards.splice(destination.index, 0, movedCard); // Поправлено на "cards"
    movedCard.board = destBoard.id;

    setData([...data]);

    axios.put(`http://localhost:8000/api/cards/${movedCard.id}/`, movedCard)
      .catch(error => console.error('There was an error!', error));
  };

  const updateCard = (bid, cid, card) => {
    const index = data.findIndex((item) => item.id === bid);
    if (index < 0) return;

    const tempBoards = [...data];
    const cards = tempBoards[index].cards || []; // Поправлено на "cards"
   
    const cardIndex = cards.findIndex((item) => item.id === cid);
    if (cardIndex < 0) return;

    axios.put(`http://localhost:8000/api/cards/${cid}/`, card)
      .then(() => {
        tempBoards[index].cards[cardIndex] = card; // Поправлено на "cards"
        setData(tempBoards);
      })
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
                card={item.cards || []}
                setName={setName}
                addCard={addCard}
                removeCard={removeCard}
                updateCard={updateCard}
                removeBoard={removeBoard}
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
