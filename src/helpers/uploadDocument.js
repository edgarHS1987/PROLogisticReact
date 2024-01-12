import {driversUploadDocument,driverListDocuments,fetchBlob,driverOneDocument} from '../services/drivers';

export const uploadFile = async( file,id,tipo )=>{

    let error = '';
    let msg = '';


    let obj = new FormData();
    obj.append('file', file.blobFile);
    obj.append('idDriver', id)
    obj.append('tipo', tipo)
    
    console.log(obj);
    const response = await driversUploadDocument(obj);

    if(response){

        if( response.ok !== undefined ){
            error = response.ok;
            msg = response.mensaje;
        }else{
            error = response.ok;
            msg = response.mensaje;
        }
    
    }


    return ({
        'status':error,
        'msg': msg,
    });

}   


export const getListDocumentsXX = async(tipo,idDriver)=>{

    async function getBlob( tipoPar,idDriverPar ) {
        let blobFi = await driverOneDocument( tipoPar,idDriverPar  );
        // console.log(blobFi);
        return blobFi;
    };

    let error = '';
    let msg = '';

    let obj = new FormData();
    obj.append('tipo', tipo);
    
    const response = await driverListDocuments(tipo,idDriver);
    

    let docsDriver = [];
    let docDriver = {};

    if(response){   

        let count = 0;
        response[0].forEach(async function (doc) {

            count +=1;
            // let fileBlob = await getBlob(doc.name);

            docDriver = {
                // blobFile: fileBlob,
                name: doc.name,
                fileKey: doc.name,
                
            }
            docsDriver.push(docDriver);

        }); 
    }

    return ({
        docsDriver
    });

}   





