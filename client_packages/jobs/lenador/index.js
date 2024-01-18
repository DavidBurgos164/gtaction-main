let CONFIG = require('./jobs/lenador/CONFIG.js').CONFIG;
require('./jobs/lenador/gui/Main.js'); 
require('./jobs/jobs.js')

//VARS DE JOB
let lenador_Ped = mp.peds.new(mp.game.joaat(CONFIG.NPC.model), new mp.Vector3(CONFIG.NPC.x, CONFIG.NPC.y, CONFIG.NPC.z), CONFIG.NPC.heading, mp.players.local.dimension);
lenador_Ped.freezePosition(true);
lenador_Ped.setInvincible(true);
let interfazBrowser;
let dejarJobBrowser;
let is_hired = false;
let mission_data = {};
let clickBrowser;
let tiertrabajando;
let is_working = false;
let mensajeNoSkill = false;
let intervalohacha = null ;
mp.labels.new("Rodolfo", new mp.Vector3(CONFIG.NPC.x, CONFIG.NPC.y, CONFIG.NPC.z + 1.0), {
    los: false,
    font: 4,
    drawDistance: 10,
    color: [255, 255, 255, 255],
    dimension: 0
});
let lenadorblip = mp.blips.new(77, new mp.Vector3(CONFIG.NPC.x, CONFIG.NPC.y, CONFIG.NPC.z), {
    name: "Leñador",
    color: 69,
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
                mp.events.callRemote("checkExpJob","lenador");
                //interfazBrowser = mp.browsers.new('package://jobs/lenador/gui/lenador.html');
            }
        }
        if(is_hired==true && dejarJobBrowser == null){
            mp.gui.cursor.show(true, true);
            dejarJobBrowser = mp.browsers.new('package://jobs/lenador/gui/dejarjob.html');
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
    mp.events.callRemote("mensajeOK","Has sido contratado, comience a talar arboles.");
    is_hired = true;
    let Player = mp.players.local;
    Player.clearTasksImmediately();
    Player.taskTurnToFaceCoord(CONFIG.NPC.x, CONFIG.NPC.y, CONFIG.NPC.z, 0);    
    mp.events.callRemote("ropalenador");
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
    if(tiertrabajando == "pino"){
        mission_data.mission = CONFIG.spawnpino[Math.floor(Math.random() * CONFIG.spawnpino.length)];
    }else if(tiertrabajando == "roble"){
        mission_data.mission = CONFIG.spawnroble[Math.floor(Math.random() * CONFIG.spawnroble.length)];
    }
    // COGER UNA MISION
    mission_data.blip = mp.blips.new(1, new mp.Vector3(mission_data.mission.x, mission_data.mission.y, mission_data.mission.z), {
        name: "Tala el arbol",
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

    mission_data.text = mp.labels.new("Tala el arbol (e)", new mp.Vector3(mission_data.mission.x, mission_data.mission.y, mission_data.mission.z), {  
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
        if(tiertrabajando == "pino" || tiertrabajando == "roble"){
            if(!clickBrowser){
                //mp.players.local.taskStartScenarioInPlace("WORLD_HUMAN_GARDENER_PLANT", 0, true);
                mp.events.callRemote("animLenador",true);
                clickBrowser = mp.browsers.new('package://jobs/lenador/clickGame/click.html');
                mp.gui.cursor.show(true, true);
            }
        }

    }
}
mp.events.add("llamadajobtier1Lenador", () => {
    if (interfazBrowser) {
        interfazBrowser.destroy();
        interfazBrowser = null; 
        mp.gui.cursor.show(false, false);
    }
    tiertrabajando = "pino";
    hire();
})
mp.events.add('llamaInterfazLenador', (tier,exp) => {
    interfazBrowser = mp.browsers.new('package://jobs/lenador/gui/lenador.html');
    interfazBrowser.execute(`updatebarraskill('${tier}', ${exp});`);
})
mp.events.add("checkskillLenadorCliente", (respuesta,tipoArbol) => {
    if (interfazBrowser) {
        interfazBrowser.destroy();
        interfazBrowser = null; 
        mp.gui.cursor.show(false, false);
    }
    if(respuesta == "si" && tipoArbol == "roble"){
        tiertrabajando = "roble";
        hire();
    }else{
        mensajeNoSkill = true;
        setTimeout(() => {
            mensajeNoSkill = false;
        }, 4000); 
    }
})
mp.events.add("cerrarmenuLenador", () => {
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
mp.events.add("dimitirLenador", () => {
    if (dejarJobBrowser) {
        dejarJobBrowser.destroy();
        dejarJobBrowser = null; 
        mp.gui.cursor.show(false, false);
    }
    stop_working();
})
mp.events.add("render", () => {    
    if(mensajeNoSkill){
        mp.game.graphics.drawText(`No tienes la habilidad necesaria como Leñador`, [0.5, 0.1], {
            font: 0,
            color: [255, 0, 0, 255],
            scale: [0.3, 0.3],
            outline: true
        });
    }
});
mp.events.add('clickfinalizados', () => {
    if (clickBrowser) {
        clickBrowser.destroy();
        clickBrowser = null; 
        mp.gui.cursor.show(false, false);
    }
    mp.events.callRemote("animLenador",false);
    mp.players.local.clearTasksImmediately();
    mission_data.blip.destroy();
    mission_data.marker.destroy();
    mission_data.text.destroy();
    mp.players.local.freezePosition(false);            
    is_working = false; 
    if(tiertrabajando == "pino"){
        mp.events.callRemote("mensajeOK",`¡Arbol talado! Has obtenido ${CONFIG.cantidadObtenida.pino} de pino sin refinar.`);
    }else if(tiertrabajando == "roble"){
        mp.events.callRemote("mensajeOK",`¡Arbol talado! Has obtenido ${CONFIG.cantidadObtenida.roble} de roble.`);
    }
    setTimeout(() => {
        get_new_mission();
    },3000);
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
    if(clickBrowser){
        mp.gui.cursor.show(false, false);
        clickBrowser.destroy();
        clickBrowser = null; 
        mp.players.local.clearTasksImmediately();
        mp.players.local.freezePosition(false);   
        is_working = false;
        mp.events.callRemote("animLenador",false);
    }
  });




  mp.events.addDataHandler({
    'animLenador': (entity, value) => {
        const animDict = "melee@large_wpn@streamed_core_fps";
        const animName = "plyr_rear_takedown_bat_r_facehit" ;
        if(entity.type == 'player' && value != null) {
            entity.hacha = mp.objects.new('prop_w_me_hatchet', entity.position, {
                rotation: new mp.Vector3(0, 0, 0),
                alpha: 255,
                dimension: entity.dimension
            });            
            setTimeout(() => {
                entity.hacha.attachTo(entity.handle, 71, 0.088, 0.02, -0.02, 71, 166.0, 180, true, true, false, false, 0, true);
            }, 200);             

            mp.game.streaming.requestAnimDict(animDict);

            entity.taskPlayAnim(animDict, animName, 8.0, 1.0, -1, 1, 1.0, false, false, false);
            intervalohacha = setInterval(() => {
                entity.taskPlayAnim(animDict, animName, 8.0, 1.0, -1, 1, 1.0, false, false, false);
            }, 1200);
        }else{
            if(entity.hacha) { entity.hacha.destroy(); }
            clearInterval(intervalohacha);
            entity.clearTasks();
        }
    },
})
