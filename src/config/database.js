import { connect } from "mongoose";
import { enviroments } from "./environments.js";

//Conexión a MongoDB
export const connectionMongoBD = async () => {
    try {
        await connect(enviroments.URL_DATABASE)
        console.log('Conexion establecida correctamente')
    } catch (error) {
        console.error(`Error al conectarse a la base de datos: ${error.message}`)
    }
}