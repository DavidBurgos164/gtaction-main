let isFrozen = false;
var bigmap = [];

bigmap.status = 0;
bigmap.timer = null;
var time = null;
var adminInter = null;
mp.game.ui.setRadarZoom(1.0);
mp.game.ui.setRadarBigmapEnabled(false, false);
var esptoggle = 0;
var myalvl = 0;
var loggedin = mp.players.local.getVariable('loggedIn')
var ps = mp.players.local;
const player = mp.players.local;

if (mp.storage.data.espConfig != undefined) {
    mp.storage.data.espConfig.forEach((item, i) => {
        mp.players.local[item.type] = item.value;
    })
}


let tog = true;

mp.events.add({
    'adminTags': (bool) => {
        if(bool) {
            tog = true;
        }
        else if(!bool) { tog = false }
    },
    'entityStreamIn': (entity) => {
        if(entity.type == 'player' && entity.getVariable('adminFly') == true) {
            entity.setAlpha(0);
        }
    },
    'render': () => {
        if(mp.players.local.getVariable('adminDuty')) {
            mp.game.invoke('0xAEEDAD1420C65CC0', false);
            mp.game.invoke('0xBA3D194057C79A7B', 'ped_foot_water')
            mp.players.local.setCanRagdoll(false);
            mp.players.local.setInvincible(true)
        }
        else {
            mp.players.local.setInvincible(false);
            mp.players.local.setCanRagdoll(true);
         }
        if(mp.players.local.getVariable('devdebug') == true) {
            if(mp.players.local.weapon) {
                mp.game.graphics.drawText(`${mp.players.local.getAmmoInClip(mp.players.local.weapon)} ${mp.players.local.getWeaponAmmo(mp.players.local.weapon)}`, [0.5, 0.39], {
                    font: 4,
                    color: [255, 255, 255, 255],
                    scale: [0.5, 0.5],
                    outline: false
                });
            }
            if(mp.players.local.vehicle) {
                mp.game.graphics.drawText(`${mp.players.local.vehicle.handle} ${Math.trunc(mp.players.local.vehicle.getSpeed())} ${mp.players.local.vehicle.type} ${mp.players.local.vehicle.id} ${Math.trunc(mp.players.local.vehicle.getHeading())}`, [0.5, 0.6], {
                    font: 4,
                    color: [255, 255, 255, 255],
                    scale: [0.5, 0.5],
                    outline: false
                });
            }
        }
        if(mp.players.local.getVariable('adminJailed') == true && mp.players.local.getVariable('loggedIn') == true) {
            mp.game.graphics.drawText(`You are in ~r~Admin Jail~w~ for ~g~${player.getVariable('ajailReason')}~w~\n Time Remaining: ~b~${time} seconds~w~`, [0.5, 0.85], {
                font: 4,
                color: [255, 255, 255, 255],
                scale: [0.45, 0.45],
                outline: true
            });
        }
        if(mp.players.local.getVariable('adminDuty') == true) {
            //mp.players.local.setInvincible(true);
            if(mp.players.local.vehicle) {
                mp.game.invoke('0x42A8EC77D5150CBE', mp.players.local.vehicle, 1.0);
            }
        }
        if(ps.getVariable('adminDuty') == true && tog && ps.getVariable('adminFly') || ps.getVariable('adminDuty') && ps.getVariable('adminLevel') == 8 && tog) {
            mp.players.forEachInStreamRange(player => {
                if (player.handle !== 0 && player != mp.players.local) {
                    if(mp.players.local.espTags == true) {
                        position = player.position;
                        if(player.getVariable('adminDuty')) {
                            mp.game.graphics.drawText('[ADMIN] ' + `${player.getVariable('talking') ? '~g~' : '~w~'}` + player.getVariable('adminName') + `~w~ [${player.remoteId}] \n~w~<font color="#29FF8C"> HP: ${player.getHealth()}</font> ~w~<font color="#29C2FF">Armour: ${player.getArmour()}</font>\n ${player.weapon ? `~w~<font color="#ECA7FF">Wep: ${player.weapon}</font> ~w~<font color="#FF669A">Clip: ${player.getAmmoInClip(player.weapon)}</font> ~w~<font color="#AC86FF">Ammo: ${player.getWeaponAmmo(player.weapon)}` : ''}</font>`, [position.x, position.y, position.z+1.3], {
                                scale: [0.3, 0.3],
                                outline: true,
                                color: [255, 0, 0, 255],
                                font: 4
                            });
                        } else {
                            mp.game.graphics.drawText(`${Math.floor(mp.game.system.vdist(mp.players.local.position.x, mp.players.local.position.y, mp.players.local.position.z, position.x, position.y, position.z))} ${player.getVariable('talking') ? '~g~' : '~w~'}${player.getVariable('characterName')}~w~` + ` [${player.remoteId}] \n~w~<font color="#29FF8C"> HP: ${player.getHealth()}</font> ~w~<font color="#29C2FF">Armour: ${player.getArmour()}</font>\nClip: ${player.getAmmoInClip(player.weapon)}</font> ~w~<font color="#AC86FF">Ammo: ${player.getWeaponAmmo(player.weapon)}</font>`, [position.x, position.y, position.z+1.3], {
                                scale: [0.3, 0.3],
                                outline: true,
                                color: [255, 255, 255, 255],
                                font: 4
                            });
                        }
                    }
                    if(mp.players.local.espTracer == true) {
                        mp.game.graphics.drawLine(mp.players.local.position.x, mp.players.local.position.y, mp.players.local.position.z, player.position.x, player.position.y, player.position.z, 118, 255, 144, 255)
                    }
                }
            });
            mp.vehicles.forEachInStreamRange(vehicle => {
                if (vehicle.handle !== 0 && vehicle !== mp.players.local) {
                    if(mp.players.local.espTags) {
                        position = vehicle.position;
                        var clientP = mp.players.local.position;
                        mp.game.graphics.drawText(mp.game.vehicle.getDisplayNameFromVehicleModel(vehicle.model) + ` PLATE: ${vehicle.getNumberPlateText()} | SQLID: ${vehicle.getVariable('sqlID')} | ID: ${vehicle.remoteId} | DIST: ${Math.floor(mp.game.system.vdist(clientP.x, clientP.y, clientP.z, position.x, position.y, position.z))}`, [position.x, position.y, position.z-0.5], {
                            scale: [0.26, 0.26],
                            outline: true,
                            color: [255, 255, 255, 255],
                            font: 4
                        });
                    }
                    if(mp.players.local.espTracer == true) {
                        mp.game.graphics.drawLine(mp.players.local.position.x, mp.players.local.position.y, mp.players.local.position.z, vehicle.position.x, vehicle.position.y, vehicle.position.z, 255, 118, 249, 255);
                    }
                }
            });
        }
        const adminMode = mp.players.local.getVariable('adminDuty');
        const aName = mp.players.local.getVariable('adminName');
        const adminLevel = mp.players.local.getVariable('adminLevel')
        function Round(n, k) {
            var factor = Math.pow(10, k + 1);
            n = Math.round(Math.round(n * factor) / 10);
            return n / (factor / 10);
        }
        if (adminMode && tog) {
            let msg = `~r~On duty as ${adminLevel > 7 ? '~HUD_COLOUR_GOLD~Developer~r~ ' : ''}${aName}`;
            mp.players.local.armour = 100
            mp.game.graphics.drawText(msg, [0.5, 0.93], {
                font: 4,
                color: [255, 255, 255, 255],
                scale: [0.7, 0.7],
                outline: false
            });
            var ppos = "~r~X: ~w~" + Round(mp.players.local.position.x, 1) + " ~r~Y: ~w~" + Round(mp.players.local.position.y, 1) + " ~r~Z: ~w~" + Round(mp.players.local.position.z, 1);
            mp.game.graphics.drawText(ppos, [0.5, 0.967], {
                font: 4,
                color: [255, 255, 255, 255],
                scale: [0.5, 0.5],
                outline: false
            });
        }
    },
    'startAdminJail': (settime) => {
        time = settime;
        adminInter = setInterval(() => {
            if(time == 0) {
                mp.events.callRemote('endAjail');
                clearInterval(adminInter);
            };
            time--;
            mp.events.callRemote('saveajail', time);
        }, 1000);
    },
    'clearAdminInter': () => {
        if(adminInter) {
            clearInterval(adminInter);
        }
    },
    'freezePlayer': () => {
        mp.players.local.freezePosition(true);
    },
    'unfreezePlayer': () => {
        mp.players.local.freezePosition(false);
    }
});

mp.events.addDataHandler({
    'adminFly': function (entity, value) {
        if(entity.type == 'player') {
            switch(value) {
                case true:
                    {
                        entity.setAlpha(0);
                    }
                case false:
                    {
                        entity.setAlpha(255);
                    }
                default:
                    break;
            }
        }
    }
})

const useSpeedo = true;
const updateInterval = 10; // milliseconds, lower value = more accurate, at the cost of performance

const Natives = {
    IS_RADAR_HIDDEN: "0x157F93B036700462",
    IS_RADAR_ENABLED: "0xAF754F20EB5CD51A",
    SET_TEXT_OUTLINE: "0x2513DFB0FB8400FE"
};

let streetName = null;
let zoneName = null;
let isMetric = false;
let minimap = {};

function getMinimapAnchor() {
    let sfX = 1.0 / 20.0;
    let sfY = 1.0 / 20.0;
    let safeZone = mp.game.graphics.getSafeZoneSize();
    let aspectRatio = mp.game.graphics.getScreenAspectRatio(false);
    let resolution = mp.game.graphics.getScreenActiveResolution(0, 0);
    let scaleX = 1.0 / resolution.x;
    let scaleY = 1.0 / resolution.y;

    let minimap = {
        width: scaleX * (resolution.x / (4 * aspectRatio)),
        height: scaleY * (resolution.y / 5.674),
        scaleX: scaleX,
        scaleY: scaleY,
        leftX: scaleX * (resolution.x * (sfX * (Math.abs(safeZone - 1.0) * 10))),
        bottomY: 1.0 - scaleY * (resolution.y * (sfY * (Math.abs(safeZone - 1.0) * 10))),
    };

    minimap.rightX = minimap.leftX + minimap.width;
    minimap.topY = minimap.bottomY - minimap.height;
    return minimap;
}

function drawText(text, drawXY, font, color, scale, alignRight = false) {
    mp.game.ui.setTextEntry("STRING");
    mp.game.ui.addTextComponentSubstringPlayerName(text);
    mp.game.ui.setTextFont(font);
    mp.game.ui.setTextScale(scale, scale);
    mp.game.ui.setTextColour(color[0], color[1], color[2], color[3]);
    mp.game.invoke(Natives.SET_TEXT_OUTLINE);

    if (alignRight) {
        mp.game.ui.setTextRightJustify(true);
        mp.game.ui.setTextWrap(0, drawXY[0]);
    }

    mp.game.ui.drawText(drawXY[0], drawXY[1]);
}



const teleportWaypoint = () => {
    const waypoint = mp.game.ui.getFirstBlipInfoId(8);
    if (!mp.game.ui.doesBlipExist(waypoint)) return mp.events.call('notifCreate', `~r~You do not have a waypoint set!`);
    const waypointPos = mp.game.ui.getBlipInfoIdCoord(waypoint);
    if (!waypointPos) return mp.events.call('notifCreate', `~r~You do not have a waypoint set!`);

    let zCoord = mp.game.gameplay.getGroundZFor3DCoord(waypointPos.x, waypointPos.y, waypointPos.z, false, false);
    if (!zCoord) {
        for (let i = 1000; i >= 0; i -= 25) {
            mp.game.streaming.requestCollisionAtCoord(waypointPos.x, waypointPos.y, i);
            mp.game.wait(0);
        }
        zCoord = mp.game.gameplay.getGroundZFor3DCoord(waypointPos.x, waypointPos.y, 1000, false, false);
        if (!zCoord) return mp.events.call('notifCreate', `~r~You cannot teleport to this area!`);;
    }
    mp.players.local.position = new mp.Vector3(waypointPos.x, waypointPos.y, zCoord + 0.5);
    return mp.events.call('notifCreate', `~r~Teleported to waypoint!`);
};

mp.events.add('TELEPORTWAY', () => {
    const adminMode = mp.players.local.getVariable('adminDuty');
    const adminLevel = mp.players.local.getVariable('adminLevel')
    if( !(adminLevel > 7 || adminMode) ) return;
    teleportWaypoint();
});

mp.events.add('playerReady', () => {
    var northBlip = mp.game.invoke('0x3F0CF9CB7E589B88')
    if(northBlip) {
        mp.game.invoke('0x45FF974EEE1C8734', northBlip, 0)
     }
    mp.events.call('client:showLoginScreen');
    mp.players.local.hasHud = true;
});






setInterval(() => {
    var hashud = mp.players.local.getVariable('hasHud')
    if (mp.game.invoke(Natives.IS_RADAR_ENABLED) && !mp.game.invoke(Natives.IS_RADAR_HIDDEN) && hashud) {
        isMetric = mp.game.gameplay.getProfileSetting(227) == 1;
        minimap = getMinimapAnchor();
        var localPlayer = mp.players.local;
        const position = mp.players.local.position;
        let getStreet = mp.game.pathfind.getStreetNameAtCoord(position.x, position.y, position.z, 0, 0);
        sid = mp.players.local.getVariable('sid');
        playerID = `${sid} | ${Math.floor(new Date().getTime() / 1000)}`;
        playerPing = `PING: ${localPlayer.playerPing}`;
        let heading = mp.players.local.getHeading();
        // Call server time event (Sets variable to local player!)
        // <font color="#b0b0b0">${mp.players.local.getVariable('serverTime')}</font>
        mp.events.callRemote('currenttime');
        serverTime = (`~HUD_COLOUR_OBJECTIVE_ROUTE~${mp.players.local.getVariable('serverTime')}`);
        if (mp.players.local.heading != 0) {
            if (heading < 45 || heading > 315) {
                direction = "N";
            }
            if (heading > 45 && heading < 135) {
                direction = "W";
            }
            if (heading > 135 && heading < 225) {
                direction = "S";
            }
            if (heading > 255 && heading < 315) {
                direction = "E";
            }

        }

        function Round(n, k) {
            var factor = Math.pow(10, k + 1);
            n = Math.round(Math.round(n * factor) / 10);
            return n / (factor / 10);
        }
        var player = mp.players.local;
        const pozaX = player.position.x;
        const pozaY = player.position.y;
        const pozaZ = player.position.z;
        //player.outputChatBox("~r~X ~w~" + Round(pozaX, 3));
        //player.outputChatBox("~r~Y ~w~" + Round(pozaY, 3));
        //player.outputChatBox("~r~Z ~w~" + Round(pozaZ, 3));
        playerCompass = `~w~<font color="#b0b0b0">|</font> ${direction} ~w~<font color="#b0b0b0">|</font>`;
        playerPosition = "~r~X: ~w~" + Round(pozaX, 1) + " ~r~Y: ~w~" + Round(pozaY, 1) + " ~r~Z: ~w~" + Round(pozaZ, 1);
        const camera = mp.cameras.new("gameplay");
        zoneName = mp.game.ui.getLabelText(mp.game.zone.getNameOfZone(position.x, position.y, position.z));
        streetName = mp.game.ui.getStreetNameFromHashKey(getStreet.streetName);
        if (getStreet.crossingRoad && getStreet.crossingRoad != getStreet.streetName) streetName += `, ${mp.game.ui.getStreetNameFromHashKey(getStreet.crossingRoad)}`;
    } else {
        playerID = null;
        streetName = null;
        zoneName = null;
    }
}, updateInterval);

// NO CLIP
// Toggle Cursor script
var getNormalizedVector = function(vector) {
    var mag = Math.sqrt(
      vector.x * vector.x + vector.y * vector.y + vector.z * vector.z
    );
    vector.x = vector.x / mag;
    vector.y = vector.y / mag;
    vector.z = vector.z / mag;
    return vector;
  };
  var getCrossProduct = function(v1, v2) {
    var vector = new mp.Vector3(0, 0, 0);
    vector.x = v1.y * v2.z - v1.z * v2.y;
    vector.y = v1.z * v2.x - v1.x * v2.z;
    vector.z = v1.x * v2.y - v1.y * v2.x;
    return vector;
  };
  var bindVirtualKeys = {
    F4: 0x73
  };
  var bindASCIIKeys = {
    Q: 69,
    E: 81,
    LCtrl: 17,
    Shift: 16
  };
  var isNoClip = false;
  var noClipCamera;
  var shiftModifier = false;
  var controlModifier = false;
  var localPlayer = mp.players.local;
  mp.keys.bind(bindVirtualKeys.F4, true, function() {
    isNoClip = !isNoClip;
    mp.game.ui.displayRadar(!isNoClip);
    if (isNoClip) {
      startNoClip();
    } else {
      stopNoClip();
    }
  });
  function startNoClip() {
    mp.game.graphics.notify('NoClip ~g~activated');
    var camPos = new mp.Vector3(
      localPlayer.position.x,
      localPlayer.position.y,
      localPlayer.position.z
    );
    var camRot = mp.game.cam.getGameplayCamRot(2);
    noClipCamera = mp.cameras.new('default', camPos, camRot, 45);
    noClipCamera.setActive(true);
    mp.game.cam.renderScriptCams(true, false, 0, true, false);
    localPlayer.freezePosition(true);
    localPlayer.setInvincible(true);
    localPlayer.setVisible(false, false);
    localPlayer.setCollision(false, false);
  }
  function stopNoClip() {
    mp.game.graphics.notify('NoClip ~r~disabled');
    if (noClipCamera) {
      localPlayer.position = noClipCamera.getCoord();
      localPlayer.setHeading(noClipCamera.getRot(2).z);
      noClipCamera.destroy(true);
      noClipCamera = null;
    }
    mp.game.cam.renderScriptCams(false, false, 0, true, false);
    localPlayer.freezePosition(false);
    localPlayer.setInvincible(false);
    localPlayer.setVisible(true, false);
    localPlayer.setCollision(true, false);
  }
  mp.events.add('render', function() {
    if (!noClipCamera || mp.gui.cursor.visible) {
      return;
    }
    controlModifier = mp.keys.isDown(bindASCIIKeys.LCtrl);
    shiftModifier = mp.keys.isDown(bindASCIIKeys.Shift);
    var rot = noClipCamera.getRot(2);
    var fastMult = 1;
    var slowMult = 1;
    if (shiftModifier) {
      fastMult = 3;
    } else if (controlModifier) {
      slowMult = 0.5;
    }
    var rightAxisX = mp.game.controls.getDisabledControlNormal(0, 220);
    var rightAxisY = mp.game.controls.getDisabledControlNormal(0, 221);
    var leftAxisX = mp.game.controls.getDisabledControlNormal(0, 218);
    var leftAxisY = mp.game.controls.getDisabledControlNormal(0, 219);
    var pos = noClipCamera.getCoord();
    var rr = noClipCamera.getDirection();
    var vector = new mp.Vector3(0, 0, 0);
    vector.x = rr.x * leftAxisY * fastMult * slowMult;
    vector.y = rr.y * leftAxisY * fastMult * slowMult;
    vector.z = rr.z * leftAxisY * fastMult * slowMult;
    var upVector = new mp.Vector3(0, 0, 1);
    var rightVector = getCrossProduct(
      getNormalizedVector(rr),
      getNormalizedVector(upVector)
    );
    rightVector.x *= leftAxisX * 0.5;
    rightVector.y *= leftAxisX * 0.5;
    rightVector.z *= leftAxisX * 0.5;
    var upMovement = 0.0;
    if (mp.keys.isDown(bindASCIIKeys.Q)) {
      upMovement = 0.5;
    }
    var downMovement = 0.0;
    if (mp.keys.isDown(bindASCIIKeys.E)) {
      downMovement = 0.5;
    }
    mp.players.local.position = new mp.Vector3(
      pos.x + vector.x + 1,
      pos.y + vector.y + 1,
      pos.z + vector.z + 1
    );
    mp.players.local.heading = rr.z;
    noClipCamera.setCoord(
      pos.x - vector.x + rightVector.x,
      pos.y - vector.y + rightVector.y,
      pos.z - vector.z + rightVector.z + upMovement - downMovement
    );
    noClipCamera.setRot(
      rot.x + rightAxisY * -5.0,
      0.0,
      rot.z + rightAxisX * -5.0,
      2
    );
  });
  




// LLEGA AQUI
let specCam = null;

/* Camera settings */
const mouseSensitivity = 6.5;
const zoomSpeed = 3.5;
const minZoom = 5.0;
const maxZoom = 60.0;

mp.events.add('StartSpectatingTarget::Client', (target) => {
    mp.players.local.attachTo(target.handle, 0, 0, 0, 10, 0, 0, 0, true, false, false, false, 0, false);
    setupSpectatingCamera(target);
});

mp.events.add('StopSpectatingTarget::Client', () => {
    mp.players.local.detach(true, false);
    mp.game.cam.renderScriptCams(false, false, 0, true, false);
    specCam.destroy();
    specCam = null;
});

function setupSpectatingCamera(target){
    // Create a new camera
	specCam = mp.cameras.new('default', target.position,
                                        new mp.Vector3(0, 0, target.getHeading()),
                                        60);
	specCam.attachTo(target.handle, 0, -1.75, 1.75, true);
	specCam.setActive(true);
    mp.game.cam.renderScriptCams(true, false, 0, true, false);
}

mp.events.add('render', () => {
    if (specCam !== null && specCam.isActive() && specCam.isRendering()) {
        mp.game.controls.disableAllControlActions(2);

        var x = (mp.game.controls.getDisabledControlNormal(7, 1) * mouseSensitivity);
        var y = (mp.game.controls.getDisabledControlNormal(7, 2) * mouseSensitivity);
        var zoomIn = (mp.game.controls.getDisabledControlNormal(2, 40) * zoomSpeed);
        var zoomOut = (mp.game.controls.getDisabledControlNormal(2, 41) * zoomSpeed);

        var currentRot = specCam.getRot(2);

        currentRot = new mp.Vector3(currentRot.x - y, 0, currentRot.z - x);

        specCam.setRot(currentRot.x, currentRot.y, currentRot.z, 2);

        if (zoomIn > 0)
        {
            var currentFov = specCam.getFov();
            currentFov -= zoomIn;
            if (currentFov < minZoom)
                currentFov = minZoom;
            specCam.setFov(currentFov);
        } else if (zoomOut > 0)
        {
            var currentFov = specCam.getFov();
            currentFov += zoomOut;
            if (currentFov > maxZoom)
                currentFov = maxZoom;
            specCam.setFov(currentFov);
        }
    }
});