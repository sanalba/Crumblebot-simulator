class Bloque {
  constructor(x, y, categoria, id, texto, boton = false, enEscenario = false) {
    // IDENTIFICACIÓN
    this.nombre = texto[0];
    this.categoria = categoria;
    this.id = id;
    this.bucle = false;
    this.boton = boton;
    this.enEscenario = enEscenario;
    this.colorBloque;
    this.colorBorde;
    // VINCULACIÓN DE BLOQUES
    this.subBloque = [];
    this.siguiente = null;
    this.bucleSiguiente = null;
    this.anterior = null;
    this.padre = null;
    this.variablePadre = null;
    // PARA PROCESO DE EJECUCIÓN
    this.repeticionBucle = false;
    this.repeticion = 0;
    // TEXTOS
    this.numTextos = 0;
    this.texto = [];
    this.xTexto = [];
    this.AxTexto = [];
    this.indiceLISTA = [];
    // DATOS
    this.valorNumerico = 0;
    this.valorLogico = false;
    this.dato = [];
    this.tipo = texto[1].charAt(0);
    this.numDatos = 0;
    this.tipoDato = [];
    this.xDato = [];
    this.AxDato = [];
    // POSICIÓN Y DIMENSIONES  
    this.x = x;
    this.y = y;
    this.grosorBase = 20;
    this.grosorBloque = this.grosorBase;
    this.grosorBloquesBucle = 0;
    this.grosorTotal = 0;
    this.inc = 2;
    this.grosorDato = this.grosorBloque - this.inc * 2;
    this.anchoLadoIzqBucle = this.grosorBloque / 2;
    this.ancho = 0;
    // Para clonado
    this.anteriorClon = -1;
    this.siguienteClon = -1;
    this.padreClon = -1;
    this.bucleSiguienteClon = -1;
    // Calcula número de textos y datos
    for (let i = 2; i < texto.length; i++) {
      if (!texto[i] || texto[i] === "") break;
      else if (texto[i].charAt(0) === '_') this.numTextos++;
      else this.numDatos++;
    }
    this.boton = boton;
    // Casos especiales
    if (this.nombre === "ElseBlock") this.grosorBloque = this.grosorBase;
    else if (this.nombre === "IfElseBlock") this.grosorBloque = this.grosorBase;
    else if (this.nombre === "AddNewVariableButton") {
      botonCrearVariable=this;
      this.boton = true;
    }
    this.calculoColores(this.boton);
    this.subBloque = new Array(this.numDatos);
    // Inicializar arrays
    this.texto = new Array(this.numTextos);
    this.dato = new Array(this.numDatos);
    if (this.nombre === "VariableBlock") {
      this.dato = new Array(1);
      this.dato[0] = "0";
    } else {
      this.dato = new Array(this.numDatos);
    }
    this.indiceLISTA = new Array(this.numDatos).fill(0);
    this.tipoDato = new Array(this.numDatos);
    this.AxTexto = new Array(this.numTextos);
    this.xTexto = new Array(this.numTextos);
    this.AxDato = new Array(this.numDatos);
    this.xDato = new Array(this.numDatos); 
    // Procesar elementos del texto
    let contadorDatos = 0, contadorTextos = 0;
    for (let i = 2; i < texto.length; i++) {
      if (texto[i] && texto[i] !== "") {
        let caracter = texto[i].charAt(0);
        if (caracter === '_') {
          this.texto[contadorTextos] = texto[i].substring(1);
          this.AxTexto[contadorTextos] = int(textWidth(this.texto[contadorTextos] + "   "));
          contadorTextos++;
        } else {
          this.tipoDato[contadorDatos] = caracter;
          this.dato[contadorDatos] = texto[i].substring(1);      
          if (caracter === '*') {
            this.AxDato[contadorDatos] = this.grosorDato;
          } else {
            this.AxDato[contadorDatos] = this.calculoAnchoDato(this.dato[contadorDatos]);
          }         
          contadorDatos++;
        }  
        if (this.tipo === 'o' && this.numDatos > 0) {
          if (this.AxTexto.length > 0) {
            this.AxTexto[0] -= 1;
            this.AxTexto[this.numTextos - 1] -= 8;
          }
        }
      }
    }
    // Determinar si es bucle
    if (this.categoria === 2 && this.id > 2) this.bucle = true;
    this.calculoGrosorBucle();
    this.calculoDimensiones();
  }
  
  clonarBloque() {
    let copia;
    // Crear nueva instancia del bloque
    if (this.nombre === "VariableBlock") {
      copia = new Bloque(this.x, this.y, 3, 4, BOTON_VARIABLE, this.boton, this.enEscenario);
    } else {
      copia = new Bloque(this.x, this.y, this.categoria, this.id, 
                        t[this.categoria][this.id], this.boton, this.enEscenario);
    }
    // Copiar propiedades primitivas
    copia.variablePadre = this.variablePadre;
    copia.nombre = this.nombre;
    copia.tipo = this.tipo;
    copia.bucle = this.bucle;
    copia.repeticionBucle = this.repeticionBucle;
    copia.repeticion = this.repeticion;
    copia.boton = this.boton;
    copia.enEscenario = this.enEscenario;
    copia.colorBloque = this.colorBloque;
    copia.colorBorde = this.colorBorde;
    copia.numTextos = this.numTextos;
    copia.numDatos = this.numDatos;
    copia.valorNumerico = this.valorNumerico;
    copia.valorLogico = this.valorLogico;
    copia.grosorBase = this.grosorBase;
    copia.grosorBloque = this.grosorBloque;
    copia.grosorBloquesBucle = this.grosorBloquesBucle;
    copia.grosorTotal = this.grosorTotal;
    copia.inc = this.inc;
    copia.grosorDato = this.grosorDato;
    copia.anchoLadoIzqBucle = this.anchoLadoIzqBucle;
    copia.categoria = this.categoria;
    copia.id = this.id;
    copia.x = this.x + 200;
    copia.y = this.y + 100;
    copia.ancho = this.ancho;
    // Incrementar contador global
    cont++;
    copia.num = cont;
    // Copiar arrays complejos (con clonación profunda)
    if (this.indiceLISTA != null) copia.indiceLISTA = [...this.indiceLISTA];
    if (this.texto != null) copia.texto = [...this.texto];
    if (this.xTexto != null) copia.xTexto = [...this.xTexto];
    if (this.AxTexto != null) copia.AxTexto = [...this.AxTexto];
    if (this.dato != null) copia.dato = [...this.dato];
    if (this.xDato != null) copia.xDato = [...this.xDato];
    if (this.AxDato != null) copia.AxDato = [...this.AxDato];
    if (this.tipoDato != null) copia.tipoDato = [...this.tipoDato]; 
    // Inicializar arrays si no existen
    if (copia.subBloque == null) {
      copia.subBloque = [];
    }
    // Copiar sub-bloques recursivamente
    for (let i = 0; i < this.subBloque.length; i++) {
      if (this.subBloque[i] != null) {
        copia.subBloque[i] = this.subBloque[i].clonarBloque();
        copia.subBloque[i].padre = copia;
        codigo.push(copia.subBloque[i]); // push() en lugar de add()
      }
    } 
    // Manejar referencias especiales entre bloques clonados
    this.anteriorClon = -1;
    this.siguienteClon = -1;
    this.padreClon = -1;
    this.bucleSiguienteClon = -1;
    for (let i = 0; i < bloquesSeleccionados.length; i++) {
      if (this.anterior === bloquesSeleccionados[i]) {
        this.anteriorClon = i;
      }
      if (this.siguiente === bloquesSeleccionados[i]) {
        this.siguienteClon = i;
      }
      if (this.padre === bloquesSeleccionados[i]) {
        this.padreClon = i;
      }
      if (this.bucleSiguiente === bloquesSeleccionados[i]) {
        this.bucleSiguienteClon = i;
      }
    } 
    return copia;
  }

  calculoAnchoDato(dato) {
    let resultado = textWidth(dato + "    ") + this.inc;
    if (resultado < this.grosorDato * 1.75) {
      return int(this.grosorDato * 1.75);
    } else {
      return resultado;
    }
  }
  
  calculoColores(boton) {
    this.colorBorde = color(255);
    if (boton === false) { // Si el bloque no es un botón
      if (this.nombre === "WhenRunBlock") {
        this.colorBloque = color(255, 0, 0);
        this.grosorBase = 30;
        this.grosorBloque = this.grosorBase;
        this.grosorTotal = this.grosorBase;
        this.anchoLadoIzqBucle = 20;
      } else {
        // Asumiendo que colorBloq es un array global
        if (typeof colorBloq !== 'undefined' && this.categoria < colorBloq.length) {
          this.colorBloque = colorBloq[this.categoria];
        } else {
          // Valor por defecto si colorBloq no está definido
          this.colorBloque = color(100, 100, 100); // Gris por defecto
        }
      }
    } else { // Si el bloque es un botón
      if (this.nombre === "DelButton" || this.nombre === "RenameButton") {
        this.colorBloque = color(128); 
        this.colorBorde = color(220);
      } else {
        this.colorBloque = color(255);
        // Asumiendo que colorBloq es un array global
        if (typeof colorBloq !== 'undefined' && this.categoria < colorBloq.length) {
          this.colorBorde = colorBloq[this.categoria];
        } else {
          // Valor por defecto si colorBloq no está definido
          this.colorBorde = color(100, 100, 100); // Gris por defecto
        }
      }
    }
  }

  solapeBloque(x, y, bloque) {
    return x > bloque.x && 
          x < bloque.x + bloque.ancho && 
          y > bloque.y && 
          y < bloque.y + bloque.grosorBloque;
  }

  solapeBloqueAbajo(x, y, bloque) {
    return x > bloque.x && 
          x < bloque.x + bloque.ancho && 
          y > bloque.y + this.grosorBloquesBucle + this.grosorBloque && 
          y < bloque.y + bloque.grosorTotal;
  }

  colision(xOrigen, yOrigen, esArriba) {
    if (this !== bloqueSeleccionado) {
      if (bloqueSeleccionado !== null) {
        if (bloqueSeleccionado.nombre === "WhenRunBlock") return null;
      }
      if (esArriba === true && this.solapeBloque(xOrigen, yOrigen, this) === true) {
        return this;
      } else if (esArriba === false && 
                bloqueSeleccionado !== null && 
                bloqueSeleccionado.nombre !== "DoForeverBlock" && 
                bloqueSeleccionado.nombre !== "WhenRunBlock" && 
                this.solapeBloqueAbajo(xOrigen, yOrigen, this)) {
        return this;
      }
    }
    return null;
  }

  // CALCULA SI HEMOS PINCHADO SOBRE UN DATO: DE ESCRITURA O DE LISTA
  colisionDatos(xOrigen, yOrigen) {
    for (let i = 0; i < this.numDatos; i++) { // Analiza todos los subBloques
      if (xOrigen > this.x + this.xDato[i] && 
          xOrigen < this.x + this.xDato[i] + this.AxDato[i] && 
          yOrigen > this.y && 
          yOrigen < this.y + this.grosorBloque) {
        if (bloqueEditando !== null) cerrarEdicionTexto();
        // Si el bloque no tiene subBloque...
        if (this.subBloque[i] === null || this.subBloque[i] === undefined) {
          if (!(this.categoria === 3 && this.id < 3 && i === 0)) {
            // Y además es de tipo c (numérico)...
            if (this.tipoDato[i] === 'o') { // Si el bloque es de escritura
              bloqueEditando = this; // Guarda el bloque para poder escribir sobre el
              subBloqueEditando = i; // Guarda el lugar del subBloque para poder escribir sobre el
              return null; // Devolvemos el bloque vacío, simplemente para distinguir que hemos seleccionado edición de texto en lugar de LISTA
            } else if (this.tipoDato[i] === '*') {
              bloqueEditando = this;
              subBloqueEditando = i;
              colorPickerOpen = true;
              return null;
            } else if (this.tipoDato[i] >= '0' && this.tipoDato[i] <= '6') {
              this.indiceLISTA[i]++;
              if (this.indiceLISTA[i] > LISTA[parseInt(this.tipoDato[i])].length - 1) {
                this.indiceLISTA[i] = 0;
              }
              if (LISTA[parseInt(this.tipoDato[i])][this.indiceLISTA[i]] === "") {
                this.indiceLISTA[i] = 0;
              }
              this.dato[i] = LISTA[parseInt(this.tipoDato[i])][this.indiceLISTA[i]];
              this.AxDato[i] = this.calculoAnchoDato(this.dato[i]);
              if (this.nombre === "MotorBlock") {
                this.numTextos = 4;
                this.numDatos = 3;
              }
              this.calculoDimensiones();
              return this;
            }
          }
        } 
        // Si tiene un subBloque...
        else {
          // Busca otros subBloques dentro del subBloque
          let j = this.subBloque[i].colisionDatos(xOrigen, yOrigen);
          if (j !== null) { // Si encuentra un subSubBloque lo devuelve
            return j;
          } else {
            return null; // Si no encuentra subSubBloque devuelve nulo
          }
        }
      }
    }
    return this;
  }

  solapeDato(x, y, bloque, i) {
    let borde = 2;
    if (x > bloque.x + bloque.xDato[i] - borde && 
        x < bloque.x + bloque.xDato[i] + bloque.AxDato[i] + borde && 
        y > bloque.y && 
        y < bloque.y + bloque.grosorBloque) {
      return true;
    } else {
      return false;
    }
  }

  // COMPRUEBA LA COLISIÓN DEL BLOQUE ARRASTRADO SOBRE OTROS subBLOQUES
  colisionInterior(xOrigen, yOrigen, tipoBloque) {
    for (let i = 0; i < this.numDatos; i++) {
      if (this.solapeDato(xOrigen, yOrigen, this, i)) {
        if (this.subBloque[i] !== null && this.subBloque[i] !== undefined && (tipoBloque === 'o' || tipoBloque === 'h')) { // Si el espacio es de tipo ovalado o hexagonal y está ocupado por un subBloque
          let j = this.subBloque[i].colisionInterior(xOrigen, yOrigen, tipoBloque); // Recursividad dentro de los subBloques
          if (j !== null) return j;
        }
        // Si el espacio es de tipo ovalado o hexagonal, no está ocupado por un subBloque y el tipo de bloque que se coloca coincide con el del receptor
        if ((tipoBloque === 'o' || tipoBloque === 'h') && tipoBloque === this.tipoDato[i]) {
          if (!(this.categoria === 3 && this.id < 3 && i === 0 && bloqueSeleccionado.nombre !== "VariableBlock")) {
            seleccionSubBloque = i; // Esto sirve para almacenar el índice del subBloque. Cuando se suelte el bloque servirá para conectarlo.
            return this;
          }
        }
      }
    }
    return null;
  }

  // Añade el subBloque con el índice i
  addSubBloque(i) {
    if (this.subBloque[i] === null || this.subBloque[i] === undefined) {
      this.subBloque[i] = bloqueSeleccionado;
      this.subBloque[i].padre = this;
    } else {
      let paraSacarFuera = this.subBloque[i]; // Si ya existía un subBloque lo guardamos para sacarlo y moverlo de lugar
      this.subBloque[i] = bloqueSeleccionado; // Añade el nuevo subBloque
      this.subBloque[i].padre = this;
      paraSacarFuera.padre = null; // Sacamos el subBloque original
      paraSacarFuera.x += 50;
      paraSacarFuera.y += 50;
    }
    // Buscamos el primer bloque padre/contenedor de la cadena y recalculamos su grosor y ancho, ya que el nuevo subBloque tendrá dimensiones diferentes al original
    let bloquePadre = this;
    bloquePadre.calculoGrosor();
    if (bloquePadre.tipo === '_') {
      bloquePadre.actualizarCoordenadas();
      bloquePadre.calculoGrosorBucle();
    }
    while (bloquePadre.padre !== null) {
      bloquePadre = bloquePadre.padre;
      bloquePadre.calculoGrosor();
      if (bloquePadre.tipo === '_') {
        bloquePadre.actualizarCoordenadas();
        bloquePadre.calculoGrosorBucle();
      }
    }
    this.calculoDimensiones();
    this.calculoGrosor();
    this.calculoGrosorBucle();
    this.actualizarCoordenadas();
  }
  seleccionBloquesDependientes() {
    bloquesSeleccionados = [];
    let bloque = this; // Comienza con el bloque bloqueSiguiente (this)
    // Recorre todos los bloques siguientes y buclesSiguiente iza sus coordenadas
    while (bloque !== null) {
      bloquesSeleccionados.push(bloque);     
      if (bloque.bucle === true) { // Si el bloque es un bucle, bloqueSiguiente actualiza las coordenadas de sus bloques contenidos
        if (bloque.bucleSiguiente !== null) {
          bloque.bucleSiguiente.seleccionBloquesDependientes();
        }
      }
      bloque = bloque.siguiente; // Avanza al siguiente bloque
    }   
  }

  actualizarNombreVariables(variable) {
    for (let i = 0; i < this.numDatos; i++) {
      if (this.subBloque[i] !== null && this.subBloque[i] !== undefined) {
        this.subBloque[i].actualizarNombreVariables(variable);
      }
    }
    if (this.variablePadre !== null) {
      if (this.variablePadre === variable) {
        this.texto[0] = variable.texto[0];
        this.AxTexto[0] = this.calculoAnchoDato(this.texto[0]);
        this.calculoDimensiones();
      }
    }
  }
  
  eliminarBloque() {
    for (let i = 0; i < this.numDatos; i++) {
      if (this.subBloque[i] !== null && this.subBloque[i] !== undefined) {
        this.subBloque[i].eliminarBloque();
      }
    }
    // 1. Encontrar índice
    let index = codigo.indexOf(this);
    if (index === -1) return false;
    // 2. Liberar recursos del bloque
    if (this.dispose) {
      this.dispose(); // Método cleanup personalizado
    }
    // 3. Eliminar del array
    codigo.splice(index, 1);  
    // 4. Actualizar referencias
    return true;
  }

  borrarVariables(variable) {
    let resultado;
    // Primero, recorrer y modificar subBloque[]
    for (let i = 0; i < this.numDatos; i++) {
      if (this.subBloque[i] !== null && this.subBloque[i] !== undefined) {
        resultado = this.subBloque[i].borrarVariables(variable);
        if (resultado !== null) {
          this.subBloque[i] = null;
          this.AxDato[i] = Math.floor(textWidth(this.dato[i] + "_")) + this.inc;
          this.calculoDimensiones();
        }
      }
    }
    // Finalmente, si este bloque es el que se quiere borrar, devolverlo
    if (this.variablePadre === variable) return this;
    return null;
  }

  // COLOCA LOS BLOQUES CONECTADOS
  actualizarCoordenadas() {
    let bloque = this; // Comienza con el bloque bloqueSiguiente (this)
    // Si el bloque no tiene un bloque anterior, establece sus coordenadas base
    if (bloque.anterior === null) {
      if (bloque.padre !== null) {
        // Si tiene un padre, posiciona el bloque dentro del padre
        bloque.x = bloque.padre.x + bloque.padre.anchoLadoIzqBucle;
        bloque.y = bloque.padre.y + bloque.padre.grosorBloque;
      }
    }
    // Recorre todos los bloques siguientes y bloqueSiguienteiza sus coordenadas
    while (bloque !== null) {
      if (bloque.anterior !== null) {
        // Posiciona el bloque debajo del bloque anterior
        if (bloque.anterior.categoria === 0 && bloque.anterior.id === 0) {
          bloque.x = bloque.anterior.x + bloque.anterior.anchoLadoIzqBucle;
        } else {
          bloque.x = bloque.anterior.x;
        }
        
        if (bloque.anterior.bucle === true) {
          bloque.y = bloque.anterior.y + bloque.anterior.grosorTotal;
        } else {
          bloque.y = bloque.anterior.y + bloque.anterior.grosorBloque;
        }   
        // Si el bloque tiene un padre, ajusta su posición x
        if (bloque.padre !== null) {
          bloque.x = bloque.padre.x + bloque.padre.anchoLadoIzqBucle;
        }
      }
      if (bloque.bucle === true) { // Si el bloque es un bucle, bloqueSiguienteiza las coordenadas de sus bloques contenidos
        if (bloque.bucleSiguiente !== null) {
          bloque.bucleSiguiente.actualizarCoordenadas();
        }
      }
      bloque = bloque.siguiente; // Avanza al siguiente bloque
    }
  }

  calculoGrosorBucle() {
    this.grosorBloquesBucle = 0;
    // Buscar bloques hijos en codigo global (simplificado)
    if (typeof codigo !== 'undefined') {
      for (let bloque of codigo) {
        if (bloque.padre === this && bloque.tipo === '_') {
          this.grosorBloquesBucle += bloque.grosorTotal;
        }
      }
    }
    if (this.grosorBloquesBucle === 0) this.grosorBloquesBucle = this.grosorBase;
    this.grosorBloque = this.calculoGrosor();
    if (this.bucle && this.nombre !== "WhenRunBlock") {
      if (this.nombre === "IfElseBlock") {
        this.grosorTotal = this.grosorBloque + this.grosorBloquesBucle;
      } else {
        this.grosorTotal = this.grosorBloque + this.grosorBloquesBucle + this.grosorBase;
      }
    } else {
      this.grosorTotal = this.grosorBloque;
    }
    // Recalcular para padres (simplificado)
    let bloque = this;
    while (bloque.padre !== null) {
      bloque = bloque.padre;
      bloque.calculoGrosorBucle();
      bloque.actualizarCoordenadas();
    }
    return this.grosorTotal;
  }
  
  calculoGrosor() {
    let mayorGrosor = 0;
    if (this.numDatos > 0) {
      for (let i = 0; i < this.subBloque.length; i++) {
        if (this.subBloque[i]) {
          let grosorCalculado = this.subBloque[i].calculoGrosor();
          if (grosorCalculado > mayorGrosor) mayorGrosor = grosorCalculado;
        }
      }
    }
    if (mayorGrosor >= this.grosorBase) {
      this.grosorBloque = mayorGrosor + 2 * this.inc;
    } else {
      this.grosorBloque = this.grosorBase;
    }
    return this.grosorBloque;
  }
  
  calculoDimensiones() {  
    // Asegurar que los arrays existan
    if (!this.xTexto) this.xTexto = [];
    if (!this.AxTexto) this.AxTexto = [];
    if (!this.xDato) this.xDato = [];
    if (!this.AxDato) this.AxDato = [];
    if (!this.subBloque) this.subBloque = [];
    if (!this.indiceLISTA) this.indiceLISTA = [];
    // Calcular subBloques
    for (let i = 0; i < this.numDatos; i++) {
      if (this.subBloque && this.subBloque[i] && typeof this.subBloque[i].calculoDimensiones === 'function') {
        this.subBloque[i].calculoDimensiones();
      }
    }
    // Inicializar primer elemento
    this.xTexto[0] = 0;
    if (this.numDatos > 0 && this.numTextos > 0) {
      if (this.AxTexto[0]) {
        this.xDato[0] = this.AxTexto[0];
      } else {
        this.xDato[0] = 0;
      }
      // Procesar elementos restantes
      for (let i = 1; i < this.numTextos; i++) {
        // LÍNEA 271 CORREGIDA:
        const subBloqueAnterior = this.subBloque[i - 1];
        if (!subBloqueAnterior) {
          // No hay subBloque
          if (this.xDato[i - 1] !== undefined && this.AxDato[i - 1] !== undefined) {
            this.xTexto[i] = this.xDato[i - 1] + this.AxDato[i - 1];
          } else {
            this.xTexto[i] = (this.xTexto[i - 1] || 0) + (this.AxTexto[i - 1] || 0);
          }
        } else {
          // Hay subBloque
          if (subBloqueAnterior.ancho !== undefined) {
            this.AxDato[i - 1] = subBloqueAnterior.ancho;
          } else {
            this.AxDato[i - 1] = this.grosorDato * 1.75;
          }
          if (this.xDato[i - 1] !== undefined && this.AxDato[i - 1] !== undefined) {
            this.xTexto[i] = this.xDato[i - 1] + this.AxDato[i - 1];
          }
          // Posicionar subBloque
          if (this.xDato[i - 1] !== undefined) {
            subBloqueAnterior.x = this.x + this.xDato[i - 1];
            subBloqueAnterior.y = this.y + (this.grosorBloque - (subBloqueAnterior.grosorBloque || this.grosorBase)) / 2;
          }
        } 
        // Actualizar xDato para el siguiente
        if (i < this.numDatos) {
          if (this.xTexto[i] !== undefined && this.AxTexto[i] !== undefined) {
            this.xDato[i] = this.xTexto[i] + this.AxTexto[i];
          }
        }
      }
    } 
    // Calcular ancho final
    if (this.nombre === "MotorBlock" && this.indiceLISTA && this.indiceLISTA[1] === 2) {
      this.ancho = 175;
    } else if (this.numTextos > 0 && this.xTexto[this.numTextos - 1] !== undefined && this.AxTexto[this.numTextos - 1] !== undefined) {
      this.ancho = this.xTexto[this.numTextos - 1] + this.AxTexto[this.numTextos - 1];
    } else {
      this.ancho = 200; // Valor por defecto
    }
  }
  
  actualizarCoordenadas() {
    let bloque = this;
    if (bloque.anterior === null) {
      if (bloque.padre !== null) {
        bloque.x = bloque.padre.x + bloque.padre.anchoLadoIzqBucle;
        bloque.y = bloque.padre.y + bloque.padre.grosorBloque;
      }
    }
    while (bloque !== null) {
      if (bloque.anterior !== null) {
        if (bloque.anterior.categoria === 0 && bloque.anterior.id === 0) {
          bloque.x = bloque.anterior.x + bloque.anterior.anchoLadoIzqBucle;
        } else {
          bloque.x = bloque.anterior.x;
        }
        if (bloque.anterior.bucle) {
          bloque.y = bloque.anterior.y + bloque.anterior.grosorTotal;
        } else {
          bloque.y = bloque.anterior.y + bloque.anterior.grosorBloque;
        } 
        if (bloque.padre !== null) {
          bloque.x = bloque.padre.x + bloque.padre.anchoLadoIzqBucle;
        }
      }
      if (bloque.bucle && bloque.bucleSiguiente) {
        bloque.bucleSiguiente.actualizarCoordenadas();
      }
      bloque = bloque.siguiente;
    }
  }
  
  dibujar() {
    this.calculoDimensiones(); 
    push(); 
    if (this.enEscenario) {
      translate(windowWidth / 2, windowHeight / 2);
      scale(zoomCodigo * escalaBase);
      translate(panCodigoX, panCodigoY);
    } else {
      scale(escalaBase);
    }
    // Dibujar formas
    strokeWeight(1);
    stroke(this.colorBorde);
    fill(this.colorBloque);  
    // Dibujar según tipo
      if (this.nombre !== "ElseBlock") {
        if (this.nombre === "IfElseBlock") {
          this.dibujoIfElse();
        } else if (this.nombre === "WhenRunBlock") {
          this.dibujobloquesStart();
        } else if (this.bucle) {
          this.dibujoBucle();
        } else if (this.tipo === '_') {
          this.dibujoBloque();
        } else {
          this.dibujobloqueDatos();
        }
      }    
      this.dibujoSubBloquesVacios();
    // ✅ DIBUJAR TEXTO SEPARADAMENTE
    this.dibujarTextosBloque();
    pop();
  }

  dibujarTextosBloque() {
    push();   
    // Posición absoluta del bloque
    translate(this.x, this.y);
    // Configuración de texto CONSISTENTE
    textSize(12); // Tamaño fijo
    noStroke();
    // Textos fijos del bloque
    textAlign(CENTER, CENTER);
    fill(this.colorBorde);
    let numTextos2;
    let numDatos2;
    if (this.nombre === "MotorBlock" && this.dato[1] === "STOP") {
      numTextos2=2;
      numDatos2=2;
    } else {
      numTextos2=this.numTextos;
      numDatos2=this.numDatos;
    }
    for (let i = 0; i < numTextos2; i++) {
      let x = Math.round(this.xTexto[i] + this.AxTexto[i] / 2);
      let y = Math.round(this.grosorBloque / 2);
      text(this.texto[i], x, y);
    }
    // Texto "end if" o "loop"
    textAlign(LEFT, CENTER);
    if (this.nombre === "IfBlock" || this.nombre === "ElseBlock") {
      let x = Math.round(this.grosorBase / 2);
      let y = Math.round(this.grosorTotal - this.grosorBase / 2);
      text("end if", x, y);
    } else if (this.nombre === "DoUntilBlock" || this.nombre === "DoForeverBlock" || this.nombre === "DoTimesBlock") {
      let x = Math.round(this.grosorBase / 2);
      let y = Math.round(this.grosorTotal - this.grosorBase / 2);
      text("loop", x, y);
    } 
    // Textos de datos
    textAlign(CENTER, CENTER);
    fill(0);
    for (let i = 0; i < numDatos2; i++) {
      if (this.tipoDato[i] !== '*' && !this.subBloque[i]) {
        let x = Math.round(this.xDato[i] + this.AxDato[i] / 2);
        let y = Math.round(this.grosorBloque / 2);
        text(this.dato[i], x, y);
      }
    }
    pop();
  }

  dibujoBloque() {
    push();
    translate(this.x, this.y);
    beginShape(); 
    this.dibujoPrimerBloquelBucle();
    vertex(30, this.grosorBloque);
    vertex(25, this.grosorBloque + 3);
    vertex(20, this.grosorBloque + 3);
    vertex(15, this.grosorBloque);
    vertex(5, this.grosorBloque);
    vertex(0, this.grosorBloque - 5);
    vertex(0, 5);   
    endShape();
    pop();
  }
  
  dibujoBucle() {
    push();
    translate(this.x, this.y);
    beginShape();
    this.dibujoPrimerBloquelBucle();
    this.dibujoSegundoBloquelBucle();
    this.dibujoTercerbloqueBucle();
    let yNivel = this.grosorBloque + this.grosorBloquesBucle + this.grosorBase;
    vertex(30, yNivel);
    if (this.nombre !== "DoForeverBlock") {
      vertex(25, yNivel + 3);
      vertex(20, yNivel + 3);
    }
    vertex(15, yNivel);
    vertex(5, yNivel);
    vertex(0, yNivel - 3);
    vertex(0, 5);
    endShape(p5.CLOSE);
    pop();
  }

  dibujoIfElse() {
    push();
    translate(this.x, this.y);
    beginShape();
    this.dibujoPrimerBloquelBucle();
    this.dibujoSegundoBloquelBucle();
    this.dibujoTercerbloqueBucle();
    let yNivel = this.grosorBloque + this.grosorBloquesBucle + this.grosorBase;
    vertex(this.ancho, yNivel - 5);
    vertex(this.ancho - 5, yNivel);
    vertex(this.anchoLadoIzqBucle + 30, yNivel);
    vertex(this.anchoLadoIzqBucle + 25, yNivel + 3);
    vertex(this.anchoLadoIzqBucle + 20, yNivel + 3);
    vertex(this.anchoLadoIzqBucle + 15, yNivel);
    vertex(this.anchoLadoIzqBucle + 5, yNivel);
    vertex(this.anchoLadoIzqBucle, yNivel + 5);
    yNivel = this.grosorBase + this.grosorBloque + this.grosorBloquesBucle + this.siguiente.grosorBloquesBucle;
    vertex(this.anchoLadoIzqBucle, yNivel - 5);
    vertex(this.anchoLadoIzqBucle + 5, yNivel);
    vertex(this.anchoLadoIzqBucle + 15, yNivel);
    vertex(this.anchoLadoIzqBucle + 20, yNivel + 3);
    vertex(this.anchoLadoIzqBucle + 25, yNivel + 3);
    vertex(this.anchoLadoIzqBucle + 30, yNivel);
    vertex(this.ancho - 5, yNivel);
    vertex(this.ancho, yNivel + 5);
    yNivel = this.grosorBase + this.grosorBloque + this.grosorBloquesBucle + this.siguiente.grosorBloquesBucle + this.grosorBase;
    vertex(this.ancho, yNivel - 5);
    vertex(this.ancho - 5, yNivel);
    vertex(30, yNivel);
    vertex(25, yNivel + 3);
    vertex(20, yNivel + 3);
    vertex(15, yNivel);
    vertex(5, yNivel);
    vertex(0, yNivel - 5);
    vertex(0, 5);
    endShape(p5.CLOSE);
    pop();
  }

  dibujobloquesStart() {
    push();
    translate(this.x, this.y);
    beginShape();
    vertex(0, 10);
    vertex(10, 0);
    vertex(this.ancho - 5, 0);
    vertex(this.ancho, 5);
    vertex(this.ancho, this.grosorBloque - 5);
    vertex(this.ancho - 5, this.grosorBloque);
    vertex(this.anchoLadoIzqBucle + 30, this.grosorBloque);
    vertex(this.anchoLadoIzqBucle + 25, this.grosorBloque + 3);
    vertex(this.anchoLadoIzqBucle + 20, this.grosorBloque + 3);
    vertex(this.anchoLadoIzqBucle + 15, this.grosorBloque);
    vertex(this.anchoLadoIzqBucle + 5, this.grosorBloque);
    vertex(this.anchoLadoIzqBucle, this.grosorBloque + 3);
    vertex(this.anchoLadoIzqBucle, this.grosorBloque + 10);
    vertex(this.anchoLadoIzqBucle / 2, this.grosorBloque + 20);
    vertex(0, this.grosorBloque + 10);
    vertex(0, 10);
    endShape(p5.CLOSE);
    pop();
  }

  dibujobloqueDatos() {
    if (this.tipo === 'h') {
      this.dibujoDiamante(this.x, this.y, this.ancho, this.grosorBloque, this.colorBloque);
    } else if (this.tipo === 'o') {
      noStroke();
      this.dibujoOvalo(this.x, this.y, this.ancho, this.grosorBloque, this.colorBloque);
      strokeWeight(1);
      this.dibujoContornoOvalo(this.x, this.y, this.ancho, this.grosorBloque, this.colorBorde);
    }
  }

  dibujoOvalo(x, y, xFinal, grueso, colorInterior) {
    push();
    translate(x, y);
    fill(colorInterior);
    ellipse(grueso / 2, grueso / 2, grueso, grueso);
    ellipse(xFinal - grueso / 2, grueso / 2, grueso, grueso);
    rect(grueso / 2, 0, xFinal - grueso, grueso);
    pop();
  }

  dibujoContornoOvalo(x, y, xFinal, grueso, colorExterior) {
    push();
    translate(x, y);
    stroke(colorExterior);
    arc(grueso / 2, grueso / 2, grueso, grueso, PI / 2, PI * 3 / 2);
    arc(xFinal - grueso / 2, grueso / 2, grueso, grueso, -PI / 2, PI / 2);
    line(grueso / 2, 0, xFinal - grueso / 2, 0);
    line(grueso / 2, grueso, xFinal - grueso / 2, grueso);
    pop();
  }

  dibujoDiamante(x, y, xFinal, grueso, colorInterior) {
    fill(colorInterior);
    push();
    translate(x, y);
    beginShape();
    vertex(0, grueso / 2);
    vertex(grueso / 2, 0);
    vertex(xFinal - grueso / 2, 0);
    vertex(xFinal, grueso / 2);
    vertex(xFinal - grueso / 2, grueso);
    vertex(grueso / 2, grueso);
    vertex(0, grueso / 2);
    endShape(p5.CLOSE);
    pop();
  }

  dibujoPrimerBloquelBucle() {
    vertex(0, 5);
    vertex(5, 0);
    vertex(15, 0);
    vertex(20, 3);
    vertex(25, 3);
    vertex(30, 0);
    vertex(this.ancho - 5, 0);
    vertex(this.ancho, 5);
    vertex(this.ancho, this.grosorBloque - 5);
    vertex(this.ancho - 5, this.grosorBloque);
  }

  dibujoSegundoBloquelBucle() {
    vertex(this.anchoLadoIzqBucle + 30, this.grosorBloque);
    vertex(this.anchoLadoIzqBucle + 25, this.grosorBloque + 3);
    vertex(this.anchoLadoIzqBucle + 20, this.grosorBloque + 3);
    vertex(this.anchoLadoIzqBucle + 15, this.grosorBloque);
    vertex(this.anchoLadoIzqBucle + 5, this.grosorBloque);
  }

  dibujoTercerbloqueBucle() {
    let yNivel = this.grosorBloque + this.grosorBloquesBucle;
    vertex(this.anchoLadoIzqBucle, this.grosorBloque + 5);
    vertex(this.anchoLadoIzqBucle, yNivel - 5);
    vertex(this.anchoLadoIzqBucle + 5, yNivel);
    vertex(this.anchoLadoIzqBucle + 15, yNivel);
    vertex(this.anchoLadoIzqBucle + 20, yNivel + 3);
    vertex(this.anchoLadoIzqBucle + 25, yNivel + 3);
    vertex(this.anchoLadoIzqBucle + 30, yNivel);
    vertex(this.ancho - 5, yNivel);
    vertex(this.ancho, yNivel + 5);
    yNivel = this.grosorBloque + this.grosorBloquesBucle + this.grosorBase;
    vertex(this.ancho, yNivel - 5);
    vertex(this.ancho - 5, yNivel);
  }

  dibujoSubBloquesVacios() {
    for (let i = 0; i < this.numDatos; i++) {
      if (this.subBloque[i] === null || this.subBloque[i] === undefined) {
        if (this.tipoDato[i] === 'h') {
          this.dibujoDiamante(
            this.x + this.xDato[i],
            this.y + this.grosorBloque / 2 - this.grosorBase / 2 + this.inc,
            this.AxDato[i],
            this.grosorBase - 2 * this.inc,
            color(255)
          );
        } else if (this.tipoDato[i] === 'o' && !(this.nombre === "MotorBlock" && this.dato[1] === "STOP")) {
          noStroke();
          this.dibujoOvalo(
            this.x + this.xDato[i],
            this.y + this.grosorBloque / 2 - this.grosorBase / 2 + this.inc,
            this.AxDato[i],
            this.grosorBase - 2 * this.inc,
            255
          );
        } else if (this.tipoDato[i] >= '0' && this.tipoDato[i] <= '6') {
          noStroke();
          this.dibujoOvalo(
            this.x + this.xDato[i],
            this.y + this.grosorBloque / 2 - this.grosorBase / 2 + this.inc,
            this.AxDato[i],
            this.grosorBase - 2 * this.inc,
            color(200)
          );
        } else if (this.tipoDato[i] === '*') {
          fill(this.dato[i]);
          stroke(255);
          rect(
            this.x + this.xDato[i],
            this.y + this.grosorBloque / 2 - this.grosorBase / 2 + this.inc,
            this.grosorBase - 2 * this.inc,
            this.grosorBase - 2 * this.inc
          );
        }
      }
    }
  }

  dibujoSubBloquesOcupados() {
    let numDatos2;
    if (this.nombre === "MotorBlock" && this.dato[1] === "STOP") {
      numDatos2 = 2;
    } else {
      numDatos2 = this.numDatos;
    }
    for (let i = 0; i < numDatos2; i++) {
      if (this.subBloque[i] !== null && this.subBloque[i] !== undefined (this.tipoDato[i] === 'h' || this.tipoDato[i] === 'o')) {
        this.subBloque[i].dibujar();
      }
    }
  }

  dibujoSub() {
    let numDatos2;
    if (this.nombre === "MotorBlock" && this.dato[1] === "STOP") {
      numDatos2 = 2;
    } else {
      numDatos2 = this.numDatos;
    }
    this.dibujar();
    for (let i = 0; i < numDatos2; i++) {
      if (this.subBloque[i] !== null && this.subBloque[i] !== undefined) {
        this.subBloque[i].dibujoSub();
      }
    }
  }
  
  ejecutar() {
    // println(this.nombre);
    let avanzar = true;
    let saltoIf = false;
    // PROCESO RECURSIVO. PRIMERO EJECUTA LOS SUBBLOQUES/PARÁMETROS DEL BLOQUE
    for (let i = 0; i < this.numDatos; i++) {
      if (this.subBloque[i] !== null && this.subBloque[i] !== undefined) this.subBloque[i].ejecutar();
    }
    // ASIGNAMOS VALORES A VARIABLES
    let valorNum = new Array(this.numDatos);
    let valorLog = new Array(this.numDatos);
    for (let i = 0; i < this.numDatos; i++) {
      // Si en el parámetro no hay subBloque el valor lo toma del dato
      if (this.subBloque[i] === null || this.subBloque[i] === undefined) {
        valorNum[i] = parseFloat(this.dato[i]);
      } 
      // Si en el parámetro SÍ hay subBloque ...
      else {
        // Si el subBloque es un óvalo o un hexágono
        if (this.subBloque[i].tipo === 'o' || this.subBloque[i].tipo === 'h') {
          // si es una variable toma el valor numérico del bloque variablePadre (el que está en el menú izquierdo)
          if (this.subBloque[i].nombre === "VariableBlock") {
            valorNum[i] = this.subBloque[i].variablePadre.valorNumerico;
          }
          // Si no es una variable toma los valores numérico y lógico del bloque
          else {
            valorNum[i] = this.subBloque[i].valorNumerico;
            valorLog[i] = this.subBloque[i].valorLogico;
          }
        }
      }
    }
    // CATEGORÍA 0
    if (this.nombre === "WhenRunBlock") {
      // No hace nada
    } else if (this.nombre === "DigitalOutputBlock") {
      let letr = this.dato[0].charAt(0);
      let valor;
      if (this.dato[1] === "HI") valor = 255; else valor = 0;  
      if (letr === 'A') letraGPIO[0].valorOutput = valor;
      else if (letr === 'B') letraGPIO[1].valorOutput = valor;
      else if (letr === 'C') letraGPIO[3].valorOutput = valor;
      else if (letr === 'D') letraGPIO[2].valorOutput = valor;   
    } else if (this.nombre === "MotorBlock") {
      // Esto evita que el primer bloque motor gire un poco antes que el segundo motor, lo que provocará un pequeño giro incluso cuando los 2 motores son forward
      if (this.siguiente !== null) {
        if (this.siguiente.nombre === "MotorBlock") esperarUnCiclo = true;
        else esperarUnCiclo = false;
      } else {
        esperarUnCiclo = false;
      }
      if (this.dato[1] === "STOP") {
        crumblebot.potMotor[parseInt(this.dato[0]) - 1] = 0;
      } else if (this.dato[1] === "FORWARD") {
        crumblebot.potMotor[parseInt(this.dato[0]) - 1] = valorNum[2];
      } else {
        crumblebot.potMotor[parseInt(this.dato[0]) - 1] = valorNum[2] * (-1.0);
      }
    } else if (this.nombre === "DigitalInputBlock") {
      let letr = this.dato[0].charAt(0);
      let valorLetra = 0;
      if (letr === 'A') valorLetra = letraGPIO[0].actualizarValor();
      else if (letr === 'B') valorLetra = letraGPIO[1].actualizarValor();
      else if (letr === 'C') valorLetra = letraGPIO[3].actualizarValor();
      else if (letr === 'D') valorLetra = letraGPIO[2].actualizarValor();
      if (this.dato[1] === "HI") {
        if (valorLetra < 128) this.valorLogico = false; else this.valorLogico = true;
      } else if (this.dato[1] === "LO") {
        if (valorLetra < 128) this.valorLogico = true; else this.valorLogico = false;
      }
    } else if (this.nombre === "AnalogueInput") {
      let letr = this.dato[0].charAt(0);
      if (letr === 'A') this.valorNumerico = letraGPIO[0].valorLetra;
      else if (letr === 'B') this.valorNumerico = letraGPIO[1].valorLetra;
      else if (letr === 'C') this.valorNumerico = letraGPIO[3].valorLetra;
      else if (letr === 'D') this.valorNumerico = letraGPIO[2].valorLetra;
    } else if (this.nombre === "DistanceBlock") {
      let letr = this.dato[0].charAt(0);
      if (letr === 'A') this.valorNumerico = letraGPIO[0].valorLetra;
      else if (letr === 'B') this.valorNumerico = letraGPIO[1].valorLetra;
      else if (letr === 'C') this.valorNumerico = letraGPIO[3].valorLetra;
      else if (letr === 'D') this.valorNumerico = letraGPIO[2].valorLetra;   
    // CATEGORÍA 1 (SPARKLES)
    } else if (this.nombre === "SetSprakleBlock" && valorNum[0] < 8) {
      colorLED[Math.floor(valorNum[0])] = color(valorNum[1]);
    } else if (this.nombre === "TurnSprakleOffBlock" && valorNum[0] < 8) {
      colorLED[Math.floor(valorNum[0])] = color(0);
    } else if (this.nombre === "SetAllSpraklesBlock") {
      for (let i = 0; i < 8; i++) colorLED[i] = color(valorNum[0]);
    } else if (this.nombre === "TurnAllSpraklesOffBlock") {
      for (let i = 0; i < 8; i++) colorLED[i] = color(0);
    } else if (this.nombre === "SetSprakleRGBBlock" && valorNum[0] < 8) {
      colorLED[Math.floor(valorNum[0])] = color(valorNum[1], valorNum[2], valorNum[3]);
    } else if (this.nombre === "SetAllSparklesRGBBlock") {
      for (let i = 0; i < 8; i++) colorLED[i] = color(valorNum[0], valorNum[1], valorNum[2]);  
    // CATEGORÍA 2 (CONTENEDORES)
    } else if (this.nombre === "WaitMSBlock") {
      miliSegundos = Math.floor(valorNum[0]);
      inicio = millis();
    } else if (this.nombre === "WaitBlock") {
      miliSegundos = Math.floor(valorNum[0] * 1000);
      inicio = millis();
    } else if (this.nombre === "WaitUntilBlock") {
      if (this.subBloque[0] !== null) {
        if (valorLog[0] === false) avanzar = false;
        else avanzar = true;
      } else {
        avanzar = false;
      }
    } else if (this.nombre === "IfBlock") {
      if (this.subBloque[0] === null || valorLog[0] === false) saltoIf = true;
    } else if (this.nombre === "IfElseBlock") {
      if (this.subBloque[0] === null || valorLog[0] === false) saltoIfElse = true;
      else saltoIfElse = false;
    } else if (this.nombre === "ElseBlock") {
      if (saltoIfElse === false) saltoIf = true;
      saltoIfElse = false;
    } else if (this.nombre === "DoTimesBlock") {
      if (this.repeticion === 0) repeticionBucle = true;
      this.repeticion += 1;
      if (this.repeticion >= valorNum[0]) {
        this.repeticionBucle = false;
        this.repeticion = 0;
      }
    } else if (this.nombre === "DoUntilBlock") {
      if (this.subBloque[0] !== null) {
        if (valorLog[0] === false) this.repeticionBucle = true;
        else this.repeticionBucle = false;
      } else {
        repeticionBucle = true;
      }
    } else if (this.nombre === "DoForeverBlock") {
      this.repeticionBucle = true;
      
    // CATEGORÍA 3 (VARIABLES)
    } else if (this.nombre === "AssignmentBlock") {
      if (this.subBloque[0] !== null) {
        this.subBloque[0].variablePadre.valorNumerico = valorNum[1];
      }
    } else if (this.nombre === "IncreaseBlock") {
      if (this.subBloque[0] !== null) {
        this.subBloque[0].variablePadre.valorNumerico = this.subBloque[0].variablePadre.valorNumerico + valorNum[1];
      }
    } else if (this.nombre === "DecreaseBlock") {
      if (this.subBloque[0] !== null) {
        this.subBloque[0].variablePadre.valorNumerico = this.subBloque[0].variablePadre.valorNumerico - valorNum[1];
      }
    // CATEGORÍA 4 (OPERATORS)
    } else if (this.categoria === 4) {
      if (this.id < 8) {
        if (this.nombre === "AddBlock") this.valorNumerico = valorNum[0] + valorNum[1];
        else if (this.nombre === "SubBlock") this.valorNumerico = valorNum[0] - valorNum[1];
        else if (this.nombre === "MultiplyBlock") this.valorNumerico = valorNum[0] * valorNum[1];
        else if (this.nombre === "DivideBlock") this.valorNumerico = valorNum[0] / valorNum[1];
        else if (this.nombre === "EqualityBlock") {
          if (valorNum[0] === valorNum[1]) {
            this.valorLogico = true;
          } else {
            this.valorLogico = false;
          }
        } else if (this.nombre === "NotEqualBlock") {
          if (valorNum[0] !== valorNum[1]) this.valorLogico = true;
          else this.valorLogico = false;
        } else if (this.nombre === "LessThanBlock") {
          if (valorNum[0] < valorNum[1]) this.valorLogico = true;
          else this.valorLogico = false;
        } else if (this.nombre === "GreaterThanBlock") {
          if (valorNum[0] > valorNum[1]) this.valorLogico = true;
          else this.valorLogico = false;
        }
      } else {
        if (this.nombre === "AndBlock") this.valorLogico = valorLog[0] && valorLog[1];
        else if (this.nombre === "OrBlock") this.valorLogico = valorLog[0] || valorLog[1];
        else if (this.nombre === "NotBlock") this.valorLogico = !valorLog[0];
        else if (this.nombre === "RandomBlock") this.valorNumerico = Math.floor(random(valorNum[0], valorNum[1]));
      }
    }
    // SELECCIONA EL SIGUIENTE BLOQUE A EJECUTAR
    if (this.tipo === '_' && avanzar === true) {
      if (saltoIf === true || saltoIfElse === true) { // Sólo ocurre con los bloques if que son bucles
        if (this.siguiente !== null) {
          return bloqueEjecutando = this.siguiente;
        } else if (this.siguiente === null) {
          return bloqueEjecutando = this.siSiguienteEsNulo();
        }
      }
      if (this.bucleSiguiente !== null) return bloqueEjecutando = this.bucleSiguiente;
      if (this.bucleSiguiente === null && this.repeticionBucle === true) return bloqueEjecutando = this;
      if (this.siguiente === null) return bloqueEjecutando = this.siSiguienteEsNulo();
      else if (this.siguiente !== null) return bloqueEjecutando = this.siguiente;
    } else if (avanzar === false) {
      return bloqueEjecutando = this;
    }
    return bloqueEjecutando = null;
  }

  siSiguienteEsNulo() {
    if (this.padre === null) return null;
    else if (this.padre !== null) {
      let bloque = this.padre;
      while (bloque.padre !== null && bloque.siguiente === null && bloque.repeticionBucle === false) {
        bloque = bloque.padre;
      }
      if (bloque.repeticionBucle === true) return bloque;
      if (bloque.siguiente !== null) return bloque.siguiente;
    }
    return null;
  }
}

// Exportar para usar en otros archivos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Bloque;
}
