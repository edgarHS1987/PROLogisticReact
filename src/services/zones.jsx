import { fetchRequest } from "../libs/functions"


/**
 * Asigna drivers a una zona
 * @param {*} obj 
 * @returns 
 */
export const zonesAssignDriver = (obj)=>{
    return fetchRequest({url:'/zones/assign/driver', method:'POST', body:obj});
}

export const zonesByClient = (id)=>{
    return fetchRequest({url:'/zones/byClient/'+id});
}

/**
 * Obtiene zonas configuradas
 * @param {integer} id identificador de cliente
 */
export const zonesConfigured = (id)=>{
    return fetchRequest({url:'/zones/configured/'+id});
}

/**
 * Guarda la configuracion de zonas
 */
export const zonesConfiguring = (obj)=>{
    return fetchRequest({url:'/zones/configuring', method:'POST', body:obj});
}

/**
 * Verifica si ya existe la configuracion de zonas
 * @param {*} clients_id 
 */
export const zonesVerify = (clients_id)=>{
    return fetchRequest({url:'/zones/verify', method:'POST', body:{clients_id: clients_id}});
}

/**
 * Obtiene el numero de driver que no estan asignados a una zona
 */
export const zonesUnsignedDrivers = ()=>{
    return fetchRequest({url:'/zones/unsignedDrivers'});
}