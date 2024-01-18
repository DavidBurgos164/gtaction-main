function cerrar(){
    mp.events.call('cerrarmenuLenador'); 
}
function trabajar(tier){
    switch(tier){
        case 1: 
            mp.events.call('llamadajobtier1Lenador');
            break;
        case 2:            
            mp.events.call('checkskillLenador',"roble");
            break;
    }
}
function dimitir(){
    mp.events.call('dimitirLenador'); 
}
var root = document.documentElement;

function updatebarraskill(tier,exp){
    document.getElementById('tier').textContent = "Tier " + tier;
    root.style.setProperty('--final-width', exp+'%');
    increase(exp);
}
 // Puedes ajustar el valor según tus necesidades
function increase(exp) {
    
    // Change the variable to modify the speed of the number increasing from 0 to (ms)
    let SPEED = 40;
    // Retrieve the percentage value
    let limit = parseInt(document.getElementById("value1").innerHTML, 10);
    limit = exp;
    for(let i = 0; i <= limit; i++) {
        setTimeout(function () {
            document.getElementById("value1").innerHTML = i + "%";
        }, SPEED * i);
    }
}
