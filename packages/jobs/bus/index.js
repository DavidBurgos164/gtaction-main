const db = require('../../models/index.js')
const economy = require ('../../economy.js');

mp.events.add({
    'vehjobbus': (player, vehicle) => {
        let vehheadingtier0 = 173.921;
        var veh = mp.vehicles.new(mp.joaat(vehicle), player.position, {
            dimension: player.dimension,
            numberPlate: `null`,
            heading: vehheadingtier0,
            engine: true,
        });
        console.log(`${player.characterId} crea un vehiculo en bus`); //no borrar
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
            }, { where: { id: car.id } }).then(() => { mp.log(`${player.characterName} esta trabajando de bus`)})
        })
    },
    "pagarT1Bus" : (player,tier) => {
        let tierLevel = tier;
        let expganada = economy.exptransportista[tierLevel];
       
        db.skills.increment(
            { expexpertocoches: expganada },
            { where: { id: player.characterId } }
        )
        let dineropagar = player.cashAmount + economy.transportista[tierLevel] ;
        db.characters.update(
            {cashAmount: dineropagar},
            {where: {id: player.characterId}}
        )
        mp.chat.info(player,`Buen trabajo aqui tienes tu parte: ${economy.transportista[tierLevel]}$, ademas has ganado ${expganada} de experiencia.`);
        player.setVariable('cashValue', dineropagar);
        console.log(`El jugador ${player.characterId} ha cobrado ${economy.transportista[tierLevel]} y ahora tiene en la mano ${dineropagar}`)

    },
    "ropabus" : (player) => {      
        let clothes;  
        if(player.sex == "male"){
            player.setClothes(4,35,0,0);//pantalones
            player.setClothes(11,348,0,0);//camisa
            player.setClothes(6,21,0,0);//zapatillas
            player.setClothes(3,4,0,0);//torso
            player.setClothes(8,15,0,0);//undershirts
            clothes = `{"mask": 0, "maskTexture": 0, "torso": 4, "Leg": 35, "LegTexture": 0, "bags": 0, "bagTexture": 0, "shoes": 21, "shoesTexture": 0, "acess": 0, "acessTexture": 0, "undershirt": 15, "undershirtTexture": 0, "armor": 0, "decals": 0, "decalsTexture": 0, "tops": 348, "topsTexture": 0}`;
        }else{
            //mujer
            player.setClothes(4,34,0,0);//pantalones
            player.setClothes(11,366,0,0);//camisa
            player.setClothes(6,29,0,0);//zapatillas
            player.setClothes(8,8,0,0);//undershirts
            player.setClothes(3,14,0,0);//torso
            clothes = `{"mask": 0, "maskTexture": 0, "torso": 14, "Leg": 34, "LegTexture": 0, "bags": 0, "bagTexture": 0, "shoes": 29, "shoesTexture": 0, "acess": 0, "acessTexture": 0, "undershirt": 8, "undershirtTexture": 0, "armor": 0, "decals": 0, "decalsTexture": 0, "tops": 366, "topsTexture": 0}`;
        }
        db.player_clothes.update(
            {dataJob: clothes},
            {where: {id: player.characterId}}
        ).then(() => {
            clothes = JSON.parse(clothes)
            player.setVariable("clothesJob",clothes); 
        })      
    },
});