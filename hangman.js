var inquirer = require('inquirer')
var isLetter = require('is-letter')

var Word = require('./word.js')
var Game = require('./game.js')

var hangManDisplay = Game.newWord.hangman

var wordBank = Game.newWord.wordList
var guessesRemaining = 10
var guessedLetters = []
var display = 0
var currentWord

startGame()

function startGame() {
    console.log('---------------------------------------------------------')
    console.log('')
    console.log('Lord Of The Rings Constructor Hangman!')
    console.log('')
    console.log('---------------------------------------------------------')

    // clears guessedLetters before a new game starts if it's not already empty.
    if (guessedLetters.length > 0) {
        guessedLetters = []
    }

    inquirer.prompt([
        {
            name: 'play',
            type: 'confirm',
            message: 'Are You Ready To Play?'
        }
    ]).then(function (answer) {
        if (answer.play) {
            console.log('')            
            console.log('You Have 10 guesses To Guess The Right Lord Of The Rings Character.')
            console.log('Best Of Luck To You Mate! :) ')
            newGame()
        } else {
            console.log('Good Then Leave You Inferior Weakling :) ')
        }
    })
}

function newGame() {
    if (guessesRemaining === 10) {
        console.log('---------------------------------------------------------')

        // generates random number based on the wordBank
        var randNum = Math.floor(Math.random() * wordBank.length)
        currentWord = new Word(wordBank[randNum])
        currentWord.getLetters()

        // displays current word as blanks.
        console.log('')
        console.log(currentWord.wordRender())
        console.log('')
        promptUser()
    } else {
        resetGuessesRemaining()
        newGame()
    }
}

function resetGuessesRemaining() {
    guessesRemaining = 10
}

function promptUser() {
    inquirer.prompt([
        {
            name: 'chosenLetter',
            type: 'input',
            message: 'Choose a letter',
            validate: function(value) {
                if (isLetter(value)) {
                    return true
                } else {
                    return false
                }
            }
        }
    ]).then(function(ltr) {

        // turn letter into uppper case and store in variable
        var letterReturned = (ltr.chosenLetter).toUpperCase()

        // check to see if you guessed that letter already and set flag to false
        var guessedAlready = false
        for (var i = 0; i < guessedLetters.length; i++) {
            if(letterReturned === guessedLetters[i]) {
                guessedAlready = true
            }
        }

        if (guessedAlready === false) {
            // push letter into array
            guessedLetters.push(letterReturned)

            // variable to check if letter was in the word
            var found = currentWord.checkIfLetterFound(letterReturned)

            if (found === 0) {
                console.log('Sorry Mate Wrong Guess :) ')

                guessesRemaining--

                // counter for hangman display
                display++

                console.log('Guesses reamaining: ' + guessesRemaining)
                console.log(hangManDisplay[display - 1]) // prints the hangman display

                console.log('---------------------------------------------------------')
                console.log('')
                console.log(currentWord.wordRender())
                console.log('')
                console.log('---------------------------------------------------------')
                console.log('Letters guessed: ' + guessedLetters)
            } else {
                console.log('Yes! You are correct!!')

                if (currentWord.checkWord() === true) {
                    console.log('')
                    console.log(currentWord.wordRender())
                    console.log('')
                    console.log('----- Congrats Mate YOU WIN -----')
                    startGame()
                } else {
                    console.log('These Are Your Guesses Remaining Mate: ' + guessesRemaining)
                    console.log('')
                    console.log(currentWord.wordRender())
                    console.log('')
                    console.log('---------------------------------------------------------')
                    console.log('Letters YOU Have Already Guessed: ' + guessedLetters)
                }
            }

            // if guessesRemaining and the current word isn't found prompt the user
            if (guessesRemaining > 0 && currentWord.wordFound === false) {
                promptUser();
            } else if (guessesRemaining === 0) { // if you don't have any guesses left and haven't found the word you lose
                console.log('')                
                console.log('----- Sorry But The Game Is Over -----')
                console.log('')
                console.log('The Word You Failed To Guess Was: ' + currentWord.word)
                console.log('')                
            }
        } else { // prompts the user that they guessed that letter already
            console.log('Come On Man You"ve Guessed That Letter Already, Give It Another Whirl :).')
            promptUser();
        }
    })
}
