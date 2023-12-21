import { fetchRequest } from "../libs/functions"

export const users = ()=>{
    return fetchRequest({url:'/users'});
}

export const usersDelete = (id)=>{
    return fetchRequest({url:'/users/'+id, method:'DELETE'});
}

export const usersId = (id)=>{
    return fetchRequest({url:'/users/'+id});
}

export const usersSave = (obj)=>{
    return fetchRequest({url:'/users', method:'POST', body:obj});
}

export const usersUpdate = (id, obj)=>{
    return fetchRequest({url:'/users/'+id, method:'PUT', body:obj});
}

export const usersResetPassword = (obj)=>{
    return fetchRequest({url:'/users/reset/password', method:'PATCH', body:obj});
}