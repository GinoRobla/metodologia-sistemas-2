import { Usuario } from "../factories/Usuario";

export class UsuarioService {

    private static instance: UsuarioService;
    private usuarioList:Usuario[] = []

    private constructor(){}

    public static getInstance(): UsuarioService {
        if (!UsuarioService.instance) {
            UsuarioService.instance = new UsuarioService();
        }
        return UsuarioService.instance;
    }

    public static resetInstance(): void {
        UsuarioService.instance = new UsuarioService();
    }

    getSize():number{
        return this.usuarioList.length
    }

    getUsuarioList(): Usuario[]{
        return this.usuarioList
    }

    getAllBarberos(): Usuario[] | []{
        const usuarios = this.usuarioList.filter(usu => usu.tipoUsuario === 'Barbero')
        return usuarios
    }

    getAllClientes(): Usuario[] | []{
        const usuarios = this.usuarioList.filter(usu => usu.tipoUsuario === 'Cliente')
        return usuarios
    }

    getUsuarioByEmail(email:string): Usuario | undefined{
        const usuario = this.usuarioList.find(usu => usu.email === email)
        return usuario
    }

    addUsuario(nombre:string, email:string, telefono:string, contraseña:string, tipoUsuario:string): Usuario{
        const newUsu = new Usuario(nombre, email, telefono, contraseña, tipoUsuario)
        this.usuarioList.push(newUsu)
        return newUsu
    }

    deleteUsuario(email:string): boolean{
        const idx = this.usuarioList.findIndex(usu => usu.email === email)
        if(idx === -1) return false
        this.usuarioList.splice(idx, 1)
        return true
    }
}