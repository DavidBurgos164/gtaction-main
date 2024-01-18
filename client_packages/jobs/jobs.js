mp.events.add("sonido", (param) => {
    if(param == "panelreparado"){
        mp.game.audio.playSoundFrontend(-1, "Goal", "DLC_HEIST_HACKING_SNAKE_SOUNDS", true);//punto
    }else if(param == "contratado"){
        //mp.game.audio.playSoundFrontend(-1, "BASE_JUMP_PASSED", "HUD_AWARDS", true);//contratado
        mp.game.audio.playSoundFrontend(-1, "Menu_Accept", "Phone_SoundSet_Default", true);
    }else if(param == "stop_work"){
        mp.game.audio.playSoundFrontend(-1, "ScreenFlash", "MissionFailedSounds", true);
    }else if(param == "paradabus"){
        mp.game.audio.playSoundFrontend(-1, "CHECKPOINT_PERFECT", "HUD_MINI_GAME_SOUNDSET", true);
    }else if(param == "paradabusFail"){
        // DE MOMENTO NO HAY NINGUNO QUE CONVEZCA mp.game.audio.playSoundFrontend(-1, "CANCEL", "HUD_FREEMODE_SOUNDSET", true);
    }else if(param == "failBOMBA"){
        mp.game.audio.playSoundFrontend(-1, "Failure", "DLC_HEIST_HACKING_SNAKE_SOUNDS", true);//PETARDAZO DEL COPON, NO USAR
    }else if(param == "completado"){        
        mp.game.audio.playSoundFrontend(-1, "Mission_Pass_Notify", "DLC_HEISTS_GENERAL_FRONTEND_SOUNDS", true);//PETARDAZO DEL COPON, NO USAR
    }else if(param == "cobrarjob"){
        mp.game.audio.playSoundFrontend(-1, "LOCAL_PLYR_CASH_COUNTER_COMPLETE", "DLC_HEISTS_GENERAL_FRONTEND_SOUNDS", true);
    }
})
mp.events.add('entityStreamIn', (entity) => {
    if (entity.type === "player" && entity.getVariable("animLenador")) {
        if(entity.type == 'player') {
            entity.hacha = mp.objects.new('prop_w_me_hatchet', entity.position, {
                rotation: new mp.Vector3(0, 0, 0),
                alpha: 255,
                dimension: entity.dimension
            });            
            setTimeout(() => {
                entity.hacha.attachTo(entity.handle, 71, 0.088, 0.02, -0.02, 71, 166.0, 180, true, true, false, false, 0, true);
            }, 200);    
    }
    }
}); 
mp.events.addDataHandler({
    'moviltest': (entity, value) => {
        if(entity.type == 'player' && value == true) {
            entity.mobilePhone = mp.objects.new('hei_prop_heist_binbag', entity.position, {
                rotation: new mp.Vector3(0, 0, 0),
                alpha: 255,
                dimension: entity.dimension
            });
            
            setTimeout(() => {
                entity.mobilePhone.attachTo(entity.handle, 71, 0.1, 0, 0, -45, 300, 0, true, true, false, false, 0, true);
            }, 200);
        }else{
            if(entity.mobilePhone) { entity.mobilePhone.destroy(); }
            entity.clearTasks();
        }

    },
})
let interfazBrowser;
mp.events.add('test', () => {
    interfazBrowser = mp.browsers.new('package://ui/build/index.html');
    //interfazBrowser.url = "package://"
    //interfazBrowser.execute(`updatebarraskill('${tier}', ${exp});`);
})