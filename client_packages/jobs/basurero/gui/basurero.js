function cerrar(){
    mp.events.call('cerrarmenuBasurero'); 
}
function trabajar(tier){
    switch(tier){
        case 1: 
            mp.events.call('llamadajobBasureroTier1');
            break;
        case 2:
            mp.events.call('checkskillcliente');
            break;
    }
}
function dimitir(){
    mp.events.call('dimitirBasurero'); 
}
var root = document.documentElement;

function updatebarraskill(tier,exp){
    document.getElementById('tier').textContent = "Tier " + tier;
    root.style.setProperty('--final-width', exp+'%');
    increase(exp);
}
 // Puedes ajustar el valor según tus necesidades
function increase(tier,exp) {
    
    // Change the variable to modify the speed of the number increasing from 0 to (ms)
    let SPEED = 40;
    // Retrieve the percentage value
    let limit = parseInt(document.getElementById("value1").innerHTML, 10);
    limit = tier;
    for(let i = 0; i <= limit; i++) {
        setTimeout(function () {
            document.getElementById("value1").innerHTML = i + "%";
        }, SPEED * i);
    }
}
