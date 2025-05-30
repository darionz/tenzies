import Die from "./Die"
import React from "react"
import { nanoid } from "nanoid"
import Confetti from 'react-confetti'
import { useWindowSize } from 'react-use'

export default function App() {
  const [diceArray, setDiceArray] = React.useState(() =>generateAllNewDice())
  const buttonRef = React.useRef(null)
  const { width, height } = useWindowSize()
  const gameWon = diceArray.every(dice => dice.value === diceArray[0].value) && diceArray.every(dice => dice.isHeld === true)

  React.useEffect(() => {
    if (gameWon) {
      buttonRef.current.focus()
    }
  }, [gameWon])

  function generateAllNewDice() {
    const array = []
    for (let i = 0; i < 10; i++) {
      array[i] = {
        id: nanoid(),
        value:  Math.floor(Math.random() * (7 - 1) + 1),
        isHeld: false
      }
    }
    return array
  }

  function rollDice() {
    gameWon ? setDiceArray(generateAllNewDice) : 
    setDiceArray(prevArray => prevArray.map(die =>
      !die.isHeld ? {...die, value: Math.floor(Math.random() * (7 - 1) + 1) } : die
    ))
  }

  function hold(id) {
    setDiceArray(prevArray => prevArray.map(die => 
      die.id === id ? {...die, isHeld: !die.isHeld} : die
    ))
  }

  const diceElements = diceArray.map(dieObj => 
    <Die 
      key={dieObj.id} 
      value={dieObj.value} 
      isHeld={dieObj.isHeld} 
      hold={hold}
      id={dieObj.id}
    />) 
    
  return (
    <main>
      {gameWon && <Confetti width={width} height={height}/>}
      <div aria-live="polite" className="sr-only">
        {gameWon && <p>Congratulations! You won! Press "New game" to start again</p>}
      </div>
      <h1 className="title">Tenzies</h1>
      <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
      <div className="dice-container">
        {diceElements}
      </div>

      <button ref={buttonRef} className="roll-button" onClick={rollDice}>
        {gameWon ? "New Game" : "Roll" }
      </button>
    </main>
  )
}
