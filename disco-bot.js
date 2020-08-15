require('dotenv').config()
const Discord = require('discord.js')
const client = new Discord.Client()

client.on('ready', () => {
    console.log("Connected as " + client.user.tag)
})

client.on('disconnect', () => {
    console.log(client.user.tag + " DISCONNECTED")
})

client.on('message', (received) => {
    if(received.author == client.user ){
        return
    }

    if(received.mentions.has(client.user)) {
        received.channel.send(`What's up, ${received.author.toString()}? 
        Type '>help' for a list of commands.
        Type '>help [command] for detailed help on available commands.`)
    }

    if(received.content.startsWith(">")) {
        parseArgs(received)
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
        default:
            received.channel.send("I'm sorry. I don't know that command. Enter '>help' for a list of my commands.")
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
        received.channel.send(">" + cmd + " xdy : rolls x y-sided dice. e.g roll 2d6")
    } else if (testRe.test(dice) ) {
        const matches = dice.match(re)
        const numDice = matches[0]
        const die = matches[1]
        var result = new Array()
        for (let index = 0; index < numDice; index++) {
            result.push(randInt(1, die))
        }
        
        received.channel.send(received.author.toString() + " rolled " + args + " and got " + result.sort((a,b) => {return a - b}).join(', '))
    } else {
        received.channel.send("I'm sorry, " + received.author.toString() + ", I can't roll " + args)
    }
}

function helpCommand(cmd, args, received) {
    if (args.length > 0) {
        processCommand(args[0], cmd, received)
    } else {
        received.channel.send(`To enter a command, enter '>' followed by a command and relevant arguments. 
        Available commands are : 
        flip
        help
        roll`)
    }
}

function randInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min
}

client.login(process.env.TOKEN)