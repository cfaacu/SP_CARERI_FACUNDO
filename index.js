const urlRecurso = "http://localhost/personasFutbolitasProfesionales.php";
var listaPersonas;
const COLUMNAS = ["id","nombre","apellido","edad","equipo","posicion","cantidadGoles","titulo","facultad","añoGraduacion"];

function traerElementos()
{
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function()
    {
        cargando();
        if(xhttp.readyState == 4)
        {        
            if(xhttp.status == 200)
            {
                const datosTabla = JSON.parse(xhttp.response);
                console.log(datosTabla);
                listaPersonas = datosTabla.map(persona => {
                    const esFutbolista = persona?.cantidadGoles;
                    const { id, nombre, apellido, edad } = persona;
                    if (esFutbolista) {
                        const { equipo, posicion,cantidadGoles} = persona;
                        return new Futbolista(nombre, apellido, edad, equipo, posicion,cantidadGoles,id);
                    } else {
                        const { titulo, facultad,añoGraduacion} = persona;
                        return new Profesional(nombre, apellido, edad, titulo, facultad,añoGraduacion,id);
                    }
                });
                console.log(listaPersonas);
                generarFilas(listaPersonas);
                terminarCargando();
            }    
            else
            {
                alert("Error al cargar los datos");
                terminarCargando();
            }
        }
    }
    xhttp.open("GET",urlRecurso);
    xhttp.send();
}

traerElementos();

function $(elemento)
{
    return document.getElementById(elemento);
}

function cargando() {
    const formularioTabla = $('contenedor-tabla');
    formularioTabla.style.display = 'none';

    const formularioAbm = $('abm-form');
    formularioAbm.style.display = 'none';

    const spinner = $('spinner');
    spinner.style.display = 'block';
}


function terminarCargando() {
    const spinner = $('spinner');
    spinner.style.display = 'none';


    const formularioTabla = $('contenedor-tabla');
    formularioTabla.style.display = 'block';
}



const tabla = $('contenedor-tabla');
const formulario = $('abm-form');
formulario.style.display = 'none';

function generarFilas (lista)
{
    const filasAnteriores = tabla.querySelectorAll('tr');
    const filasTabla = $('filas-tabla');

    for (let i = 1; i < filasAnteriores.length; i++) {
        filasTabla.removeChild(filasAnteriores[i]);
    }

    lista.map((persona, index) => {
        const fila = document.createElement("tr");
        fila.setAttribute("id-fila", index);
        fila.setAttribute("class", "fila-generada")

        COLUMNAS.map(columna => {
            const celda = document.createElement("td");
            celda.setAttribute('id', `celda-${columna}`);

            celda.textContent = persona[columna] !== undefined && persona[columna] !== null && persona[columna] !== '' ? persona[columna] : 'N/A';
            fila.appendChild(celda);
        });
        const botonModificar = document.createElement("button");
        botonModificar.textContent = "Modificar";
        botonModificar.addEventListener("click", (e) => {
            modificarAccion(e);
        });

        const botonEliminar = document.createElement("button");
        botonEliminar.textContent = "Eliminar";
        botonEliminar.addEventListener("click", (e) => {
            eliminarAccion(e);
        });

        const celdaModificar = document.createElement("td");
        celdaModificar.appendChild(botonModificar);

        const celdaEliminar = document.createElement("td");
        celdaEliminar.appendChild(botonEliminar);

        fila.appendChild(celdaModificar);
        fila.appendChild(celdaEliminar);

        filasTabla.appendChild(fila);
    });
}

function seleccionarTipoPersona(estaEditando, tipoCliente)
{
    const esFutbolista = $('tipo-input').value == '1';

    console.log((estaEditando && tipoCliente != 'N/A'));
    if ((esFutbolista && !estaEditando || (estaEditando && tipoCliente != 'N/A'))) {
        $('equipo-input').style.display = 'block';
        $('posicion-input').style.display = 'block';
        $('cantidadGoles-input').style.display = 'block';
        $('titulo-input').style.display = 'none';
        $('facultad-input').style.display = 'none';
        $('añoGraduacion-input').style.display = 'none';
    } else {
        $('equipo-input').style.display = 'none';
        $('posicion-input').style.display = 'none';
        $('cantidadGoles-input').style.display = 'none';
        $('titulo-input').style.display = 'block';
        $('facultad-input').style.display = 'block';
        $('añoGraduacion-input').style.display = 'block';
    }
}

function abrirFormulario(estaEditando, esFutbolista)
{
    seleccionarTipoPersona(estaEditando, esFutbolista);
    formulario.style.display = 'flex';
    tabla.style.display = 'none';
    $('tipo-input').style.display = estaEditando ? 'none' : 'block';
}

function abrirTabla()
{
    formulario.style.display = 'none';
    tabla.style.display = 'block';
    $('nombre-input').value = '';
    $('apellido-input').value = '';
    $('edad-input').value = '';
    $('equipo-input').value = '';
    $('posicion-input').value = '';
    $('cantidadGoles-input').value = '';
    $('titulo-input').value = '';
    $('facultad-input').value = '';
    $('añoGraduacion-input').value = '';
}

async function lanzarFetch(nuevaPersona,miPersona,idPersona)
{
    let respuesta = await fetch(urlRecurso,{
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(miPersona)
    })
    if(respuesta.status == 200)
    {
        let texto = await respuesta.text();
        let idRespuesta = JSON.parse(texto);
        nuevaPersona.id = idRespuesta.id;
        listaPersonas = idPersona
        ? [...listaPersonas.filter(persona => persona.id !== parseInt(idPersona)), nuevaPersona]
        : [...listaPersonas, nuevaPersona];
        generarFilas(listaPersonas);
        abrirTabla();
        terminarCargando();
    }
    else
    {
        alert("ERROR al modificar");
        terminarCargando();
    }
}
async function aceptarAccion()
{
    cargando();
    const idPersona = $('id-input').value;
    const nombre = $('nombre-input').value.trim();
    const apellido = $('apellido-input').value.trim();
    const edad = parseInt($('edad-input').value);
    const equipo = $('equipo-input').value.trim();
    const posicion = $('posicion-input').value.trim();
    const cantidadGoles = parseInt($('cantidadGoles-input').value);
    const titulo = $('titulo-input').value.trim();
    const facultad = $('facultad-input').value.trim();
    const añoGraduacion = parseInt($('añoGraduacion-input').value);
    const esFutbolista = $('tipo-input').value == '1';
    let nuevaPersona;
    var miObjeto;
    if (esFutbolista) {
        nuevaPersona = new Futbolista(
            nombre,
            apellido,
            edad,
            equipo,
            posicion,
            cantidadGoles
        );
        miObjeto = {
            nombre: nombre,
            apellido: apellido,
            edad: edad,
            equipo: equipo,
            posicion: posicion,
            cantidadGoles: cantidadGoles
          };         
    } else {
        nuevaPersona = new Profesional(
            nombre,
            apellido,
            edad,
            titulo,
            facultad,
            añoGraduacion
        );
        miObjeto = {
            nombre: nombre,
            apellido: apellido,
            edad: edad,
            titulo: titulo,
            facultad: facultad,
            añoGraduacion: añoGraduacion
          };
    }
    lanzarFetch(nuevaPersona,miObjeto,idPersona);
}

function modificarAccion(e) {
    alert("No implementado");
}

function eliminarAccion(e)
{
    var miObjeto = {
        id: 0
      };
    const fila = e.target.closest('tr');
    const idFila = fila?.getAttribute('id-fila');
    if (fila && idFila) {
        const datos = {};
        const datosCelda = fila?.querySelectorAll('td');
        var idPersona = datosCelda[0].textContent;
        miObjeto.id = idPersona;
    }
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function()
    {
        cargando();
        if(xhttp.readyState == 4)
        {        
            if(xhttp.status == 200)
            {
                listaPersonas = [...listaPersonas.filter(persona => persona.id !== parseInt(idPersona))];
                abrirTabla();
                generarFilas(listaPersonas);
                terminarCargando();
            }    
            else
            {
                alert("Error al cargar los datos");
                terminarCargando();
            }
        }
    }
    xhttp.open("DELETE",urlRecurso);
    xhttp.setRequestHeader('Content-type', 'application/json');
    xhttp.send(JSON.stringify(miObjeto));

}
