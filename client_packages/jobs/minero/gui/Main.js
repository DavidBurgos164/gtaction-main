mp.events.add('checkskillMineria', (tipoMineral) => {
    mp.events.callRemote("checkskillMineriaSV",tipoMineral);
});
