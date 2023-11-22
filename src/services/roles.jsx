import {fetchRequest} from '../libs/functions';

export const roles = ()=>{
    return fetchRequest({url:'/roles'});
};