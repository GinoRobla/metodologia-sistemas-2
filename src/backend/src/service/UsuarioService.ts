import { Usuario } from "../models/Usuario";

export class UsuarioService {

    private usuarioList:Usuario[] = []

    getSize():number{
        throw new Error
    }

    getUsuarioList(): Usuario[]{
        throw new Error
    }

    getUsuarioByEmail(): Usuario | undefined{
        throw new Error
    }

    addUsuario(): Usuario{
        throw new Error
    }

    deleteUsuario(): boolean{
        throw new Error
    }
}