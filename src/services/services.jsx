import { fetchRequest } from "../libs/functions";
const gmapskey = import.meta.env.VITE_GMAPS;

/**
 * obtener geolocacion de direccion mapbox
 */
export const mapBoxByAddreess = (address)=>{    
    let url = ' https://api.mapbox.com/geocoding/v5/mapbox.places/'+address+'.json?country=mx&proximity=-73.990593%2C40.740121&types=address&language=es&access_token=pk.eyJ1Ijoicm9nZXI2MTEiLCJhIjoiY2xvZWc1dWsxMGc0cjJrcDlmeDZ6dnlzOSJ9.rrrwzrBrNPXPy1aZzYZLgg'
    return fetch(url)
            .then(res => {
                if(res.ok){
                    return res.json();
                }
            }).then(response => {
                return response;
            });
}

/**
 * Obtener geolocacion de direccion google
 */
export const gMapsByAddress = (address)=>{
    let url = 'https://maps.googleapis.com/maps/api/geocode/json?key='+gmapskey+'&address='+address
    return fetch(url)
            .then(res => {
                if(res.ok){
                    return res.json();
                }
            }).then(response => {
                return response;
            });
}


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

/**
 * Obtiene detalles del servicio
 * @param {*} id identificador de servicio
 */
export const servicesDetails = (id)=>{
    return fetchRequest({url:'/services/details/'+id});
}

/**
 * Listado de servicios por cliente
 * @param {*} id identificador de cliente
 */
export const servicesList = (id, date)=>{
    return fetchRequest({url:'/services/list/'+id+'/'+date});
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

/**
 * Actualiza latitude longitud
 */
export const servicesUpdateLocation = (obj)=>{
    return fetchRequest({url:'/services/update/location', method:'PUT', body:obj});
}

/**
 * Obtiene el listado de servicio que no tienen latitud y longitud
 * @param {*} clients_id 
 */
export const servicesWithoutLocation = (clients_id)=>{
    return fetchRequest({url:'/services/location/'+clients_id});
}