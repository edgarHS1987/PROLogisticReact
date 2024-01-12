import { fetchRequest } from "../libs/functions";

export const servicesList = (obj)=>{
    return fetchRequest({url:'/services/list', method:'POST', body:obj});
}

export const servicesDelete = (id)=>{
    return fetchRequest({url:'/services/'+id, method:'DELETE'});
}


export const servicesSave = (obj)=>{
    return fetchRequest({url:'/services', method:'POST', body:obj});
}