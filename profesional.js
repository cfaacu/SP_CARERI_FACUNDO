class Profesional extends Persona {
    constructor(nombre, apellido, edad, titulo, facultad,añoGraduacion,id = 0) {
        super(nombre, apellido, edad,id);

        this.titulo = titulo;
        this.facultad = facultad;
        this.añoGraduacion = añoGraduacion;
    }
}