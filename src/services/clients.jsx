import { fetchRequest } from "../libs/functions"

export const clients = ()=>{
    return fetchRequest({url:'/clients'});
}

export const clientsList = ()=>{
    return fetchRequest({url:'/clients/list'});
}