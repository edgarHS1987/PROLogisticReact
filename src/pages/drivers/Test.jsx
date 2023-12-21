import React, { useEffect, useState } from 'react';

export const FileViewer = () => {
  const [fileUrl, setFileUrl] = useState('');

  useEffect(() => {
    // Reemplaza 'nombre-archivo.txt' con el nombre real del archivo que deseas obtener
    const filename = 'nombre-archivo.txt';

    // Realiza una solicitud para obtener la URL temporal del archivo
    let obj = new FormData();
    obj.append('name', 'Comprobante_de_pago_factura.pdf');
    obj.append('folder', 'tst')
    obj.append('id', '0')

    let headers = {
        // 'Authorization'	: 'Bearer '	+ token,
        'Content-Type'	: 'application/json',
        'Accept'		: 'application/json',
    }

    setFileUrl('/storage/drivers-doc/driver_0/Licencia/image001 (50).png');

    // fetch('http://127.0.0.1:8000/url?name=image001 (50).png&folder=tst&id=0', {
    //     method:'GET',
    //     //body: obj,
    //     headers: new Headers( headers ),
    // })
    //   .then(response => response.json())
    //   .then(data     => {
    //     // Almacena la URL temporal en el estado
    //     // console.log("response url " + response );
    //     // console.log(url);
    //     setFileUrl(data.temporary_url);
    //   })
    //   .catch(error => {
    //     console.error('Error al obtener la URL temporal:', error);
    //   });
  }, []);

  return (
    <div>
      {fileUrl && (
        <iframe
          src={fileUrl}
          title="Vista previa del archivo"
          style={{ width: '100%', height: '500px' }}
        />
      )}
    </div>
  );
};

export default FileViewer;
