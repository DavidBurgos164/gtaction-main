const db = require('../models/index.js');
mp.events.add({
    'mensajeOK': (player,mensaje) => {
        mp.chat.success(player, `${mensaje}`);
    },
    'animLenador': (player, tog) => {
        tog ? player.setVariable('animLenador', true) : player.setVariable('animLenador', null);
    },
    'animMinero': (player,tog) => {
        tog ? player.setVariable('animMinero', true) : player.setVariable('animMinero', null);
    },
/*     'checkElectricista' : (player) => {
       console.log("llama electricista");
       player.call('llamaInterfazElec');
    }, */
     'checkExpJob' : (player,tipoJob) => {
        if(tipoJob == "electricista"){
            db.skills.findOne({
                attributes: ['hacker','exphacker'],
                where:{
                    id: player.characterId,
                } 
            }).then (result => {
                if(result){
                    player.call('llamaInterfazElec',[result.hacker,result.exphacker]);
                }
            })
        }else if(tipoJob == "minero"){
            db.skills.findOne({
                attributes: ['minero','expminero'],
                where:{
                    id: player.characterId,
                } 
            }).then (result => {
                if(result){
                    player.call('llamaInterfazMinero',[result.minero,result.expminero]);
                }
            })
        }else if(tipoJob == "lenador"){
            db.skills.findOne({
                attributes: ['lenador','explenador'],
                where:{
                    id: player.characterId,
                } 
            }).then (result => {
                if(result){
                    player.call('llamaInterfazLenador',[result.lenador,result.explenador]);
                }
            })
        }else if(tipoJob == "bus"){
            db.skills.findOne({
                attributes: ['expertocoches','expexpertocoches'],
                where:{
                    id: player.characterId,
                } 
            }).then (result => {
                if(result){
                    player.call('llamaInterfazBus',[result.expertocoches,result.expexpertocoches]);
                }
            })
        }else if(tipoJob == "basurero"){
            db.skills.findOne({
                attributes: ['quimico','expquimico'],
                where:{
                    id: player.characterId,
                } 
            }).then (result => {
                if(result){
                    player.call('llamaInterfazBasurero',[result.quimico,result.expquimico]);
                }
            })
        }

       
    } 
})