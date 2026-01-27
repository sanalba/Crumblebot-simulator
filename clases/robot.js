class Robot {
  constructor(x, y, xLED, yLED) {
    this.x = x;
    this.y = y;
    this.xLED = xLED;
    this.yLED = yLED;
    this.ultrasonidosConectado = false;
  } 
  dibujar() {
    image(robotGrande, 0, 0);
    fill(0);
    noStroke();
    rectMode(CORNER);  
    if (ejecutando == true) {
      rect(45, 270, 10, 10);
    } else {
      rect(80, 270, 10, 10);
    } 
    if (dist(transformedX, transformedY, windowWidth - 155, windowHeight / 2 - 40) < 10) {
      elemento[4].valorElemento = 255;
    } 
    if (dist(transformedX, transformedY, windowWidth - 75, windowHeight / 2 - 40) < 10) {
      elemento[6].valorElemento = 255;
    } 
    if (elemento[5].conectorElemento != null && ejecutando == true) {
      let otroConector = elemento[5].conectorElemento.jumperAsociado.devolverOtroExtremo(elemento[5].conectorElemento);
      if (otroConector && otroConector.gpioConectado != null) {
        if (otroConector.gpioConectado.letraAsociada == letraGPIO[3]) {
          for (let i = 0; i < 8; i++) {
            if (colorLED[i] != color(0)) {
              for (let j = 8; j >= 0; j--) {
                fill(red(colorLED[i]), green(colorLED[i]), blue(colorLED[i]), 200 - j * 25);
                ellipse(this.xLED[i], this.yLED[i], j * 10, j * 10);
              }
            }
          }
        }
      }
    }
  }
}

class DifferentialRobot {
  constructor(x, y, largo, ancho) {
    this.largo = largo;
    this.ancho = ancho;
    this.body = this.createRobotWithPivotAt(x, y, largo, ancho, 35, 0);
  }  
  // Función SIMPLIFICADA para crear robot con pivote específico
  createRobotWithPivotAt(x, y, largo, ancho, pivotX = 0, pivotY = 0) {
    // 1. Primero crear el robot normal (centrado en 0,0)
    let robot = this.createCompositeRobot(0, 0, largo, ancho);   
    // 2. Ahora MOVER todas las partes para que el pivote quede donde queremos
    // pivotX, pivotY es dónde queremos el centro de rotación RELATIVO al centro del robot 
    // Primero encontramos el centro actual (aproximado)
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;   
    for (let part of robot.parts) {
      for (let v of part.vertices) {
        if (v.x < minX) minX = v.x;
        if (v.x > maxX) maxX = v.x;
        if (v.y < minY) minY = v.y;
        if (v.y > maxY) maxY = v.y;
      }
    }
    
    let centerX = (minX + maxX) / 2;
    let centerY = (minY + maxY) / 2;
    
    // 3. Calcular cuánto mover para que el pivote esté en (pivotX, pivotY) relativo al centro
    // Queremos: center + offset = pivot  => offset = pivot - center
    let offsetX = pivotX - centerX;
    let offsetY = pivotY - centerY;
    
    // 4. Mover TODAS las partes
    for (let part of robot.parts) {
      Body.setPosition(part, {
        x: part.position.x + offsetX,
        y: part.position.y + offsetY
      });   
      // También mover los vértices de la parte (importante para colisiones)
      if (part.vertices) {
        for (let v of part.vertices) {
          v.x += offsetX;
          v.y += offsetY;
        }
      }
    }   
    // 5. Recalcular el cuerpo compuesto
    Body.setPosition(robot, {
      x: robot.position.x + offsetX,
      y: robot.position.y + offsetY
    });  
    // 6. Mover a la posición final deseada
    Body.setPosition(robot, { x: x, y: y });  
    return robot;
  } 
  // Tu función original de creación (centrada en 0,0)
  createCompositeRobot(x, y, largo, ancho) {
    let parts = [];
    // 1️⃣ Base
    let frontVertices = [];
    frontVertices.push({ x: 0, y: 0});
    frontVertices.push({ x: largo/2+17, y: 0});
    frontVertices.push({ x: largo/2+17, y: ancho-34 });
    frontVertices.push({ x: 0, y: ancho-34 });
    let base = Bodies.fromVertices(-22, 0, [frontVertices], {
      friction: 0.3,
      frictionAir: 0.15,
      restitution: 0.2
    }, true);
    parts.push(base);

    // 2️⃣ Parte frontal
    let segments = 12;
    frontVertices = [];
    for (let i = 0; i <= segments; i++) {
      let angle = map(i, 0, segments, -PI / 6 + radians(3), PI / 6 - radians(3));
      let fx = cos(angle) * (largo / 2);
      let fy = -sin(angle) * (largo / 2);
      frontVertices.push({ x: fx, y: fy });
    }
    let front = Bodies.fromVertices(57, 0, [frontVertices], {
      friction: 0.3,
      frictionAir: 0.15,
      restitution: 0.2
    }, true);
    parts.push(front);
 
    // 3️⃣ Ruedas
    frontVertices = [];
    frontVertices.push({ x: 0, y: 0 });
    frontVertices.push({ x: 44, y: 0 });
    frontVertices.push({ x: 44, y: ancho });
    frontVertices.push({ x: 0, y: ancho });
    
    let wheel = Bodies.fromVertices(-70, 0, [frontVertices], {
      friction: 0.3,
      frictionAir: 0.15,
      restitution: 0.2
    }, true);
       
    parts.push(wheel);

    // 4️⃣ Cuerpo compuesto
    let robot = Body.create({
      parts: parts,
      frictionAir: 0.15
    });

    Body.setPosition(robot, { x: x, y: y });
    Body.setAngle(robot, 0);
    World.add(world, robot);
    
    return robot;
  }
  
  update() { 
    if  (esperarUnCiclo==false) {// && millis()-temp>500) {//NO ENTIENDO PERO LA ÚNICA FORMA DE QUE FUNCIONE BIEN ES UTILIzAR MILLIS
      // Tu update normal
      let vL = (crumblebot.potMotor[0]/6000.0) * MAX_WHEEL_SPEED;
      let vR = (crumblebot.potMotor[1]/6000.0) * MAX_WHEEL_SPEED;
      let v = (vR + vL) / 2;
      let omega = (vR - vL) / WHEEL_BASE;
      let a = this.body.angle;
      Body.setVelocity(this.body, {
        x: v * cos(a),
        y: v * sin(a)
      });
      Distancia+=v;
      Body.setAngularVelocity(this.body, omega);
    }
  }

  colision() {
    // Tomamos coordenadas del ratón para comprobar si luego el robot se ha desplazado
    mouseOrigenX = mouseX;
    mouseOrigenY = mouseY; 
    // Convertir coordenadas del mouse considerando PAN y ZOOM
    transformedX = int((mouseX - windowWidth / 2) / (zoomSimulacion * escalaBase) - panSimulacionX);
    transformedY = int((mouseY - windowHeight / 2) / (zoomSimulacion * escalaBase) - panSimulacionY);   
    // Transformamos las coordenadas del ratón al espacio del rectángulo
    let cosAng = cos(-this.body.angle);
    let sinAng = sin(-this.body.angle);
    let mxRotado = transformedX * cosAng - transformedY * sinAng;
    let myRotado = transformedX * sinAng + transformedY * cosAng;  
    // Control de rotación
    if (dist(mxRotado, myRotado, robotPequeño.width / 2 + 20, 0) < 10) return 1; 
    // Control de rectángulo
    if (abs(mxRotado) < robotPequeño.width / 2 && abs(myRotado) < robotPequeño.height / 2) return 2; 
    return 0;
  }
}

//*******************************************************************
class Crumblebot {
  constructor(x, y, ancho, largo, angulo, AxLED, AyLED) {
    this.xInicio = x;
    this.yInicio = y;
    this.ancho = ancho;
    this.largo = largo;
    this.anguloInicio = angulo;
    this.frontal = int(LARGO_IMAGEN_ROBOT / 2);
    this.AxLED = AxLED;
    this.AyLED = AyLED;
    this.L = 140;
    this.potMotor = [0.0, 0.0];
    this.x = x;
    this.y = y;
    this.anguloSinFisica = 0;
    this.velocidad = 0;
    this.velocidadAngular = 0;
    this.ultrasonidosConectado = false;
  }
  

  dibujar() {
    if (robot.ultrasonidosConectado == true) {
      image(robotPequeñoUltrasonidos, 0, 0);
    } else {
      image(robotPequeño, 0, 0);
    }
    
    // Muestra la pequeña circunferencia para girar el robot
    if (robotSeleccionado == true) {
      stroke(0);
      fill(255);
      ellipse(this.largo / 2 + 20, 0, 15, 15);
    }
    
    // Muestra las luces LED si están activadas
    noStroke();
    if (elemento[5].conectorElemento != null && ejecutando == true) {
      let otroConector = elemento[5].conectorElemento.jumperAsociado.devolverOtroExtremo(elemento[5].conectorElemento);
      if (otroConector && otroConector.gpioConectado != null) {
        if (otroConector.gpioConectado.letraAsociada == letraGPIO[3]) {
          for (let i = 0; i < 8; i++) {
            if (colorLED[i] != color(0)) {
              for (let j = 8; j >= 0; j--) {
                fill(red(colorLED[i]), green(colorLED[i]), blue(colorLED[i]), 200 - j * 25);
                ellipse(this.AxLED[i], this.AyLED[i], j * 3, j * 3);
              }
            }
          }
        }
      }
    }
  }
  
  // Detecta si se ha pinchado sobre el robot o el punto de giro
  colision() {
    // Tomamos coordenadas del ratón para comprobar si luego el robot se ha desplazado
    mouseOrigenX = mouseX;
    mouseOrigenY = mouseY;
    
    // Convertir coordenadas del mouse considerando PAN y ZOOM
    transformedX = int((mouseX - windowWidth / 2) / (zoomSimulacion * escalaBase) - panSimulacionX);
    transformedY = int((mouseY - windowHeight / 2) / (zoomSimulacion * escalaBase) - panSimulacionY);
    
    if (!this.robotReal) return 0; // Si no hay física
    
    // Transformamos las coordenadas del ratón al espacio del rectángulo
    let cosAng = cos(-this.robotReal.getRotation());
    let sinAng = sin(-this.robotReal.getRotation());
    let mxRotado = transformedX * cosAng - transformedY * sinAng;
    let myRotado = transformedX * sinAng + transformedY * cosAng;
    
    // Control de rotación
    if (dist(mxRotado, myRotado, robotPequeño.width / 2 + 20, 0) < 10) return 1;
    
    // Control de rectángulo
    if (abs(mxRotado) < robotPequeño.width / 2 && abs(myRotado) < robotPequeño.height / 2) return 2;
    
    return 0;
  }
  
  avance(fisica) {
    
    if (esperarUnCiclo == false) {
  // Fuerza proporcional al "voltaje" del motor
 
      //let vL=(this.potMotor[0]/100.0)*MAX_WHEEL_SPEED;// mm/s
      let vR=(this.potMotor[1]/100.0)*MAX_WHEEL_SPEED;
      /*let v=(vL+vR)*0.5;//velocidad lineal
      let w=(vL-vR)/this.L;//velocidad angular  
      let dt = 1.0 / 60.0;
      let dtheta = w * dt;
      this.anguloSinFisica = this.anguloSinFisica + dtheta;        
      this.x += v * cos(this.anguloSinFisica) * dt;
      this.y += v * sin(this.anguloSinFisica) * dt;*/
       // Cinemática diferencial
      /*
      let v = (vR + vL) / 2;
      let omega = (vR - vL) /this.L;
      let angle = this.robotFisico.angle;
      // Velocidad en coordenadas globales
      let vx = v * cos(angle);
      let vy = v * sin(angle);
      // Aplicar movimiento
      robot.setVelocity(this.robot, { x: vx, y: vy });
      robot.setAngularVelocity(this.robot, omega);
      this.x=robot.body.position.x;
      this.x=robot.body.position.y;
      this.anguloSinFisica=robot.body.angle;
      */
    }
    
  }
  
  actuadores() {
    // Sonido del Buzzer
    if (elemento[3].conectorElemento != null) {
      let otroConector = elemento[3].conectorElemento.jumperAsociado.devolverOtroExtremo(elemento[3].conectorElemento);
      if (otroConector && otroConector.gpioConectado != null) {
        let letraAsociada = otroConector.gpioConectado.letraAsociada;
        let valor = max(letraAsociada.valorOutput, letraAsociada.valorLetra);
        
        // NOTA: En p5.js usarías p5.Oscillator o p5.Sound
        if (valor > 127 && isBeeping == false) {
          isBeeping = true;
          // sine.play(); // Depende de tu implementación de sonido
        } else if (valor < 128 && isBeeping == true) {
          isBeeping = false;
          // sine.stop();
        }
      }
    }
  }
  
  setAngulo(radianes) {
    this.robotReal.anguloSinFisica= radianes;
  }
  
  girar(grados) {
    this.anguloSinFisica=radians(grados);
  }
  
  rotatePoint(p) {  
    let cosA = cos(this.anguloSinFisica);
    let sinA = sin(this.anguloSinFisica);
    return createVector(p.x * cosA - p.y * sinA, p.x * sinA + p.y * cosA);
  }
}