import {fetchRequest,decript} from '../libs/functions';

import cryptoJs from 'crypto-js';
import Swal from 'sweetalert2';

export const drivers = ()=>{
    return fetchRequest({url:'/drivers'});
};

export const driverSave = (obj)=>{
    return fetchRequest(
        {
            url:'/drivers/create',
            method:'POST',
            body: obj,
        });
};

export const driversId = (id)=>{
    return fetchRequest({url:'/drivers/'+id});
}

export const driverFiscalDataSave = (obj)=>{
    return fetchRequest(
        {
            url:'/drivers/address/create',
            method:'POST',
            body: obj,
        });
};

export const driversAddressId = (id)=>{
    return fetchRequest({url:'/drivers/address/'+id});
}


export const driversUploadDocument = (obj)=>{
    return fetchRequest(
        {
            url:'/drivers/docs/uploadDoc',
            method:'POST',
            body:obj,
            sendFile:true,
        });
}

export const driverClearFolder = (obj)=>{
    return fetchRequest(
        {
            url:'/drivers/docs/clearFolder/',
            method:'POST',
            body:obj,
        });
}



export const driverDocumentsSave = (obj)=>{
    return fetchRequest(
        {
            url:'/drivers/docs/create',
            method:'POST',
            body: obj,
        });
};

export const driverDocumentsId = (id)=>{
    return fetchRequest(
        {
            url:'/drivers/docs/'+id,
        });
};

export const driverListDocuments = (tipo,id)=>{
    return fetchRequest(
        {
            url:'/drivImages/listaDocuments/' + tipo + '/' + id,
        });
};

//List docs for visor
export const driverGetDocsVisor = (tipo,id)=>{
    return fetchRequest(
        {
            url:'/drivImages/allDocs/' + tipo + '/' + id,
        });
};


export const driverOneDocument = (file) =>{

    return fetchBlob( file );

}

export const fetchBlob = async ( file,tipo,idDriver ) => {
    const apiUrl = 'http://127.0.0.1:8000/api/drivImages/oneDocument/' +file+ '/' +tipo+ '/' +idDriver;
    let token = decript('token');

    const headers = new Headers({
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/pdf'
    });

    const requestOptions = {
        method: 'GET', 
        headers: headers,
    };

    const res = await fetch(apiUrl, requestOptions);
    const blob = await res.blob();  
    const fileN = new File( [blob],file ,{type: blob.type} )

    return fileN;


    // fetch(apiUrl, requestOptions)
    // .then(response => response.blob() 
    //     // console.log("response");
    //     // console.log(response);
    //     // if (!response.ok) {
    //     // throw new Error(`Error: ${response.status} - ${response.statusText}`);
    //     // }
    //     // console.log(response.url);
    //     // return response.blob(); // La respuesta se espera como un archivo Blob (PDF)
    // )
    // .then(blob => {
    //     // console.log("blob");
    //     console.log(blob);
    //     return blob;
    //     // Manipular el Blob como desees, por ejemplo, abrirlo en una nueva ventana
    //     // const pdfUrl = URL.createObjectURL(pdfBlob);
    //     // window.open(pdfUrl, '_blank');
    // })
    // .catch(error => {
    //     console.error('Error en la solicitud Fetch:', error);
    // });
    
};

export const driverVehicleId = (id)=>{
    return fetchRequest(
        {
            url:'/drivers/vehicle/'+id,
        });
};

export const driverVehicleSave = (obj)=>{
    return fetchRequest(
        {
            url:'/drivers/vehicle/create',
            method:'POST',
            body: obj,
        });
};

export const driverVehicleUpdate = (obj)=>{
    return fetchRequest(
        {
            url:'/drivers/vehicle/update',
            method:'POST',
            body: obj,  
        });
};


export const fetchFileToVisualize = async ( file,tipo,idDriver ) => {
    const apiUrl = 'http://127.0.0.1:8000/api/drivImages/visorDoc/' +file+ '/' +tipo+ '/' +idDriver;
    let token = decript('token');

    const headers = new Headers({
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/pdf'
    });

    const requestOptions = {
        method: 'GET', 
        headers: headers,
    };

    fetch(apiUrl, requestOptions)
    .then(response => response.blob() 
        // console.log("response");
        // console.log(response);
        // if (!response.ok) {
        // throw new Error(`Error: ${response.status} - ${response.statusText}`);
        // }
        // console.log(response.url);
        // return response.blob(); // La respuesta se espera como un archivo Blob (PDF)
    )
    .then(blob => {
        // Manipular el Blob como desees, por ejemplo, abrirlo en una nueva ventana
        const pdfUrl = URL.createObjectURL(blob);
        window.open(pdfUrl, '_blank');
    })
    .catch(error => {
        console.error('Error en la solicitud Fetch:', error);
    });
    
};