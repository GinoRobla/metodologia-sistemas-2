export class Usuario {
    constructor(
        public nombre:string,
        public email:string,
        public telefono:string,
        public contraseña:string,
        public tipoUsuario:string, //Cliente | Barbero
    ){}
}