import { Usuario } from "../models/Usuario";

export class UsuarioService {

    private usuarioList:Usuario[] = []

    getSize():number{
        return this.usuarioList.length
    }

    getUsuarioList(): Usuario[]{
        return this.usuarioList
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