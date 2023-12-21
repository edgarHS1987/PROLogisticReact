import {fetchRequest} from '../libs/functions';

export const permissions = ()=>{
    return fetchRequest({url:'/permissions'});
};

export const permissionsAssigned = (id)=>{
    return fetchRequest({
        url:'/permissions/assigned/'+id
    });
};

export const permissionsToAssign = (obj)=>{
    return fetchRequest({
        url:'/permissions/assign',
        method:'POST',
        body:obj
    });
};

export const permissionsToDesign = (obj)=>{
    return fetchRequest({
        url:'/permissions/design',
        method:'POST',
        body:obj
    });
};