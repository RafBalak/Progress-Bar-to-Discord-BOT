
import discord from 'discord.js';
const { Discord } = discord;
import { config } from "dotenv";
import { Client, Intents } from 'discord.js';
import { splitBar } from 'string-progressbar';
import { BarLakBot } from "./message_routes.js";

config()

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const token = process.env.DISCORD_TOKEN;
client.login(token)
const max = 0;
const current = 0;
const bot = new BarLakBot();
client.on('message', message => {
      
      bot.routeMessage(message)
       
//       if (message.content.toLowerCase().startsWith('!meta')) {
//         const args = message.content.split(/ +/).slice(1);
//         console.log(args); 
//         console.log(args[0]);
//         max = +args[0];
//         message.channel.send(`Valor da meta definido para ${max}`);
//        }
//      if (message.content.toLowerCase().startsWith('!atual')) {
//         const args = message.content.split(/ +/).slice(1);
//         console.log(args); 
//         console.log(args[0]);
//         current = +args[0];
//         message.channel.send(`Valor atual definido para ${current}`);
//        }
//        if (message.content === '!ajuda' ) {
    
//         message.channel.send(`Comandos:\n-!barra -> Exibe a meta, o valor atual e a barra de progresso da tesouraria\n-!meta-> Usuário insere a meta de gold a ser alcançada ex: !meta 3000\n-!atual-> Usuário insere o valor de gold atual ex: !atual 1500\n`);
//        }

// 	 if (message.content === '!barra' ) {
//      console.log(max);
//        if (!max) {
//         message.channel.send(`Defina o valor da meta a ser atingida (!ajuda para ver os comandos)`);
//        }
//        else {
//          var meta = max;
//          var atual = current;
//          const split = splitBar(meta, atual);
//          var ajuste = + split[1]
//          if (+ split[1] < 100){
//          message.channel.send(`\nMeta da Tesouraria = ${String (max)} Gold  :coin:  \nValor Atual = ${String (current)} Gold  :coin: \n\n ${"[" + split[0] + "] [" + ajuste.toFixed(2) + "%]"}\n`);
//          console.log ('\nMeta da Tesouraria = ', max,'Gold');
//          console.log ('Valor Atual =', current,'Gold\n');
//          console.log("[" + split[0] + "] [" + split[1] + "%]\n");
//          }
//          if (+ split[1] > 100)
//          {
//           message.channel.send(`\nMeta da Tesouraria = ${String (max)} Gold  :coin:  \nValor Atual = ${String (current)} Gold  :coin: \n\n ${"[" + split[0] + "] [" + ajuste.toFixed(2) + "%]"} :fire: \n`);
//           console.log ('\nMeta da Tesouraria = ', max,'Gold');
//           console.log ('Valor Atual =', current,'Gold\n');
//           console.log("[" + split[0] + "] [" + split[1] + "%]\n");
//           message.channel.send(`\n:partying_face: ** Parabéns pessoal, atingimos a meta para pagar os impostos**  :partying_face: `)
//          }
//            }
//    }
  

});


