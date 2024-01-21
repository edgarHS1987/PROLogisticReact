import React, { useState,useEffect,useRef,useContext,Fragment } from 'react'
import { Form, Button,Grid, Col, Divider,DatePicker,ButtonGroup,
  ButtonToolbar } from 'rsuite';

import { useNavigate } from "react-router-dom";
import Title from '../../components/Title';
import Table from '../../components/Table';
import {useForm} from '../../hooks/useForm';
import Toast from '../../components/Toast';
import ButtonList from "../../components/ButtonList";

import SystemContext from "../../context/SystemContext";

import {  asignedServices } from "../../services/reports";
import { downloadExcel } from "react-export-table-to-excel";
import ExportIcon from '@rsuite/icons/Export';
import DetailDelivery from '../modals/DetailDelivery';

export const AssignedServices = ( {loader, reset} ) => {

  const tableRef = useRef(null);
  const {getPermission} = useContext(SystemContext);
  const [fechaInicio,setFechaInicio] =useState( new Date() );
  const [fechaFinal,setFechaFinal] =useState( new Date() );
  const detailRef = useRef(null);

	const [tableConfig, setTableConfig] = useState({columns:[
        {
            label: '#Servicio',
            selector: row => row.col1,
            show:true,
            width:'10%'
        },
        {
            label: 'Fecha Alta Servicio',
            selector: row => row.col2,
            show:true,
            width:'15%'
        },
        {
            label: 'Guia',
            selector: row => row.col3,
            show:true,
            width:'10%'
        },
        {
          label: 'Codigo Postal',
          selector: row => row.col4,
          show:true,
          width:'10%'
        },
        {
          label: 'Driver',
          selector: row => row.col5,
          show:true,
          width:'20%'
        },
        {
          label: 'Fecha Asignacion',
          selector: row => row.col6,
          show:true,
          width:'15%'
        },
        {
          label: 'Estatus',
          selector: row => row.col7,
          show:true,
          width:'10%'
        },
        {
          label:'',
          show:true,
          width:'10px',            
          selector: row => {
              return(
                  <Fragment>
                      <ButtonToolbar>
                          
                          {getPermission('admin_users_update') && (
                              <ButtonList 
                                  controlId={'edit'}
                                  title="Detalle Entrega"
                                  type="location"
                                  action={()=>onOpenDetail(row.id)}
                              />
                          )}

                      </ButtonToolbar>
                  </Fragment>
              )
          } 
      }
        
    ]})
	const [tableList, setTableList] = useState([]);


  const onOpenDetail = ( id )=>{
    detailRef.current.handleOpen( id );
  }

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

    const handleChangeFechaInicio = ( date ) =>{
      setFechaInicio( date );
    }
    const handleChangeFechaFinal = ( date ) =>{
      setFechaFinal( date );
    }

	/**
	 * Obtiene los datos
	 * */
	const getData = async ()=>{
    await loader.current.handleShow('Cargando...');

    let finicio = new Date( fechaInicio );  
    let fini = finicio.toLocaleDateString( "en-CA" );
    fini = fini.replace( /\//g, "-" );

    let ffinal = new Date( fechaFinal );
    let ffin = ffinal.toLocaleDateString( "en-CA" );
    ffin = ffin.replace( /\//g, "-" );
      
		let response = await asignedServices( fini,ffin );
    
		if( response ){
			let data = response.data.map((res)=>{ 
    
				//configuracion de cada fila conformer la confifuracion de columnas 
				let item = {
          col1: res.id,
          col2: res.fechaAltaServicio+' '+res.horaAltaServicio,
          col3: res.guia,
          col4: res.zip,
					col5: res.names+' '+res.lastname1+(res.lastname2 !== null ? ' '+res.lastname2 : ''),
					col6: res.fechaAsignacion+' '+res.horaAsignacion,
          col7: res.status,
          
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

  function handleDownloadExcel() {

    const header = ["#Servicio", "Fecha Alta Servicio" , "Guia", 
        "Cogigo Postal", "Driver", "Fecha Asignacion"];

    if ( tableList.length == 0 ) {
      Toast.fire({icon:'error', title:'Error', text:'No Hay Datos para Exportar', timer:4500})
    }else{
      downloadExcel({
        fileName: "excel",
        sheet: "react-export-table-to-excel",
        tablePayload: {
          header,
          // accept two different data structures
          body: tableList,
        },
      });
    }
  }
    

	useEffect(()=>{
    getTableConfig();
	},[fechaInicio]);

  useEffect(()=>{
    getTableConfig();
	},[fechaFinal]);

  useEffect(()=>{
		onLoad();
	},[]);

  return (
    <>
      <DetailDelivery ref={ detailRef }
        loader={loader}
      />

      <Grid fluid className='content'>
            <Grid fluid>
                <Col xs={24} className="mb-2">
                    <Title screen="Reportes" action="Servicios Asignados" />
                </Col>
            </Grid>            
            <Divider style={{marginTop:0}} />
            <Grid fluid>
               <Col xs={24}>
                    <div className='p-4 shadow rounded form-content'>

                      <Form layout="inline">
                        <Form.Group controlId="dateInicial">
                          <Form.ControlLabel>Fecha Inicial</Form.ControlLabel>
                          <DatePicker placeholder="Selecciona Fecha" 
                            name="fechaInicio" 
                            onChange={ handleChangeFechaInicio }
                            value = { fechaInicio }
                            style={{ width: 200 }} size="sm"/>
                          <Form.HelpText tooltip>Requerido</Form.HelpText>
                        </Form.Group>

                        <Form.Group controlId="dateFinal">
                          <Form.ControlLabel>Fecha Final</Form.ControlLabel>
                          <DatePicker placeholder="Selecciona Fecha" 
                            name="fechaFinal" 
                            value = { fechaFinal }
                            onChange={ handleChangeFechaFinal }
                            style={{ width: 200 }} size="sm"/>
                          <Form.HelpText tooltip>Requerido</Form.HelpText>
                        </Form.Group>

                        <ButtonGroup>
                        <Button color="blue" appearance="ghost" onClick={ handleDownloadExcel } 
                          startIcon={<ExportIcon />}>
                            Exportar a Excel
                        </Button>
                          {/* <IconButton icon={<ExportIcon />} appearance="default" size="sm" 
                            onClick={ handleDownloadExcel }>
                              Exportar a Excel
                        </IconButton> */}
                        </ButtonGroup>
                        
                        
                      </Form>
                        <hr />   

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

                    </div>                    
                </Col>
            </Grid>   
      </Grid>


    </>
  )
}

export default AssignedServices;
