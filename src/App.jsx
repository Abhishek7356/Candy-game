import { useEffect, useState } from 'react';
import './App.css';
import redCandy from '../src/assets/redCandy.png';
import greenCandy from '../src/assets/greenCandy.png';
import blueCandy from '../src/assets/blueCandy.png';
import purpleCandy from '../src/assets/Purplecandy.webp';
import orangeCandy from '../src/assets/orangeCandy.png';
import brownCandy from '../src/assets/brownCandy.png';
import blank from '../src/assets/blank.png'
import Score from './components/Score';

function App() {
  const [candyBoard, setCandyBoard] = useState([])
  const [beingDrag, setBeingDrag] = useState(null)
  const [beingReplace, setBeingReplace] = useState(null)
  const [score, setScore] = useState(0)
  const [turn, setTurn] = useState(0)

  const candyColors = [
    redCandy,
    greenCandy,
    blueCandy,
    purpleCandy,
    orangeCandy,
    brownCandy
  ]
  const width = 8;

  const setupCandyBoard = () => {
    let shuffledColorArray = [];
    for (let i = 0; i < width * width; i++) {
      let randomColor = candyColors[Math.floor(Math.random() * candyColors.length)]
      shuffledColorArray.push(randomColor)
    }
    setCandyBoard(shuffledColorArray);
  }

  const checkThreeCol = () => {
    for (let i = 0; i <= 47; i++) {
      const threeCandyCol = [i, i + width, i + width * 2];
      let currentCellColor = candyBoard[i];
      const isBlank = candyBoard[i] === blank

      if (threeCandyCol.every(item => candyBoard[item] == currentCellColor && !isBlank)) {
        threeCandyCol.forEach(item => candyBoard[item] = blank)
        setScore((prev) => prev + 3);
        
        return true
      }
    }
  }

  const checkThreeRow = () => {
    for (let i = 0; i < 64; i++) {
      const threeCandyRow = [i, i + 1, i + 2];
      const notValid = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 62, 63]
      let currentCellColor = candyBoard[i];
      const isBlank = candyBoard[i] === blank

      if (notValid.includes(i)) {
        continue
      }

      if (threeCandyRow.every(item => candyBoard[item] == currentCellColor && !isBlank)) {
        threeCandyRow.forEach(item => candyBoard[item] = blank)
        setScore((prev) => prev + 3);
        
        return true
      }
    }
  }

  const moveBelow = () => {
    const firstRow = [0, 1, 2, 3, 4, 5, 6, 7];
    for (let i = 0; i <= 55; i++) {
      let isfirstRow = firstRow.includes(i)
      if (isfirstRow && candyBoard[i] === blank) {
        candyBoard[i] = candyColors[Math.floor(Math.random() * candyColors.length)]
      }

      if (candyBoard[i + width] === blank) {
        candyBoard[i + width] = candyBoard[i];
        candyBoard[i] = blank
      }
    }
  }

  // console.log(candyBoard);
  useEffect(() => {
    setupCandyBoard()
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      checkThreeCol();
      checkThreeRow();
      moveBelow()
      setCandyBoard([...candyBoard])
    }, 100)
    return (() => clearInterval(timer))
  }, [checkThreeCol, candyBoard, checkThreeRow, moveBelow])

  const hanleDragStart = (e) => {
    setBeingDrag(e.target)
  }

  const handleDrop = (e) => {
    setBeingReplace(e.target)
  }

  const handleDragEnd = (e) => {
    let beingDragId = parseInt(beingDrag.getAttribute('data-id'));
    let beingReplacedId = parseInt(beingReplace.getAttribute('data-id'));
    // console.log("beingDragId", beingDragId);
    // console.log("beingReplacedId", beingReplacedId);
    candyBoard[beingReplacedId] = beingDrag.getAttribute('src');
    candyBoard[beingDragId] = beingReplace.getAttribute('src');

    let validMove = [beingDragId + 1, beingDragId - 1, beingDragId + width, beingDragId - width]
    let isValidMove = validMove.includes(beingReplacedId)
    let isThreeRow = checkThreeRow();
    let isThreeCol = checkThreeCol();

    if (beingReplacedId && isValidMove && (isThreeCol || isThreeRow)) {
      setBeingDrag(null)
      setBeingReplace(null)
      setTurn(turn + 1)
    } else {
      candyBoard[beingReplacedId] = beingReplace.getAttribute('src');
      candyBoard[beingDragId] = beingDrag.getAttribute('src');
      setCandyBoard([...candyBoard])
    }
  }

  let allColorsColumn = candyBoard.map((cColor, index) => {
    return (
      <img
        src={cColor}
        data-id={index}
        draggable={true}
        style={{ objectFit: 'contain' }}
        alt={cColor} key={index}
        onDragStart={hanleDragStart}
        onDrop={handleDrop}
        onDragEnd={handleDragEnd}
        onDragLeave={(e) => e.preventDefault()}
        onDragEnter={(e) => e.preventDefault()}
        onDragOver={(e) => e.preventDefault()}
      />
    )
  })

  return (
    <div className="App">
      <Score turn={turn} score={score} />
      <div className='gameBoard'>
        {allColorsColumn}
      </div>
    </div>
  );
}

export default App;
