import { splitBar } from 'string-progressbar';


const getLastMessage = async (channel) => {
    const messages = await channel.messages.fetch({limit: 1})
    const lastMessage = messages.first()
    return lastMessage
}

export class BarLakBot{
    meta;
    current;
    routes;
    barChannel;
    ranking;
    dbChannel;

    constructor(guild){
        this.meta = 0;
        this.current = 0;
        this.ranking = {};
        this.routes = [
            ["meta", this.onMetaMessage],
            ["barra", this.onBarraMessage],
            ["set", this.onSetMessage],
            ["doado", this.onAddMessage],
            ["withdraw", this.onWithdrawMessage],
            ["reset", this.onResetMessage],
            ["setBarChannel", this.onSetBarChannelMessage],
        ]
        this.guild = guild
        this.readDb()
    }

    hasPermission = (message) => {
        const consul = message.guild.roles.cache.find(role => role.name === "Cônsules")
        const gov = message.guild.roles.cache.find(role => role.name === "Governador")
        console.log(gov)
        if (message.member.roles.cache.has(consul.id) || message.member.roles.cache.has(gov.id)){
            return true
        }else{
            message.channel.send("Você não possui a permissão de Cônsule ou Governador.")
        }
        return false
    }

    routeMessage(message) {
        const match = message.content.match("^\\!\\b(?<command>\\w+)\\b(?:\\s+(?<args>.*)?$|$)")
        if (match) {
            console.log(message.content)
            const route = this.routes.find((route) => {
                return route[0] === match.groups.command
            })

            if (route != null) {
                route[1](message, match.groups.args)
            }
            this.saveDb()
        }
    }

    writeRanking = () => {
        let ranking = "Ranking de Doadores!!"
        if (!this.ranking) {
            return
        }
        ranking += "\n-----------------------------\n"
        Object.entries(this.ranking).map(entry => {
            console.log(entry[0])
            ranking += `${entry[0]} ------- ${entry[1]}\n`
        })
            
        ranking += "\n-----------------------------\n"
        return ranking
    }

    writeBar = (channel) => {
        getLastMessage(channel).then((lastMessage) => {
            let msg = this.writeRanking()
            if (!this.meta) {
                channel.send(`Defina o valor da meta a ser atingida (!ajuda para ver os comandos)`);
    
            } else {
                const split = splitBar(this.meta, this.current);
                var ajuste = + split[1]
                if (+ split[1] < 100){
                msg += (`\nMeta da Tesouraria = ${String (this.meta)} Gold  :coin:  \nValor Atual = ${String (this.current)} Gold  :coin: \n\n ${"[" + split[0] + "] [" + ajuste.toFixed(2) + "%]"}\n`);
                console.log ('\nMeta da Tesouraria = ', this.max,'Gold');
                console.log ('Valor Atual =', this.current,'Gold\n');
                console.log("[" + split[0] + "] [" + split[1] + "%]\n");
                }
                if (+ split[1] >= 100)
                {
                msg += (`\nMeta da Tesouraria = ${String (this.meta)} Gold  :coin:  \nValor Atual = ${String (this.current)} Gold  :coin: \n\n ${"[" + split[0] + "] [" + ajuste.toFixed(2) + "%]"} :fire: \n`);
                console.log ('\nMeta da Tesouraria = ', this.meta,'Gold');
                console.log ('Valor Atual =', this.current,'Gold\n');
                console.log("[" + split[0] + "] [" + split[1] + "%]\n");
                msg += (`\n:partying_face: ** Parabéns pessoal, atingimos a meta para pagar os impostos**  :partying_face: `)
                }
                if (lastMessage) {
                    lastMessage.edit(msg)
                }else {
                    channel.send(msg)
                }
            }
        })
    }

    onMetaMessage = (message, args) => {
        if (!this.hasPermission(message)) return
        if (!args) {
            message.channel.send("Você deve definir um valor para a meta.");
            return
        }
        args = args.split(" ")
        const newMeta = parseFloat(args[0])
        if (!isNaN(newMeta)) {
            this.meta = newMeta;
            message.channel.send(`Valor da meta definido para ${newMeta}`);
        }else{
            message.channel.send(`O valor "${args[0]}" não é um número válido.`);
        }
        this.writeBar(this.barChannel)
    }

    onBarraMessage = (message, args) => {
        this.writeBar(this.barChannel)
    }

    onSetMessage = (message, args) => {
        if (!this.hasPermission(message)) return
        if (!args) {
            message.channel.send("Você deve definir um valor para a meta.");
            return
        }
        args = args.split(" ")
        const newCurrent = parseFloat(args[0])
        if (!isNaN(newCurrent)){
            this.current = newCurrent
            this.writeBar(this.barChannel)
        }else{
            message.channel.send(`O valor "${args[0]}" não é um número válido.`);
        }
    }

    onAddMessage = (message, args) => {
        if (!args) {
            message.channel.send("Você deve definir um valor para a meta.");
            return
        }
        args = args.split(" ")
        const val = parseFloat(args[0])
        if (!isNaN(val)){
            this.current += val
            if (!(message.author.username in this.ranking)) {
                this.ranking[message.author.username] = 0
            }
            this.ranking[message.author.username] += val
            this.writeBar(this.barChannel)
        }else{
            message.channel.send(`O valor "${args[0]}" não é um número válido.`);
        }
    }

    onWithdrawMessage = (message, args) => {
        if (!args) {
            message.channel.send("Você deve definir um valor para a meta.");
            return
        }
        args = args.split(" ")
        const val = parseFloat(args[0])
        if (!isNaN(val)) {
            this.current -= val
            if (this.current < 0) this.current = 0
            this.writeBar(this.barChannel)
        }
    }

    onResetMessage = (message, args) => {
        this.current = 0
        this.meta = 0
        this.writeBar(this.barChannel)
    }

    onSetBarChannelMessage = (message, args) => {
        this.barChannel = message.channel
        message.channel.send("Este canal foi configurado como o novo canal para visualização")
    }

    saveDb = () => {
        const obj = {
            "meta": this.meta, "current": this.current, "ranking": this.ranking,
            "barChannel": this.barChannel.id
        }
        if (this.dbChannel) {
            this.dbChannel.messages.fetch({limit: 1}).then(messages => {
                const latestMessage = messages.first()
                if (!latestMessage) {
                    this.dbChannel.send(JSON.stringify(obj))
                }else{
                    latestMessage.edit(JSON.stringify(obj))
                }
            })
            
        }
        
    }

    readDb = () => {
        if (this.guild){
            this.guild.fetch().then(guild => {
                guild.channels.fetch().then((channels) => {
                    const dbChannel = channels.find((ch) => ch.name === "bot_db")
                    if (dbChannel) {
                        dbChannel.fetch().then(channel => {
                            this.dbChannel = channel
                            channel.messages.fetch({limit: 1}).then(messages => {
                                const latestMessage = messages.first()

                                if (latestMessage) {
                                    const obj = JSON.parse(latestMessage.content)
                                    this.meta = obj.meta
                                    this.current = obj.current
                                    this.ranking = obj.ranking
                                    this.barChannel = guild.channels.cache.get(obj.barChannel)
                                }
                            })
                        })
                    }

                    if (!this.barChannel) {
                        this.barChannel = guild.channels.cache.first().children.first()
                    }
                });
            })
        }
    }
}
