document.addEventListener("DOMContentLoaded", function() {
    console.log("ocultamos info")
});
function loadContent(param){
    let content = ''
    
    if (param === 'info') {
        content = 'La info del pj jamon';
    } else if (param === 'gubernamentales') {
        content = 'Gubernamentales jamonas';
    } else if (param === 'empresas') {
        content = 'Las empresas jamonas';
    }else if (param === 'actionCoins') {
        content = 'Esto es el texto de las actioncoins';
    }

    // Mostrar el contenido en el área designada
    document.getElementById('content').innerHTML = content;
    document.getElementById('content').style.display = 'block';
}