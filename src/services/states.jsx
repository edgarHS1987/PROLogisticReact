import { fetchRequest } from "../libs/functions";

/**
 * Obtiene listado de estados individual
 * @returns 
 */
export const statesItems = ()=>{
    return fetchRequest({url:'/states/list'});
}

/**
 * btiene el listado detallado de estados donde se incluyen 
 * municipios, codigos postales, colonias y zonas
 */
export const statesDetails = ()=>{
    return fetchRequest({url:'/states'});
}

/**
 * Guarda los datos de los estados
 * no incliye latitud y longitud
 */
export const statesStore = (obj)=>{
    return fetchRequest({url:'/states', method:'POST', body:obj});
}

/**
 * Verifica si ya se realizo registro de estados
 */
export const statesVerify = (obj)=>{
    return fetchRequest({url:'/states/verify', method:'POST', body:obj});
}

