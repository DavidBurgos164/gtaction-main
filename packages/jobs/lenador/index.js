const economy = require ('../../economy.js');
const db = require('../../models/index.js');
mp.events.add({
    "ropalenador" : (player) => {
        let clothes;
        if(player.sex == "male"){
            player.setClothes(4,1,3,0);//pantalones
            player.setClothes(11,234,19,0);//camisa
            player.setClothes(6,71,1,0);//zapatillas
            player.setClothes(3,0,0,0);//torso
            player.setClothes(8,15,0,0);//undershirts
            clothes = `{"mask": 0, "maskTexture": 0, "torso": 0, "Leg": 1, "LegTexture": 3, "bags": 0, "bagTexture": 0, "shoes": 71, "shoesTexture": 1, "acess": 0, "acessTexture": 0, "undershirt": 15, "undershirtTexture": 0, "armor": 0, "decals": 0, "decalsTexture": 0, "tops": 234, "topsTexture": 19}`;    
        }else{
            //mujer
            player.setClothes(4,1,8,0);//pantalones
            player.setClothes(11,244,19,0);//camisa
            player.setClothes(6,74,1,0);//zapatillas
            player.setClothes(8,8,0,0);//undershirts
            player.setClothes(3,14,0,0);//torso
            clothes = `{"mask": 0, "maskTexture": 0, "torso": 0, "Leg": 1, "LegTexture": 8, "bags": 0, "bagTexture": 0, "shoes": 74, "shoesTexture": 1, "acess": 0, "acessTexture": 0, "undershirt": 8, "undershirtTexture": 0, "armor": 0, "decals": 0, "decalsTexture": 0, "tops": 244, "topsTexture": 19}`;   
        }
        db.player_clothes.update(
            {dataJob: clothes},
            {where: {id: player.characterId}}
        ).then(() => {
            clothes = JSON.parse(clothes)
            player.setVariable("clothesJob",clothes); 
        })   
    },
    "checkskillLenadorSV": (player,tipoMineral) => {
        if(tipoMineral == "roble"){
            db.skills.findOne({
                attributes: ['lenador'],
                where:{
                    id: player.characterId,
                } 
            }).then (result => {
                if(result){
                    if(result.lenador < 2){
                        respuesta = "no"
                        player.call('checkskillLenadorCliente',[respuesta,tipoMineral]);
                    }else{
                        respuesta = "si"
                        player.call('checkskillLenadorCliente',[respuesta,tipoMineral]);
                    }
                }
            })
        }
    }
})
