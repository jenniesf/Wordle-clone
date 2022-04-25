import { WORDS } from "./words.js";

const NUMBER_OF_GUESSES = 6
let guessesRemaining = NUMBER_OF_GUESSES
let currentGuess = []   // each letter goes into an array to check
let nextLetter = 0      // index of an array
let rightGuessString = WORDS[  Math.floor( Math.random() * WORDS.length )  ]   // choose random word from list words array
console.log( rightGuessString )  // log the word


// CREATE GAMEBOARD
function initBoard() {
    let board = document.getElementById("game-board");

    // create the gameboard grids
        // create the rows - run up to 6 times
    for (let i = 0; i < NUMBER_OF_GUESSES; i++) {
        let row = document.createElement("div") // creating 6 divs (rows)
        row.className = "letter-row"  // assign class name to row
        
        // create boxes/columns - run 5 times
        // create 5 boxes to each row
        for (let j = 0; j < 5; j++) {
            let box = document.createElement("div")  // creating 5 divs (columns)
            box.className = "letter-box"  // assign class name to each box
            row.appendChild(box)  // append box to the row
        }

        board.appendChild(row)  // append row to the board after each creation

    }
}
initBoard()  // call gameboard

// CHECKING FOR KEYPRESS
document.addEventListener( 'keyup', ( e ) => {   // e is the parameter
    if ( guessesRemaining === 0 ) {
        return  // immediately exit the function
    }

    let pressedKey = String(e.key)  // add pressed letter into a variable

    if ( pressedKey === "Backspace" && nextLetter !== 0 ) { // if click delete and already empty
        deleteLetter()
        return  // return will exit the function
    }

    if ( pressedKey === "Enter") {
        checkGuess()
        return
    }

    let found = pressedKey.match(/[a-z]/gi)  // add letters to a variable - validating the press key against A  - Z
   
    if( !found || found.length > 1) {    //if not found/not matched or press more than one key at the same time
        return                              // exit the function
    } else {
        insertLetter(pressedKey)
    }
})
// RUN INSERT LETTER FUNCTION
function insertLetter( pressedKey ) {
    if ( nextLetter === 5 ){
        return
    }
    pressedKey = pressedKey.toLowerCase() 

    let row = document.getElementsByClassName('letter-row')[ 6 - guessesRemaining ] // grab row and specify each row
    let box = row.children[nextLetter]

    box.textContent = pressedKey
    box.classList.add('filled-box')
    currentGuess.push(pressedKey) 
    nextLetter = nextLetter + 1          // update nextLetter counter
}

function deleteLetter ( ) {
    let row = document.getElementsByClassName('letter-row')[6-guessesRemaining] // tell us which row we are on
    let box = row.children[nextLetter-1]                                        // tell us which box to delete

    box.textContent = ''                // remove last letter from DOM
    box.classList.remove('filled-box')
    currentGuess.pop()                  // remove last letter/element from array
    nextLetter = nextLetter - 1         // update nextLetter counter
}

function checkGuess () {
    let row = document.getElementsByClassName('letter-row')[6-guessesRemaining]  // tell us which row we are on
    let guessString = ''
    let rightGuess = Array.from( rightGuessString )   // generate an array from the ACTUAL word

    for ( const val of currentGuess ) {     // for each element of the currentGuess array
        guessString = guessString + val     // add/concatenate element to guessString variable 
    }

    if (guessString.length != 5) {          // check if user word is 5 letters
        alert('Not enough letters!')
        return                              // return will exit the function
    }

    if ( !WORDS.includes(guessString) ) {   // check if the user word is in the list
        alert( 'Word not in the list')
        return
    }

    for ( let i = 0 ; i < 5 ; i++) {        // if entry is valid, apply formatting to each element
        let letterColor = ''
        let box = row.children[i]           // identify each array elemnt by index
        let letter = currentGuess[i]        // identify each array elemnt of user's guess by index 

        let letterPosition = rightGuess.indexOf( currentGuess[i] )   // identify index of the ACTUAL word from the user's guess
        if ( letterPosition === -1 ) {
            letterColor = 'lightgrey'                                     // turn grey if letter not in the word
        } else {
            if ( currentGuess[i] === rightGuess[i] ) {
                letterColor = 'lightgreen'
            } else {
                letterColor = 'lightyellow'
            }
            rightGuess[letterPosition] = "#"   // resetting letter position
        }
        // update coloring/formatting
        let delay = 250 * i   // still inside the loop - set delay for each letter

        setTimeout( () => {
            box.style.backgroundColor = letterColor
            shadeKeyboard( letter, letterColor )
        }, delay)
    }

    if ( guessString === rightGuessString ) {
        alert('You guess right!')
        guessesRemaining = 0
        return
    } else {                                        // resetting the variables to start the next guess
        guessesRemaining = guessesRemaining - 1
        currentGuess = []
        nextLetter = 0

        if ( guessesRemaining === 0 ) {
            alert("You've run out of guesses!")
            alert(`The right word was ${rightGuessString}`)
        }
    }
}
// Shade keyboard for gray, yellow, green
function shadeKeyboard ( letter, color ) {

    for ( const elem of document.getElementsByClassName('keyboard-button')) {
        if ( elem.textContent ===  letter ) {
            let oldColor = elem.style.backgroundColor
            if (oldColor === 'lightgreen') {
                return
            }

            if (oldColor === 'lightyellow' && color != 'lightgreen') {
                return
            }

            elem.style.backgroundColor = color
            break
        }
    }
}

// on screen keyboard
document.getElementById("keyboard-cont").addEventListener("click", (e) => {
    const target = e.target
    if (!target.classList.contains("keyboard-button")) {
        return
    }
    let key = target.textContent
    if (key === "Del") {
        key = "Backspace"
    } 
    document.dispatchEvent(new KeyboardEvent("keyup", {'key': key}))
})