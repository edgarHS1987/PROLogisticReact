import { Fragment, useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ButtonToolbar, Col, Divider, Grid, Message } from "rsuite";

import Title from "../../components/Title"
import Button from "../../components/Button";

import { decript } from "../../libs/functions";
import { servicesList, servicesTotalUnsigned } from "../../services/services";

import ModalUnsignedService from "../modals/UnsignedServices";
import Input from "../../components/Input";
import moment from "moment";
import ButtonList from "../../components/ButtonList";
import Table from "../../components/Table";
import ModalDetailServices from "../modals/DetailServices";
import SystemContext from "../../context/SystemContext";

const ServicesList = ({loader})=>{
    const {getPermission} = useContext(SystemContext);
    const unsignedModal = useRef();
    const detailsModal = useRef();
    const tableRef = useRef();
    
    const navigate = useNavigate();

    const tableColumns = [
        {
            label: 'Fecha',
            selector: row => row.col1,
            show:true,
            width:'10%'
        },
        {
            label: 'Contacto',
            selector: row => row.col2,
            show:true,
            width:'15%'
        },
        {
            label: 'Dirección',
            selector: row => row.col3,
            show:true,
            width:'30%'
        },
        {
            label: 'Teléfonos',
            selector: row => row.col4,
            show:true,
            width:'15%'
        },
        {
            label: 'Driver',
            selector: row => row.col5,
            show:true,
            width:'20%'
        },
        {
            label: 'Estatus',
            selector: row => row.col6,
            show:true,
            width:'10%'
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
                                    controlId={'details'}
                                    title="Detalles"
                                    type="details"
                                    appearance="ghost"  
                                    size="xs"                                  
                                    action={()=>openDetails(row.id)}
                                />
                            
                        </ButtonToolbar>
                    </Fragment>
                )
            } 
        }
    ]
    const [totalServiceUnsigned, setTotalServiceUnsigned] = useState(0);
    const [date, setDate] = useState(moment().format('YYYY-MM-DD'));
    const [tableList, setTableList] = useState([]);

    const onLoad = ()=>{
        tableRef.current.setTable();
        getServiceUnsigned();
        getServices();
    }

    const getServiceUnsigned = async ()=>{
        let clients_id = decript('clients_id');

        let response = await servicesTotalUnsigned(clients_id);

        if(response){
            setTotalServiceUnsigned(response.services);

            if(response.services > 0){
                unsignedModal.current.handleShow(response.services);
            }
        }
    }

    const getServices = async ()=>{
        await loader.current.handleShow('Cargando...');

        let clients_id = decript('clients_id');

        let response = await servicesList(clients_id, date);
        if(response){
            let data = response.map((res)=>{
                let item = {
                    id: res.id,
                    col1:moment(res.date).format('DD/MM/YYYY'),
                    col2: res.contact_name,
                    col3: res.address+' '+res.colony+', '+res.zip_code+' '+res.municipality,
                    col4: res.phones,
                    col5: res.driver,
                    col6: res.status
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

    const openDetails = (id)=>{
        detailsModal.current.handleShow(id);
    }

    const handleChange = (e)=>{
        let value = e.target.value;

        setDate(value);
    }

    useEffect(()=>{
        onLoad();
    },[]);
    
    return(
        <Grid fluid className='content'>
            <Grid fluid>
                <Col xs={24} className="mb-2">
                    <Title screen="Servicios" action={"Listado"} />
                </Col>
            </Grid>            
            <Divider style={{marginTop:0}} />
            <Grid fluid>
                {totalServiceUnsigned > 0 && (
                    <Message style={{padding:5}} type="error">Servicios sin asignar: {totalServiceUnsigned}</Message>
                )}
                                
                <Col xs={24} className="p-2 flex align-items-end">
                    <Col xs={4}>
                        <label>Fecha</label>
                        <Input 
                            type="date"
                            id="date"
                            value={date}
                            handleChange={handleChange}
                            required
                        />
                    </Col>
                    <Col xs={2}>
                        <Button title="Buscar" appearance="ghost" action={()=>getServices()} />
                    </Col>
                    <Col xs={2} xsOffset={18}>
                        {getPermission('services_create') && (
                            <Button 
                                title="Nuevo"
                                appearance="ghost"
                                classes="btn-new"
                                action={()=>navigate('/services/new')}
                            />
                        )}                        
                    </Col>
                </Col>
                    
                    
                <Col xs={24}>
                    <div className='p-4 shadow rounded form-content'>
                        <Table 
                            loader={loader}
                            columns={tableColumns}
                            data={tableList}
                            ref={tableRef}
                        />                        
                    </div>                    
                </Col>
            </Grid>     

            <ModalUnsignedService 
                loader={loader}
                getData={getServiceUnsigned}
                ref={unsignedModal}
            />
            <ModalDetailServices 
                loader={loader}
                ref={detailsModal}
            />
        </Grid>
    )
}

export default ServicesList;