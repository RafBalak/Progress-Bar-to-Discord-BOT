import { splitBar } from 'string-progressbar';

export class BarLakBot{
    meta;
    current;
    routes;
    barChannel;

    constructor(){
        this.meta = 0;
        this.current = 0;
        this.routes = [
            ["meta", this.onMetaMessage],
            ["barra", this.onBarraMessage],
            ["set", this.onSetMessage],
            ["add", this.onAddMessage],
            ["withdraw", this.onWithdrawMessage],
            ["reset", this.onResetMessage],
            ["setBarChannel", this.onSetBarChannelMessage],
        ]
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
        }
    }


    writeBar = (channel) => {
       if (!this.meta) {
            channel.send(`Defina o valor da meta a ser atingida (!ajuda para ver os comandos)`);
       } else {
         const split = splitBar(this.meta, this.current);
         var ajuste = + split[1]
         if (+ split[1] < 100){
         channel.send(`\nMeta da Tesouraria = ${String (this.meta)} Gold  :coin:  \nValor Atual = ${String (this.current)} Gold  :coin: \n\n ${"[" + split[0] + "] [" + ajuste.toFixed(2) + "%]"}\n`);
         console.log ('\nMeta da Tesouraria = ', this.max,'Gold');
         console.log ('Valor Atual =', this.current,'Gold\n');
         console.log("[" + split[0] + "] [" + split[1] + "%]\n");
         }
         if (+ split[1] >= 100)
         {
          channel.send(`\nMeta da Tesouraria = ${String (this.meta)} Gold  :coin:  \nValor Atual = ${String (this.current)} Gold  :coin: \n\n ${"[" + split[0] + "] [" + ajuste.toFixed(2) + "%]"} :fire: \n`);
          console.log ('\nMeta da Tesouraria = ', this.meta,'Gold');
          console.log ('Valor Atual =', this.current,'Gold\n');
          console.log("[" + split[0] + "] [" + split[1] + "%]\n");
          channel.send(`\n:partying_face: ** Parabéns pessoal, atingimos a meta para pagar os impostos**  :partying_face: `)
         }
           }
    }

    onMetaMessage = (message, args) => {
        args = args.split(" ")
        const newMeta = parseFloat(args[0])
        if (!isNaN(newMeta)) {
            this.meta = newMeta;
            message.channel.send(`Valor da meta definido para ${newMeta}`);
        }else{
            message.channel.send(`O valor "${args[0]}" não é um número válido.`);
        }
        this.writeBar(message.channel)
    }

    onBarraMessage = (message, args) => {
        this.writeBar(message.channel)
    }

    onSetMessage = (message, args) => {
        args = args.split(" ")
        const newCurrent = parseFloat(args[0])
        if (!isNaN(newCurrent)){
            this.current = newCurrent
            this.writeBar(message.channel)
        }else{
            message.channel.send(`O valor "${args[0]}" não é um número válido.`);
        }

    }

    onAddMessage = (message, args) => {
        args = args.split(" ")
        const val = parseFloat(args[0])
        if (!isNaN(val)){
            this.current += val
            this.writeBar(message.channel)
        }else{
            message.channel.send(`O valor "${args[0]}" não é um número válido.`);
        }
    }

    onWithdrawMessage = (message, args) => {
        args = args.split(" ")
        const val = parseFloat(args[0])
        if (!isNaN(val)) {
            this.current -= val
            if (this.current < 0) this.current = 0
            this.writeBar(message.channel)
        }
    }

    onResetMessage = (message, args) => {
        this.current = 0
        this.meta = 0
        this.writeBar(message.channel)
    }

    onSetBarChannelMessage = (message, args) => {
        this.barChannel = message.channel
        message.channel.send("Este canal foi configurado como o novo canal para visualização")
    }

}
