function crearMenuHTML() {
  // Crear barra de menú con HTML/CSS
  let menuHTML = `
    <div id="menu-bar" style="
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      background: #2c3e50;
      color: white;
      padding: 10px;
      z-index: 1000;
      font-family: Arial, sans-serif;
    ">
      <span style="margin-right: 20px; font-weight: bold;">Az-zait</span>
      
      <div style="display: inline-block; position: relative;">
        <button onclick="toggleMenu('archivo-menu')" style="
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          padding: 5px 10px;
        ">Archivo</button>
        <div id="archivo-menu" style="
          display: none;
          position: absolute;
          background: white;
          border: 1px solid #ccc;
          min-width: 150px;
          box-shadow: 2px 2px 5px rgba(0,0,0,0.2);
        ">
          <hr style="margin: 5px 0;">
          <hr style="margin: 5px 0;">
          <div onclick="window.close()" style="padding: 8px; cursor: pointer; color: black;">Salir</div>
        </div>
      </div>
      
      <div style="display: inline-block; position: relative; margin-left: 10px;">
        <button onclick="toggleMenu('config-menu')" style="
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          padding: 5px 10px;
        ">Configuración</button>
        <div id="config-menu" style="
          display: none;
          position: absolute;
          background: white;
          border: 1px solid #ccc;
          min-width: 150px;
          box-shadow: 2px 2px 5px rgba(0,0,0,0.2);
        ">
          <div onclick="guardarPosicionesConDialogo()" style="padding: 8px; cursor: pointer; color: black;">Guardar posiciones</div>
          <div onclick="cargarTapete()" style="padding: 8px; cursor: pointer; color: black;">Cargar tapete</div>
          <div onclick="eliminarTapete()" style="padding: 8px; cursor: pointer; color: black;">Eliminar tapete</div>
        </div>
      </div>
      
      <div style="float: center;">
        <span id="nombre-archivo" style="font-style: italic;">Sin_titulo</span>
      </div>
    </div>
    
    <style>
      /* ESTILOS PARA ELIMINAR MÁRGENES DEL BODY Y CANVAS */
      body {
        margin: 0;
        padding: 0;
        overflow: hidden;
      }
      
      canvas {
        display: block;
        position: absolute;
        top: 50px; /* Altura exacta del menú */
        left: 0;
        margin: 0 !important;
        padding: 0 !important;
        border: none !important;
      }
    </style>
  `;
  
  // Añadir al documento
  document.body.insertAdjacentHTML('afterbegin', menuHTML);
  
  // Ajustar el canvas después de que se cargue
  setTimeout(function() {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      // Medir la altura exacta del menú
      const menuHeight = document.getElementById('menu-bar').offsetHeight;
      
      // Posicionar el canvas justo debajo del menú
      canvas.style.position = 'absolute';
      canvas.style.top = menuHeight + 'px';
      canvas.style.left = '0';
      canvas.style.margin = '0';
      canvas.style.padding = '0';
      canvas.style.border = 'none';
      
      // Ajustar altura del canvas
      const newHeight = window.innerHeight - menuHeight;
      canvas.height = newHeight;
      canvas.style.height = newHeight + 'px';
      
      // Si estás en p5.js, redimensionar
      if (typeof resizeCanvas === 'function') {
        resizeCanvas(canvas.width, newHeight);
      }
    }
  }, 50);
}

// Función para alternar menús (la misma que tenías)
function toggleMenu(menuId) {
  const menu = document.getElementById(menuId);
  menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
  
  // Cerrar otros menús
  if (menuId === 'archivo-menu') {
    document.getElementById('config-menu').style.display = 'none';
  } else {
    document.getElementById('archivo-menu').style.display = 'none';
  }
}

// Cerrar menús al hacer clic fuera
document.addEventListener('click', function(event) {
  if (!event.target.closest('button')) {
    document.getElementById('archivo-menu').style.display = 'none';
    document.getElementById('config-menu').style.display = 'none';
  }
});

// Variables globales para p5.js
let ultimoArchivoAza = null;
let ultimoArchivoCrm = null;

function guardarPosicionesConDialogo() {
  crumblebot.xInicio = robotFisico.body.position.x;
  crumblebot.yInicio = robotFisico.body.position.y;
  crumblebot.anguloInicio = robotFisico.body.angle;
  
  obstaculoInicio = [];
  for (let i = 0; i < obstaculo.length; i++) {
    let obs = obstaculo[i];
    obstaculoInicio.push(new ObstaculoInicio(
      obs.body.position.x,
      obs.body.position.y,
      obs.ancho,
      obs.alto,
      obs.body.angle,
      obs.estatico
    ));
  }
  alert("Posiciones guardadas");
}

function nuevoArchivoConDialogo() {
  if (confirm("¿Está seguro de que desea crear un nuevo archivo? Se perderán los cambios no guardados.")) {
    eliminarConfiguracion();
    eliminarCrumble();   
    // Crear variables por defecto (u,v,w,x,y,z)
    for (let i = 0; i < 7; i++) {
      crearVariable(String.fromCharCode(116 + i)); // 116 = 't'
    }   
    // Actualizar título
    document.getElementById('nombre-archivo').textContent = 'Sin_titulo';
    ultimoArchivoAza = null;
    ultimoArchivoCrm = null;
  }
}

// Procedimiento para abrir solo .aza
function abrirArchivoAzaConDialogo() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.aza';  
  input.onchange = function(e) {
    const archivo = e.target.files[0];
    if (!archivo) return;  
    ultimoArchivoAza = archivo.name;
    // Preguntar si quiere cargar también el .crm asociado
    const nombreArchivoCrm = archivo.name.replace('.aza', '.crm');
    const reader = new FileReader();
    reader.onload = function(event) {
      const contenido = event.target.result; 
      // Verificar si existe archivo .crm con el mismo nombre
      fetch(nombreArchivoCrm)
        .then(response => {
          if (response.ok) {
            if (confirm(`¿Desea también abrir el archivo Crumble asociado?\n${nombreArchivoCrm}`)) {
              ultimoArchivoCrm = nombreArchivoCrm;
              abrirArchivoCrumble(nombreArchivoCrm);
            }
          }       
          // Procesar archivo .aza
          abrirArchivoDesdeContenido(contenido);
          document.getElementById('nombre-archivo').textContent = archivo.name;
        })
        .catch(() => {
          // Solo abrir .aza
          abrirArchivoDesdeContenido(contenido);
          document.getElementById('nombre-archivo').textContent = archivo.name;
        });
    };
  
    reader.readAsText(archivo);
  };
  input.click();
}

// Procedimiento para guardar solo .aza
function guardarArchivoAzaConDialogo() {
  const contenido = generarArchivo();
  // Crear nombre por defecto
  let nombreArchivo = ultimoArchivoAza || 'nuevo.aza';
  // Crear elemento de descarga
  const elemento = document.createElement('a');
  elemento.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(contenido));
  elemento.setAttribute('download', nombreArchivo);
  elemento.style.display = 'none';
  document.body.appendChild(elemento);
  elemento.click();
  document.body.removeChild(elemento);
  // Actualizar último archivo
  ultimoArchivoAza = nombreArchivo;
  document.getElementById('nombre-archivo').textContent = nombreArchivo;
  alert(`Archivo guardado exitosamente:\n${nombreArchivo}`);
  // Preguntar si quiere guardar también el .crm
  if (confirm('¿Desea también guardar el archivo Crumble?')) {
    guardarArchivoCrumbleConDialogo();
  }
}

// Procedimiento para abrir solo .crm
function abrirArchivoCrumbleConDialogo() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.crm';
  input.onchange = function(e) {
    const archivo = e.target.files[0];
    if (!archivo) return; 
    ultimoArchivoCrm = archivo.name;  
    const reader = new FileReader();
    reader.onload = function(event) {
      const contenido = event.target.result;
      abrirArchivoCrumbleDesdeContenido(contenido);
      document.getElementById('nombre-archivo').textContent = archivo.name;
    };  
    reader.readAsText(archivo);
  }; 
  input.click();
}

// Procedimiento para guardar solo .crm
function guardarArchivoCrumbleConDialogo() {
  const contenido = generarArchivoCrumble();
  // Crear nombre por defecto
  let nombreArchivo = ultimoArchivoCrm || 'nuevo.crm';
  // Crear elemento de descarga
  const elemento = document.createElement('a');
  elemento.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(contenido));
  elemento.setAttribute('download', nombreArchivo);
  elemento.style.display = 'none';
  document.body.appendChild(elemento);
  elemento.click();
  document.body.removeChild(elemento);
  // Actualizar último archivo
  ultimoArchivoCrm = nombreArchivo;
  document.getElementById('nombre-archivo').textContent = nombreArchivo;
  alert(`Archivo guardado exitosamente:\n${nombreArchivo}`);
}

function generarArchivo() {
  let xml = '<Canva>';
  // CRUMBLEBOT
  xml += `<Crumblebot><x>${crumblebot.xInicio}</x><y>${crumblebot.yInicio}</y><angulo>${crumblebot.anguloInicio}</angulo></Crumblebot>`;
  // TAPETE
  if (nombreFondo != null) {
    xml += `<Tapete><file>${nombreFondo}</file></Tapete>`;
  }
  // ULTRASONIDOS
  xml += `<Ultrasonido><conectado>${robot.ultrasonidosConectado}</conectado></Ultrasonido>`;
  // JUMPERS
  xml += '<Jumpers>';
  for (let variable of jumpers) {
    xml += `<Jumper><x>${variable.x}</x><y>${variable.y}</y></Jumper>`;
  }
  xml += '</Jumpers>';
  // CONECTORES DE CABLES
  xml += '<Conectores>';
  for (let variable of conector) {
    const gpioIndex = gpio.indexOf(variable.gpioConectado);
    const elementoIndex = elemento.indexOf(variable.elementoConectado);
    xml += `<Conector><x>${variable.x}</x><y>${variable.y}</y><gpioConectado>${gpioIndex}</gpioConectado><elementoConectado>${elementoIndex}</elementoConectado></Conector>`;
  }
  xml += '</Conectores>';
  // GPIOs
  xml += '<GPIOs>';
  for (let variable of gpio) {
    const conectorIndex = conector.indexOf(variable.conectorGPIO);
    xml += `<GPIO><conector>${conectorIndex}</conector></GPIO>`;
  }
  xml += '</GPIOs>';
  // ELEMENTOS
  xml += '<Elementos>';
  for (let variable of elemento) {
    const conectorIndex = conector.indexOf(variable.conectorElemento);
    xml += `<Elemento><conector>${conectorIndex}</conector></Elemento>`;
  }
  xml += '</Elementos>';
  // OBSTÁCULOS
  if (obstaculoInicio.length > 0) {
    xml += '<Obstaculos>';
    for (let variable of obstaculoInicio) {
      xml += `<Obstaculo><x>${variable.x}</x><y>${variable.y}</y><ancho>${variable.ancho}</ancho><alto>${variable.alto}</alto><angulo>${variable.angulo}</angulo><estatico>${variable.estatico}</estatico></Obstaculo>`;
    }
    xml += '</Obstaculos>';
  }
  xml += '</Canva>';
  return xml;
}

function generarArchivoCrumble() {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>';
  xml += '<CrumbleDocument version="1.5.8" language="english">';
  // Variables
  xml += '<Variables>';
  for (let variable of codigoVariables) {
    xml += `<Variable>${variable.texto[0]}</Variable>`;
  }
  xml += '</Variables>';
  // Canvas
  xml += '<Canvas>';
  // Bloques WhenRunBlock
  if (bloquesStart != null) {
    for (let bloque of bloquesStart) {
      xml += `<WhenRunBlock><x>${int(bloque.x + width / 2)}</x><y>${int(bloque.y + height / 2)}</y>`;
      if (bloque.siguiente != null) {
        xml += '<attach_point index="0">';
        xml += generarBloqueXML(bloque.siguiente, false);
        xml += '</attach_point>';
      }
      xml += '</WhenRunBlock>';
    }
  }
  // Bloques no conectados a ProgramStart
  for (let bloque of codigo) {
    if (!bloque.nombre == "WhenRunBlock"  && bloque.anterior == null && bloque.padre == null) {
      xml += generarBloqueXML(bloque, true);
    }
  }
  xml += '</Canvas>';
  xml += '</CrumbleDocument>';
  return xml;
}

function generarBloqueXML(bloque, esSuelto) {
  if (bloque == null) return "";
  // Caso especial para bloques ElseBlock
  if (bloque.nombre == "ElseBlock") return "";
  // Para variables
  if (bloque.variablePadre != null) {
    return `<VariableBlock>${bloque.texto[0]}</VariableBlock>`;
  }
  const infoBloque = obtenerInfoBloqueCrumble(bloque.nombre);
  if (infoBloque == null) return "";
  let xml = "";
  // Abrir etiqueta (con coordenadas si es suelto)
  if (esSuelto) {
    xml += `<${bloque.nombre}><x>${int(bloque.x + width / 2)}</x><y>${int(bloque.y + height / 2)}</y>`;
  } else {
    xml += `<${bloque.nombre}>`;
  }
  // Parámetros normales
  for (let i = 1; i < infoBloque.length; i++) {
    const paramName = infoBloque[i];
    if (paramName != "") {
      const tieneSubBloque = bloque.subBloque != null && i - 1 < bloque.subBloque.length && bloque.subBloque[i - 1] != null;
      const esParametroCondicional = paramName == "conditional";
      xml += `<${paramName}>`;
      // Si tiene subbloque
      if (tieneSubBloque) {
        if (esParametroCondicional) {
          xml += '<adopt_point index="0">';
          xml += generarBloqueXML(bloque.subBloque[i - 1], false);
          xml += '</adopt_point>';
        } else {
          if (bloque.dato != null && i - 1 < bloque.dato.length && bloque.dato[i - 1] != null) {
            xml += bloque.dato[i - 1];
          }
          xml += '<adopt_point index="0">';
          xml += generarBloqueXML(bloque.subBloque[i - 1], false);
          xml += '</adopt_point>';
        }
      } 
      // Si no tiene subbloque, usar el valor del dato
      else if (bloque.dato != null && i - 1 < bloque.dato.length && bloque.dato[i - 1] != null) {
        if (paramName == "colour") {
          const c = color(bloque.dato[i - 1]);
          xml += `<red>${int(red(c))}</red>`;
          xml += `<green>${int(green(c))}</green>`;
          xml += `<blue>${int(blue(c))}</blue>`;
        } else {
          xml += bloque.dato[i - 1];
        }
      }
      // Para condicionales vacíos
      else if (esParametroCondicional) {
        xml += "/";
      }
      
      xml += `</${paramName}>`;
    }
  } 
  // Manejo especial para IfElseBlock
  if (bloque.nombre == "IfElseBlock") {
    // Parte IF
    if (bloque.bucle && bloque.bucleSiguiente != null) {
      xml += '<adopt_point index="0">';
      let actual = bloque.bucleSiguiente;
      while (actual != null && actual.nombre != "ElseBlock") {
        xml += generarBloqueXML(actual, false);
        actual = actual.siguiente;
      }
      xml += '</adopt_point>';
    }
    
    // Parte ELSE
    if (bloque.siguiente != null && bloque.siguiente.nombre == "ElseBlock") {
      const elseBlock = bloque.siguiente;
      if (elseBlock.bucleSiguiente != null) {
        xml += '<adopt_point index="1">';
        let actual = elseBlock.bucleSiguiente;
        while (actual != null) {
          xml += generarBloqueXML(actual, false);
          actual = actual.siguiente;
        }
        xml += '</adopt_point>';
      }
      
      if (bloque.siguiente.siguiente != null) {
        xml += '<attach_point index="0">';
        xml += generarBloqueXML(bloque.siguiente.siguiente, false);
        xml += '</attach_point>';
      }
    }
  } 
  // Bloques con bucles normales
  else if (bloque.bucle && bloque.bucleSiguiente != null) {
    xml += '<adopt_point index="0">';
    let actual = bloque.bucleSiguiente;
    while (actual != null) {
      xml += generarBloqueXML(actual, false);
      actual = actual.siguiente;
    }
    xml += '</adopt_point>';
  }
  // Bloques conectados abajo
  if (bloque.siguiente != null && bloque.siguiente.nombre != "ElseBlock") {
    xml += '<attach_point index="0">';
    xml += generarBloqueXML(bloque.siguiente, false);
    xml += '</attach_point>';
  }
  xml += `</${bloque.nombre}>`;
  return xml;
}

function obtenerInfoBloqueCrumble(nombreLocal) {
  for (let menu = 0; menu < NOTACION_CRUMBLE.length; menu++) {
    for (let opcion = 0; opcion < NOTACION_CRUMBLE[menu].length; opcion++) {
      if (NOTACION_CRUMBLE[menu][opcion][0] == nombreLocal) {
        return NOTACION_CRUMBLE[menu][opcion];
      }
    }
  }
  return null;
}

function eliminarConfiguracion() {
  ledsActivos = 0;
  esperarUnCiclo = false;
  saltoIfElse = false;
  miliSegundos = 0;
  Crono = 0;
  Distancia = 0;
  // Reinicia variables
  offsetX = 0;
  offsetY = 0;
  panSimulacionX = 0;
  panSimulacionY = 0;
  panCodigoX = 0;
  panCodigoY = 0;
  // Reinicio de posición del robot
  crumblebot.xInicio = 0;
  crumblebot.yInicio = 0;
   Matter.Body.setPosition(robotFisico.body, { 
     x: 0, 
     y: 0 
  });
  robotFisico.body.angle=0;
  crumblebot.potMotor = [0.0, 0.0];
  robot.ultrasonidosConectado = false;
  // Elimina el fondo
  fondo = null;
  // Posiciona los conectores de los jumpers en su posición original
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 2; j++) {
      conector[i * 2 + j].x = ANCHO_ROBOT / 2 + 10 + i * 50 + j * 22;
      conector[i * 2 + j].y = 50 - ALTO_ROBOT / 2;
      conector[i * 2 + j].gpioConectado = null;
      conector[i * 2 + j].elementoConectado = null;
    }
  }
  // Posiciona los conectores de los cables
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 2; j++) {
      conector[8 + i * 2 + j].x = -350 + j * 50;
      conector[8 + i * 2 + j].y = -150 + i * 75;
      conector[8 + i * 2 + j].gpioConectado = null;
      conector[8 + i * 2 + j].elementoConectado = null;
    }
  }
  // Posiciona los jumpers
  for (let i = 0; i < 4; i++) {
    jumpers[i].x = ANCHO_ROBOT / 2 + 10 + i * 50;
    jumpers[i].y = 50 - ALTO_ROBOT / 2;
  }
  // Desconecta los GPIOs y los Elementos
  for (let i = 0; i < conectorGPIO.length; i++) {
    gpio[i].conectorGPIO = null;
    elemento[i].conectorElemento = null;
  }
  // Elimina los obstáculos
  for (let i = obstaculo.length - 1; i >= 0; i--) {
    obstaculo[i].eliminar();
  }
  obstaculo = [];
  obstaculoSeleccionado = null;
  // Elimina los obstáculos de inicio
  obstaculoInicio = [];
  // Pone todos los colores customizados en blanco
  for (let i = 0; i < 16; i++) customColor[i] = color(255);
  for (let j = 0; j < 8; j++) colorLED[j] = color(0);
}

function abrirArchivoDesdeContenido(contenido) {
  eliminarConfiguracion(); 
  try {
    // Parsear XML
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(contenido, "text/xml"); 
    // CRUMBLEBOT
    const x = xmlDoc.getElementsByTagName("x")[0].textContent;
    const y = xmlDoc.getElementsByTagName("y")[0].textContent;
    const angulo = xmlDoc.getElementsByTagName("angulo")[0].textContent; 
    crumblebot.xInicio = int(x);
    crumblebot.yInicio = int(y);
    crumblebot.anguloInicio = float(angulo);
    Matter.Body.setPosition(robotFisico.body, { 
      x: crumblebot.xInicio, 
      y: crumblebot.yInicio 
    });
    robotFisico.body.angle=crumblebot.anguloInicio;
    // TAPETE
    const tapeteElements = xmlDoc.getElementsByTagName("Tapete");
    if (tapeteElements.length > 0) {
      const file = tapeteElements[0].getElementsByTagName("file")[0].textContent;
      nombreFondo = null;
      // Intentar cargar el tapete
      try {
        // Verificar si el archivo existe en la lista de imágenes disponibles
        for (let i = 0; i < archivosSVG.length; i++) {
          if (file === archivosSVG[i]) {
            nombreFondo=file;
            console.log(nombreFondo);
            cargarFondo();
            break;
          } 
        }
        if (fondo==null) {
          console.error("EL TAPETE NO SE ENCUENTRA EN LA CARPETA ESCENARIOS");
        }
      } catch (error) {
        console.error("Error al cargar tapete:", error);
        inicioMensaje = millis();
        mensaje = "ERROR AL CARGAR EL TAPETE: " + file;
      }
    }
    // ULTRASONIDO
    const ultrasonidoElements = xmlDoc.getElementsByTagName("Ultrasonido");
    if (ultrasonidoElements.length > 0) {
      const conectado = ultrasonidoElements[0].getElementsByTagName("conectado")[0];
      if (conectado) {
        robot.ultrasonidosConectado = conectado.textContent === "true";
      }
    }
    // JUMPERS
    const jumpersElements = xmlDoc.getElementsByTagName("Jumpers");
    if (jumpersElements.length > 0) {
      const jumperList = jumpersElements[0].getElementsByTagName("Jumper");
      for (let i = 0; i < jumperList.length && i < jumpers.length; i++) {
        const jumper = jumperList[i];
        const xElem = jumper.getElementsByTagName("x")[0];
        const yElem = jumper.getElementsByTagName("y")[0];
        
        if (xElem && yElem) {
          jumpers[i].x = parseInt(xElem.textContent);
          jumpers[i].y = parseInt(yElem.textContent);
        }
      }
    }
    // CONECTORES DE CABLES
    const conectoresElements = xmlDoc.getElementsByTagName("Conectores");
    if (conectoresElements.length > 0) {
      const conectorList = conectoresElements[0].getElementsByTagName("Conector");
      for (let i = 0; i < conectorList.length && i < conector.length; i++) {
        const con = conectorList[i];
        // Posición X
        const xElem = con.getElementsByTagName("x")[0];
        if (xElem) conector[i].x = parseInt(xElem.textContent);
        // Posición Y
        const yElem = con.getElementsByTagName("y")[0];
        if (yElem) conector[i].y = parseInt(yElem.textContent);
        // GPIO conectado
        const gpioElem = con.getElementsByTagName("gpioConectado")[0];
        if (gpioElem) {
          const gpioIndex = parseInt(gpioElem.textContent);
          conector[i].gpioConectado = (gpioIndex !== -1) ? gpio[gpioIndex] : null;
        }
        // Elemento conectado
        const elemElem = con.getElementsByTagName("elementoConectado")[0];
        if (elemElem) {
          const elemIndex = parseInt(elemElem.textContent);
          conector[i].elementoConectado = (elemIndex !== -1) ? elemento[elemIndex] : null;
        }
      }
    }
    // GPIOs
    const gpiosElements = xmlDoc.getElementsByTagName("GPIOs");
    if (gpiosElements.length > 0) {
      const gpioList = gpiosElements[0].getElementsByTagName("GPIO");
      for (let i = 0; i < gpioList.length && i < gpio.length; i++) {
        const gp = gpioList[i];
        const conectorElem = gp.getElementsByTagName("conector")[0];
        
        if (conectorElem) {
          const conectorIndex = parseInt(conectorElem.textContent);
          gpio[i].conectorGPIO = (conectorIndex !== -1) ? conector[conectorIndex] : null;
        }
      }
    }
    // ELEMENTOS
    const elementosElements = xmlDoc.getElementsByTagName("Elementos");
    if (elementosElements.length > 0) {
      const elementoList = elementosElements[0].getElementsByTagName("Elemento");
      for (let i = 0; i < elementoList.length && i < elemento.length; i++) {
        const elem = elementoList[i];
        const conectorElem = elem.getElementsByTagName("conector")[0];
        
        if (conectorElem) {
          const conectorIndex = parseInt(conectorElem.textContent);
          elemento[i].conectorElemento = (conectorIndex !== -1) ? conector[conectorIndex] : null;
        }
      }
    }
    // OBSTÁCULOS
    const obstaculosElements = xmlDoc.getElementsByTagName("Obstaculos");
    if (obstaculosElements.length > 0) {
      const obstaculoList = obstaculosElements[0].getElementsByTagName("Obstaculo");
      for (let i = 0; i < obstaculoList.length; i++) {
        const obs = obstaculoList[i];
        // Obtener dimensiones y propiedades
        const xElem = obs.getElementsByTagName("x")[0];
        const yElem = obs.getElementsByTagName("y")[0];
        const anchoElem = obs.getElementsByTagName("ancho")[0];
        const altoElem = obs.getElementsByTagName("alto")[0];
        const anguloElem = obs.getElementsByTagName("angulo")[0];
        const estaticoElem = obs.getElementsByTagName("estatico")[0];
        const x = parseFloat(xElem.textContent);
        const y = parseFloat(yElem.textContent);
        const ancho = parseFloat(anchoElem.textContent);
        const alto = parseFloat(altoElem.textContent);
        const angulo =parseFloat(anguloElem.textContent);
        const estatico = estaticoElem.textContent === "true";
        // Crear nuevo obstáculo
        const nuevoObstaculo = new Obstaculo(x, y, ancho, alto, angulo, estatico);
        obstaculo.push(nuevoObstaculo);
        //Body.setVelocity(nuevoObstaculo, 0);
        //Body.setAngularVelocity(nuevoObstaculo, 0);
        const nuevoObstaculoInicio = new ObstaculoInicio(x, y, ancho, alto, angulo, estatico);
        obstaculoInicio.push(nuevoObstaculoInicio);
      }
    } 
  } catch (error) {
    console.error("Error al abrir archivo:", error);
    alert("Error al abrir el archivo. Formato incorrecto.");
  }
}

function abrirArchivoCrumbleDesdeContenido(contenido) {
  eliminarCrumble(); 
  try {
    // Parsear XML
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(contenido, "text/xml"); 
    
    // Verificar si hay errores de parseo
    const parserError = xmlDoc.querySelector('parsererror');
    if (parserError) {
      throw new Error('Error en el XML: ' + parserError.textContent);
    }
    
    // Procesar variables
    const variables = xmlDoc.getElementsByTagName("Variable");
    for (let i = 0; i < variables.length; i++) {
      const nombreVar = variables[i].textContent;
      if (nombreVar && nombreVar.trim() !== "") {
        crearVariable(nombreVar.trim());
      }
    } 
    
    // Procesar estructura de bloques
    const canvasElement = xmlDoc.getElementsByTagName("Canvas")[0];
    if (canvasElement) {
      // Obtener todos los elementos hijos del Canvas
      const bloquesXML = Array.from(canvasElement.children);    
      
      // Procesar bloques principales
      for (let bloqueXML of bloquesXML) {
        const bloque = procesarBloque(bloqueXML, true);
        if (!bloque) continue;
        
        if (bloque.nombre === "WhenRunBlock") {
          bloquesStart.push(bloque);
          bloqueStartSeleccionado = bloque;
        }
        
        // Si es IfElseBlock, ya se creó el Else en procesarBloque
        // No crear otro aquí
        
        procesarConexiones(bloqueXML, bloque);
      }
    }
    
    // Ajustar relaciones padre-hijo para bloques con bucles
    for (let bloque of codigo) {
      if (bloque.bucle === true && bloque.bucleSiguiente !== null) {
        let bloq = bloque.bucleSiguiente;
        bloque.bucleSiguiente.padre = bloque;
        
        while (bloq.siguiente !== null) {
          bloq.siguiente.padre = bloque;
          bloq = bloq.siguiente;
        }
      }
    }
    
    // Actualizar propiedades de los bloques
    for (let bloque of codigo) {
      bloque.calculoGrosorBucle();
      if (bloque.anterior === null && bloque.padre === null) {
        bloque.actualizarCoordenadas();
      }
      
      // Adaptar tamaño de huecos y obtener índices de listas
      for (let i = 0; i < bloque.subBloque.length; i++) {
        if (bloque.subBloque[i] === null && bloque.tipoDato[i] !== '*') {
          bloque.AxDato[i] = int(bloque.calculoAnchoDato(bloque.dato[i]));
        }
        
        // Obtener índice dentro de las LISTAs
        if (bloque.tipoDato[i] >= '0' && bloque.tipoDato[i] <= '6') {
          const listaIndex = parseInt(bloque.tipoDato[i]);
          for (let j = 0; j < LISTA[listaIndex].length; j++) {
            if (bloque.dato[i] === LISTA[listaIndex][j]) {
              bloque.indiceLISTA[i] = j;
              break;
            }
          }
        }
      }
      
      bloque.calculoDimensiones();
    }
    
    // Actualizar lista de bloques no seleccionados
    bloquesNoSeleccionados = [...codigo];
   
    if (bloqueStartSeleccionado !== null) {
      bloqueEjecutando = bloqueStartSeleccionado;
    }
    ejecutando = false;
    
    // Inicializar variables a cero
    for (let variable of codigoVariables) {
      variable.dato[0] = "0";
      variable.valorNumerico = 0;
    }
    
  } catch (error) {
    console.error("Error al abrir archivo Crumble:", error);
    alert("Error al abrir el archivo Crumble. Formato incorrecto.\n" + error.message);
  }
}

// Función auxiliar para procesar un bloque XML
function procesarBloque(bloqueXML, esPrincipal) {
  const nombre = bloqueXML.tagName;
  if (!nombre) return null;
  
  // Coordenadas (solo para bloques principales)
  let x = 0, y = 0;
  if (esPrincipal) {
    try {
      const xElem = bloqueXML.querySelector("x");
      const yElem = bloqueXML.querySelector("y");
      if (xElem && yElem) {
        x = parseInt(xElem.textContent) - width / 2;
        y = parseInt(yElem.textContent) - height / 2;
      }
    } catch (e) {
      console.warn("Error obteniendo coordenadas para", nombre);
    }
  }
  
  // Caso especial para VariableBlock
  if (nombre === "VariableBlock") {
    const varName = bloqueXML.textContent.trim();
    for (let variable of codigoVariables) {
      if (variable.texto[0] === varName) {
        const subBloque = new Bloque(x, y, 3, 4, BOTON_VARIABLE, false, true);
        subBloque.texto[0] = variable.texto[0];
        subBloque.AxTexto[0] = variable.AxTexto[0];
        subBloque.variablePadre = variable;
        codigo.push(subBloque);
        cont++;
        subBloque.num = cont;
        return subBloque;
      }
    }
    return null;
  }
  
  // Buscar en arrays de bloques
  let categoria = -1;
  let id = -1;
  
  for (let cat = 0; cat < t.length; cat++) {
    for (let i = 0; i < t[cat].length; i++) {
      if (t[cat][i][0] === nombre) {
        categoria = cat;
        id = i;
        break;
      }
    }
    if (categoria !== -1) break;
  }
  
  if (categoria === -1) return null;
  
  // Crear bloque
  const bloque = new Bloque(x, y, categoria, id, t[categoria][id], false, true);
  codigo.push(bloque);
  cont++;
  bloque.num = cont;
  
  // Procesar parámetros básicos - AQUÍ ESTÁ LA DIFERENCIA CLAVE
  const infoBloque = obtenerInfoBloqueCrumble(nombre);
  if (infoBloque) {
    for (let i = 1; i < infoBloque.length; i++) {
      const paramName = infoBloque[i];
      if (!paramName) continue;
      
      const param = bloqueXML.querySelector(paramName);
      if (param) {
        // Clonar el nodo para eliminar los adopt_point
        const paramClonado = clonarNodoXML(param);
        
        // Eliminar adopt_point si existe
        const adoptPoint = paramClonado.querySelector("adopt_point");
        if (adoptPoint) {
          paramClonado.removeChild(adoptPoint);
        }
        
        // Obtener contenido limpio
        const contenido = paramClonado.textContent.trim();
        
        if (contenido && contenido !== "/") {
          if (paramName === "colour") {
            const red = param.querySelector("red") ? parseInt(param.querySelector("red").textContent) : 255;
            const green = param.querySelector("green") ? parseInt(param.querySelector("green").textContent) : 255;
            const blue = param.querySelector("blue") ? parseInt(param.querySelector("blue").textContent) : 255;
            bloque.dato[i - 1] = str(color(red, green, blue));
          } else {
            bloque.dato[i - 1] = contenido;
          }
        }
      }
    }
  } 
  return bloque;
}

// Función para procesar conexiones entre bloques
function procesarConexiones(bloqueXML, bloque) {
  let siguiente = null;
  let siguienteXML = null;

  const attachPoint = bloqueXML.querySelector(":scope > attach_point");
  if (attachPoint) {
    const hijos = Array.from(attachPoint.children);
    if (hijos.length > 0) {
      siguienteXML = hijos[0];
      siguiente = procesarBloque(siguienteXML, false);
    }
  }

  // CASO IfElseBlock
  if (bloque.nombre === "IfElseBlock") {
    // Crear Else UNA SOLA VEZ
    const bloqueElse = new Bloque(bloque.x, bloque.y, 2, 5, t[2][5], false, true);
    codigo.push(bloqueElse);
    cont++;
    bloqueElse.num = cont;

    bloque.siguiente = bloqueElse;
    bloqueElse.anterior = bloque;

    if (siguiente) {
      bloqueElse.siguiente = siguiente;
      siguiente.anterior = bloqueElse;
    }
  } else {
    if (siguiente) {
      bloque.siguiente = siguiente;
      siguiente.anterior = bloque;
    }
  }

  if (siguiente && siguienteXML) {
    procesarConexiones(siguienteXML, siguiente);
  }
 
  // Procesar sub-bloques en parámetros
  const infoBloque = obtenerInfoBloqueCrumble(bloque.nombre);
  if (infoBloque && bloque.subBloque) {
    for (let i = 1; i < infoBloque.length; i++) {
      const paramName = infoBloque[i];
      if (!paramName) continue;
      
      const param = bloqueXML.querySelector(paramName);
      if (param) {
        const adoptPoint = param.querySelector("adopt_point");
        if (adoptPoint) {
          const subBloques = Array.from(adoptPoint.children);
          
          for (let subBloqueXML of subBloques) {
            const subBloque = procesarBloque(subBloqueXML, false);
            if (subBloque) {
              // IMPORTANTE: Guardar el bloque seleccionado actual
              const bloqueSeleccionadoAnterior = bloqueSeleccionado;
              
              // Seleccionar temporalmente el sub-bloque
              bloqueSeleccionado = subBloque;
              
              // Añadir sub-bloque en la posición correcta
              try {
                // Asegurar que el índice es válido
                if (i - 1 < bloque.subBloque.length) {
                  // Primero eliminar cualquier bloque existente en esa posición
                  if (bloque.subBloque[i - 1]) {
                    // Eliminar el bloque anterior si existe
                    const index = codigo.indexOf(bloque.subBloque[i - 1]);
                    if (index !== -1) {
                      codigo.splice(index, 1);
                    }
                  }
                  
                  // Ahora añadir el nuevo sub-bloque
                  bloque.subBloque[i - 1] = subBloque;
                  subBloque.padre = bloque;
                }
              } catch (e) {
                console.warn("Error añadiendo sub-bloque:", e);
              }
              
              // Restaurar bloque seleccionado
              bloqueSeleccionado = bloqueSeleccionadoAnterior;
              
              // Procesar conexiones del sub-bloque
              procesarConexiones(subBloqueXML, subBloque);
            }
          }
        }
      }
    }
  }
  
  // Procesar bloques contenedores (DoUntil, DoForever...)
  // Solo adopt_points que no están dentro de parámetros
    const adoptPoints = bloqueXML.querySelectorAll(":scope > adopt_point");

  for (let adoptPoint of adoptPoints) {
    const parentName = adoptPoint.parentElement?.tagName;
    if (["count", "time", "conditional"].includes(parentName)) continue;

    const bloqueInternoXML = adoptPoint.children[0];
    if (!bloqueInternoXML) continue;

    const indexValue = adoptPoint.getAttribute("index");
    const bloqueInterno = procesarBloque(bloqueInternoXML, false);

    if (!bloqueInterno) continue;

    // Si el bloque interno es IfElseBlock → crear Else
    if (bloqueInterno.nombre === "IfElseBlock") {
      const bloqueElse = new Bloque(bloqueInterno.x, bloqueInterno.y, 2, 5, t[2][5], false, true);
      codigo.push(bloqueElse);
      cont++;
      bloqueElse.num = cont;

      bloqueInterno.siguiente = bloqueElse;
      bloqueElse.anterior = bloqueInterno;
    }

    // ELSE interno
    if (bloque.nombre === "IfElseBlock" && indexValue === "1") {
      bloque.siguiente.bucleSiguiente = bloqueInterno;
      bloqueInterno.padre = bloque.siguiente;
    } else {
      bloque.bucleSiguiente = bloqueInterno;
      bloqueInterno.padre = bloque;
    }

    procesarConexiones(bloqueInternoXML, bloqueInterno);
  }
}

// Función auxiliar para clonar nodo XML (simplificada para p5.js)
function clonarNodoXML(original) {
  if (!original) return null; 
  // En p5.js podemos simplemente usar cloneNode
  try {
    return original.cloneNode(true);
  } catch (e) {
    console.warn("Error al clonar XML:", e);
    return null;
  }
}

// Función para crear una variable
function crearVariable(nombre) {
  // Asumiendo que tienes una estructura similar a tu código Processing
  const bloqueVar = new Bloque(0, 0, 3, 3, t[3][3], false, true);
  bloqueVar.texto[0] = nombre;
  bloqueVar.AxTexto[0] = textWidth(nombre);
  codigoVariables.push(bloqueVar);
  // Crear botón para la variable
  const botonVar = new Bloque(0, 0, 3, 4, BOTON_VARIABLE, false, true);
  botonVar.texto[0] = nombre;
  botonVar.variablePadre = bloqueVar;
  botonesVariables.push(botonVar);
  return bloqueVar;
}

function eliminarCrumble() {
  ejecutando = false;
  codigo = [];
  bloquesStart = [];
  codigoVariables = [];
  bloqueSeleccionado = null;
  bloquesSeleccionados = [];
  botonesVariables = [];
}

function cargarTapete() {
  modo = 6; // Cambiar a modo selección de tapete
}

function eliminarTapete() {
  fondo = null;
  nombreFondo = null;
  alert("Tapete eliminado");
}

function salirAplicacion() {
  if (confirm("¿Está seguro de que desea salir?")) {
    window.close();
  }
}

// Inicializar el menú cuando se cargue la página
document.addEventListener('DOMContentLoaded', function() {
  crearMenuHTML();
});