// loader.js - Controla el orden de ejecución
window.appEstado = {
    p5Listo: false,
    sketchListo: false,
    funcionesListas: false
};

// Esperar a que p5.js esté disponible
function esperarP5(callback) {
    if (typeof p5 !== 'undefined') {
        callback();
    } else {
        setTimeout(() => esperarP5(callback), 100);
    }
}

// Iniciar todo
esperarP5(function() {
    // Cargar sketch.js dinámicamente
    const script = document.createElement('script');
    script.src = 'sketch.js';
    document.head.appendChild(script);
});