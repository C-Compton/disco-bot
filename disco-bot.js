const dotenv = require('dotenv')
if(dotenv.error) {
    console.log(dotenv.error)
}
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
        received.channel.send("What's up, " + received.author.toString() + "? Type '!help' for a list of commands. Type '!help [command] for detailed help on available commands.")
    }

    if(received.content.startsWith("!")) {
        parseArgs(received)
    }

})

function parseArgs(received) {
    let splitCmd = received.content.split(" ")
    let primaryCmd = splitCmd[0].trim()
    let args = splitCmd.slice(1)

    processCommand(primaryCmd, args, received)
}

function processCommand(cmd, args, received) {
    cmd = cmd.substr(1)
    switch(cmd) {
        case 'help':
            helpCommand(cmd, args, received)
            break
        case 'flip':
            flipCommand(cmd, args, received)
            break
        default:
            received.channel.send("I'm sorry. I don't know that command. Enter '!help' for a list of my commands.")
    }
}

function flipCommand(cmd, args, received) {
    console.log("flipCommand -- cmd: " + cmd + " -- args: " + args)
    if (args == 'help') {
        received.channel.send("!" + cmd + " : flips a 2-sided coin.")
        return
    } else {
        let result = randInt(0, 1)
        received.channel.send(received.author.toString() + " flipped " + (result == 0 ? "Heads" : "Tails"))
    }
}

function helpCommand(cmd, args, received) {
    console.log("helpCommand -- cmd: " + cmd + " -- args: " + args)
    if (args.length > 0) {
        processCommand(args[0], cmd, received)
    } else {
        received.channel.send("Available commands are : !flip, !roll")
    }
}

function randInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min
}

client.login(process.env.TOKEN)