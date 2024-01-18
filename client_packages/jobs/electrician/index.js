let CONFIG = require('./jobs/electrician/CONFIG.js').CONFIG;
require('./jobs/electrician/cables/Main.js'); 
require('./jobs/electrician/simon/main.js'); 
require('./jobs/electrician/gui/main.js'); 
require('./jobs/jobs.js')
//require('./jobs/electrician/teleport_to_inaccesible.js');

let mission_data = {};
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
let Electrician_Ped = mp.peds.new(mp.game.joaat(CONFIG.NPC.model), new mp.Vector3(CONFIG.NPC.x, CONFIG.NPC.y, CONFIG.NPC.z), CONFIG.NPC.heading, mp.players.local.dimension);
Electrician_Ped.freezePosition(true);
Electrician_Ped.setInvincible(true);
let cablesBrowser;
let simonBrowser;
let interfazBrowser;
let dejarJobBrowser;
let tiertrabajando;
let mensajeTemp = false;
let resultado;
mp.labels.new("Paco", new mp.Vector3(CONFIG.NPC.x, CONFIG.NPC.y, CONFIG.NPC.z + 1.0), {
    los: false,
    font: 4,
    drawDistance: 10,
    color: [255, 255, 255, 255],
    dimension: 0
});

let electricistablip = mp.blips.new(643, new mp.Vector3(CONFIG.NPC.x, CONFIG.NPC.y, CONFIG.NPC.z), {
    name: "Electricista",
    color: 0,
    shortRange: true,
    dimension: 0
});

function stop_working() {
    is_hired = false;
    left_vehicle = false;
    mp.events.callRemote("stop_work");
    mp.events.call("sonido","stop_work");
    if(work_van){
        mp.events.call('requestBrowser', `gui.chat.push('<i class="fa-regular fa-transformer-bolt" style="color:#ffa570"></i> <font color="#ffa570"><font color="#FF0000">[RADIO] Has perdido tu trabajo</font> , si deseas volver a ser contratado vuelve a la central electrica</font>')`);
        mp.events.callRemote("borrarvehmundo",work_van);
    }else{
        mp.events.call('requestBrowser', `gui.chat.push('<i class="fa-regular fa-transformer-bolt" style="color:#ffa570"></i> <font color="#ffa570"><font color="#FF0000">Has dejado el trabajo</font> , si necesitas volver a ser contratado habla con Benceslao.</font>')`);
    }
    work_van = null;
    van_spawned = false;
    jobs_hechos = 0 ;
    if(garage_marker){
        garage_marker.destroy();
    }
    if (car_delete_interval != null) {
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
    is_working = false;  
    electricistablip.setRoute(true);
    electricistablip.setRoute(false);//removemos todos los waypoints
    ruta = 0;
    if(cobro_marker){
        cobro_marker.destroy();
        cobro_marker = null; 
    }
    mp.events.callRemote("ropaoriginal");
}

function hire() {
    mp.events.callRemote("test", true);
    tiertrabajando = 1;
    mp.events.call("sonido","contratado");
    //mp.events.call('requestBrowser', `gui.chat.push('<i class="fa-regular fa-transformer-bolt" style="color:#ffa570"></i> <font color="#ffa570"><font color="#75ff78"> Has sido contratado</font> , por favor recoja su vehiculo de trabajo en orden.</font>')`);
    mp.events.callRemote("mensajeOK","Has sido contratado, por favor recoja su vehiculo de trabajo en orden.");
    is_hired = true;
    let Player = mp.players.local;
    Player.clearTasksImmediately();
    Player.taskTurnToFaceCoord(CONFIG.NPC.x, CONFIG.NPC.y, CONFIG.NPC.z, 0);
    Player.playFacialAnim("mic_chatter", "mp_facial");
    setTimeout(() => {
        Player.clearTasksImmediately();
    }, 1000);        
    enable_garage();
    mp.events.callRemote("ropaelect");
}
function hireT2(){
    tiertrabajando = 2;
    mp.events.call("sonido","contratado");
    mp.events.call('requestBrowser', `gui.chat.push('<i class="fa-regular fa-transformer-bolt" style="color:#ffa570"></i> <font color="#ffa570"><font color="#75ff78"> Has sido contratado</font> , por favor recoja su vehiculo de trabajo en orden.</font>')`);
    mp.events.callRemote("mensajeOK","Has sido contratado, por favor recoja su vehiculo de trabajo en orden.");
    is_hired = true;
    let Player = mp.players.local;
    Player.clearTasksImmediately();
    Player.taskTurnToFaceCoord(CONFIG.NPC.x, CONFIG.NPC.y, CONFIG.NPC.z, 0);
    Player.playFacialAnim("mic_chatter", "mp_facial");
    setTimeout(() => {
        Player.clearTasksImmediately();
    }, 1000);        
    enable_garageT2();
    mp.events.callRemote("ropaelect");
}
function spawn_car() {
    const vehicleModel = "speedo4";
    mp.events.callRemote("vehjob", vehicleModel);
    van_spawned = true ;
    garage_marker.destroy();
    garage_marker = null; 
    //le damos tiempo a la bd+lado servidor para generar el vehiculo
    setTimeout(() => {
        work_van = mp.players.local.vehicle;        
    }, 1000);
    
}
function spawn_carT2() {
    const vehicleModel = "bison2";
    mp.events.callRemote("vehjob", vehicleModel);
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
function enable_garageT2() {
    garage_marker = mp.markers.new(1, new mp.Vector3(CONFIG.GarageT2.x, CONFIG.GarageT2.y, CONFIG.GarageT2.z - 1.0), 2.7, {
        color: [0, 255, 0, 100], //verde
        visible: true,
        dimension: 0
    });
}
function get_new_mission() {
    if(jobs_hechos == 0 ){
        ruta = Math.floor(Math.random() * CONFIG.numrutas + 1);        
    }
    resultado = CONFIG.broken_panels.filter(e => e.ruta == ruta);
    mission_data.mission = resultado[jobs_hechos];
    //mission_data.mission = CONFIG.broken_panels[Math.floor(Math.random() * CONFIG.broken_panels.length)];
    // COGER UNA MISION
    mission_data.blip = mp.blips.new(1, new mp.Vector3(mission_data.mission.x, mission_data.mission.y, mission_data.mission.z), {
        name: "Repara el cableado",
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

    mission_data.text = mp.labels.new("Repara el cableado (e)", new mp.Vector3(mission_data.mission.x, mission_data.mission.y, mission_data.mission.z), {  
        los: false,
        font: 4,
        drawDistance: 10,
        color: [255, 255, 255, 255],
        dimension: 0
    });    
}
function get_new_missionT2(){
    if(jobs_hechos == 0 ){
        ruta = Math.floor(Math.random() * CONFIG.numrutasT2 + 1);        
    }
    resultado = CONFIG.panelestier2.filter(e => e.ruta == ruta);
    mission_data.mission = resultado[jobs_hechos];
    //mission_data.mission = CONFIG.broken_panels[Math.floor(Math.random() * CONFIG.broken_panels.length)];
    // COGER UNA MISION
    mission_data.blip = mp.blips.new(1, new mp.Vector3(mission_data.mission.x, mission_data.mission.y, mission_data.mission.z), {
        name: "Repara este panel",
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

    mission_data.text = mp.labels.new("Repara el panel (e)", new mp.Vector3(mission_data.mission.x, mission_data.mission.y, mission_data.mission.z), {  
        los: false,
        font: 4,
        drawDistance: 10,
        color: [255, 255, 255, 255],
        dimension: 0
    });    
}
function start_job() {
    if(is_working == false){
        is_working = true;
        mp.players.local.freezePosition(true);
        mp.players.local.taskTurnToFaceCoord(mission_data.mission.x, mission_data.mission.y, mission_data.mission.z, 0);
        if(tiertrabajando == 1){
            if(!cablesBrowser){
                mp.players.local.taskStartScenarioInPlace("WORLD_HUMAN_WELDING", 0, true);
                cablesBrowser = mp.browsers.new('package://jobs/electrician/cables/cables.html');
                mp.gui.cursor.show(true, true);
            }
        }else if(tiertrabajando == 2){
            if(!simonBrowser){                
                mp.players.local.taskStartScenarioInPlace("WORLD_HUMAN_SEAT_WALL_TABLET", 0, true);
                simonBrowser = mp.browsers.new('package://jobs/electrician/simon/simon.html');
                mp.gui.cursor.show(true, true);
            }
        }

    }
}
function cobrar(){
    if (is_hired && van_spawned == true && trabajo_fin == true) {
        if(work_van && mp.players.local.vehicle == work_van){
            mp.events.callRemote("borrarveh");
            if(tiertrabajando == 1){
                mp.events.callRemote("pagar",tiertrabajando);
            }else if(tiertrabajando == 2){
                mp.events.callRemote("pagarT2",tiertrabajando);
            }
            mp.events.call("sonido","cobrarjob");
            if(work_van){
                mp.events.callRemote("borrarvehmundo",work_van);
            }
            electricistablip.setRoute(false);
            cobro_marker.destroy();
            cobro_marker = null; 
            is_hired = false;
            is_working = false;
            jobs_hechos = 0;
            trabajo_fin = false;
            van_spawned = false;
            ruta = 0;
            mp.events.callRemote("ropaoriginal");
        }else{
            mp.events.call('requestBrowser', `gui.chat.push('<i class="fa-regular fa-transformer-bolt" style="color:#ffa570"></i> <font color="#ffa570"><font color="#FF0000">&iexcl;&iexcl;Sube a tu vehiculo de trabajo!!</font>, o no podras terminar el trabajo</font>')`);
        }
    }else{
        mp.events.call('requestBrowser', `gui.chat.push('<i class="fa-regular fa-transformer-bolt" style="color:#ffa570"></i> <font color="#ffa570"><font color="#FF0000">&iexcl;&iexcl;No has terminado el trabajo GANDUL!!</font>, si quieres terminar el curro entonces habla con Paco</font>')`);
    }
}
mp.keys.bind(0x45, true, function () {
    
    if (mp.game.system.vdist(CONFIG.Garage.x, CONFIG.Garage.y, CONFIG.Garage.z, mp.players.local.position.x, mp.players.local.position.y, mp.players.local.position.z) < 2.0) {
        if (is_hired && van_spawned == false) {            
            spawn_car();
            get_new_mission();
        }
    }
    if (mp.game.system.vdist(CONFIG.GarageT2.x, CONFIG.GarageT2.y, CONFIG.GarageT2.z, mp.players.local.position.x, mp.players.local.position.y, mp.players.local.position.z) < 2.0) {
        if (is_hired && van_spawned == false) {            
            spawn_carT2();
            get_new_missionT2();
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
                mp.events.callRemote("checkExpJob","electricista");
                //interfazBrowser = mp.browsers.new('package://jobs/electrician/gui/electricista.html');
            }
        }
        if(is_hired==true && dejarJobBrowser == null){
            mp.gui.cursor.show(true, true);
            dejarJobBrowser = mp.browsers.new('package://jobs/electrician/gui/dejarjob.html');
        }
    }    

    if (mp.game.system.vdist(mission_data.mission.x, mission_data.mission.y, mission_data.mission.z, mp.players.local.position.x, mp.players.local.position.y, mp.players.local.position.z) < 2.0) {
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
mp.keys.bind(27, true, function () {//AL ESCAPE CIERRA LA VENTANA DEL MINIJUEGO
    if (cablesBrowser) {
        mp.gui.cursor.show(false, false);
        cablesBrowser.destroy();
        cablesBrowser = null; 
        mp.players.local.clearTasksImmediately();
        mp.players.local.freezePosition(false);   
        is_working = false;
    }
    if(simonBrowser){
        mp.gui.cursor.show(false, false);
        simonBrowser.destroy();
        simonBrowser = null; 
        mp.players.local.clearTasksImmediately();
        mp.players.local.freezePosition(false);   
        is_working = false;
    }
});
mp.events.add('llamaInterfazElec', (tier,exp) => {
    interfazBrowser = mp.browsers.new('package://jobs/electrician/gui/electricista.html');
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
            mp.game.graphics.drawText(`Repara el panel y vuelve a tu vehiculo de trabajo o perderas el trabajo, tienes: ${outside_car_timer} segundos.`, [0.5, 0.1], {
                font: 0,
                color: [255, 255, 255, 255],
                scale: [0.3, 0.3],
                outline: true
            });
        }
    }
    if(mensajeTemp){
        mp.game.graphics.drawText(`No tienes la habilidad necesaria como hacker`, [0.5, 0.1], {
            font: 0,
            color: [255, 0, 0, 255],
            scale: [0.3, 0.3],
            outline: true
        });
    }
});
mp.events.add('cablesfinalizados', () => {
    if (cablesBrowser) {
        cablesBrowser.destroy();
        cablesBrowser = null; 
        mp.gui.cursor.show(false, false);

    }
    jobs_hechos++; 
    if (jobs_hechos == CONFIG.panelestier2.length){
        trabajo_fin = true ;
    }  
    mp.players.local.clearTasksImmediately();
    mission_data.blip.destroy();
    mission_data.marker.destroy();
    mission_data.text.destroy();
    mp.players.local.freezePosition(false);            
    if(trabajo_fin){
        mp.events.call('requestBrowser', `gui.chat.push('<i class="fa-regular fa-transformer-bolt" style="color:#ffa570"></i> <font color="#ffa570"><font color="#75ff78">[RADIO]&iexcl;Todos los paneles han sido reparados!</font> vuelve a la central y cobra</font>')`);
        cobro_marker = mp.markers.new(1, new mp.Vector3(CONFIG.cobro.x, CONFIG.cobro.y, CONFIG.cobro.z - 1.0), 3.7, {
            color: [0, 255, 0, 100], //verde
            visible: true,
            dimension: 0
        }); 
    mp.events.call("sonido","completado");
    //waypoint hacia cobro
    electricistablip.setRoute(true);
    }else{                
        get_new_mission();
        is_working = false; 
        // FUNCION PARA COGER EL SIGUIENTE PUNTO DE LA RUTA
        mp.events.call('requestBrowser', `gui.chat.push('<i class="fa-regular fa-transformer-bolt" style="color:#ffa570"></i> <font color="#ffa570"><font color="#75ff78">[RADIO]&iexcl;Panel reparado!</font> continua hacia el siguiente panel</font>')`);
    }
    
});
mp.events.add("finsimonInterfaz", () => {
    if (simonBrowser) {
        simonBrowser.destroy();
        simonBrowser = null; 
        mp.gui.cursor.show(false, false);
    }
    mp.events.call("sonido","panelreparado");
    jobs_hechos++; 
    if (jobs_hechos == resultado.length){
        trabajo_fin = true ;
    }  
    mp.players.local.clearTasksImmediately();
    mission_data.blip.destroy();
    mission_data.marker.destroy();
    mission_data.text.destroy();
    mp.players.local.freezePosition(false);            
    if(trabajo_fin){
        mp.events.call('requestBrowser', `gui.chat.push('<i class="fa-regular fa-transformer-bolt" style="color:#ffa570"></i> <font color="#ffa570"><font color="#75ff78">[RADIO]&iexcl;Todos los paneles han sido reparados!</font> vuelve a la central y cobra</font>')`);
        cobro_marker = mp.markers.new(1, new mp.Vector3(CONFIG.cobro.x, CONFIG.cobro.y, CONFIG.cobro.z - 1.0), 3.7, {
            color: [0, 255, 0, 100], //verde
            visible: true,
            dimension: 0
        }); 
    //waypoint hacia cobro
    electricistablip.setRoute(true);
    }else{                
        get_new_missionT2();
        is_working = false; 
        // FUNCION PARA COGER EL SIGUIENTE PUNTO DE LA RUTA
        mp.events.call('requestBrowser', `gui.chat.push('<i class="fa-regular fa-transformer-bolt" style="color:#ffa570"></i> <font color="#ffa570"><font color="#75ff78">[RADIO]&iexcl;Panel reparado!</font> continua hacia el siguiente panel</font>')`);
    }
});
mp.events.add("llamadajobtier1", () => {
    if (interfazBrowser) {
        interfazBrowser.destroy();
        interfazBrowser = null; 
        mp.gui.cursor.show(false, false);
    }
    hire();
})

mp.events.add("llamadajobtier2", (respuesta) => {
    if(respuesta == "no"){
        mensajeTemp = true ;
        
        if (interfazBrowser) {
            interfazBrowser.destroy();
            interfazBrowser = null; 
            mp.gui.cursor.show(false, false);
        }
        setTimeout(() => {
            mensajeTemp = false;
        }, 4000); 
        return
    }
    if (interfazBrowser) {
        interfazBrowser.destroy();
        interfazBrowser = null; 
        mp.gui.cursor.show(false, false);
    }
    //mp.game.graphics.notify('~g~Contratado en tier2');
    hireT2();
})
mp.events.add("cerrarmenuElec", () => {
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
mp.events.add("dimitir", () => {
    if (dejarJobBrowser) {
        dejarJobBrowser.destroy();
        dejarJobBrowser = null; 
        mp.gui.cursor.show(false, false);
    }
    mp.events.callRemote("test", false);
    stop_working();
})
