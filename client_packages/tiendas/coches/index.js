let CONFIG = require('./tiendas/coches/CONFIG.js').CONFIG;
let dealerPillbox_Ped = mp.peds.new(mp.game.joaat(CONFIG.NPCPILLBOX.model), new mp.Vector3(CONFIG.NPCPILLBOX.x, CONFIG.NPCPILLBOX.y, CONFIG.NPCPILLBOX.z), CONFIG.NPCPILLBOX.heading, 0);
dealerPillbox_Ped.freezePosition(true);
dealerPillbox_Ped.setInvincible(true);
let interfazBrowser = null ;
let vehiclePreview = null;
mp.labels.new("Francesco", new mp.Vector3(CONFIG.NPCPILLBOX.x, CONFIG.NPCPILLBOX.y, CONFIG.NPCPILLBOX.z + 1.0), {
    los: false,
    font: 4,
    drawDistance: 10,
    color: [255, 255, 255, 255],
    dimension: 0
});
let cochepillboxblip = mp.blips.new(225, new mp.Vector3(CONFIG.NPCPILLBOX.x, CONFIG.NPCPILLBOX.y, CONFIG.NPCPILLBOX.z), {
    name: "Concesionario coches",
    color: 0,
    shortRange: true,
    dimension: 0
});
mp.keys.bind(0x45, true, function () {
    //VALIDACIONES PARA QUE NO ABRA CON EL CHAT ABIERTO Y DEMAS
    let istyping = mp.players.local.isTypingInTextChat;
    var islogged = mp.players.local.getVariable('loggedIn')
    if(mp.players.local.canTogHud && mp.players.local.currentRoute != 'vehicledealer') return;
    if(istyping || !islogged) return
    if (mp.game.system.vdist(CONFIG.NPCPILLBOX.x, CONFIG.NPCPILLBOX.y, CONFIG.NPCPILLBOX.z, mp.players.local.position.x, mp.players.local.position.y, mp.players.local.position.z) < 2.0) {
        if(interfazBrowser == null){
            if(!mp.game.ui.isPauseMenuActive()) {
                mp.gui.cursor.show(true, true);
                interfazBrowser = mp.browsers.new('package://tiendas/coches/test.html');
            }
        }
    }    

});
mp.events.add("crearpreviewcoche",(hashcoche) => {
    if(vehiclePreview){
        vehiclePreview.destroy();
        delete vehiclePreview;
    }
    vehiclePreview = mp.vehicles.new(mp.game.joaat(hashcoche), new mp.Vector3(CONFIG.previewpillboxcoche.x, CONFIG.previewpillboxcoche.y, CONFIG.previewpillboxcoche.z),
    {
        numberPlate: "TEST",
        color: [[255, 0, 0],[255,0,0]],
        heading: CONFIG.previewpillboxcoche.heading,
    });
})
mp.events.add('cerrarmenuCochesPillbox', () => {
    if(interfazBrowser){
        interfazBrowser.destroy();
        interfazBrowser = null; 
        mp.gui.cursor.show(false, false);
    }
    vehiclePreview.destroy();
    delete vehiclePreview;
    
})