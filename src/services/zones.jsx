import { fetchRequest } from "../libs/functions"


export const zonesByClient = (id)=>{
    return fetchRequest({url:'/zones/byClient/'+id});
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
    return fetchRequest({url:'/zones/verify', method:'POST', body:{clients_id, clients_id}});
}