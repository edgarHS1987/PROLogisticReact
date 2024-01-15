import { fetchRequest } from "../libs/functions";

/**
 * Asignar servicios a drivers
 * @param {*} obj 
 * @returns 
 */
export const servicesAssignToDriver = (obj)=>{
    return fetchRequest({url:'/services/assign', method:'POST', body:obj});
}

/**
 * 
 * @param {*} id identificador de servicio
 * @returns 
 */
export const servicesDelete = (id)=>{
    return fetchRequest({url:'/services/delete/'+id, method:'DELETE'});
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