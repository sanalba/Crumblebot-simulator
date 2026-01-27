class Jumper {
  constructor(x, y, extremo0, extremo1, esCable, colorCable) {
    this.x = x;
    this.y = y;
    this.ancho = 40;
    this.alto = 15;
    this.extremo = [extremo0, extremo1];
    this.esCable = esCable;
    this.colorCable = colorCable;
  }
  
  devolverOtroExtremo(conector) {
    if (this.extremo[1] === conector) return this.extremo[0];
    else return this.extremo[1];
  }
  
  conectar() {
    for (let i = 0; i < conectorGPIO.length; i++) {
      if (this.esCable === false && dist(this.x, this.y, conectorGPIO[i].x, conectorGPIO[i].y) < 5) {
        if (elemento[i].conectorElemento === null && gpio[i].conectorGPIO === null) {
          this.colorCable = color(255, 255, 0);
          this.x = conectorGPIO[i].x;
          this.y = conectorGPIO[i].y;
          
          if (i < 5) {  // Si son los GPIO de la izquierda
            this.extremo[0].elementoConectado = elemento[i];
            this.extremo[1].gpioConectado = gpio[i];
            elemento[i].conectorElemento = this.extremo[0];
            gpio[i].conectorGPIO = this.extremo[1];
          } else {  // Si son los GPIO de la derecha
            this.extremo[1].elementoConectado = elemento[i];
            this.extremo[0].gpioConectado = gpio[i];
            elemento[i].conectorElemento = this.extremo[1];
            gpio[i].conectorGPIO = this.extremo[0];
          }
        }
        return;
      }
    }
  }
  
  desconectar() {
    if (transformedXbasico > this.x - this.ancho / 2 && 
        transformedXbasico < this.x + this.ancho / 2 && 
        transformedYbasico > this.y - this.alto / 2 && 
        transformedYbasico < this.y + this.alto / 2) {
      
      this.colorCable = color(255, 200, 0);
      offsetX = this.x - transformedXbasico;
      offsetY = this.y - transformedYbasico;
      
      if (this.extremo[0].elementoConectado !== null) {
        this.extremo[0].elementoConectado.conectorElemento = null;
        this.extremo[1].gpioConectado.conectorGPIO = null;
        this.extremo[0].elementoConectado = null;
        this.extremo[1].gpioConectado = null;
      } else if (this.extremo[0].gpioConectado !== null) {
        this.extremo[1].elementoConectado.conectorElemento = null;
        this.extremo[0].gpioConectado.conectorGPIO = null;
        this.extremo[1].elementoConectado = null;
        this.extremo[0].gpioConectado = null;
      }
      return this;
    }
    return null;
  }
  
  dibujar() {
    rectMode(CENTER);
    stroke(0, 125, 0);
    strokeWeight(1);
    
    if (this.esCable === false) {  // Si es un Jumper, no un cable...
      if (this.extremo[0].gpioConectado !== null || this.extremo[0].elementoConectado !== null) {
        fill(255, 255, 0);
      } else {
        fill(255, 200, 0);
      }
      rect(this.x, this.y, this.ancho, this.alto);
    } else {
      // Dibuja los cuadraditos de los conectores
      for (let i = 0; i < 2; i++) {
        if (this.extremo[i].elementoConectado !== null || this.extremo[i].gpioConectado !== null) {
          fill(0, 255, 0);
        } else {
          fill(0);
        }
        rect(this.extremo[i].x, this.extremo[i].y, 10, 10);
      }
      
      // Dibuja el cable
      noFill();
      stroke(this.colorCable);
      strokeWeight(5);
      beginShape();
      curveVertex(this.extremo[0].x, this.extremo[0].y - 10);
      curveVertex(this.extremo[0].x, this.extremo[0].y);
      curveVertex((this.extremo[0].x + this.extremo[1].x) / 2, 
                  (this.extremo[0].y + this.extremo[1].y) / 2 - abs(this.extremo[0].x - this.extremo[1].x));
      curveVertex(this.extremo[1].x, this.extremo[1].y);
      curveVertex(this.extremo[1].x, this.extremo[1].y + 10);
      endShape();
    }
  }
}
//******************************************************************
class Conector {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.jumperAsociado = null;
    this.gpioConectado = null;
    this.elementoConectado = null;
  }
  
  desconectar() {
    if (dist(transformedXbasico, transformedYbasico, this.x, this.y) < 5) {
      if (this.elementoConectado !== null) {
        this.elementoConectado.conectorElemento = null;
        this.elementoConectado = null;
      } else if (this.gpioConectado !== null) {
        this.gpioConectado.conectorGPIO = null;
        this.gpioConectado = null;
      }
      offsetX = this.x - transformedXbasico;
      offsetY = this.y - transformedYbasico;
      return this;
    }
    return null;
  }
  
  conectar() {
    for (let i = 0; i < elemento.length; i++) {
      if (dist(transformedXbasico, transformedYbasico, elemento[i].x, elemento[i].y) < 10) {
        if (elemento[i].conectorElemento === null) {
          if (this.jumperAsociado.devolverOtroExtremo(this).elementoConectado === null) {
            this.elementoConectado = elemento[i];
            elemento[i].conectorElemento = this;
            this.x = elemento[i].x;
            this.y = elemento[i].y;
          } else {
            inicioMensaje = millis();
            mensaje = "No es posible conectar. El otro extremo del conector es también un sensor/actuador";
          }
        }
        return;  // Si la distancia era true, es imposible encontrar otra colisión
      }
    }
    
    for (let i = 0; i < gpio.length; i++) {
      if (dist(transformedXbasico, transformedYbasico, gpio[i].x, gpio[i].y) < 10) {
        if (gpio[i].conectorGPIO === null) {
          if (this.jumperAsociado.devolverOtroExtremo(this).gpioConectado === null) {
            this.gpioConectado = gpio[i];
            gpio[i].conectorGPIO = this;
            this.x = gpio[i].x;
            this.y = gpio[i].y;
          } else {
            inicioMensaje = millis();
            mensaje = "No es posible conectar. El otro extremo del conector es también una letra";
          }
        }
        return;
      }
    }
  }
}

class ConectorGPIO {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}
//**********************************************************************
class Letra {
  constructor(letraChar) {
    this.letra = letraChar;
    this.valorOutput = 0;
    this.valorLetra = 0;
    this.gpioLetra = [];
  }
  
  actualizarValor() {
    let maxValor = this.valorOutput;
    
    for (let variable of this.gpioLetra) {
      let valorElemento = 0;
      if (variable.conectorGPIO !== null) {
        let otroConector = variable.conectorGPIO.jumperAsociado.devolverOtroExtremo(variable.conectorGPIO);
        let elementoConectado = otroConector ? otroConector.elementoConectado : null;
        
        if (elementoConectado !== null) {
          valorElemento = elementoConectado.actualizarValor();
        } else {
          valorElemento = 0;
        }
      }
      if (valorElemento > maxValor) maxValor = valorElemento;
    }
    
    this.valorLetra = maxValor;
    return this.valorLetra;
  }
}

class GPIO {
  constructor(x, y, letraAsociada) {
    this.x = x;
    this.y = y;
    this.letraAsociada = letraAsociada;
    this.conectorGPIO = null;
  }
}
//*******************************************************************
class Elemento {
  constructor(x, y, elemento) {
    this.x = x;
    this.y = y;
    this.elemento = elemento;
    this.valorElemento = 0;
    this.conectorElemento = null;
  }
  
  actualizarValor() {
    let robotX;
    let robotY;
    if (desplazandoRobot) {
      robotX=CrumX;
      robotY=CrumY;
    } else {
      robotX=robotFisico.body.position.x;
      robotY=robotFisico.body.position.y;
    }
    if (this.elemento === "SONIC") {
      if (robot.ultrasonidosConectado === true && ejecutando === true) {
        this.valorElemento = int(calcularDistanciaRayo()) / 10;  // Dividimos entre 10 para que sea en cm
      }
    } else if (this.elemento === "LIGHT1") {
      if (desplazandoBulb === true) {
        let transformedX = (windowWidth / 2) + (panSimulacionX + DIST_LDR * cos(robotFisico.body.angle - ANGULO_LDR)) * zoomSimulacion;
        let transformedY = (windowHeight / 2) + (panSimulacionY + DIST_LDR * sin(robotFisico.body.angle - ANGULO_LDR)) * zoomSimulacion;
        this.valorElemento = int(10000 / dist(transformedX, transformedY, mouseX, mouseY));
      } else {
        this.valorElemento = 0;
      }
    } else if (this.elemento === "LINE1" && fondo !== null && fondo !== undefined) {
        let xC = fondo.width / 2 + robotX + DIST_SENSOR_BN * cos(robotFisico.body.angle - ANGULO_SENSOR_BN);
        let yC = fondo.height / 2 + robotY + DIST_SENSOR_BN * sin(robotFisico.body.angle - ANGULO_SENSOR_BN);      
        if (xC > fondo.width || xC < 0 || yC > fondo.height || yC < 0) {
        this.valorElemento = 0;
        } else {
          this.valorElemento = 255 - getRealLuminosity(fondo.get(int(xC), int(yC)));
        }
    } else if (this.elemento === "LIGHT2") {
      if (desplazandoBulb === true) {
        let transformedX = (windowWidth / 2) + (panSimulacionX + DIST_LDR * cos(robotFisico.body.angle + ANGULO_LDR)) * zoomSimulacion;
        let transformedY = (windowHeight / 2) + (panSimulacionY + DIST_LDR * sin(robotFisico.body.angle + ANGULO_LDR)) * zoomSimulacion;
        this.valorElemento = 255 - int(10000 / dist(transformedX, transformedY, mouseX, mouseY));
      } else {
        this.valorElemento = 0;
      }
    } else if ((this.elemento === "LINE2" && fondo !== null && fondo !== undefined)) {
        let xC = fondo.width / 2 + robotX + DIST_SENSOR_BN * cos(robotFisico.body.angle + ANGULO_SENSOR_BN);
        let yC = fondo.height / 2 + robotY + DIST_SENSOR_BN * sin(robotFisico.body.angle + ANGULO_SENSOR_BN);
        if (xC > fondo.width || xC < 0 || yC > fondo.height || yC < 0) {
          this.valorElemento = 0;
        } else {
          this.valorElemento = 255 - getRealLuminosity(fondo.get(int(xC), int(yC)));
        }
    }
    
    return this.valorElemento;
  }
}

function getRealLuminosity(c) {
  return (red(c) * 0.299 + green(c) * 0.587 + blue(c) * 0.114);
}
//*******************************************************************
function calcularDistanciaRayo() {
  // NOTA: Esta función depende de FWorld/FBox de Processing
  let FOV = radians(15);  // Define la apertura de la onda
  let pasos = 5;  // Determina la sensibilidad de la onda
  let mejorDistancia = 4000;  // Especifica la mayor distancia de medida 
  // Calcula las coordenadas del sensor de ultrasonidos (en el frontal)
  let xRobot = robotFisico.body.position.x + crumblebot.frontal * cos(robotFisico.body.angle);
  let yRobot = robotFisico.body.position.y + crumblebot.frontal * sin(robotFisico.body.angle);
  // Obtiene la rotación del robot
  let rotRobot = robotFisico.body.angle;
  for (let i = 0; i <= pasos; i++) {
    let anguloRayo = rotRobot + (-FOV / 2 + i * (FOV / pasos));
    let dir = createVector(Math.cos(anguloRayo), Math.sin(anguloRayo));
    for (let o of obstaculo) {
      let resultado = calcularInterseccionSegmento(xRobot,yRobot,dir,o);
      if (resultado && resultado.distancia > 0 && resultado.distancia < mejorDistancia ) {
        let dot = Math.abs(dir.dot(resultado.direccionSegmento));
        if (dot < 0.7 / (resultado.distancia / 500)) {
          mejorDistancia = resultado.distancia;
        }
      }
    }
    for (let o of laterales) {
      let resultado = calcularInterseccionSegmento(xRobot,yRobot,dir,o);
      if (resultado && resultado.distancia > 0 && resultado.distancia < mejorDistancia ) {
        let dot = Math.abs(dir.dot(resultado.direccionSegmento));
        if (dot < 0.7 / (resultado.distancia / 500)) {
          mejorDistancia = resultado.distancia;
        }
      }
    }
  }
  // Devolver valor dummy por ahora
  return mejorDistancia < 4000 ? mejorDistancia : 0;
}


class ResultadoInterseccion {
  constructor(distancia, direccionSegmento, interseccion) {
    this.distancia = distancia;
    this.direccionSegmento = direccionSegmento;
    this.interseccion = interseccion;
  }
}

function calcularInterseccionSegmento(x1, y1, dir, box) {
  // Obtener las 4 esquinas del rectángulo rotado
  let w = box.ancho;
  let h = box.alto;
  let ang = box.body.angle;

  let cosA = Math.cos(ang);
  let sinA = Math.sin(ang);

  let cx = box.body.position.x;
  let cy = box.body.position.y;

  let esquinas = [
    createVector(cx + (-w/2)*cosA - (-h/2)*sinA, cy + (-w/2)*sinA + (-h/2)*cosA),
    createVector(cx + ( w/2)*cosA - (-h/2)*sinA, cy + ( w/2)*sinA + (-h/2)*cosA),
    createVector(cx + ( w/2)*cosA - ( h/2)*sinA, cy + ( w/2)*sinA + ( h/2)*cosA),
    createVector(cx + (-w/2)*cosA - ( h/2)*sinA, cy + (-w/2)*sinA + ( h/2)*cosA)
  ];

  // Probar intersección con cada segmento
  for (let i = 0; i < 4; i++) {
    let a = esquinas[i];
    let b = esquinas[(i + 1) % 4];

    let interseccion = lineIntersect(
      x1,
      y1,
      x1 + dir.x * 4000,
      y1 + dir.y * 4000,
      a.x,
      a.y,
      b.x,
      b.y
    );

    if (interseccion) {
      let dist = dist2D(x1, y1, interseccion.x, interseccion.y);
      let dirSegmento = p5.Vector.sub(b, a).normalize();
      return new ResultadoInterseccion(dist, dirSegmento, interseccion);
    }
  }
  return null;
}

function dist2D(x1, y1, x2, y2) {
  return Math.hypot(x2 - x1, y2 - y1);
}

function lineIntersect(x1, y1, x2, y2, x3, y3, x4, y4) {
  let den = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
  if (abs(den) < 0.0001) return null;
  
  let ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / den;
  let ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / den;
  
  if (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1) {
    return createVector(x1 + ua * (x2 - x1), y1 + ua * (y2 - y1));
  }
  return null;
}