class Futbolista extends Persona {
    constructor(nombre, apellido, edad, equipo, posicion,cantidadGoles,id = 0) {
        super(nombre, apellido, edad,id);

        this.equipo = equipo;
        this.posicion = posicion;
        this.cantidadGoles = cantidadGoles;
    }
}