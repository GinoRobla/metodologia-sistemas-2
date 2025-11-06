export class Turno {
    constructor(
        public cliente:string, 
        public barbero:string, 
        public fecha:string, 
        public servicios:string[], 
        public duracion:number, 
        public precio:number
    ){}
}