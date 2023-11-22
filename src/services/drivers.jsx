import {fetchRequest} from '../libs/functions';

export const drivers = ()=>{
    return fetchRequest({url:'/drivers'});
};