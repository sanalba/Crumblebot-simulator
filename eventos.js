function mousePressed() {
  if (mouseButton === LEFT) {
    transformedXbasico = mouseX / escalaBase;
    transformedYbasico = mouseY / escalaBase;
    // Si se pincha en los botones del menú
    for(let i = 3; i < numBotones - 2; i++) {    
      if (transformedXbasico > xBoton[i] - boton[i].width / 2 && 
        transformedXbasico < xBoton[i] + boton[i].width / 2 && 
        transformedYbasico > yBoton[i] - boton[i].width / 2 && 
        transformedYbasico < yBoton[i] + boton[i].height / 2) {      
        if (modo !== i) {
          modo = i; 
          return;
        }
      }
    }
    let inc = 0;
    // Si se pincha en el botón + (ZOOM)
    if (transformedXbasico > xBoton[6] - ANCHO_BOTON / 2 && 
      transformedXbasico < xBoton[6] + ANCHO_BOTON / 2 && 
      transformedYbasico > yBoton[6] - ANCHO_BOTON / 2 && 
      transformedYbasico < yBoton[6] + ANCHO_BOTON / 2) {
      inc = -0.25;
    }
    // Si se pincha en el botón - (ZOOM) 
    else if (transformedXbasico > xBoton[7] - ANCHO_BOTON / 2 && 
        transformedXbasico < xBoton[7] + ANCHO_BOTON / 2 && 
        transformedYbasico > yBoton[7] - ANCHO_BOTON / 2 && 
        transformedYbasico < yBoton[7] + ANCHO_BOTON / 2) {
      inc = 0.25;
    }
    if (inc !== 0) { 
      if (modo === 3) {
        zoomConfiguracion = zoomConfiguracion + inc;
        zoomConfiguracion = constrain(zoomConfiguracion, 1, 1.5);      
      } else if (modo === 4) {
        zoomCodigo = zoomCodigo + inc;
        zoomCodigo = constrain(zoomCodigo, 0.5, 1.5);
      } else if (modo === 5) {
        zoomSimulacion = zoomSimulacion + inc;
        zoomSimulacion = constrain(zoomSimulacion, 0.25, 1.5);
        if (robot.ultrasonidosConectado === true) {
          radio = 0;
          bufferEfectos.clear();
        }
      }
      return;
    }
    // Si se pincha en los botones PLAY, PARAR O REFRESCAR
    for(let i = 0; i < 3; i++) { 
      if (transformedXbasico > xBoton[i] - ANCHO_BOTON / 2 && 
        transformedXbasico < xBoton[i] + ANCHO_BOTON / 2 && 
        transformedYbasico > yBoton[i] - ANCHO_BOTON / 2 && 
        transformedYbasico < yBoton[i] + ANCHO_BOTON / 2) {       
        if (robot.ultrasonidosConectado === true) {
          radio = 0;
          bufferEfectos.clear();
        }       
        // Si se pulsa el botón PLAY
        if (i === 0) botonPlay();
        // Si se pulsa el botón PARAR
        else if (i === 1) botonStop();
        // Si se pulsa el botón REINICIAR
        else if (i === 2) botonReiniciar();
        return;
      }
    }
    if (modo == 5) { // MODO SIMULACIÓN
      //Pulsación den los botones SW1 y SW2
      if (dist(mouseX,mouseY,windowWidth-155,windowHeight/2-40)<10) {elemento[4].valorElemento=255;return;}
      if (dist(mouseX,mouseY,windowWidth-75,windowHeight/2-40)<10) {elemento[6].valorElemento=255;return;}  
      //Pulsación en la bombilla
      if (transformedXbasico>windowWidth/2-anchoBulb/2 && transformedXbasico<windowWidth/2+anchoBulb/2 && transformedYbasico>windowHeight-100-bulb.height/2 && transformedYbasico<windowHeight-100+bulb.height/2) { 
        bulbX=windowWidth/2-robotFisico.body.position.x;
        bulbY=windowHeight-100-robotFisico.body.position.y;
        offsetX=bulbX-transformedXbasico;//Distancia entre ratón y punto de referencia del subBloque
        offsetY=bulbY-transformedYbasico;
        desplazandoBulb=true;
        return;
      } 
      // Convertir coordenadas del mouse considerando PAN y ZOOM
      transformedX=(mouseX-windowWidth/2)/(zoomSimulacion*escalaBase)-panSimulacionX;
      transformedY=(mouseY-windowHeight/2)/(zoomSimulacion*escalaBase)-panSimulacionY;
      transformedObstaculoX=(mouseX-windowWidth/2)/(zoomSimulacion*escalaBase)-panSimulacionX+robotFisico.body.position.x;
      transformedObstaculoY=(mouseY-windowHeight/2)/(zoomSimulacion*escalaBase)-panSimulacionY+robotFisico.body.position.y;   
      transformedXbasico=(mouseX-windowWidth/2)/escalaBase;
      transformedYbasico=(mouseY-0)/escalaBase;
      if (!ejecutando) {
        //Si se pincha en el botón AÑADIR OBSTÁCULO
        if (transformedXbasico > -90-80 && transformedXbasico < -90+80 && transformedYbasico > 75 && transformedYbasico < 105) {         
          //Crear nuevo obstáculo
          let nuevoObstaculo = new Obstaculo(
            transformedX + robotFisico.body.position.x, 
            transformedY + robotFisico.body.position.y, 
            80, 80, 0, false
          );          
          obstaculo.push(nuevoObstaculo);    
          offsetX=nuevoObstaculo.body.position.x-transformedX;//Distancia entre ratón y punto de referencia del subBloque
          offsetY=nuevoObstaculo.body.position.y-transformedY;
          RectX=nuevoObstaculo.body.position.x; 
          RectY=nuevoObstaculo.body.position.y; 
          obstaculoSeleccionado = null;
          obstaculoDesplazando = nuevoObstaculo; // ¡IMPORTANTE! No uses esto con MouseConstraint           
          movidoDuranteEjecucion = true;       
          return; 
        }
        //Si se pincha en el botón AÑADIR BARRERA
        if (transformedXbasico>90-80 && transformedXbasico<90+80 && transformedYbasico>75 && transformedYbasico<105) { 
          let nuevaBarrera = new Obstaculo(
            transformedX + robotFisico.body.position.x, 
            transformedY + robotFisico.body.position.y, 
            80, 80, 0, true
          );          
          obstaculo.push(nuevaBarrera);    
          offsetX=nuevaBarrera.body.position.x-transformedX;//Distancia entre ratón y punto de referencia del subBloque
          offsetY=nuevaBarrera.body.position.y-transformedY;
          RectX=nuevaBarrera.body.position.x; 
          RectY=nuevaBarrera.body.position.y; 
          obstaculoSeleccionado = null;
          obstaculoDesplazando = nuevaBarrera; // ¡IMPORTANTE! No uses esto con MouseConstraint           
          movidoDuranteEjecucion = true;       
          return; 
        }
        //Si se pincha en cualquier obstáculo del tablero del robot
        //Si hay un obstáculo seleccionado podemos girarlo o agrandarlo (obtenemos el modo según donde se pinche)
        if (obstaculoSeleccionado!=null) {
          obstaculoSeleccionado.modoTransformacion=obstaculoSeleccionado.colision();  
          if (obstaculoSeleccionado.modoTransformacion>0 && obstaculoSeleccionado.modoTransformacion<6) {
            obstaculoSeleccionado.body.isStatic=true;
            if (obstaculoSeleccionado.modoTransformacion == 1) { // Para giro
              let anguloInicial = atan2(transformedObstaculoY - obstaculoSeleccionado.body.position.y, transformedObstaculoX - obstaculoSeleccionado.body.position.x);
              offsetAngulo = anguloInicial - obstaculoSeleccionado.body.angle;
            }   
          } else {
            obstaculoSeleccionado=null;
            obstaculoSeleccionado.body.isStatic=obstaculoSeleccionado.estatico;
          }
          return;
        }      
        // Revisa si se ha pinchado sobre alguno de los obstáculos del escenario...
        for (let variable of obstaculo) {
          if (variable.colision()==6) {
            if (Crono>0) movidoDuranteEjecucion=true;
            offsetX=variable.body.position.x-transformedX;
            offsetY=variable.body.position.y-transformedY;
            obstaculoDesplazando=variable;
            RectX=obstaculoDesplazando.body.position.x; 
            RectY=obstaculoDesplazando.body.position.y; 
            obstaculoSeleccionado=null;
            movidoDuranteEjecucion = true;   
            return;
          }
        }
        //Revisa si se ha pinchado sobre el robot
        resultadoSeleccion=robotFisico.colision();
        //Si se pincha en el robot...
        if (robotSeleccionado==true) {
          if (resultadoSeleccion==1) { 
            anguloInicial=atan2(transformedY,transformedX);
            offsetAngulo=anguloInicial-robotFisico.body.angle;
            angleDragged=robotFisico.body.angle;
            robotFisico.body.isStatic=true;
            return;
          } else if (resultadoSeleccion==0) { 
            robotSeleccionado=false;
            return;
          }
        }
        if (resultadoSeleccion==2){
          desplazandoRobot=true;
          robotFisico.body.isStatic=true;
          robotSeleccionado=false;
          offsetX=robotFisico.body.position.x-transformedX;//Distancia entre ratón y origen del robot
          offsetY=robotFisico.body.position.y-transformedY;
          CrumblebotAnteriorX=robotFisico.body.position.x;
          CrumblebotAnteriorY=robotFisico.body.position.y;
          CrumX=robotFisico.body.position.x; 
          CrumY=robotFisico.body.position.y; 
          return;
        }
      }
      //Si no, es porque se ha pinchado en la pantalla...
      if (ejecutando==false) {
        panningSimulacion=true;
        panStartSimulacionX=mouseX;
        panStartSimulacionY=mouseY;
      } 
      return;
    }
    // MODO EDICIÓN DE BLOQUES (modo == 4)
    else if (modo == 4) {
      // Convertir coordenadas del mouse considerando PAN y ZOOM
      if (colorPickerOpen) {
        mouseColorX=(mouseX-windowWidth/2+ANCHO_MARCO/2)/escalaBase; 
        mouseColorY=int((mouseY-windowHeight/2+ALTO_MARCO/2)/escalaBase);
        // Lógica de selección de color
        let pickerMouseX = mouseX - (windowWidth / 2 - ANCHO_MARCO / 2 * escalaBase);
        let pickerMouseY = mouseY - (windowHeight / 2 - ALTO_MARCO / 2 * escalaBase);
        let scaledX = pickerMouseX / escalaBase;
        let scaledY = pickerMouseY / escalaBase;
        // Verificar si se hizo clic en el selector de color (H y S)
        if (mouseColorX >= PICKER_X && mouseColorX <= PICKER_X + ANCHO_PICKER && 
            mouseColorY >= PICKER_Y - ALTO_PICKER && mouseColorY <= PICKER_Y) {
          hue = Math.floor(map(mouseColorX - PICKER_X, 0, ANCHO_PICKER, 0, 239));
          saturation = Math.floor(map(PICKER_Y - mouseColorY, 0, ALTO_PICKER, 0, 240)); 
          currentColor = HSBtoRGB(hue, saturation, getBrightness(currentColor));
          updateColor();
          return;
        }
        // Verificar si se hizo clic en el deslizador de brillo
        let sliderX = PICKER_X + ANCHO_PICKER + 10;
        if (mouseColorX >= sliderX && mouseColorX <= sliderX + 10 && 
            mouseColorY >= PICKER_Y - ALTO_PICKER && mouseColorY <= PICKER_Y) {
          brightness = Math.floor(map(PICKER_Y - mouseColorY, 0, ALTO_PICKER, 0, 240));
          currentColor = HSBtoRGB(getHue(currentColor), getSaturation(currentColor), brightness);
          updateColor();
          return;
        }
        // Botón "Define Custom Colours"
        if (scaledX > 10 && scaledX < 205 && scaledY > 250 && scaledY < 270) {
          //customColorActivo = !customColorActivo;
          return;
        }
        // Botón "OK"
        if (scaledX > 10 && scaledX < 100 && scaledY > 280 && scaledY < 300) {
          colorPickerOpen = false;
          bloqueEditando.dato[subBloqueEditando] = currentColor.toString("#rrggbb");
          bloqueEditando=null;
          return;
        }
        // Botón "Cancel"
        if (scaledX > 115 && scaledX < 205 && scaledY > 280 && scaledY < 300) {
          colorPickerOpen = false;
          bloqueEditando=null;
          return;
        }
        // Selección de color básico
        if (scaledX > 10 && scaledX < 170 && scaledY > 40 && scaledY < 160) {
          let col = int((scaledX - 10) / 25);
          let fila = int((scaledY - 40) / 20);
          if (col >= 0 && col < 8 && fila >= 0 && fila < 6) {
            BASIC_COLORSeleccionado = fila * 8 + col;
            currentColor = BASIC_COLOR[BASIC_COLORSeleccionado];
            updateColor();
          }
          return;
        }  
        // Selección de color personalizado
        if (scaledX > 10 && scaledX < 90 && scaledY > 200 && scaledY < 240) {
          let col = int((scaledX - 10) / 25);
          let fila = int((scaledY - 200) / 20);
          if (col >= 0 && col < 4 && fila >= 0 && fila < 4) {
            customColorSeleccionado = fila * 4 + col;
            if (customColor[customColorSeleccionado]) {
              currentColor = customColor[customColorSeleccionado];
              updateColor();
            }
          }
          return;
        }     
        // Selector de color HSB
        if (customColorActivo && scaledX > PICKER_X && scaledX < PICKER_X + ANCHO_PICKER && 
            scaledY > PICKER_Y - ALTO_PICKER && scaledY < PICKER_Y) {
          hue = map(scaledX - PICKER_X, 0, ANCHO_PICKER, 0, 239);
          saturation = map(PICKER_Y - scaledY, 0, ALTO_PICKER, 0, 240);
          currentColor = HSBtoRGB(hue, saturation, brightness);
          updateColor();
          return;
        }
        // Barra de brillo
        if (customColorActivo && scaledX > PICKER_X + ANCHO_PICKER + 10 && 
            scaledX < PICKER_X + ANCHO_PICKER + 20 && 
            scaledY > PICKER_Y - ALTO_PICKER && scaledY < PICKER_Y) {
          brightness = map(PICKER_Y - scaledY, 0, ALTO_PICKER, 0, 240);
          currentColor = HSBtoRGB(hue, saturation, brightness);
          updateColor();
          return;
        }    
        // Botón "Add to Custom Colours"
        if (customColorActivo && scaledX > PICKER_X && scaledX < PICKER_X + ANCHO_PICKER + 20 && 
            scaledY > 280 && scaledY < 300) {
          // Encontrar el primer slot vacío o reemplazar el seleccionado
          if (customColorSeleccionado < 16) {
            customColor[customColorSeleccionado] = currentColor;
          } else {
            for (let i = 0; i < customColor.length; i++) {
              if (!customColor[i]) {
                customColor[i] = currentColor;
                customColorSeleccionado = i;
                break;
              }
            }
          }
          return;
        }
        return;
      } else {
        // Lógica normal de edición de bloques (cuando el selector de color está cerrado)
        transformedX = (mouseX - windowWidth / 2) / (zoomCodigo * escalaBase) - panCodigoX;
        transformedY = (mouseY - windowHeight / 2) / (zoomCodigo * escalaBase) - panCodigoY;
      }
      // Si hay un código Seleccionado 2 es porque hemos pinchado con el botón derecho sobre un bloque y se ha abierto un desplegable
      if (bloqueSeleccionado !== null && desplegableBloque) {
        // Si está abierto el desplegable para Duplicar/Eliminar bloques
        // Si se pincha en duplicar bloques
        if (mouseX > xDesplegable + 10 * escalaBase && 
          mouseX < xDesplegable + 200 * escalaBase && 
          mouseY > yDesplegable && 
          mouseY < yDesplegable + 25 * escalaBase) {  
          let copia;
          bloquesVirtuales = [];
          for (let variable of bloquesSeleccionados) {
            copia = variable.clonarBloque();
            bloquesVirtuales.push(copia);
          }  
          for (let i = 0; i < bloquesSeleccionados.length; i++) {
            if (bloquesSeleccionados[i].anteriorClon === -1) {
              bloquesVirtuales[i].anterior = null;
            } else {
              bloquesVirtuales[i].anterior = bloquesVirtuales[bloquesSeleccionados[i].anteriorClon];
            }
            if (bloquesSeleccionados[i].siguienteClon === -1) {
              bloquesVirtuales[i].siguiente = null;
            } else {
              bloquesVirtuales[i].siguiente = bloquesVirtuales[bloquesSeleccionados[i].siguienteClon];
            }          
            if (bloquesSeleccionados[i].padreClon === -1) {
              bloquesVirtuales[i].padre = null;
            } else {
              bloquesVirtuales[i].padre = bloquesVirtuales[bloquesSeleccionados[i].padreClon];
            }            
            if (bloquesSeleccionados[i].bucleSiguienteClon === -1) {
              bloquesVirtuales[i].bucleSiguiente = null;
            } else {
                bloquesVirtuales[i].bucleSiguiente = bloquesVirtuales[bloquesSeleccionados[i].bucleSiguienteClon];
            }           
            // Preparamos las variables para un posible posterior clonado
            bloquesSeleccionados[i].anteriorClon = -1;
            bloquesSeleccionados[i].siguienteClon = -1;
            bloquesSeleccionados[i].padreClon = -1;
            bloquesSeleccionados[i].bucleSiguienteClon = -1;
          }        
          for (let i = 0; i < bloquesVirtuales.length; i++) {
            // Preparamos las variables para un posible posterior clonado
            bloquesVirtuales[i].anteriorClon = -1;
            bloquesVirtuales[i].siguienteClon = -1;
            bloquesVirtuales[i].padreClon = -1;
            bloquesVirtuales[i].bucleSiguienteClon = -1;             
            // Añadimos la copia a los códigos del programa
            codigo.push(bloquesVirtuales[i]);
          }
          desplegableBloque=false;  
          return;
        }    
        // Si se pincha en eliminar bloques
        if (mouseX > xDesplegable + 10 * escalaBase && 
          mouseX < xDesplegable + 200 * escalaBase && 
          mouseY > yDesplegable + 25 * escalaBase && 
          mouseY < yDesplegable + 50 * escalaBase) {
          eliminarBloques(); 
          bloquesSeleccionados=[];
          desplegableBloque=false;   
          return;
        }
      }
      // Si pincho sobre uno de los bloques del menú de categorías...
      for (let i = 0; i < codigoCategoria.length; i++) {
        if (codigoCategoria[i].colision(transformedXbasico, transformedYbasico, true) !== null) {
          menu = i;
          return;
        }
      }
      // Si pincho sobre uno de los bloques del MENÚ DE LA IZQUIERDA...
      for (let bloque of codigoMenu) { // Recorro todos los bloques del Menú
        // Solo analizamos los que pertenecen al menú de bloques seleccionado anteriormente
        if (bloque.categoria === menu) { // Pero sólo chequeo aquellos bloques en los que la categoría coincide con el menú que hay seleccionado
          if (bloque.colision(transformedXbasico, transformedYbasico, true) !== null) {
            if (bloque.nombre === "AddNewVariableButton" && menu==3) { // Si pinchamos el botón Crear nueva variable...
              crearVariable("My Var");
              bloqueEditando = codigoVariables[codigoVariables.length - 1];
            } else {
              let ident = bloque.id;
              offsetX = Math.floor(bloque.x - transformedXbasico); // Distancia entre ratón y punto de referencia del subBloque
              offsetY = Math.floor(bloque.y - transformedYbasico);
                      
              let nuevoBloque = new Bloque(
                Math.floor((transformedX + offsetX) / zoomCodigo),
                Math.floor((transformedY + offsetY) / zoomCodigo),
                menu,
                ident,
                t[menu][ident],
                false,
                true
              );      
              codigo.push(nuevoBloque); // Crea un nuevo bloque para incorporar a código       
              if (bloque.nombre === "IfElseBlock") { // Si se trata de un bloque if/else crea sus correspondiente bloque else y vincula ambos
                let bloqueElse = new Bloque(
                  bloque.x,
                  bloque.y,
                  menu,
                  ident + 1,
                  t[menu][ident + 1],
                  false,
                  true
                );     
                codigo.push(bloqueElse); // Crea un nuevo bloque para incorporar al código
                codigo[codigo.length - 1].anterior = codigo[codigo.length - 2];
                codigo[codigo.length - 1].num = cont; // Añade un número al bloque creado
                cont++;
                codigo[codigo.length - 2].siguiente = codigo[codigo.length - 1];
                codigo[codigo.length - 2].num = cont; // Añade un número al bloque creado
                cont++;
                bloqueSeleccionado = codigo[codigo.length - 2];
              } else {
                bloqueSeleccionado = codigo[codigo.length - 1];
              }
              // Si el bloque es un bloquesStart se añade un nuevo hilo
              if (bloqueSeleccionado.nombre === "WhenRunBlock") {
                bloquesStart.push(bloqueSeleccionado);
                bloqueEjecutando = bloqueSeleccionado;
              }                
              // Deja el bloque seleccionado como único en la LISTA de Seleccionados
              bloqueSeleccionado.seleccionBloquesDependientes();
              codigo[codigo.length - 1].num = cont; // Añade un número al bloque creado
              cont++;
            }           
            return;
          }
        }
      }
      // Si hemos pinchado en la pantalla. Si había un bloque que se estaba editando se cierra.
      if (bloqueEditando !== null) cerrarEdicionTexto();
      // ***** COMPROBAMOS SI SE HA PINCHADO EN ALGÚN BLOQUE DEL ESCENARIO ******
      // Lo hacemos con una función porque esta, también servirá para la selección con el botón derecho del ratón
      bloqueSeleccionado = seleccionBloque(transformedX, transformedY);
      if (bloqueSeleccionado !== null) return;
      // ***********************************************************************
      // Si pincho sobre el bloque de la VARIABLE de la izquierda...
      for (let bloque of [...codigoVariables]) {
        if (bloque.colision(transformedXbasico, transformedYbasico, true) !== null) {
          offsetX = Math.floor(bloque.x - transformedXbasico); // Distancia entre ratón y punto de referencia del subBloque
          offsetY = Math.floor(bloque.y - transformedYbasico);       
          let nuevoBloqueVariable = new Bloque(
            transformedX + offsetX,
            transformedY + offsetY,
            3,
            4,
            BOTON_VARIABLE,
            false,
            true
          );      
          codigo.push(nuevoBloqueVariable); // Crea un nuevo bloque para incorporar a código
          codigo[codigo.length - 1].texto[0] = bloque.texto[0];
          codigo[codigo.length - 1].AxTexto[0] = bloque.AxTexto[0];
          codigo[codigo.length - 1].variablePadre = bloque; // Vinculamos su VARIABLE para que todos los bloques incorporados tengan un valor común
          bloqueSeleccionado = codigo[codigo.length - 1];
          bloqueSeleccionado.seleccionBloquesDependientes();
          return;
        }
      }
      for (let bloque of [...botonesVariables]) {
        if (bloque.colision(transformedXbasico, transformedYbasico, true) !== null && menu==3) {
          if (bloque.boton === true) {
            // Si se trata de un botón DELETE. Borramos el propio bloque y todos los bloques vinculados: VARIABLE y DELETE
            if (bloque.id === 100) {
              let index = botonesVariables.indexOf(bloque);
                      
              // Borramos el bloque RENAME asociado
              let siguienteIndex = botonesVariables.indexOf(bloque.siguiente);
              if (siguienteIndex > -1) {
                botonesVariables.splice(siguienteIndex, 1);
              }        
              // Borra todas las variables existentes en el escenario
              for (let bloque2 of [...codigo]) {
                let resultado = bloque2.borrarVariables(bloque.padre); // Aquí el bloque padre es la propia variable del menú izquierdo
                if (resultado !== null) {
                  let bloqueIndex = codigo.indexOf(resultado);
                  if (bloqueIndex > -1) {
                    codigo.splice(bloqueIndex, 1);
                  }
                }
              }                      
              // Borramos la propia variable
              let padreIndex = codigoVariables.indexOf(bloque.padre);
              if (padreIndex > -1) {
                codigoVariables.splice(padreIndex, 1);
              }                    
              // Borramos el propio botón DELETE
              let bloqueIndex = botonesVariables.indexOf(bloque);
              if (bloqueIndex > -1) {
                botonesVariables.splice(bloqueIndex, 1);
              }                     
              altoMenu[3] = altoMenu[3] - codigoMenu[codigoMenu.length - 1].grosorTotal - SEPARACION_BLOQUES_MENU; // Calcula el alto del menú                    
              // Movemos hacia arriba todos los bloque inferiores al borrado
              for (let i = index; i < botonesVariables.length; i = i + 2) {
                botonesVariables[i].y = botonesVariables[i].y - Math.floor(botonesVariables[i].grosorBloque + SEPARACION_BLOQUES_MENU);
                botonesVariables[i].siguiente.y = botonesVariables[i].siguiente.y - Math.floor(botonesVariables[i].siguiente.grosorBloque + SEPARACION_BLOQUES_MENU);
                botonesVariables[i].padre.y = botonesVariables[i].padre.y - Math.floor(botonesVariables[i].padre.grosorBloque + SEPARACION_BLOQUES_MENU);
              }
              return;
            } 
            // Si se trata de un botón RENAME...
            else if (bloque.id === 200) {
              bloqueEditando = bloque.padre; // Vincula para editar texto el bloque padre (VARIABLE EN SÍ)
              return;
            }
          }
        }
      }
      // A estas alturas, si hemos llegado aquí es porque no hemos pinchado en ningún objeto; es decir, hemos pinchado en la pantalla.
      // Si la zona pinchada está fuera de las áreas de los menús, se produce el PANEADO
      let anchoRect;
      if (menu < 5) {
        anchoRect = anchoMenu[0] + 10;
      } else {
        anchoRect = anchoMenu[5] + 10;
      }
      if (!((mouseX < anchoRect && mouseY < altoMenu[menu]) || mouseY < 0)) {
        panningCodigo = true;
        panStartCodigoX = mouseX;
        panStartCodigoY = mouseY;
      }
    }  //***************** MODO CONFIGURACIÓN *************************************************
    else if (modo == 3) {  
      // Transformar coordenadas del mouse (teniendo en cuenta zoom y desplazamiento)
      transformedXbasico = int((mouseX - windowWidth/2) / (zoomConfiguracion * escalaBase / 1.5));
      transformedYbasico = int((mouseY - windowHeight/2) / (zoomConfiguracion * escalaBase / 1.5));
      
      // Si se presionan los pulsadores SW1 o SW2
      if (dist(transformedXbasico, transformedYbasico, -107, 266) < 10) {
        elemento[4].valorElemento = 255;
        return;
      }
      if (dist(transformedXbasico, transformedYbasico, 224, 33) < 10) {
        elemento[6].valorElemento = 255;
        return;
      }
      // Si se presiona el interruptor del robot
      if (transformedYbasico > 270 && transformedYbasico < 280) {
        if (transformedXbasico > 40 && transformedXbasico < 50 && ejecutando == true) {
          botonStop();
          return;
        } else if (transformedXbasico > 75 && transformedXbasico < 85 && ejecutando == false) {
          botonPlay();
          return;
        }
      }
      // Si se presiona el sensor de ultrasonidos
      if (transformedXbasico > ULTRASONIC_X - ANCHO_ULTRASONIC/2 && 
          transformedXbasico < ULTRASONIC_X + ANCHO_ULTRASONIC/2 && 
          transformedYbasico > ULTRASONIC_Y - ALTO_ULTRASONIC/2 && 
          transformedYbasico < ULTRASONIC_Y + ALTO_ULTRASONIC/2) {
        robot.ultrasonidosConectado = true;
        return;
      } else if (transformedXbasico > ULTRASONIDOS_X - ANCHO_ULTRASONIDOS/2 && 
                transformedXbasico < ULTRASONIDOS_X + ANCHO_ULTRASONIDOS/2 && 
                transformedYbasico > ULTRASONIDOS_Y - ALTO_ULTRASONIDOS/2 && 
                transformedYbasico < ULTRASONIDOS_Y + ALTO_ULTRASONIDOS/2) {
        robot.ultrasonidosConectado = false;
        return;
      }
      // Si se pincha en un jumper
      for (let i = 0; i < jumpers.length; i++) {
        let variable = jumpers[i];
        jumperSeleccionado = variable.desconectar(transformedXbasico, transformedYbasico);
        if (jumperSeleccionado != null) return;
      }
      // Si se pincha en el extremo de un cable
      for (let i = 0; i < conector.length; i++) {
        let variable = conector[i];
        conectorSeleccionado = variable.desconectar(transformedXbasico, transformedYbasico);
        if (conectorSeleccionado != null) return;
      }
    } //****************MODO SELECCIÓN DE TAPETE (modo == 6)
    else if (modo == 6) {
      // Ajustar coordenadas por escala
      let mx = mouseX / escalaBase;
      let my = mouseY / escalaBase + offsetYBarra;  
      // Verificar clic en thumbnails
      for (let i = 0; i < thumbnails.length; i++) {
        if (mx >= xPos[i] && mx <= xPos[i] + anchoThumbnail &&
            my >= yPos[i] && my <= yPos[i] + altoThumbnail) {
          indiceTapeteSeleccionado = i;
          shapeCargado=false;
          nombreFondo=archivosSVG[i];
          cargarFondo();
        }
      }  
      // Verificar clic en barra de scroll (si existe)
      if (totalThumbnailsHeight > windowHeight) {
        let barraX = windowWidth - 40;
        if (mouseX >= barraX && mouseX <= barraX + 20 &&
            mouseY >= 60 && mouseY <= windowHeight - 40) {
          // Iniciar arrastre de scroll
          arrastrandoScroll = true;
          clickScrollY = mouseY;
          scrollOffsetInicial = offsetYBarra;
        }
      } 
      // Si se hace clic fuera de todo, deseleccionar
      indiceTapeteSeleccionado = -1;
    } 

  // ******************** SI SE PULSA EL BOTÓN DERECHO *********************
  } else if (mouseButton === RIGHT) {
    if (modo === 4) {
      transformedX = Math.floor((mouseX - windowWidth / 2) / (zoomCodigo * escalaBase) - panCodigoX);
      transformedY = Math.floor((mouseY - windowHeight / 2) / (zoomCodigo * escalaBase) - panCodigoY);
      bloqueSeleccionado = seleccionBloque(transformedX, transformedY);        
      if (bloqueSeleccionado !== null) { 
        desplegableBloque=true;
        xDesplegable = mouseX; 
        yDesplegable = mouseY;
      }
    }    
  } 
}

// PROCEDIMIENTO PARA SELECCIONAR, TANTO SI ES PARA ARRASTRAR (botonDrch=false) COMO SI ES PARA BORRAR/CLONAR (botonDrch=true)
function seleccionBloque(transformedX, transformedY) {
  // Si pincho sobre uno de los bloques del escenario... buscar el bloque más profundo (subbloques) que colisiona
  for (let bloque of codigo) {    
    if (bloque.nombre !== "ElseBlock") { // Impide que en el bloque else se pueda seleccionar
      // Comprueba si el ratón está sobre un bloque (parte superior si es un bucle)
      bloqueSeleccionado = bloque.colision(transformedX, transformedY, true); // true indica que se va a analizar el contacto con la parte superior
    }
    // Si hay selección de un bloque. Comprobamos si hay selección de alguno de los parámetros interiores del bloque
    if (bloqueSeleccionado != null) {
      if (bloqueSeleccionado.nombre === "WhenRunBlock") {
        bloqueStartSeleccionado = bloqueSeleccionado;
      } 
      offsetX = bloque.x - transformedX; // Distancia entre ratón y origen de bloque
      offsetY = bloque.y - transformedY;
      // No queremos que la siguiente línea tenga efecto en los bloques del menú, ya que no podemos editar datos en esos bloques
      if (bloqueSeleccionado.enEscenario === true) { // No queremos que la siguiente línea tenga efecto en los bloques del menú
        bloqueSeleccionado = bloqueSeleccionado.colisionDatos(transformedX, transformedY); // Busca si el puntero está en parámetros/datos en los bloques y ejecuta su edición si los detecta
      } 
      // Si hay algún bloque o subBloque seleccionado
      if (bloqueSeleccionado != null) {  
        bloqueSeleccionado.seleccionBloquesDependientes();   
        offsetX = bloqueSeleccionado.x - transformedX; // Distancia entre ratón y punto de referencia del subBloque
        offsetY = bloqueSeleccionado.y - transformedY;  
        // Cerramos el cuadro de texto si hubiera alguno activo
        if (bloqueEditando != null) cerrarEdicionTexto();  
        inicioDesplazarBloque = true;
        mouseOrigenX = mouseX;
        mouseOrigenY = mouseY;
      } 
      break;
    }
  }
  return bloqueSeleccionado;
}

function mouseDragged() {
  if (modo == 5) { // MODO SIMULACIÓN
    if (panningSimulacion) {
      panSimulacionX+=(mouseX-panStartSimulacionX)/(zoomSimulacion*escalaBase);
      panSimulacionY+=(mouseY-panStartSimulacionY)/(zoomSimulacion*escalaBase);
      panStartSimulacionX=mouseX;
      panStartSimulacionY=mouseY;
      return;
    } 
    // 1. GESTIÓN DE OBSTÁCULOS    
    transformedX = (mouseX - windowWidth / 2) / (zoomSimulacion * escalaBase) - panSimulacionX;
    transformedY = (mouseY - windowHeight / 2) / (zoomSimulacion * escalaBase) - panSimulacionY;
    transformedObstaculoX = transformedX + robotFisico.body.position.x;
    transformedObstaculoY = transformedY + robotFisico.body.position.y;
     //Si hay un obstáculo seleccionado para editar su ángulo y dimensión
    if (obstaculoSeleccionado!=null) {
      if (obstaculoSeleccionado.modoTransformacion==1) {
      // Para giro: calculamos el nuevo ángulo y aplicamos el offset
        let nuevoAngulo=atan2(transformedObstaculoY-obstaculoSeleccionado.body.position.y,transformedObstaculoX-obstaculoSeleccionado.body.position.x);
        obstaculoSeleccionado.body.angle=nuevoAngulo-offsetAngulo;
      } else {
        // Convertimos el movimiento a coordenadas locales del rectángulo
        let dx=(mouseX-pmouseX)/(zoomSimulacion*escalaBase);
        let dy=(mouseY-pmouseY)/(zoomSimulacion*escalaBase);        
        // Rotamos el vector de movimiento inversamente al ángulo del rectángulo
        let cosAng=cos(-obstaculoSeleccionado.body.angle);
        let sinAng=sin(-obstaculoSeleccionado.body.angle);
        let dxLocal=dx*cosAng-dy*sinAng;
        let dyLocal=dx*sinAng+dy*cosAng;        
        // Aplicamos solo el componente necesario (X para ensanchar, Y para alargar)
        if (obstaculoSeleccionado.modoTransformacion==2) {
          obstaculoSeleccionado.ensanchar(dxLocal*2);
        } else if (obstaculoSeleccionado.modoTransformacion==3) {
          obstaculoSeleccionado.ensanchar(-dxLocal*2);
        } else if (obstaculoSeleccionado.modoTransformacion==4) {
          obstaculoSeleccionado.alargar(dyLocal*2);
        } else if (obstaculoSeleccionado.modoTransformacion==5) {
          obstaculoSeleccionado.alargar(-dyLocal*2);
        }
      }
      return;
    }//Si hay un obstáculo seleccionado para ser arrastrado
    else if (obstaculoDesplazando!=null) {
      RectX=transformedX+offsetX;
      RectY=transformedY+offsetY;
      return;
    }
    // 3. GESTIÓN DE BOMBILLA
    else if (desplazandoBulb) {
      bulbX=transformedX+offsetX;
      bulbY=transformedY+offsetY;
      return;
    }    
    // 4. PAN DEL ESCENARIO
    else if (robotSeleccionado) {//Si el robot está seleccionado modificamos su ángulo
      if (Crono>0) movidoDuranteEjecucion=true;
      angleDragged=(atan2(transformedY,transformedX)-offsetAngulo);
      robotFisico.body.angle=(atan2(transformedY,transformedX)-offsetAngulo);
    } else if (desplazandoRobot==true) {//Si el robot setá siendo desplazado cambiamos su posición
      movidoDuranteEjecucion=true;
      CrumX=transformedX+offsetX;
      CrumY=transformedY+offsetY;
      if (robotFisico.body.position.x<-anchoMundo/2.5|| robotFisico.body.position.x>anchoMundo/2.5 || robotFisico.body.position.y<-altoMundo/2.5 || robotFisico.body.position.y>altoMundo/2.5) {
        desplazandoRobot=false;
        Matter.Body.setPosition(robotFisico.body, { 
          x: 0, 
          y: 0 
        });
        mensaje="Robot fuera de los límites del mundo";
        inicioMensaje=millis();      
      }
      return;  
    }
  } // MODO EDICIÓN DE BLOQUES (modo == 4)
  else if (modo == 4) {
    if (colorPickerOpen) {
      // Si el selector de color está abierto, no hacer pan
      return;
    }   
    // PAN del área de código
    if (panningCodigo) {
      panCodigoX += (mouseX - panStartCodigoX) / (zoomCodigo * escalaBase);
      panCodigoY += (mouseY - panStartCodigoY) / (zoomCodigo * escalaBase);
      panStartCodigoX = mouseX;
      panStartCodigoY = mouseY;
    } else if (inicioDesplazarBloque == true && (mouseOrigenX != mouseX || mouseOrigenY != mouseY)) {
      // Detecta si se ha producido movimiento del ratón
      if (bloqueSeleccionado.tipo == '_') {
        desconectar(bloqueSeleccionado); // Lo desconectamos de su bloque superior
      } 
      // Si no es un bloque normal y tiene padre (es un subBloque)...
      else if (bloqueSeleccionado.padre != null) {
        // Recorro todos los subBloques del padre (bloque que contiene el subBloque)
        for (let i = 0; i < bloqueSeleccionado.padre.subBloque.length; i++) {
          if (bloqueSeleccionado == bloqueSeleccionado.padre.subBloque[i]) {
            bloqueSeleccionado.padre.subBloque[i] = null;
            bloqueSeleccionado.padre.AxDato[i] = bloqueSeleccionado.padre.calculoAnchoDato(bloqueSeleccionado.padre.dato[i]);
            bloqueSeleccionado.padre.calculoDimensiones();
            bloqueSeleccionado.padre.calculoGrosorBucle();
            bloqueSeleccionado.padre.actualizarCoordenadas();
            
            if (bloqueSeleccionado.padre.padre != null) {
              bloqueSeleccionado.padre.padre.calculoGrosorBucle();
              bloqueSeleccionado.padre.padre.actualizarCoordenadas();
            }
            break;
          }
        }  
      }
      bloqueSeleccionado.seleccionBloquesDependientes();
      inicioDesplazarBloque = false;
      return;
    } else if (bloqueSeleccionado != null && codigo != null) { // Nos aseguramos que hay un bloque seleccionado
      transformedX = Math.floor((mouseX - windowWidth / 2) / (zoomCodigo * escalaBase) - panCodigoX);
      transformedY = Math.floor((mouseY - windowHeight / 2) / (zoomCodigo * escalaBase) - panCodigoY);
      bloqueSeleccionado.x = transformedX + offsetX;
      bloqueSeleccionado.y = transformedY + offsetY;
      if (bloqueSeleccionado.tipo == '_') {
        bloqueSeleccionado.actualizarCoordenadas(); // Modifica las coordenadas de los bloques conectados debajo del desplazado
      }    
      seleccion = null; // Bloque o parte superior en caso de bucles
      seleccion2 = null; // subBloques
      seleccion3 = null; // Parte inferior de Bucles    
      // Recorremos todos los bloques
      for (let bloque of codigo) {
        // Buscamos solape en otros bloques o en la parte superior de los bucles
        seleccion = bloque.colision(bloqueSeleccionado.x, bloqueSeleccionado.y, true);  
        // Si se ha encontrado un bloque, si el bloque arrastrado es de tipo edición de texto o LISTA
        // Comprobamos colisiones de bloques dentro de los parámetros del bloque seleccionado anteriormente
        if (seleccion != null) { 
          if (bloqueSeleccionado.tipo == 'o' || bloqueSeleccionado.tipo == 'h') {
            seleccion2 = seleccion.colisionInterior(bloqueSeleccionado.x, bloqueSeleccionado.y, bloqueSeleccionado.tipo);        
          }
          break; // Si hay selección no tiene sentido continuar con el bucle for
        }
        // Si el bloque seleccionado es de tipo normal, buscamos solape en las zonas inferiores de los bucles
        if (bloqueSeleccionado.tipo == '_') {
          seleccion3 = bloque.colision(bloqueSeleccionado.x, bloqueSeleccionado.y, false);     
          if (seleccion3 != null) {
            if (seleccion3.nombre === "IfElseBlock") {
              seleccion3 = null; // Si el bloque es if/else no se podrá seleccionar en la parte del else
            }
            break; // Si hay selección no tiene sentido continuar con el bucle for
          }
        }    
      }
    }
  } //MODO CONFIGURACIÓN
  else if (modo === 3) {
    transformedXbasico = Math.floor((mouseX - windowWidth / 2) / (zoomConfiguracion * escalaBase / 1.5));
    transformedYbasico = Math.floor((mouseY - windowHeight / 2) / (zoomConfiguracion * escalaBase / 1.5)); 
    if (jumperSeleccionado != null) {
        jumperSeleccionado.x = transformedXbasico + offsetX;
        jumperSeleccionado.y = transformedYbasico + offsetY; 
        return;
    } else if (conectorSeleccionado != null) {
        conectorSeleccionado.x = transformedXbasico + offsetX;
        conectorSeleccionado.y = transformedYbasico + offsetY;
        return;
    }    
  } // MODO SELECCIÓN DE TAPETE (modo == 6)
  else if (modo == 6) {
    if (draggingScrollBar) {
      let deltaY = mouseY - dragStartY;
      let maxOffset = totalThumbnailsHeight - (windowHeight / escalaBase - 100);
      offsetYBarra = constrain(offsetYBarra + deltaY, 0, maxOffset);
      dragStartY = mouseY;
    }
  }
}

function mouseReleased() {
  if (modo == 5) { // MODO SIMULACIÓN
    panningSimulacion=false;
    desplazandoBulb=false;
    elemento[4].valorElemento=0;//Desactiva el BOTÓN SW1
    elemento[6].valorElemento=0;//Desactiva el BOTÓN SW2
    //Si se estaba desplazando un obstáculo 
    if (obstaculoDesplazando!=null) {
      //Si realmente no se ha producido arrastre del obstáculo, hacemos que se seleccione para editar (dimensionar/girar)
      if (mouseX==mouseOrigenX && mouseY==mouseOrigenY) {
        obstaculoSeleccionado=obstaculoDesplazando;
        obstaculoSeleccionado.isStatic=true;
      } else {
        obstaculoDesplazando.body.isStatic=obstaculoDesplazando.estatico;
      }
      Matter.Body.setPosition(obstaculoDesplazando.body, { 
        x: RectX, 
        y: RectY 
      });
      obstaculoDesplazando=null;
      return;
    }
    // Liberar robot
    if (desplazandoRobot) {
      if (mouseX==mouseOrigenX && mouseX==mouseOrigenX) robotSeleccionado=true;
      Matter.Body.setPosition(robotFisico.body, { 
        x: CrumX, 
        y: CrumY 
      });
      robotFisico.body.isStatic=false;
      desplazandoRobot = false;
      return;  
    }
    if (robotSeleccionado) {
      robotFisico.body.isStatic=false;
      //robotFisico.body.angle=angleDragged;
      robotSeleccionado = false;
    }
    // Liberar bombilla
    if (desplazandoBulb) {
      desplazandoBulb = false;
    }
  } // MODO CONFIGURACIÓN DEL ROBOT (modo == 3)
  else if (modo == 3) {
    // Conectar jumper o conector al soltar
    if (jumperSeleccionado != null) {
      jumperSeleccionado.conectar();
      jumperSeleccionado = null;
    } 
    if (conectorSeleccionado != null) {
      conectorSeleccionado.conectar();
      conectorSeleccionado = null;
    }
  } // MODO DE EDICIÓN DE BLOQUES
  else if (modo == 4) {
    panningCodigo = false;
    desplazandoVentanaColor = false;
    if (bloqueSeleccionado != null) { // Nos aseguramos que hay un bloque seleccionado 
      // Convertir coordenadas del mouse considerando PAN y ZOOM
      transformedXbasico = Math.floor((mouseX + offsetX));
      transformedYbasico = Math.floor((mouseY + offsetY));
      let anchoRect;
      if (menu < 5) {
        anchoRect = anchoMenu[0] + 10;
      } else {
        anchoRect = anchoMenu[5] + 10;
      }
      // Si soltamos el bloque fuera de la pantalla activa
      if ((transformedXbasico < anchoRect + 5 && transformedYbasico < (altoMenu[menu] + 5) * escalaBase) || 
          transformedYbasico < ALTO_MENU_SUPERIOR) {
        // Si el bloque es un bloquesStart lo elimina de la lista de bloques de inicio
        if (bloqueSeleccionado.nombre === "WhenRunBlock") {
          // Encontrar y eliminar el bloque de bloquesStart
          let index = -1;
          for (let i = 0; i < bloquesStart.length; i++) {
            if (bloquesStart[i] === bloqueSeleccionado) {
              index = i;
              break;
            }
          }
          if (index > -1) {
            bloquesStart.splice(index, 1);
          }
        }  
        //Elimina los bloques seleccionados
        eliminarBloques();  
        bloquesSeleccionados=[];         
      } else if (inicioDesplazarBloque == false) {
        if (bloqueSeleccionado.nombre === "WhenRunBlock") {
          bloqueStartSeleccionado = bloqueSeleccionado;
        }
        // Si hay selección en la parte inferior de un bucle...
        if (seleccion3 != null) {
          conectar(bloqueSeleccionado, seleccion3, false); // Lo conectamos (false indica parte inferior)
          seleccion3 = null;
        // Si hay selección de un subBloque...
        } else if (seleccion2 != null && bloqueSeleccionado.tipo == seleccion2.tipoDato[seleccionSubBloque]) {
          seleccion2.addSubBloque(seleccionSubBloque, bloqueSeleccionado); // Lo añadimos dentro de un bloque
          seleccion2 = null;
        // Si hay selección de un bloque o de la parte superior de un bucle...
        } else if (seleccion != null && seleccion.tipo == '_' && bloqueSeleccionado.tipo == '_') {
          conectar(bloqueSeleccionado, seleccion, true); // Lo conectamos (true indica parte superior)  
          seleccion = null;
        }
      } 
      if (!desplegableBloque) {
        bloqueSeleccionado = null;
        bloquesSeleccionados = [];
      }
    } 
  } // MODO SELECCIÓN DE TAPETE (modo == 6)
  else if (modo == 6) {
    // Liberar barra de scroll
    draggingScrollBar = false;
  }
}

function keyPressed() {
  // MODO SIMULACIÓN
  if (modo == 5) {
    // Tecla ESPACIO: alternar ejecución
    if (key == ' ') {
      if (ejecutando) {
        botonStop();
      } else {
        botonPlay();
      }
      return;
    }
    
    // Tecla 'R': reiniciar simulación
    if (key == 'r' || key == 'R') {
      reiniciarSimulacion();
      return;
    }
    if (keyCode === 27) {  // 27 es el código de ESC
    }
    // Tecla DELETE: eliminar obstáculo seleccionado
    if (key == DELETE || key == BACKSPACE) {
      if (obstaculoSeleccionado != null) {
        let index = obstaculo.indexOf(obstaculoSeleccionado);
        if (index > -1) {
          obstaculoSeleccionado.eliminar();
          obstaculo.splice(index, 1);
          obstaculoInicio.splice(index, 1);
          obstaculoSeleccionado = null;
          movidoDuranteEjecucion = true;
        }
      }
      return;
    }
  } // MODO EDICIÓN DE BLOQUES
  else if (modo == 4) {
    // Si estamos editando texto
    if (modo==4 && bloqueEditando != null && colorPickerOpen == false) {
      if (keyCode == BACKSPACE) {
        // Eliminar último carácter
        if (textoTemporal.length > 0) {
          textoTemporal = textoTemporal.substring(0, textoTemporal.length - 1);
        }
      } else if (keyCode == ENTER || keyCode == RETURN || keyCode == ESCAPE) {
        cerrarEdicionTexto();
      }  else if (textoTemporal.length < maximoCaracteres) {
        // Añadir carácter
        if (bloqueEditando.nombre!="VariableBlock") {
          if ((key >= '0' && key <= '9') || key == '.' || key == '-') {
            textoTemporal += key;
          } 
        } else if ((key >= '0' && key <= '9') || (key >= 'a' && key <= 'z') || (key >= 'A' && key <= 'Z') || key === '.' || key === '-') {
          textoTemporal += key;
        }
      }
      return;
    }
    // Tecla DELETE: eliminar bloque seleccionado
    if (keyCode == DELETE || keyCode == BACKSPACE) {
      if (bloqueSeleccionado2 != null) {
        // Lógica para eliminar bloque
        eliminarBloque(bloqueSeleccionado2);
        bloqueSeleccionado2 = null;
        xDesplegable = -100;
        yDesplegable = -100;
      }
      return;
    }
    // Teclas ZOOM: Ctrl+ y Ctrl-
    if (keyCode == 61 && (keyIsDown(CONTROL) || keyIsDown(91))) { // Ctrl+ o Cmd+
      zoomCodigo = min(zoomCodigo + 0.1, 3.0);
      return;
    }
    if (keyCode == 173 && (keyIsDown(CONTROL) || keyIsDown(91))) { // Ctrl- o Cmd-
      zoomCodigo = max(zoomCodigo - 0.1, 0.5);
      return;
    }
  }
}

function eliminarBloques() {
  for (let bloque of bloquesSeleccionados) {
    bloque.eliminarBloque();
  }
}

function cerrarEdicionTexto() {
  // Si estamos editando un bloque del escenario y no el nombre de una variable...
  if (!(bloqueEditando.categoria === 3 && bloqueEditando.id > 3)) {
    if (esNumeroReal(textoTemporal)) {
      let numero = parseFloat(textoTemporal);     
      // Si el número supera el máximo permitido para ese bloque lo limita
      if (bloqueEditando.nombre === "MotorBlock") {
        if (numero > 100) numero = 100;
        else if (numero < 0) numero = 0;
      } else if (bloqueEditando.nombre === "ServoBlock" || bloqueEditando.nombre === "ServoBlockType") {
        if (numero > 90) numero = 90;
        else if (numero < -90) numero = -90;
      } else if (bloqueEditando.nombre === "SetSprakleBlock" || bloqueEditando.nombre === "TurnSprakleOffBlock" || (bloqueEditando.nombre === "SetSprakleRGBBlock" && subBloqueEditando === 0)) {
        if (numero > 31) numero = 31;
        else if (numero < 0) numero = 0;
      } else if ((bloqueEditando.nombre === "SetSprakleRGBBlock" && (subBloqueEditando === 1 || subBloqueEditando === 2 || subBloqueEditando === 3)) || bloqueEditando.nombre === "SetAllSparklesRGBBlock") {
        if (numero > 255) numero = 255;
        else if (numero < 0) numero = 0;
      } else if (bloqueEditando.nombre === "WaitBlock" || bloqueEditando.nombre === "WaitMSBlock" || bloqueEditando.nombre === "DoTimesBlock") {
        if (numero > 32767) numero = 32767;
        else if (numero < 0) numero = 0;
      } else if (bloqueEditando.nombre === "AddBlock" || bloqueEditando.nombre === "SubBlock" || bloqueEditando.nombre === "MultiplyBlock" || bloqueEditando.nombre === "DivideBlock") {
        if (numero > 32767) numero = 32767;
        else if (numero < 0) numero = 0;
      } else if (bloqueEditando.nombre === "EqualityBlock" || bloqueEditando.nombre === "NotEqualBlock" || bloqueEditando.nombre === "LessThanBlock" || bloqueEditando.nombre === "GreaterThanBlock" || bloqueEditando.nombre === "RandomBlock") {
        if (numero > 32767) numero = 32767;
        else if (numero < 0) numero = 0;
      } else if (bloqueEditando.nombre === "SmartDigitsBlock") {
        if (numero > 32767) numero = 32767;
        else if (numero < 0) numero = 0;
      } else if (bloqueEditando.nombre === "SmartPitchBlock") {
        if (numero > 20000) numero = 20000;
        else if (numero < 0) numero = 0;
      } else if (bloqueEditando.nombre === "SetTempoBlock") {
        if (numero > 300) numero = 300;
        else if (numero < 0) numero = 0;
      }
      // Hay bloques que sólo permiten número enteros y otros que admiten números reales
      if (bloqueEditando.nombre === "WaitBlock") {
        textoTemporal = String(numero);
      } else {
        textoTemporal = String(Math.floor(numero));
      }
      // Sustituimos el valor del parámetro/dato del bloque por el del cuadro de texto
      bloqueEditando.dato[subBloqueEditando] = textoTemporal;
      // Recalculamos las dimensiones del bloque
      bloqueEditando.AxDato[subBloqueEditando] = bloqueEditando.calculoAnchoDato(bloqueEditando.dato[subBloqueEditando]);
      bloqueEditando.calculoDimensiones();
    }
  } 
  // Si estamos editando el nombre de una variable
  else {
    // Si el nombre de la variable no está en blanco...
    if (textoTemporal.replace(/ /g, "").length > 0) {
      bloqueEditando.texto[0] = textoTemporal;
      bloqueEditando.AxTexto[0] = bloqueEditando.calculoAnchoDato(bloqueEditando.texto[0]);
      bloqueEditando.calculoDimensiones();
      // Recoloca el botón DELETE
      bloqueEditando.siguiente.x = bloqueEditando.x + bloqueEditando.ancho + 10;
      // Recoloca el botón RENAME
      bloqueEditando.siguiente.siguiente.x = bloqueEditando.siguiente.x + bloqueEditando.siguiente.ancho + 10;
      let bloqueRENAME = bloqueEditando.siguiente.siguiente;
      if (bloqueRENAME.x + bloqueRENAME.ancho + 5 > anchoMenu[3]) {
        anchoMenu[3] = bloqueRENAME.x + bloqueRENAME.ancho + 5;
      }
      // Actualizar nombre en todos los bloques
      for (let bloque of codigo) {
        bloque.actualizarNombreVariables(bloqueEditando);
      }
    }
  }
  // Desactiva el cuadro de texto activo
  bloqueEditando = null;
  textoTemporal = "";
}

function mouseWheel(event) {
  // ZOOM en modo simulación
  if (modo == 5) {
    let zoomFactor = 1.1;
    let mouseXBefore = (mouseX - windowWidth / 2) / (zoomSimulacion * escalaBase) - panSimulacionX;
    let mouseYBefore = (mouseY - windowHeight / 2) / (zoomSimulacion * escalaBase) - panSimulacionY;
    if (event.delta > 0) {
      zoomSimulacion /= zoomFactor;
    } else {
      zoomSimulacion *= zoomFactor;
    }
    zoomSimulacion = constrain(zoomSimulacion, 0.1, 3.0);
    let mouseXAfter = (mouseX - windowWidth / 2) / (zoomSimulacion * escalaBase) - panSimulacionX;
    let mouseYAfter = (mouseY - windowHeight / 2) / (zoomSimulacion * escalaBase) - panSimulacionY;
    panSimulacionX += mouseXAfter - mouseXBefore;
    panSimulacionY += mouseYAfter - mouseYBefore;
  } // ZOOM en modo edición de bloques
  else if (modo == 4) {
    let zoomFactor = 1.1;
    let mouseXBefore = (mouseX - windowWidth / 2) / (zoomCodigo * escalaBase) - panCodigoX;
    let mouseYBefore = (mouseY - windowHeight / 2) / (zoomCodigo * escalaBase) - panCodigoY;
    if (event.delta > 0) {
      zoomCodigo /= zoomFactor;
    } else {
      zoomCodigo *= zoomFactor;
    }
    zoomCodigo = constrain(zoomCodigo, 0.5, 3.0); 
    let mouseXAfter = (mouseX - windowWidth / 2) / (zoomCodigo * escalaBase) - panCodigoX;
    let mouseYAfter = (mouseY - windowHeight / 2) / (zoomCodigo * escalaBase) - panCodigoY;
    panCodigoX += mouseXAfter - mouseXBefore;
    panCodigoY += mouseYAfter - mouseYBefore;
  } // Scroll en modo selección de tapete
  else if (modo == 6) {
    offsetYBarra += event.delta * 0.5;
    let maxOffset = totalThumbnailsHeight - (windowHeight / escalaBase - 100);
    offsetYBarra = constrain(offsetYBarra, 0, maxOffset);
  }
  return false; // Prevenir scroll predeterminado
}

function cargarFondo() {
  loadImage("assets/images/escenarios/" + nombreFondo,(img) => {
    fondo = createGraphics(img.width,img.height);
    fondo.pixelDensity(1);
    fondo.background(255);
    fondo.image(img, 0, 0, fondo.width,fondo.height);
    modo=5;
    shapeCargado = true;
    return;
  });
}
//*******************************************************************

function botonPlay() {
  if (modo == 5 && !ejecutando) {
    ejecutando = true;
    inicioCrono = millis();
    bloqueEjecutando = bloqueStartSeleccionado;
    Distancia = 0;
    // Resetear variables
    for (let variable of codigoVariables) {
      variable.dato[0] = "0";
      variable.valorNumerico = 0;
    }
  }
}

function botonStop() {
  ejecutando = false;
  bloqueEjecutando = null;
  // Detener motores
  if (crumblebot) {
    crumblebot.potMotor[0] = 0;
    crumblebot.potMotor[1] = 0;
  }
  // Detener sonido
  isBeeping = false;
  // sine.stop(); // Si estás usando p5.sound
}

function botonReiniciar() {
  // Pone las variables a cero
  for (let variable of codigoVariables) {
    variable.dato[0] = "0";
    variable.valorNumerico = 0;
  }
  // Establece las coordenadas y ángulo del robot iniciales
  crumblebot.x = crumblebot.xInicio;
  crumblebot.y = crumblebot.yInicio;
  Matter.Body.setPosition(robotFisico.body, { 
        x: crumblebot.xInicio, 
        y: crumblebot.yInicio 
      });
  robotFisico.body.angle = crumblebot.anguloInicio;
  // Establece los obstáculos en su configuración inicial
  // Eliminar obstáculos existentes
  if (obstaculo) {
    for (let i = obstaculo.length - 1; i >= 0; i--) {
      if (obstaculo[i] && obstaculo[i].eliminar) {
        obstaculo[i].eliminar();
      }
    }
    obstaculo.length = 0; // clear() en JavaScript
    // Recrear obstáculos desde la configuración inicial
    if (obstaculoInicio != null) {
      for (let i = 0; i < obstaculoInicio.length; i++) {
        let obsInicial = obstaculoInicio[i];
        if (obsInicial) {
          let nuevoObstaculo = new Obstaculo(
            obsInicial.x,
            obsInicial.y,
            obsInicial.ancho,
            obsInicial.alto,
            obsInicial.angulo,
            obsInicial.estatico
          );
          obstaculo.push(nuevoObstaculo);
          Body.setVelocity(obstaculo, 0);
          Body.setAngularVelocity(obstaculo, 0);
        }
      }
    }
  }
  // Para que se ejecute debe haber al menos un bloque Start
  bloqueEjecutando = bloqueStartSeleccionado;
  movidoDuranteEjecucion = false;
  esperarUnCiclo = false;
  saltoIfElse = false;
  miliSegundos = 0;
  Crono = 0;
  Distancia = 0;
  // Detiene los motores
  if (crumblebot.potMotor) {
    crumblebot.potMotor[0] = 0;
    crumblebot.potMotor[1] = 0;
  } 
  // Desactiva el zumbador
  isBeeping = false;
  /*if (sine && sine.stop) {
    sine.stop();
  }*/
  // Desactiva todos los diodos LED
  if (colorLED) {
    for (let j = 0; j < colorLED.length; j++) {
      colorLED[j] = color(0);
    }
  } 
  // Reinicio adicional de variables (repetido en tu código original)
  for (let variable of codigoVariables) {
    variable.dato[0] = "0";
  } 
  if (colorLED) {
    for (let i = 0; i < 8; i++) {
      if (i < colorLED.length) {
        colorLED[i] = color(0);
      }
    }
  }
}

function reiniciarSimulacion() {
  // Restaurar obstáculos a posición inicial
  for (let i = 0; i < obstaculoInicio.length; i++) {
    if (obstaculo[i]) {
      obstaculo[i].setPosition(obstaculoInicio[i].x, obstaculoInicio[i].y);
      obstaculo[i].setRotation(obstaculoInicio[i].angulo);
      obstaculo[i].setSize(obstaculoInicio[i].ancho, obstaculoInicio[i].alto);
    }
  }
  // Restaurar robot a posición inicial
  if (crumblebot) {
    crumblebot.x=crumblebot.xInicio;
    crumblebot.x=yInicio;
    crumblebot.anguloSinFisica=crumblebot.anguloInicio;
    crumblebot.potMotor[0] = 0;
    crumblebot.potMotor[1] = 0;
  }
  // Detener ejecución
  ejecutando = false;
  bloqueEjecutando = null;
  movidoDuranteEjecucion = false;
  // Resetear variables
  for (let variable of codigoVariables) {
    variable.dato[0] = "0";
    variable.valorNumerico = 0;
  }
}

function eliminarBloque(bloque) {
  // Lógica para eliminar un bloque del código
  // Esta función depende de tu implementación específica
  let index = codigo.indexOf(bloque);
  if (index > -1) {
    // Desconectar el bloque
    desconectar(bloque);  
    // Eliminar de las listas
    codigo.splice(index, 1); 
    // Actualizar referencias
    // (más lógica específica de tu aplicación)
  }
}