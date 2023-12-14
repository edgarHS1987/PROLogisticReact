import { fetchRequest } from "../libs/functions"

export const clients = ()=>{
    return fetchRequest({url:'/clients'});
}