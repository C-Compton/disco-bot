'use strict';

const FS = require('fs')

class Hangman {
    #imgDir = './hangman/img/'

    #answer = "Hello World"
    #correct = ""
    #incorrect = new Array()
    
    #state = 0
    #images = new Array()

    constructor() {
        this.#init()
    }
    
    get correctGuesses() {
        return this.#correct
    }

    get incorrectGuesses() {
        return this.#incorrect
    }

    set #correctGuesses(correct) {
        this.#correct = correct
    }

    set #resetCorrectGuesses(answer) {
        let replaceRegex = /[A-Za-z]/g
        this.#correct = answer.replace(replaceRegex, "-")
    }

    #init() {
        FS.readdir(this.#imgDir, (err, files) => {
            if(err) {
                onerror(err)
                return;
            }
            files.forEach(file => {
                let filePath = this.#imgDir + file
                console.log(filePath)
                this.#images.push(filePath)

            })
        })
        this.#resetCorrectGuesses = this.#answer
    }

    getImage() {
        var img = this.#images[this.#state]
        console.log(`Found image at: ${img}`)
        return img
    }

    didLose() {
        return this.#state === this.#images.length - 1
    }

    didWin() {
        return this.#answer === this.#correct
    }

    guessLetter(letter){
        console.log(`Guess: ${letter}`)
        var indices = []
        var str = this.#answer.toLowerCase()
        for(var i = 0; i < str.length; i++) {
            if(str[i] === letter.toLowerCase()){
                indices.push(i)
            }
        }
        // let charIndex = this.#answer.toLowerCase().indexOf(letter.toLowerCase())

        if( indices.length > 0) {
            console.log(`Found at index: ${indices.toString()}`)
            let result = this.#correct
            var start = 0
            indices.forEach (i => {
                result = result.substring(start, i).concat(
                this.#answer.charAt(i),
                result.substring(i + 1))
            })
            // let preCharString = this.#correct.substring(0, charIndex)
            // let answerChar = this.#answer.charAt(charIndex)
            // let postCharString = this.#correct.substring(charIndex + 1)
            console.log(`Result: ${result}`)
            this.#correctGuesses = result //preCharString.concat(answerChar,postCharString)
        } else {
            this.#incorrect.push(letter)
            this.#state += 1
        }
    }
}

module.exports = Hangman