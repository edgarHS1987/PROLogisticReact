import { fetchRequest } from "../libs/functions";

/**
 * Obtener geolocacion por codigo postal
 */
export const mapboxByZipCode = (zipCode)=>{
    return fetch('https://api.mapbox.com/geocoding/v5/mapbox.places/'+zipCode+'.json?country=mx&types=postcode&access_token='+import.meta.env.VITE_PK)
            .then(res => {
                if(res.ok){
                    return res.json();
                }
            }).then(response => {
                return response;
            });
}

/**
 * Obtiene listado de municipios que no tiene datos de ubicacion
 * @param {integer} id identificador de estado
 */
export const municipalitiesItems = (id)=>{
    return fetchRequest({url:'/municipalities/list/'+id});
}

/**
 * Guarda los datos de municipio
 * @param {integer} id identificador del estado
 */
export const municipalitiesShow = (id)=>{
    return fetchRequest({url:'/municipalities/show/'+id});
}

/**
 * Guarda los datos de municipio
 * @param {object} obj datos de municipio, ciudades, codigos postales y colonias
 */
export const municipalitiesStore = (obj)=>{
    return fetchRequest({url:'/municipalities', method:'POST', body:obj});
}

/**
 * Actualiza datos de municipios y codigos postales
 * @param {*} obj datos 
 * @returns 
 */
export const municipalitiesUpdate = (obj)=>{
    return fetchRequest({url:'/municipalities', method:'PUT', body:obj});
}

/**
 * Verifica si ya se cargaron datos de un municipio
 * @param {object} datos de municipio
 */
export const municipalityVerify = (obj)=>{
    return fetchRequest({url:'/municipality/verify', method:'POST', body:obj});
}