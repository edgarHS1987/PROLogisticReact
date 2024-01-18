import { useEffect, useState} from 'react';
import { driverGetDocsVisor } from '../services/drivers';


export const useFetchData = ( reportType ) =>{
    
    const [docs,setDocs] = useState( [] ); 
    const [loading,setLoading] = useState( '' );

    const getDocs = async () => {
        const response = await driverGetDocsVisor( tipo,idDriver );
        const resultados = response[0].data.map( (doc) => {
            return {
                label: doc.name_file,
                value: doc.name_file,
            };
        });
        let dataWithFolder = [{
            label: 'Archivos',
            value: 'Archivos',
            children: 
                resultados,
        }];

        setDocs( resultados );
        setLoading( false );
    }


    useEffect( () => {

        if ( reportType ) {
            getDocs();  
            
            return () => {
                setDocs([]);
                setLoading( '' );
            }; 
        }
        
    },[reportType])


    return{
        docs: docs,
        isLoading: loading,
    }


}