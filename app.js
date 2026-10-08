"use strict";//Activa el modo estricto en JS -Hace que javascript sea mas exigente
/*
tareas es un arreglo donde se guardan las tareas y cada tarea será un objeto
siguienteId genera un identificador diferente para cada tarea
filtroActual indica que mostrar: todas, pendientes o completas
 */
const tareas = [];
let siguienteId = 1;
let filtroActual = "todas";

/*
 * Referencias al DOM 
 * querySelector() busca elementos del HTML usando selectores CSS
 */
const formulario = document.querySelector("#formulario");
const campoTitulo = document.querySelector("#titulo");
const mensaje = document.querySelector("#mensaje");
const lista = document.querySelector("#lista");
const contador = document.querySelector("#contador");
const vacio = document.querySelector("#vacio");
const filtros = document.querySelector(".filtros");
//--------------------------------------------------------------------------------------------------

/**
 * Obtener las tareas visible
 * filter() crea un objeto nuevo con los elementos que cumplen una condicion
 */
function obtenerTareasVisibles() {
    if (filtroActual === "pendientes") {
        return tareas.filter((tarea => !tarea.completada));
    }
    if (filtroActual === "completadas") {
        return tareas.filter((tarea => tarea.completada));
    }
    return tareas;
}//Fin del obtenerTareasVisibles

//--------------------------------------------------------------------------------------------------
/**
 * Agregar una nueva tarea en el formulario
 */
formulario.addEventListener("submit", (evento) => {
    evento.preventDefault(); //Evita que el formulario recargue la pagina

    const titulo = campoTitulo.value.trim(); //Obtiene el texto y elimina espacios externos

    //Se valida que haya texto
    if (!titulo) {
        mensaje.textContent =
            "Escribe una descripcion antes de agregar";
        campoTitulo.focus();
        return;
    }

    //Se crea el objeto Tarea
    const nuevaTarea = {
        id: siguienteId,
        titulo: titulo,
        completada: false
    };

    //Guarda la tarea en el arreglo
    tareas.push(nuevaTarea);

    //Preparar el id para la siguiente tarea
    siguienteId++;

    //Util para observar los datos 
    console.log("Tareas actuales: ", tareas);

    //Limpiar formulario
    formulario.reset();
    mensaje.textContent = "";
    campoTitulo.focus();

    //vuelve a recargar la lista
    renderizar();
})
//--------------------------------------------------------------------------------------------------
/**
 * Renderiza las tareas
 * Se toma los datos de JavaScript y mostrarlos en el HTML
 */
function renderizar() {
    //Limpia la listavisual antes de volver a dibujarla
    lista.replaceChildren();

    const visibles = obtenerTareasVisibles();

    for (const tarea of visibles) {
        // Crear <li>
        const item = document.createElement("li");
        item.className = "tarea";

        //Agrega o quita la clase "completada"
        item.classList.toggle("completada", tarea.completada);

        //Crear el texto de la tarea
        const titulo = document.createElement("span");
        titulo.className = "titulo-tarea";
        titulo.textContent = tarea.titulo;

        //Contenedor de botones
        const acciones = document.createElement("div");
        acciones.className = "acciones";

        //Boton completar / Reabrir
        const completar = document.createElement("button");
        completar.type = "button";

        //dataset agrega información personalizada al botón
        completar.dataset.accion = "alternar";
        completar.dataset.id = String(tarea.id);

        completar.textContent =
            tarea.completada ? "Reabrir" : "Completar";

        completar.setAttribute(
            "aria-label",
            `${completar.textContent}: ${tarea.titulo}`
        );

        //Boton eliminar
        const eliminar = document.createElement("button");
        eliminar.type = "button";
        eliminar.className = "eliminar";
        eliminar.dataset.accion = "eliminar";
        eliminar.dataset.id = String(tarea.id);
        eliminar.textContent = "Eliminar";

        eliminar.setAttribute(
            "aria-label",
            `Eliminar: ${tarea.titulo}`
        );
        //Insertar elementos
        acciones.append(completar, eliminar);
        item.append(titulo, acciones);
        lista.append(item);
    }//Fin del for

    //Contar pendientes
    const pendientes = tareas.filter(
        (tarea) => !tarea.completada
    ).length;

    contador.textContent =
        `${pendientes} pendientes de ${tareas.length}`;

    //Mostrar mensaje de lista vacia cuando corresponda
    vacio.hidden = visibles.length > 0;
}//Fin funcion renderizar
//--------------------------------------------------------------------------------------------------
/**
 * Se filtran Tareas
 */
filtros.addEventListener("click", (evento) => {
    const boton =
        evento.target.closest("button[data-filtro]");
    if(!boton){
        return;
    }

    //Guardar el filtro elegido
    filtroActual = boton.dataset.filtro;

    //Obtener todos los botones de filtro
    const botonesFiltro = filtros.querySelectorAll("button");

    //Marcar visualmente solo el filtro activo
    for (const opcion of botonesFiltro){
        const activo = opcion === boton;
        opcion.classList.toggle(
            "activo",
            activo
        );
        opcion.setAttribute(
            "aria-pressed",
            String(activo)
        );
    }
    renderizar();
});
//--------------------------------------------------------------------------------------------------
/**
 * Funcion para completar,reabrir o eliminar
 * Se utiliza delegacion de eventos
 * un solo listener controla los botones de todas las tareas
 */
lista.addEventListener("click", (evento)=>{
    //Busca el botón presionado
    const boton = evento.target.closest("button[data-accion]");

    if(!boton)
    {
        return;
    }
    //dataset.id llega como texto; lo convertimos a numero
    const id = Number(boton.dataset.id);

    //findIndex() busca la posicion de la tarea en el arreglo
    const indice = tareas.findIndex(
        (tarea)=> tarea.id ===id
    );


    //Completar o reabrir
    if(boton.dataset.accion === "alternar"){
        tareas[indice].completada = !tareas[indice].completada;
    }
    //Eliminar
    else if(boton.dataset.accion === "eliminar"){
        tareas.splice(indice,1);
    }
    renderizar();
});


//--------------------------------------------------------------------------------------------------

renderizar();






