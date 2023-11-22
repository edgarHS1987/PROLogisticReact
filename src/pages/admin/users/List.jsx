import { useState, useEffect, useRef, Fragment } from "react";
import { useNavigate } from "react-router-dom";

import { Grid, Col, Divider, ButtonToolbar} from 'rsuite';

import Title from '../../../components/Title';
import Table from '../../../components/Table';
import ButtonList from "../../../components/ButtonList";

import Button from "../../../components/Button";
import { swalAction } from "../../../libs/functions";
import Toast from "../../../components/Toast";
import { users, usersDelete } from "../../../services/user";
import ModalResetPassword from "../../modals/password";

const UsersList = ({loader, reset})=>{
	const tableRef = useRef(null);
    const navigate = useNavigate();

	const [tableConfig, setTableConfig] = useState({columns:[
        {
            label: 'Nombre',
            selector: row => row.col1,
            show:true,
            width:'40%'
        },
        {
            label: 'Correo',
            selector: row => row.col2,
            show:true,
            width:'30%'
        },
        {
            label: 'Rol',
            selector: row => row.col3,
            show:true,
            width:'30%'
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
                                controlId={'assign'}
                                title="Asignar permisos"
                                type="assign_permission"
                                action={()=>onOpenReset(row.id)}
                            />
                            
                            <ButtonList 
                                controlId={'edit'}
                                title="Editar"
                                type="edit"
                                action={()=>onOpenEdit(row.id)}
                            />

                            <ButtonList 
                                controlId={'delete'}
                                title="Eliminar"
                                type="delete"
                                color="red"
                                action={()=>onDelete(row.id)}
                            />
                        </ButtonToolbar>
                    </Fragment>
                )
            } 
        }
    ]})
	const [tableList, setTableList] = useState([]);

	/**
     * Agregar configuracion de tabla
     * en el objeto selecto se agregan los elementos que se desean agregar a cada celda y 
     * llama el servicio de listado
     */
    const getTableConfig = async ()=>{
        
        await getData();
    }

    /*
		Funcion que inicializa la configuracion de la tabla
    */
	const onLoad = async ()=>{
        await tableRef.current.setTable();
		await getTableConfig();
	}

	/**
	 * Obtiene el listado de usuarios desde la base de datos
	 * */
	const getData = async ()=>{
        await loader.current.handleShow('Cargando...');

		let response = await users();
		if(response){
			let data = response.map((res)=>{ //recorre el arreglo de permisos
				//configuracion de cada fila conformer la confifuracion de columnas 
				let item = {
					id: res.id,
					col1: res.names+' '+res.lastname1+(res.lastname2 !== null ? ' '+res.lastname2 : ''),
					col2: res.email,
					col3: res.role
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

    /**
     * abre modal de reseteo de contraseña
     * @param {*} id identificador de registro
     */
    const onOpenReset = (id)=>{
        reset.current.handleShow(id);
    }
    

    /**
     * Abre pantalla de edicion de usuarios
     * @param {*} id identificador de usuario
     */
    const onOpenEdit = (id)=>{
        navigate('/admin/users/edit/'+id);
    }

    /**
     * elimina un registro 
     * @param {*} id identificador de registro
     */
    const deleteItem = async(id)=>{
        await loader.current.handleShow('Eliminando...');
        
        let response = await usersDelete(id);
        if(response){
            if(response.error){
                Toast.fire({title:'Error', text:response.error, icon:'error', timer:8000});
            }else{                
                await getData();
                Toast.fire('Correcto', response.message, 'success');
            }            
        }
        
        await loader.current.handleClose();
    }

    /**
     * Abre modal de confirmacion para eliminar un registro
     * @param {*} id 
     */
    const onDelete  = (id)=>{
        swalAction({
            title           : 'Alerta',
            text            : 'Desea eliminar el registro?',
            icon            : 'warning',
            textConfirm     : 'Si, eliminar',
            textcancel      : 'No, cancelar',
            values          : id,
            fn              : deleteItem
        });
    }

	useEffect(()=>{
		onLoad();
	},[]);
    

	return(
		<Grid fluid className='content'>
            <Grid fluid>
                <Col xs={24} className="mb-2">
                    <Title screen="Usuarios" action="Listado" />
                </Col>
            </Grid>            
            <Divider style={{marginTop:0}} />
            <Grid fluid>
                <Col xs={24} className="container-buttons">
                    <Button 
                        title="Nuevo"
                        appearance="ghost"
                        classes="btn-new"
                        action={()=>navigate('/admin/users/new')}
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

export default UsersList;