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
 * 
 * @param {*} id identificador del cliente
 * @returns 
 */
export const servicesTotalUnsigned = (id)=>{
    return fetchRequest({url:'/services/unsigned/'+id});
}

/**
 * 
 * @param {*} obj {clients_id}
 * @returns 
 */
export const servicesUnsignedByClient = (obj)=>{
    return fetchRequest({url:'/services/unsigned', method:'POST', body:obj});
}
