import { fetchRequest } from "../libs/functions"

/**
 * Obtiene listado de roles
 * @returns 
 */
export const roles = ()=>{
    return fetchRequest({url:'/roles'});
};

export const rolesDelete = (id)=>{
    return fetchRequest({url:'/roles/'+id, method:'DELETE'});
}

/**
 * Obtiene datos de un rol
 * @param {*} id identificador de rol
 * @returns 
 */
export const rolesId = (id)=>{
    return fetchRequest({url:'/roles/'+id});
};

/**
 * Guarda datos de rol
 * @param {*} obj datos de rol
 * @returns 
 */
export const rolesSave = (obj)=>{
    return fetchRequest({url:'/roles', method:'POST', body:obj});
};

/**
 * Actualiza datos de rol
 * @param {*} obj datos de rol
 * @param {*} id identificador de rol
 * @returns 
 */
export const rolesUpdate = (id, obj)=>{
    return fetchRequest({url:'/roles/'+id, method:'PUT', body:obj});
};