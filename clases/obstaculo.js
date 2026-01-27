class ObstaculoInicio {
  constructor(x, y, w, h, angulo, estatico) {
    this.body = Bodies.rectangle(x, y, w, h, {
      isStatic: estatico
    });
    this.x = x;
    this.y = y;
    this.ancho = w;
    this.alto = h;
    this.angulo = angulo;
  }
}

class Obstaculo {
  constructor(x, y, w, h, angulo, estatico) {
    this.body = Bodies.rectangle(x, y, w , h, {
      density: 1,
      friction: 1,
      restitution: 1,
      isStatic: estatico
    });
    this.x = x;
    this.y = y;
    this.ancho = w;
    this.alto = h;
    this.angulo = angulo;
    this.estatico = estatico;
    World.add(world, this.body);
  }
  
  eliminar() {
    if (this.body != null && this.world != null) {
      World.remove(world,body);
    }
  }
  
  setSize(newWidth, newHeight) {
    // Guardar propiedades importantes
    let options = {
        density: this.body.density,
        friction: this.body.friction,
        restitution: this.body.restitution,
        render: this.body.render,
        isStatic: this.body.isStatic
    }; 

    // Crear nuevo cuerpo
    let newBody = Bodies.rectangle(
        this.body.position.x,
        this.body.position.y,
        newWidth,
        newHeight,
        options
    );   
    // Transferir propiedades de estado
    Body.setVelocity(newBody, this.body.velocity);
    Body.setAngularVelocity(newBody, this.body.angularVelocity);
    Body.setAngle(newBody, this.body.angle);
    Body.isStatic=this.estatico;
    // Reemplazar en el mundo
    World.remove(world, this.body);
    World.add(world, newBody);

    // **Actualizar la referencia dentro del objeto**
    this.body = newBody;
    this.ancho = newWidth;
    this.alto = newHeight;
    
  }

  
  setPosition(x, y) {
    this.x = x;
    this.y = y;
    if (this.body && this.body.setPosition) {
      this.body.setPosition(x, y);
    }
  }
  
  setRotation(angle) {
    this.angulo = angle;
    if (this.body && this.body.setRotation) {
      this.body.setRotation(angle);
    }
  }
  
  getBody() {
    return this.body;
  }
  
  // Dibuja las circunferencias para dimensionar/girar el obstáculo
  dibujarEdicion() {
    push();
    if (obstaculoDesplazando==this) {
      translate(
        RectX, 
        RectY
      );
    } else {
      translate(
        this.body.position.x, 
        this.body.position.y
      );
    }
    rotate(this.body.angle);
    rectMode(CENTER);
    if (this.estatico) {
      fill(255,0,0);
    } else {
      fill(0,0,255);
    }
    
    rect(0,0, this.ancho, this.alto);
    // Dibujar selecciones
    if (obstaculoSeleccionado == this) {
      stroke(0);
      fill(255);
      ellipse(this.ancho / 2, 0, 15, 15);
      ellipse(0, this.alto / 2, 15, 15);
      ellipse(-this.ancho / 2, 0, 15, 15);
      ellipse(0, -this.alto / 2, 15, 15);
      ellipse(0, -this.alto / 2 - 30, 15, 15);
    } 
    pop();
  }

  
  // Detecta si se ha pinchado sobre alguno de los puntos de transformación o sobre el rectángulo
  colision() {
    //if (!crumblebot ) return 0;
    // Tomamos coordenadas del ratón para comprobar si luego el bloque se ha desplazado
    mouseOrigenX = mouseX;
    mouseOrigenY = mouseY;
    // Convertir coordenadas del mouse considerando PAN y ZOOM
    transformedX = (mouseX - windowWidth / 2) / (zoomSimulacion * escalaBase) - panSimulacionX;
    transformedY = (mouseY - windowHeight / 2) / (zoomSimulacion * escalaBase) - panSimulacionY;
     
    transformedObstaculoX = transformedX + robotFisico.body.position.x;
    transformedObstaculoY = transformedY + robotFisico.body.position.y;

    // Transformamos las coordenadas del ratón al espacio del rectángulo  
    let mx = transformedObstaculoX - this.body.position.x;
    let my = transformedObstaculoY - this.body.position.y;   
    let cosAng = cos(-this.body.angle);
    let sinAng = sin(-this.body.angle);
    let mxRotado = mx * cosAng - my * sinAng;
    let myRotado = mx * sinAng + my * cosAng;
    
    // Control de rotación
    if (dist(mxRotado, myRotado, 0, -this.alto / 2 - 30) < 10) return 1;
    
    // Controles de tamaño
    if (dist(mxRotado, myRotado, this.ancho / 2, 0) < 10) return 2;
    if (dist(mxRotado, myRotado, -this.ancho / 2, 0) < 10) return 3;
    if (dist(mxRotado, myRotado, 0, this.alto / 2) < 10) return 4;
    if (dist(mxRotado, myRotado, 0, -this.alto / 2) < 10) return 5;
    
    // Control de rectángulo
    if (abs(mxRotado) < this.ancho / 2 && abs(myRotado) < this.alto / 2) return 6;
    
    return 0;
  }
  
  setAngulo(radianes) {
    if (this.body && this.body.angle) {
      this.body.angle=radianes;
    }
  }
  
  girar(grados) {
    if (this.body && this.body.angle) {
      this.body.angle=(radians(grados));
    }
  }
  
  ensanchar(cantidad) {
    this.setSize(max(10, this.ancho + cantidad), this.alto);
  }
  
  alargar(cantidad) {
    this.setSize(this.ancho, max(10, this.alto + cantidad));
  }
  
  addStaticObstacle(x, y, w, h) {
    //Depende de la biblioteca de física
    let staticObstacle = Bodies.rectangle(x, y, w, h, { isStatic: true });
    World.add(this.world, staticObstacle);
  }
  
  getLados() {
    let corners = new Array(4);
    let hw = this.ancho / 2;
    let hh = this.alto / 2;
    
    corners[0] = this.rotatePoint(createVector(-hw, -hh));
    corners[1] = this.rotatePoint(createVector(hw, -hh));
    corners[2] = this.rotatePoint(createVector(hw, hh));
    corners[3] = this.rotatePoint(createVector(-hw, hh));
 
    for (let i = 0; i < 4; i++) {
      corners[i].add(createVector(this.body.x , this.body.y ));
    }
    
    return corners;
  }
  
  rotatePoint(p) {
    let cosA = cos(this.body.angle);
    let sinA = sin(this.body.angle);
    return createVector(p.x * cosA - p.y * sinA, p.x * sinA + p.y * cosA);
  }
  
  getEsquinas() {
    let w = this.ancho;
    let h = this.alto;   
    let center = createVector(this.body.x , this.body.y );
    let corners = new Array(4);  
    // Esquinas locales (sin rotar, relativas al centro)
    let localCorners = [
      createVector(-this.ancho / 2, -this.alto / 2),  // arriba-izquierda
      createVector(this.ancho/ 2, -this.alto / 2),   // arriba-derecha
      createVector(this.ancho / 2, this.alto / 2),    // abajo-derecha
      createVector(-this.ancho / 2, this.alto / 2)    // abajo-izquierda
    ];   
    // Aplicar rotación y traslación
    for (let i = 0; i < 4; i++) {
      let corner = localCorners[i];
      let xRotated = corner.x * cos(this.body.angle) - corner.y * sin(this.body.angle);
      let yRotated = corner.x * sin(this.body.angle) + corner.y * cos(this.body.angle); 
      corners[i] = createVector(
        center.x + xRotated,
        center.y + yRotated
      );
    }
    
    return corners;
  }
  
  // Método para dibujar el obstáculo (sin edición)
  dibujar2() {
    if (!this.body) {
      // Dibujar sin física
      push();
      translate(this.x, this.y);
      rotate(this.angulo);
      
      if (this.estatico) {
        fill(200, 100, 100);
      } else {
        fill(100, 100, 200);
      }
      
      noStroke();
      rectMode(CENTER);
      //rect(0, 0, this.ancho, this.alto);
      pop();
    } else {
      // La biblioteca de física normalmente se encarga del dibujo
      // o necesitarías obtener las propiedades y dibujar manualmente
    }
  }
}