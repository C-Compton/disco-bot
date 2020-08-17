require('dotenv').config()
const Hangman = require('./hangman/hangman')
const Discord = require('discord.js')
const { isNull } = require('util')
const client = new Discord.Client()
var hangmanGame = null

const alien = './img/alien.png'
const saw = './img/saw.png'
const hal = './img/hal-9000.png'

client.on('ready', () => {
    console.log("Connected as " + client.user.tag)
})

client.on('disconnect', () => {
    console.log(client.user.tag + " DISCONNECTED")
})

client.on('message', (received) => {
    if(received.author.id === client.user.id ){
        return
    }

    if(received.mentions.has(client.user)) {
        received.channel.send(`What's up, ${received.author.toString()}? 
        Type '>help' for a list of commands.
        Type '>help [command]' for detailed help on available commands.`)
    }

    if(received.content.startsWith(">")) {
        parseArgs(received)
    }

    if(received.content.length === 1 && hangmanGame !== null) {
        processHangmanGuess(received)
    }

})

function parseArgs(received) {
    let args = received.content.split(" ")
    let primaryCmd = args.shift().slice(1).trim()
    
    processCommand(primaryCmd, args, received)
}

function processCommand(cmd, args, received) {
    
    switch(cmd) {
        case 'help':
            helpCommand(cmd, args, received)
            break
        case 'flip':
            flipCommand(cmd, args, received)
            break
        case 'roll':
            rollCommand(cmd, args, received)
            break
        case 'hangman':
            if(hangmanGame === null) {
                startHangman(received)
            } else {
                received.channel.send(`We're already playing a game.`)
            }
            break
        case 'delete':
            deleteCommand(cmd, args, received)
            break
        default:
            received.channel.send(`I'm sorry. I don't know that command. 
            Enter '>help' for a list of my commands.
            Enter '>help [command]' for help with a specific command.`)
    }
}

function flipCommand(cmd, args, received) {
    if (args == 'help') {
        received.channel.send(">" + cmd + " : flips a 2-sided coin.")
        return
    } else {
        let result = randInt(0, 1)
        received.channel.send(received.author.toString() + " flipped " + (result == 0 ? "Heads" : "Tails"))
    }
}

function rollCommand(cmd, args, received) {
    const testRe = /\d{1,2}d\d{1,3}/
    const re = /\d+/g
    const dice = args[0]
    if (args == 'help') {
        received.channel.send(`Rolls a number of N-sided dice
        Example: '>${cmd} 2d6' will roll two 6-sided dice. `)
    } else if (testRe.test(dice) ) {
        const matches = dice.match(re)
        const numDice = matches[0]
        const die = matches[1]
        var result = new Array()
        for (let index = 0; index < numDice; index++) {
            result.push(randInt(1, die))
        }
        received.channel.send(`${received.author.toString()} rolled ${dice}
        ${result.sort((a,b) => {return a - b}).join(', ')}`)
    } else {
        received.channel.send(`I'm sorry, ${received.author.toString()}, I can't roll ${args}`)
    }
}

function helpCommand(cmd, args, received) {
    if (args.length > 0) {
        processCommand(args[0], cmd, received)
    } else {
        received.channel.send(`To enter a command, enter '>' followed by a command and relevant arguments.
        Enter '>help [command]' for help with a specific command. 
        Available commands are : 
        flip
        help
        roll`)
    }
}

function deleteCommand(cmd, args, received) {
    if(received.author.id === process.env.MY_ID) {
        let fetched
        async function clear() {
            do {
            fetched = await received.channel.messages.fetch({limit: 99}).catch(console.error)
            received.channel.bulkDelete(fetched).catch(console.error)
            } while(fetched.size >= 2)
        }

        async function clearAttach() {
            do {
                fetched = await received.channel.messages.fetch({limit: 99})
                .then(m => {
                    return m.filter(m => m.attachments.size > 0)
                })
                .then(m => {
                    received.channel.bulkDelete(m).catch(console.error)
                    return m
                })
                .catch(console.error)
            } while (fetched.size >= 2)
        }

        if (args.length > 0) {
            switch(args[0]) {
                case 'attachment':
                    clearAttach()                
                break
                default:
                    console.log(`Unknown arg to delete cmd`)
            }
        } else {
            
                clear()
        }
    } else {
        received.channel.send(`Sorry, Dave. I can't let you do that.`)
        .catch(console.error)
    }
}

function startHangman(received) {
    received.channel.send(`Let's play a game. 
If you can guess the correct word, you'll survive...`)
    .then(p => hangmanGame = new Hangman)
    .then(p => {
        received.channel.send(`Here is your first word...
        ${hangmanGame.getCorrectGuesses()}`,{
            files: [{
                attachment: './hangman/img/hangman01.png',
                name: 'hangman.png'
                }]
            })
        .catch(console.error)
    })
    .catch(console.error)                
}

function processHangmanGuess(received) {
    hangmanGame.guessLetter(received.content)
    
    received.channel.send(`    
    ${hangmanGame.getCorrectGuesses()}
    
    ${hangmanGame.getIncorrectGuesses().sort().join(', ')}`,{
    files: [{
        attachment: hangmanGame.getImage(),
        name: 'hangman.png'
        }]
    })
    .then(p => {
        if(hangmanGame.didLose() === true){
            received.channel.send(`Oh my! ${received.author.toString()} lost!
            The answer is : ${hangmanGame.getAnswer()}`)
            .then(p => {
                hangmanGame = null
            })
        } else if (hangmanGame.didWin() === true) {
            received.channel.send(`Yay! ${received.author.toString()} won!`)
            .then(p => {
                hangmanGame = null
            })
        }
    })
    .catch(console.error)
}

function randInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min
}

client.login(process.env.TOKEN)