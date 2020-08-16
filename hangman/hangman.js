'use strict';

const FS = require('fs')
var rw = require('random-words')

class Hangman {
    #imgDir = './hangman/img/'

    #answer
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

    set #solution(str) {
        this.#answer = str
    }

    set #correctGuesses(correct) {
        this.#correct = correct
    }

    set #resetCorrectGuesses(str) {
        let replaceRegex = /[A-Za-z]/g
        this.#correct = str.replace(replaceRegex, "-")
    }

    #init() {
        FS.readdir(this.#imgDir, (err, files) => {
            if(err) {
                onerror(err)
                return;
            }
            files.forEach(file => {
                let filePath = this.#imgDir + file
                this.#images.push(filePath)

            })
        })
        let randWord = rw()
        this.#solution = randWord
        console.log(`Answer: ${this.#answer}`)
        this.#resetCorrectGuesses = this.#answer
    }

    getImage() {
        var img = this.#images[this.#state]
        return img
    }

    didLose() {
        return this.#state === this.#images.length - 1
    }

    didWin() {
        return this.#answer === this.#correct
    }

    guessLetter(letter){
        var indices = []
        var str = this.#answer.toLowerCase()
        for(var i = 0; i < str.length; i++) {
            if(str[i] === letter.toLowerCase()){
                indices.push(i)
            }
        }
        
        if( indices.length > 0) {
            let result = this.#correct
            var start = 0
            indices.forEach (i => {
                result = result.substring(start, i).concat(
                this.#answer.charAt(i),
                result.substring(i + 1))
            })
            this.#correctGuesses = result
        } else {
            this.#incorrect.push(letter)
            this.#state += 1
        }
    }
}

module.exports = Hangman