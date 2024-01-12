import { Fragment, useEffect, useRef, useState } from "react";
import { ButtonToolbar, Col, Divider, Grid } from "rsuite"
import { useNavigate } from "react-router-dom";

import Title from "../../components/Title";
import Button from "../../components/Button";
import Table from "../../components/Table";
import { clients } from "../../services/clients";
import ButtonList from "../../components/ButtonList";

const ClientsList = ({loader})=>{
    const tableRef = useRef();
    const navigate = useNavigate();

    const [tableConfig, setTableConfig] = useState({columns:[
        {
            label: 'Imagen',
            selector: row => (
                <Fragment>
                    <img src={row.col1} />
                </Fragment>
            ),
            show:true
        },
        {
            label: 'Nombre',
            selector: row => row.col2,
            show:true
        },
        {
            label:'',
            show:true,
            width:'120px',            
            selector: row => {
                return(
                    <Fragment>
                        <ButtonToolbar>
                                <ButtonList
                                    controlId={'edit'}
                                    title="Editar"
                                    type="edit"
                                    //action={()=>onOpenEdit(row.id)}
                                />
                                <ButtonList 
                                    controlId={'delete'}
                                    title="Eliminar"
                                    type="delete"
                                    color="red"
                                    //action={()=>onDelete(row.id)}
                                />
                            
                        </ButtonToolbar>
                    </Fragment>
                )
            } 
        }
    ]})
	const [tableList, setTableList] = useState([]);

    /*
		Funcion que inicializa la configuracion de la tabla
    */
	const onLoad = async ()=>{
        await tableRef.current.setTable();
		await getData();
	}

    /**
	 * Obtiene el listado de clientes desde la base de datos
	 * */
	const getData = async ()=>{
        await loader.current.handleShow('Cargando...');

		let response = await clients();
		if(response){
			let data = response.map((res)=>{ //recorre el arreglo de permisos
				//configuracion de cada fila conformer la confifuracion de columnas 
				let item = {
					id: res.id,
					col1: res.image,
					col2: res.name,
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
                    <Title screen="Clientes" action="Listado" />
                </Col>
            </Grid>            
            <Divider style={{marginTop:0}} />
            <Grid fluid>
                <Col xs={24} className="container-buttons">
                        <Button 
                            title="Nuevo"
                            appearance="ghost"
                            classes="btn-new"
                            action={()=>navigate('/cliets/new')}
                        />                    
                </Col>
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

export default ClientsList;