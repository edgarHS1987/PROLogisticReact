import {fetchRequest,decript} from '../libs/functions';

import cryptoJs from 'crypto-js';
import Swal from 'sweetalert2';

export const workingDays = ( fecha1,fecha2 )=>{

    return fetchRequest(
        {
            url:'/reports/workDays/' + fecha1 + '/' + fecha2,
            method:'GET',
        });

};

export const asignedServices = ( fecha1,fecha2 )=>{

    return fetchRequest(
        {
            url:'/reports/servicesAsigned/' + fecha1 + '/' + fecha2,
            method:'GET',
        });

};

export const statusServices = ()=>{

    return fetchRequest(
        {
            url:'/reports/statusServices',
            method:'GET',
        });

};

