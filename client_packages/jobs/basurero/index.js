let CONFIG = require('./jobs/basurero/CONFIG.js').CONFIG;
require('./jobs/jobs.js')

//Variables necesarias para el job
let mission_data = {};
let cobro_blip = null;
let garage_marker = null;
let cobro_marker = null;
let is_working = false;
let car_delete_interval = null;
let outside_car_timer = CONFIG.cdfueracoche.segundos;
let is_hired = false;
let left_vehicle = false;
let work_van = null;
let van_spawned = false;
let jobs_hechos = 0 ;
let trabajo_fin = false;
let ruta = 0 ;
let tiertrabajando;
let mensajeTemp = false;
let falladoRecogida = false;
let mensajeRecogida = false;
let interfazBrowser;
let dejarJobBrowserG;
let recogerPasajerosTimer = null;
let basurero_Ped = mp.peds.new(mp.game.joaat(CONFIG.NPC.model), new mp.Vector3(CONFIG.NPC.x, CONFIG.NPC.y, CONFIG.NPC.z), CONFIG.NPC.heading, mp.players.local.dimension);
basurero_Ped.freezePosition(true);
basurero_Ped.setInvincible(true);
mp.labels.new("Nano", new mp.Vector3(CONFIG.NPC.x, CONFIG.NPC.y, CONFIG.NPC.z + 1.0), {
    los: false,
    font: 4,
    drawDistance: 10,
    color: [255, 255, 255, 255],
    dimension: 0
});
let basurero_blip = mp.blips.new(318, new mp.Vector3(CONFIG.NPC.x, CONFIG.NPC.y, CONFIG.NPC.z), {
    name: "Basurero",
    color: 0,
    shortRange: true,
    dimension: 0
});

function hire() {
    if(is_hired){
        stop_working();
        return
    }
    mp.events.call("sonido","contratado");
    mp.events.callRemote("mensajeOK","Has sido contratado, recoja su vehículo de trabajo en orden.");
    is_hired = true;
    let Player = mp.players.local;
    Player.clearTasksImmediately();
    Player.taskTurnToFaceCoord(CONFIG.NPC.x, CONFIG.NPC.y, CONFIG.NPC.z, 0);    
    enable_garage();
    mp.events.callRemote("ropabasurero");
}
function stop_working() {
    is_hired = false;
    left_vehicle = false;
    mp.events.callRemote("stop_work");
    mp.events.call("sonido","stop_work");
    if(work_van){
        mp.events.call('requestBrowser', `gui.chat.push('<i class="fa-regular fa-transformer-bolt" style="color:#ffa570"></i> <font color="#ffa570"><font color="#FF0000">[RADIO] Has perdido tu trabajo</font> , si deseas volver a ser contratado vuelve a la zona de basureros</font>')`);
        mp.events.callRemote("borrarvehmundo",work_van);
    }else{
        mp.events.call('requestBrowser', `gui.chat.push('<i class="fa-regular fa-transformer-bolt" style="color:#ffa570"></i> <font color="#ffa570"><font color="#FF0000">Has dejado el trabajo</font> , si necesitas volver a ser contratado habla con Nano.</font>')`);
    }
    work_van = null;
    van_spawned = false;
    if(garage_marker){
        garage_marker.destroy();
    }
    garage_marker = null; 
    if (car_delete_interval) {
        clearInterval(car_delete_interval);
        outside_car_timer = CONFIG.cdfueracoche.segundos ;
    }
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
    basurero_blip.setRoute(true);
    basurero_blip.setRoute(false);//removemos todos los waypoints
    ruta = 0;
    if(cobro_blip){
        cobro_blip.destroy();
    }
    if(cobro_marker){
        cobro_marker.destroy();
        cobro_marker = null; 
    }
    mp.events.callRemote("ropaoriginal");
}
function spawn_car() {
    const vehicleModel = "trash2";
    mp.events.callRemote("vehjobbasurero", vehicleModel);
    van_spawned = true ;
    garage_marker.destroy();
    garage_marker = null; 
    //le damos tiempo a la bd+lado servidor para generar el vehiculo
    setTimeout(() => {
        work_van = mp.players.local.vehicle;        
    }, 1000);
    
}
function enable_garage() {
    garage_marker = mp.markers.new(1, new mp.Vector3(CONFIG.Garage.x, CONFIG.Garage.y, CONFIG.Garage.z - 1.0), 2.7, {
        color: [0, 255, 0, 100], //verde
        visible: true,
        dimension: 0
    });
}
function get_new_mission() {
    if(jobs_hechos == 0 ){
        ruta = Math.floor(Math.random() * CONFIG.numrutas + 1);        
    }
    let resultado = CONFIG.puntosrecogida.filter(e => e.ruta == ruta);
    mission_data.mission = resultado[jobs_hechos];
    //mission_data.mission = CONFIG.puntosrecogida[Math.floor(Math.random() * CONFIG.puntosrecogida.length)];
    // COGER UNA MISION
    mission_data.blip = mp.blips.new(1, new mp.Vector3(mission_data.mission.x, mission_data.mission.y, mission_data.mission.z), {
        name: "Recoge la basura",
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

    mission_data.text = mp.labels.new("Recoge la basura (e)", new mp.Vector3(mission_data.mission.x, mission_data.mission.y, mission_data.mission.z), {  
        los: false,
        font: 4,
        drawDistance: 17,
        color: [255, 255, 255, 255],
        dimension: 0
    });    
}
function cobrar(){
    if (is_hired && van_spawned == true && trabajo_fin == true) {
        if(work_van && mp.players.local.vehicle == work_van){
            mp.events.callRemote("borrarveh");
            if(tiertrabajando == 1){
                mp.events.callRemote("pagarT1Basura",tiertrabajando);
            }else if(tiertrabajando == 2){
                mp.events.callRemote("pagarT2Basura",tiertrabajando);
            }
            mp.events.call("sonido","cobrarjob");
            if(work_van){
                mp.events.callRemote("borrarvehmundo",work_van);
            }
            basurero_blip.setRoute(false);
            cobro_marker.destroy();
            if(cobro_blip){
                cobro_blip.destroy();
            }
            cobro_marker = null; 
            is_hired = false;
            is_working = false;
            jobs_hechos = 0;
            trabajo_fin = false;
            van_spawned = false;
            mission_data = {};
            ruta = 0;
            mp.events.callRemote("ropaoriginal");
        }else{
            mp.events.call('requestBrowser', `gui.chat.push('<i class="fa-regular fa-transformer-bolt" style="color:#ffa570"></i> <font color="#ffa570"><font color="#FF0000">&iexcl;&iexcl;Sube a tu vehiculo de trabajo!!</font>, o no podras terminar el trabajo</font>')`);
        }
    }else{
        mp.events.call('requestBrowser', `gui.chat.push('<i class="fa-regular fa-transformer-bolt" style="color:#ffa570"></i> <font color="#ffa570"><font color="#FF0000">&iexcl;&iexcl;No has terminado el trabajo GANDUL!!</font>, si quieres terminar el curro entonces habla con Nano</font>')`);
    }
}
function start_job() {
    if(is_working == false){
        is_working = true;
        mp.players.local.freezePosition(true);
        mp.players.local.taskTurnToFaceCoord(mission_data.mission.x, mission_data.mission.y, mission_data.mission.z, 0);
        if(tiertrabajando == 1){

        }else if(tiertrabajando == 2){

        }

    }
}
mp.keys.bind(0x45, true, function () {
    let istyping = mp.players.local.isTypingInTextChat;
    var islogged = mp.players.local.getVariable('loggedIn')
    if(istyping || !islogged) return
    if (mp.game.system.vdist(CONFIG.Garage.x, CONFIG.Garage.y, CONFIG.Garage.z, mp.players.local.position.x, mp.players.local.position.y, mp.players.local.position.z) < 2.0) {
        if (is_hired && van_spawned == false) {            
            spawn_car();
            get_new_mission();
        }
    }
    if (mp.game.system.vdist(CONFIG.NPC.x, CONFIG.NPC.y, CONFIG.NPC.z, mp.players.local.position.x, mp.players.local.position.y, mp.players.local.position.z) < 2.0) {
        //hire();
        if(interfazBrowser == null && is_hired==false){
            if(mp.players.local.canTogHud && mp.players.local.currentRoute != 'vehicledealer') return;
            let istyping = mp.players.local.isTypingInTextChat;
            var islogged = mp.players.local.getVariable('loggedIn')
            if(istyping || !islogged) return
            if(!mp.game.ui.isPauseMenuActive()) {
                mp.gui.cursor.show(true, true);
                mp.events.callRemote("checkExpJob","basurero");
                //interfazBrowser = mp.browsers.new('package://jobs/bus/gui/bus.html');
                Player.playFacialAnim("mic_chatter", "mp_facial");
                setTimeout(() => {
                    Player.clearTasksImmediately();
                }, 1000);    
            }
        }
        if(is_hired==true && dejarJobBrowserG == null){
            mp.gui.cursor.show(true, true);
            dejarJobBrowserG = mp.browsers.new('package://jobs/bus/gui/dejarjob.html');
        }
    }
    if (mp.game.system.vdist(mission_data.mission.x, mission_data.mission.y, mission_data.mission.z, mp.players.local.position.x, mp.players.local.position.y, mp.players.local.position.z) < 5.5) {
        if (is_hired && is_working == false) {
                start_job();
        }
    }    
    if (mp.game.system.vdist(CONFIG.cobro.x, CONFIG.cobro.y, CONFIG.cobro.z, mp.players.local.position.x, mp.players.local.position.y, mp.players.local.position.z) < 3.0) {
        if(trabajo_fin){
            cobrar();
        }
    }   
});
mp.events.add('llamaInterfazBasurero', (tier,exp) => {
    interfazBrowser = mp.browsers.new('package://jobs/basurero/gui/basurero.html');
    interfazBrowser.execute(`updatebarraskill('${tier}', ${exp});`);
})
mp.events.add("playerLeaveVehicle", (vehicle, seat) => {
    if (is_hired) {
        if (vehicle == work_van) {
            left_vehicle = true;
            car_delete_interval = setInterval(() => {
                outside_car_timer--;
                if (outside_car_timer < 0) {
                    clearInterval(car_delete_interval);
                    stop_working();
                }
            }, 1000);
        }    
    } 
})

mp.events.add("playerEnterVehicle", (vehicle, seat) => {    
    if (is_hired) {
        let conductor = mp.players.local;
        if (vehicle == work_van && vehicle.getPedInSeat(-1) === conductor.handle) {
            left_vehicle = false;
            outside_car_timer = CONFIG.cdfueracoche.segundos;
                clearInterval(car_delete_interval);
        }    
    }
});
mp.events.add("render", () => {    
    if (is_hired) {
        if (left_vehicle && outside_car_timer<180) {
            mp.game.graphics.drawText(`Recupera el vehiculo y vuelve al trabajo, tienes: ${outside_car_timer} segundos.`, [0.5, 0.25], {
                font: 0,
                color: [255, 255, 255, 255],
                scale: [0.3, 0.3],
                outline: true
            });
        }
        if(mensajeRecogida){
            mp.game.graphics.drawText(`No te muevas, los pasajeros se están subiendo`, [0.5, 0.1], {
                font: 0,
                color: [255, 255, 255, 255],
                scale: [0.3, 0.3],
                outline: true
            });
        }
        if(falladoRecogida){
            mp.game.graphics.drawText(`¡¡Te has movido!! Vuelve que te has dejado una abuela.`, [0.5, 0.1], {
                font: 0,
                color: [255, 255, 255, 255],
                scale: [0.3, 0.3],
                outline: true
            });
            mp.events.call("sonido","paradabusFail");
            let falladorecogida_interval = null;
            let falladoRecogida_timer = 10 ;
            falladorecogida_interval = setInterval(() => {
                falladoRecogida_timer--;
                if (falladoRecogida_timer < 0) {
                    clearInterval(falladorecogida_interval);
                    falladoRecogida = false;
                    falladoRecogida_timer = 10;
                }
            }, 1000);
        }    
        }    
});
mp.events.add("llamadajobBasureroTier1", () => {
    if (interfazBrowser) {
        interfazBrowser.destroy();
        interfazBrowser = null; 
        mp.gui.cursor.show(false, false);
    }
    tiertrabajando = 1;
    hire();
})
mp.events.add("cerrarmenuBasurero", () => {
    if (interfazBrowser) {
        interfazBrowser.destroy();
        interfazBrowser = null; 
        mp.gui.cursor.show(false, false);
    }
    if (dejarJobBrowserG) {
        dejarJobBrowserG.destroy();
        dejarJobBrowserG = null; 
        mp.gui.cursor.show(false, false);
    }
})
mp.events.add("dimitirBasurero", () => {
    if (dejarJobBrowserG) {
        dejarJobBrowserG.destroy();
        dejarJobBrowserG = null; 
        mp.gui.cursor.show(false, false);
    }
    stop_working();
})