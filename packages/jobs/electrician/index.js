//const  economy = import ('../economy.js');
const economy = require ('../../economy.js');
const db = require('../../models/index.js');
//let CONFIG = require('../electrician/CONFIG.js').CONFIG;

mp.events.add({
    'vehjob': (player, vehicle) => {
        let vehheadingtier0 = 66.1885;
        var veh = mp.vehicles.new(mp.joaat(vehicle), player.position, {
            dimension: player.dimension,
            numberPlate: `null`,
            heading: vehheadingtier0
        });
        console.log(`${player.characterId} crea un vehiculo en electricista`); //no borrar
        veh.locked = false;
        player.putIntoVehicle(veh, 0);
        let colourOne = Math.floor(Math.random() * 160); 
        let colourTwo = Math.floor(Math.random() * 160); 
        
        const vehicleName = vehicle;

        db.vehicles.create({
            vid: 20,
            uuvid: 20,
            vehicleModel: vehicle,
            vehicleModelName: vehicleName == null ? 'Vehicle' : vehicleName,
            position: JSON.stringify(veh.position),
            OwnerId: player.characterId,
            numberPlate: "null",
            tyreStatus: '[]',
            locked: 1,
            dirtLevel: 0,
            data: `{"fuelLevel": 100, "Health": 100, "DistanceKm": 0}`,
            parked: 0,
            parkedArea: 0,
            insurance: 0,
            spawned: 1,
            lastActive: mp.core.getUnixTimestamp(),
            heading: vehheadingtier0,
            isjob: 1,
        }).then((car) => {
            veh.setVariable('sqlID', car.id);
            veh.setVariable('vehData', `{"fuelLevel": 75, "Health": 100, "DistanceKm": 0}`);
            var numPlate = `${mp.core.generateString(2).toUpperCase()}${car.id}`;
            veh.numberPlate = numPlate;
            let job = true ;
            mp.events.call('vehicle:setMods', player, veh, job);
            //veh.setColor(parseInt(colourOne), parseInt(colourTwo));
            db.vehicles.update({
                numberPlate: numPlate
            }, { where: { id: car.id } }).then(() => { mp.log(`${player.characterName} esta trabajando de electricista`)})
        })
    },
    'borrarveh' : (player, id) => {     
        if (id == null) {
            if (player.vehicle && player.vehicle.getVariable('sqlID')) {
                id = player.vehicle.getVariable('sqlID')
            }
            else if (!player.vehicle) {
                return mp.chat.info(player, `No se encuentra en un vehiculo, por favor, suba a su vehiculo de trabajo`);
            }
        }
        let ownerId, isJob;
        // Realizar la consulta a la base de datos
        const { vehicles } = require('../../models/index.js');
        vehicles.findOne({
            attributes: ['OwnerId', 'isjob'], // Especificar las columnas que deseas obtener
            where: {
            id: id,
            },
        })
            .then(result => {
            if (result) {
                ownerId = result.OwnerId;
                isJob = result.isjob;
                if (ownerId == player.characterId && isJob == 1) {    
                    let vehborrar = player.vehicle;
                    vehicles.destroy({ where: { id: id } }).then(() => {
                        if(vehborrar){
                            vehborrar.destroy();
                        }
                    });
                }else{
                    mp.chat.info(player,`No puedes entregar este vehiculo`);
                }
            } 
            })        
    return
        
    },
    "pagar" : (player,tier) => {
        let tierLevel = tier;
        let expganada = economy.expelectricista[tierLevel];
       
        db.skills.increment(
            { exphacker: expganada },
            { where: { id: player.characterId } }
        )
        let dineropagar = player.cashAmount + economy.electricista[tierLevel] ;
        db.characters.update(
            {cashAmount: dineropagar},
            {where: {id: player.characterId}}
        )
        mp.chat.info(player,`Buen trabajo aqui tienes tu parte: ${economy.electricista[tierLevel]}$, ademas has ganado ${expganada} de experiencia.`);
        player.setVariable('cashValue', dineropagar);
        console.log(`El jugador ${player.characterId} ha cobrado ${economy.electricista[tierLevel]} y ahora tiene en la mano ${dineropagar}`)

    },
    "pagarT2" : (player,tier) => {
        let tierLevel = tier;
        let expganada = economy.expelectricista[tierLevel];
       
        db.skills.increment(
            { exphacker: expganada },
            { where: { id: player.characterId } }
        )
        let dineropagar = player.cashAmount + economy.electricista[tierLevel] ;
        db.characters.update(
            {cashAmount: dineropagar},
            {where: {id: player.characterId}}
        )
        mp.chat.info(player,`Buen trabajo aqui tienes tu parte: ${economy.electricista[tierLevel]}$, ademas has ganado ${expganada}.`);
        player.setVariable('cashValue', dineropagar);
        console.log(`El jugador ${player.characterId} ha cobrado ${economy.electricista[tierLevel]} y ahora tiene en la mano ${dineropagar}`)

    },
    "stop_work" : (player) => {
        db.vehicles.destroy({
            where: {
              ownerId: player.characterId,
              isjob: 1
            }
          })
    },
    "borrarvehmundo" : (player,work_van) => {
        if(work_van && work_van.destroy){
            work_van.destroy();
        }
    },
    "ropaelect" : (player) => {
        if(player.sex == "male"){
            player.setClothes(4,98,16,0);//pantalones
            player.setClothes(11,251,16,0);//camisa
            player.setClothes(6,71,16,0);//zapatillas
            player.setClothes(3,0,0,0);//torso
            player.setClothes(8,15,0,0);//undershirts
            let clothes = `{"mask": 0, "maskTexture": 0, "torso": 0, "Leg": 98, "LegTexture": 16, "bags": 0, "bagTexture": 0, "shoes": 71, "shoesTexture": 16, "acess": 0, "acessTexture": 0, "undershirt": 15, "undershirtTexture": 0, "armor": 0, "decals": 0, "decalsTexture": 0, "tops": 251, "topsTexture": 16}`;
            db.player_clothes.update(
                {dataJob: clothes},
                {where: {id: player.characterId}}
            ).then(() => {
                clothes = JSON.parse(clothes)
                player.setVariable("clothesJob",clothes); 
            })    
        }else{
            //mujer
            player.setClothes(4,101,16,0);//pantalones
            player.setClothes(11,259,16,0);//camisas
            player.setClothes(6,74,16,0);//zapatillas
            player.setClothes(8,8,0,0);//undershirt
            player.setClothes(3,14,0,0);//torso
            let clothes = `{"mask": 0, "maskTexture": 0, "torso": 14, "Leg": 101, "LegTexture": 16, "bags": 0, "bagTexture": 0, "shoes": 74, "shoesTexture": 16, "acess": 0, "acessTexture": 0, "undershirt": 8, "undershirtTexture": 0, "armor": 0, "decals": 0, "decalsTexture": 0, "tops": 259, "topsTexture": 16}`;
            db.player_clothes.update(
                {dataJob: clothes},
                {where: {id: player.characterId}}
            ).then(() => {
                clothes = JSON.parse(clothes)
                player.setVariable("clothesJob",clothes); 
            })    
        }
    },
    "ropaoriginal" : (player) => {
        db.player_clothes.findAll({
            where: {OwnerId: player.characterId},
        }).then(results =>{
            ropa = JSON.parse(results[0].data);
            player.setClothes(1,ropa.mask,ropa.maskTexture,0);
            player.setClothes(3,ropa.torso,0,0);
            player.setClothes(4,ropa.Leg,ropa.LegTexture,0);
            player.setClothes(5,ropa.bags,ropa.bagTexture,0);
            player.setClothes(6,ropa.shoes,ropa.shoesTexture,0);
            player.setClothes(7,ropa.acess,ropa.acessTexture,0);
            player.setClothes(8,ropa.undershirt,ropa.undershirtTexture,0);
            player.setClothes(9,ropa.armor,0,0);
            player.setClothes(10,ropa.decals,ropa.decalsTexture,0);
            player.setClothes(11,ropa.tops,ropa.topsTexture,0);
            player.setVariable("clothesJob","no");
            db.player_clothes.update(
                { dataJob: null },
                { where: { OwnerId: player.characterId } }
              ).then(() => {
                mp.events.call('player:setClothing', player);
                mp.events.call('player:setModel', player);
            })

        })
    },
    "checkskillSv" : (player,tier) => {
        let respuesta = "no";
        db.skills.findOne({
            attributes: ['hacker'],
            where:{
                id: player.characterId,
            } 
        }).then (result => {
            if(result){
                if(result.hacker < 2){
                    respuesta = "no"
                    player.call('llamadajobtier2',[respuesta]);
                }else{
                    respuesta = "si"
                    player.call('llamadajobtier2',[respuesta]);
                }
            }
        })
    }
})