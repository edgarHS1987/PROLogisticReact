import { useState, useEffect, useRef, Fragment } from "react";

import {Button, Grid, Col, Divider} from 'rsuite';

import Title from '../../components/Title';
import Table from '../../components/Table';
import {drivers} from '../../services/drivers';


const DriversList = ({loader})=>{
	const tableRef = useRef(null);

	const [tableConfig, setTableConfig] = useState({columns:[
        {
            label: 'Nombre',
            selector: row => row.col1,
            show:true,
            width:'30%'
        },
        {
            label: 'Apellido Paterno',
            selector: row => row.col2,
            show:true,
            width:'20%'
        },
        {
            label: 'Apellido Materno',
            selector: row => row.col3,
            show:true,
            width:'20%'
        },
        {
            label: 'RFC',
            selector: row => row.col4,
            show:true,
            width:'20%'
        },
        {
            label: 'Estatus',
            selector: row => row.col5,
            show:true,
            width:'10%'
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
        
        await getDataDrivers();
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
	const getDataDrivers = async ()=>{
        await loader.current.handleShow('Cargando...');

		let response = await drivers();
		if(response){

			let data = response.data.map((res)=>{ //recorre el arreglo de permisos
				//configuracion de cada fila conformer la confifuracion de columnas 
				let item = {
					id: res.id,
					col1: res.names,
					col2: res.lastname1,
					col3: res.lastname2,
                    col4: res.rfc,
                    col5: res.status
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
                    <Title screen="Drivers" action="Listado" />
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

export default DriversList;