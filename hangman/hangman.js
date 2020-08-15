'use strict';

const FS = require('fs')

class Hangman {
    #imgDir = './img/'

    #answer = ""
    #correctGuesses = ""
    #incorrectGuesses = new Array()
    
    #state = 0
    #images = new Array()

    constructor() {
        this.#init()
    }

    #init() {
        FS.readdir(this.#imgDir, (err, files) => {
            files.forEach(file => {
                console.log(file)
            })
        })
    }
}

module.exports = Hangman