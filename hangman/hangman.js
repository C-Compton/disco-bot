'use strict';

const FS = require('fs')
var rw = require('random-words')

class Hangman {

    constructor() {
        this.answer = ""
        this.correct = ""
        this.imgDir = './hangman/img/'
        this.images = new Array()
        this.incorrect = new Array()
        this.state = 0
        this.init()
    }

    init() {
        FS.readdir(this.imgDir, (err, files) => {
            if(err) {
                onerror(err)
                return;
            }
            files.forEach(file => {
                let filePath = this.imgDir + file
                this.images.push(filePath)

            })
        })
        let randWord = rw()
        this.setSolution(randWord)
        console.log(`Answer: ${this.answer}`)
        this.resetCorrectGuesses(this.answer)
    }

    getAnswer() {
        return this.answer
    }
    
    setSolution(str) {
        this.answer = str
    }

    resetCorrectGuesses(str) {
        let replaceRegex = /[A-Za-z]/g
        this.correct = str.replace(replaceRegex, "-")
    }
    
    setCorrectGuesses(str) {
        this.correct = str
    }

    getCorrectGuesses() {
        return this.correct
    }

    getIncorrectGuesses() {
        return this.incorrect
    }

    getImage() {
        var img = this.images[this.state]
        return img
    }

    didLose() {
        return this.state === this.images.length - 1
    }

    didWin() {
        return this.answer === this.correct
    }

    guessLetter(letter){
        var indices = []
        var str = this.answer.toLowerCase()
        for(var i = 0; i < str.length; i++) {
            if(str[i] === letter.toLowerCase()){
                indices.push(i)
            }
        }
        
        if( indices.length > 0) {
            let result = this.correct
            var start = 0
            indices.forEach (i => {
                result = result.substring(start, i).concat(
                this.answer.charAt(i),
                result.substring(i + 1))
            })
            this.setCorrectGuesses(result)
        } else {
            this.incorrect.push(letter)
            this.state += 1
        }
    }
}

module.exports = Hangman