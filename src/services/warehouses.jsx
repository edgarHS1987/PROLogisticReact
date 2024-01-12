import { fetchRequest } from "../libs/functions";

export const warehousesShow = (id)=>{
    return fetchRequest({
        url:'/warehouses/show/'+id
    });
}