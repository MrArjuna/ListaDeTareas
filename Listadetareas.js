

function Agregartareas () {
//Obtener el campo de la tarea
let traer = document.getElementById ("Lista").value
//Validar que no este vacio
if (traer === "") {

   alert ("Por favor ingrese una tarea");
   return; 
}

//Crear Elemento en la lista

let nuevaTarea = document.createElement("li")

nuevaTarea.textContent = traer + " ";

// Crear Boton de Eliminar

let botonEliminar = document.createElement ("button");
botonEliminar.textContent = "Eliminar";
botonEliminar.onclick = function () {nuevaTarea.remove ();}

//Agregar boton de eliminar al elemento de la lista (Objeto secundario a uno primario).appendchild;

nuevaTarea.appendChild(botonEliminar);

//Agregar Elemento a la lista
//Agrega un elemento hijo a un elemento padre por medio de la funcion .appendchild.
document.getElementById("listadetareas").appendChild(nuevaTarea);


//Limpiar el cuadro de texto del nombre de la tarea
//.value es exactamente lo que tiene adentro.

document.getElementById("Lista").value = " ";

}










