mp.events.add({
    'server:menu': async (player) => {
        
        player.call('requestRoute', ['menu', true, true]);
        player.call('cursor:Show');
        const { factions } = require('../models')
        factions.findAll({}).then((getFactions) => {
            if (getFactions.length > 0) {
                getFactions.forEach((faction) => {
                    // console.log(faction);
                    player.call('requestBrowser', `appSys.commit('showMenu', true)`)
                    /* player.call('requestBrowser', [`appSys.commit('updateFaction', {
                        menuName: 'Your vehicles',
                        menuSub: 'You have ${vehicles.length} vehicles.',
                        tableOne: 'Name',
                        icon: 'fa-solid fa-car',
                        name: '${player.adminDuty ? `<font style="color:grey; font-size:15px; float:left;">#${veh.id}</font> ${veh.vehicleModelName}` : veh.vehicleModelName}',
                        id: ${veh.id},
                        button: true,
                        funcs: 'manageVehicle'
                    });`]); */
                })
            }
        })
        
    },
})