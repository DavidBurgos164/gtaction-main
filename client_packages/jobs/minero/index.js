let CONFIG = require('./jobs/minero/CONFIG.js').CONFIG;
require('./jobs/minero/gui/Main.js'); 
require('./jobs/jobs.js')

//VARS DE JOB
let Minero_Ped = mp.peds.new(mp.game.joaat(CONFIG.NPC.model), new mp.Vector3(CONFIG.NPC.x, CONFIG.NPC.y, CONFIG.NPC.z), CONFIG.NPC.heading, mp.players.local.dimension);
Minero_Ped.freezePosition(true);
Minero_Ped.setInvincible(true);
let interfazBrowser;
let dejarJobBrowser;
let is_hired = false;
let mission_data = {};
let pressBrowser;
let tiertrabajando;
let is_working = false;
let mensajeNoSkill = false;
mp.labels.new("Manolo", new mp.Vector3(CONFIG.NPC.x, CONFIG.NPC.y, CONFIG.NPC.z + 1.0), {
    los: false,
    font: 4,
    drawDistance: 10,
    color: [255, 255, 255, 255],
    dimension: 0
});
let mineriablip = mp.blips.new(618, new mp.Vector3(CONFIG.NPC.x, CONFIG.NPC.y, CONFIG.NPC.z), {
    name: "Mineria",
    color: 12,
    shortRange: true,
    dimension: 0
});

mp.keys.bind(0x45, true, function () {
    //VALIDACIONES PARA QUE NO ABRA CON EL CHAT ABIERTO Y DEMAS
    let istyping = mp.players.local.isTypingInTextChat;
    var islogged = mp.players.local.getVariable('loggedIn')
    if(mp.players.local.canTogHud && mp.players.local.currentRoute != 'vehicledealer') return;
    if(istyping || !islogged) return

    if (mp.game.system.vdist(CONFIG.NPC.x, CONFIG.NPC.y, CONFIG.NPC.z, mp.players.local.position.x, mp.players.local.position.y, mp.players.local.position.z) < 2.0) {
        if(interfazBrowser == null && is_hired==false){
            if(!mp.game.ui.isPauseMenuActive()) {
                mp.gui.cursor.show(true, true);
                mp.events.callRemote("checkExpJob","minero");
                //interfazBrowser = mp.browsers.new('package://jobs/minero/gui/minero.html');
            }
        }
        if(is_hired==true && dejarJobBrowser == null){
            mp.gui.cursor.show(true, true);
            dejarJobBrowser = mp.browsers.new('package://jobs/minero/gui/dejarjob.html');
        }
    }    
    //EMPEZAR A MINAR
    if (mp.game.system.vdist(mission_data.mission.x, mission_data.mission.y, mission_data.mission.z, mp.players.local.position.x, mp.players.local.position.y, mp.players.local.position.z) < 2.0) {
        if (is_hired && is_working == false) {
            start_job();            
        }
    }  
});
function hire() {
    mp.events.call("sonido","contratado");
    mp.events.callRemote("mensajeOK","Has sido contratado, comience a extraer materiales.");
    is_hired = true;
    let Player = mp.players.local;
    Player.clearTasksImmediately();
    Player.taskTurnToFaceCoord(CONFIG.NPC.x, CONFIG.NPC.y, CONFIG.NPC.z, 0);    
    mp.events.callRemote("ropaminero");
    get_new_mission();
}
function stop_working() {
    is_hired = false;
    mp.events.call("sonido","stop_work");
    if (mission_data.blip) {
        mission_data.blip.destroy();
    }
    if (mission_data.marker) {
        mission_data.marker.destroy();
    }
    if (mission_data.text) {
        mission_data.text.destroy();
    }
    mission_data = {};
    is_working = false;  
    tiertrabajando = "";
    mp.events.callRemote("ropaoriginal");
}
function get_new_mission() {
    if(tiertrabajando == "hierro"){
        mission_data.mission = CONFIG.spawnhierro[Math.floor(Math.random() * CONFIG.spawnhierro.length)];
    }else if(tiertrabajando == "carbon"){
        mission_data.mission = CONFIG.spawncarbon[Math.floor(Math.random() * CONFIG.spawncarbon.length)];
    }
    // COGER UNA MISION
    mission_data.blip = mp.blips.new(1, new mp.Vector3(mission_data.mission.x, mission_data.mission.y, mission_data.mission.z), {
        name: "Extrae el mineral",
        color: 5,
        shortRange: true,
        dimension: 0,
        scale: 0.7,
    });
    mission_data.blip.setRoute(true);
    mission_data.marker = mp.markers.new(1, new mp.Vector3(mission_data.mission.x, mission_data.mission.y, mission_data.mission.z - 1.0), 0.7, {
        color: [200, 160, 0, 100],
        visible: true,
        dimension: 0
    });

    mission_data.text = mp.labels.new("Extrae el mineral (e)", new mp.Vector3(mission_data.mission.x, mission_data.mission.y, mission_data.mission.z), {  
        los: false,
        font: 4,
        drawDistance: 13,
        color: [255, 255, 255, 255],
        dimension: 0
    });    
}
function start_job() {
    if(is_working == false){
        is_working = true;
        mp.players.local.freezePosition(true);
        mp.players.local.taskTurnToFaceCoord(mission_data.mission.x, mission_data.mission.y, mission_data.mission.z, 0);
        if(tiertrabajando == "hierro" || tiertrabajando == "carbon"){
            if(!pressBrowser){
                //mp.players.local.taskStartScenarioInPlace("WORLD_HUMAN_CONST_DRILL", 0, true);
                mp.events.callRemote("animMinero",true);
                pressBrowser = mp.browsers.new('package://jobs/minero/pressGame/press.html');
                mp.gui.cursor.show(true, true);
            }
        }

    }
}
mp.events.add('llamaInterfazMinero', (tier,exp) => {
    interfazBrowser = mp.browsers.new('package://jobs/minero/gui/minero.html');
    interfazBrowser.execute(`updatebarraskill('${tier}', ${exp});`);
})
mp.events.add("llamadajobtier1Mineria", () => {
    if (interfazBrowser) {
        interfazBrowser.destroy();
        interfazBrowser = null; 
        mp.gui.cursor.show(false, false);
    }
    tiertrabajando = "hierro";
    hire();
})
mp.events.add("checkskillMineriaCliente", (respuesta,tipoMineral) => {
    if (interfazBrowser) {
        interfazBrowser.destroy();
        interfazBrowser = null; 
        mp.gui.cursor.show(false, false);
    }
    if(respuesta == "si" && tipoMineral == "carbon"){
        tiertrabajando = "carbon";
        hire();
    }else{
        mensajeNoSkill = true;
        setTimeout(() => {
            mensajeNoSkill = false;
        }, 4000); 
    }
})
mp.events.add("cerrarmenuMinero", () => {
    if (interfazBrowser) {
        interfazBrowser.destroy();
        interfazBrowser = null; 
        mp.gui.cursor.show(false, false);
    }
    if (dejarJobBrowser) {
        dejarJobBrowser.destroy();
        dejarJobBrowser = null; 
        mp.gui.cursor.show(false, false);
    }
})
mp.events.add("dimitirMinero", () => {
    if (dejarJobBrowser) {
        dejarJobBrowser.destroy();
        dejarJobBrowser = null; 
        mp.gui.cursor.show(false, false);
    }
    stop_working();
})
mp.events.add("render", () => {    
    if(mensajeNoSkill){
        mp.game.graphics.drawText(`No tienes la habilidad necesaria como Minero`, [0.5, 0.1], {
            font: 0,
            color: [255, 0, 0, 255],
            scale: [0.3, 0.3],
            outline: true
        });
    }
});
mp.events.add('pressfinalizados', () => {
    if (pressBrowser) {
        pressBrowser.destroy();
        pressBrowser = null; 
        mp.gui.cursor.show(false, false);
    }
    mp.events.callRemote("animMinero",false);
    mp.players.local.clearTasksImmediately();
    mission_data.blip.destroy();
    mission_data.marker.destroy();
    mission_data.text.destroy();
    mp.players.local.freezePosition(false);            
    is_working = false; 
    if(tiertrabajando == "hierro"){
        mp.events.callRemote("mensajeOK",`¡Minerales extraidos! Has obtenido ${CONFIG.cantidadObtenida.hierro} de hierro sin refinar.`);
    }else if(tiertrabajando == "carbon"){
        mp.events.callRemote("mensajeOK",`¡Minerales extraidos! Has obtenido ${CONFIG.cantidadObtenida.carbon} de carbon.`);
    }
    setTimeout(() => {
        get_new_mission();
    },3000);
});
mp.events.add('test', () => {
    mp.console.logInfo("test", true, true);
});

mp.keys.bind(27, true, function () {//AL ESCAPE CIERRA LA VENTANA DEL MINIJUEGO
    if (interfazBrowser) {
        mp.gui.cursor.show(false, false);
        interfazBrowser.destroy();
        interfazBrowser = null; 
        mp.players.local.clearTasksImmediately();
        mp.players.local.freezePosition(false);   
        is_working = false;
    }
    if(dejarJobBrowser){
        mp.gui.cursor.show(false, false);
        dejarJobBrowser.destroy();
        dejarJobBrowser = null; 
        mp.players.local.clearTasksImmediately();
        mp.players.local.freezePosition(false);   
        is_working = false;
    }
    if(pressBrowser){
        mp.events.callRemote("animMinero",false);
        mp.gui.cursor.show(false, false);
        pressBrowser.destroy();
        pressBrowser = null; 
        mp.players.local.clearTasksImmediately();
        mp.players.local.freezePosition(false);   
        is_working = false;
    }
  });


  
  mp.events.addDataHandler({
    'animMinero': (entity, value) => {
        if(entity.type == 'player' && value != null) {
            entity.pico = mp.objects.new('prop_tool_pickaxe', entity.position, {
                rotation: new mp.Vector3(0, 0, 0),
                alpha: 255,
                dimension: entity.dimension
            });            
            setTimeout(() => {
                entity.pico.attachTo(entity.handle, 71, 0.1, 0, 0, 71, 0, 180, true, true, false, false, 0, true);
            }, 200);             
            mp.game.streaming.requestAnimDict("melee@large_wpn@streamed_variations");
            entity.taskPlayAnim("melee@large_wpn@streamed_variations", "ground_attack_0_var_a", 8.0, 1.0, -1, 0 + 1 + 32 + 16, 0.0, false, false, false)
        }else{
            if(entity.pico) { entity.pico.destroy(); }
            entity.clearTasks();
        }
    },
})
