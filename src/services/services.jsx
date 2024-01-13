import { fetchRequest } from "../libs/functions";



/**
 * 
 * @param {*} id identificador de servicio
 * @returns 
 */
export const servicesDelete = (id)=>{
    return fetchRequest({url:'/services/'+id, method:'DELETE'});
}

export const servicesSave = (obj)=>{
    return fetchRequest({url:'/services', method:'POST', body:obj});
}

/**
 * Obtiene el total de servicios sin asignar 
 * @param {*} id identificador del cliente
 * @returns 
 */
export const servicesTotalUnsigned = (id)=>{
    return fetchRequest({url:'/services/unsigned/'+id});
}

/**
 * Obtiene el listado de servicios no asignados
 * @param {*} obj {clients_id}
 * @returns 
 */
export const servicesUnsignedByClient = (obj)=>{
    return fetchRequest({url:'/services/unsigned', method:'POST', body:obj});
}