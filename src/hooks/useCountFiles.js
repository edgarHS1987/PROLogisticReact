import { useEffect, useState} from 'react';


export const useCountFiles = ( tipo,arrayFiles ) =>{
    
    const [counter,setCounter] = useState( 0 ); 
    const [ready,setReady] = useState( false );

    const counting = async () => {
        let count=0;
        console.log(arrayFiles);
        await arrayFiles.forEach(function (elemento) {
              count = count +1;
        });
        setCounter( count );
        setReady( true );
    }
    

    useEffect( () => {
        counting();    
            
        
        // return () => {
        //     setCounter( 0 );
        // };
    },[arrayFiles])


    return{
        counterFiles: counter,
        counterReady: ready,
    }


}