import React, { useState,useEffect,useRef,useContext } from 'react'
import { Form, Button,Grid, Col, Divider,DatePicker,IconButton,ButtonGroup } from 'rsuite';

import { useNavigate } from "react-router-dom";
import Title from '../../components/Title';
import Table from '../../components/Table';
import {useForm} from '../../hooks/useForm';
import Toast from '../../components/Toast';

import SystemContext from "../../context/SystemContext";

import {  workingDays } from "../../services/reports";
import { downloadExcel } from "react-export-table-to-excel";
import ExportIcon from '@rsuite/icons/Export';

export const WorkingDays = ( {loader, reset} ) => {

  const tableRef = useRef(null);
  const {getPermission} = useContext(SystemContext);
  const [fechaInicio,setFechaInicio] =useState( new Date() );
  const [fechaFinal,setFechaFinal] =useState( new Date() );

	const [tableConfig, setTableConfig] = useState({columns:[
        {
            label: 'Nombre Driver',
            selector: row => row.col1,
            show:true,
            width:'40%'
        },
        {
            label: 'Fecha',
            selector: row => row.col2,
            show:true,
            width:'30%'
        },
        {
            label: 'Estatus',
            selector: row => row.col3,
            show:true,
            width:'30%'
        },
        
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
    //let fini = finicio.toISOString().split('T')[0];   
    let fini = finicio.toLocaleDateString( "en-CA" );
    fini = fini.replace( /\//g, "-" );

    let ffinal = new Date( fechaFinal );
    //let ffin = ffinal.toISOString().split('T')[0]; 
    let ffin = ffinal.toLocaleDateString( "en-CA" );
    ffin = ffin.replace( /\//g, "-" );
      
		let response = await workingDays( fini,ffin );
    
		if( response ){
			let data = response.data.map((res)=>{ 
    
				//configuracion de cada fila conformer la confifuracion de columnas 
				let item = {
					col1: res.names+' '+res.lastname1+(res.lastname2 !== null ? ' '+res.lastname2 : ''),
					col2: res.date,
          col3: 'Activo',
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

    const header = ["Nombres", "Fecha" , "Estatus"];

    if ( tableList.length == 0 ) {
      Toast.fire({icon:'error', title:'Error', text:'No Hay Datos para Exportar', timer:4500})
    }else{
      downloadExcel({
        fileName: "Reporte Dias Trabajados",
        sheet: "Hoja1",
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
		//onLoad();
	},[fechaInicio]);

  useEffect(()=>{
    getTableConfig();
		//onLoad();
	},[fechaFinal]);

  useEffect(()=>{
		onLoad();
	},[]);

  return (
    <>
      <Grid fluid className='content'>
            <Grid fluid>
                <Col xs={24} className="mb-2">
                    <Title screen="Reportes" action="Dias Activos por Driver" />
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

export default WorkingDays;
