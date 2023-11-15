import {fetchRequest} from '../libs/functions';

export const permissions = ()=>{
    return fetchRequest({url:'/permissions'});
};