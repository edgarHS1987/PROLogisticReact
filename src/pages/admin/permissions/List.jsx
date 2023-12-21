import { useState, useEffect, useRef, Fragment } from "react";

import {Button, Grid, Col, Divider} from 'rsuite';

import Title from '../../../components/Title';
import Table from '../../../components/Table';
import {permissions} from '../../../services/permissions';


const PermissionsList = ({loader})=>{
	const tableRef = useRef(null);

	const [tableConfig, setTableConfig] = useState({columns:[
        {
            label: 'Nombre corto',
            selector: row => row.col1,
            show:true,
            width:'10%'
        },
        {
            label: 'Nombre',
            selector: row => row.col2,
            show:true,
            width:'10%'
        },
        {
            label: 'Descripción',
            selector: row => row.col3,
            show:true,
            width:'80%'
        }
    ]})
	const [tableList, setTableList] = useState([]);

	/**
     * Agregar configuracion de tabla
     * en el objeto selecto se agregan los elementos que se desean agregar a cada celda y 
     * llama el servicio de listado
     * 
     *  ej. 
     * 	si se desea agregar un boton deberia de agregar
     *  selector: row => {
     * 		return (
     * 			<Fragement>
     * 				<ComponenteBoton /> 
     * 			</Fragment>
     * 		)
     * 	}
     */
    const getTableConfig = async ()=>{
        
        await getDataPermissions();
    }

    /*
		Funcion que inicializa la configuracion de la tabla
    */
	const onLoad = async ()=>{
        await tableRef.current.setTable();
		await getTableConfig();
	}

	/**
	 * Obtiene el listado de permisos desde la base de datos
	 * */
	const getDataPermissions = async ()=>{
        await loader.current.handleShow('Cargando...');

		let response = await permissions();
		if(response){

			let data = response.data.map((res)=>{ //recorre el arreglo de permisos
				//configuracion de cada fila conformer la confifuracion de columnas 
				let item = {
					id: res.id,
					col1: res.name,
					col2: res.display_name,
					col3: res.description
				};

				return item;
			});

			
			await tableRef.current.resetTable(); //restablece el listado
			
			await setTableList(data);

			setTimeout(async ()=>{
				await tableRef.current.setTable();
			}, 0);
		}

        await loader.current.handleClose();
	}

	useEffect(()=>{
		onLoad();
	},[]);
    

	return(
		<Grid fluid className='content'>
            <Grid fluid>
                <Col xs={24} className="mb-2">
                    <Title screen="Permisos" action="Listado" />
                </Col>
            </Grid>            
            <Divider style={{marginTop:0}} />
            <Grid fluid>
               <Col xs={24}>
                    <div className='p-4 shadow rounded form-content'>
                        <Table 
                            loader={loader}
                            columns={tableConfig.columns}
                            data={tableList}
                            ref={tableRef}
                        />                        
                    </div>                    
                </Col>
            </Grid>   
        </Grid>
	)
}

export default PermissionsList;