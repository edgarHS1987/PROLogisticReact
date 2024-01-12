import { Fragment, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ButtonToolbar, Col, Divider, Grid, IconButton, Row } from "rsuite";
import moment from 'moment';

import { FaSearch } from "react-icons/fa";

import Title from "../../components/Title"
import SelectField from "../../components/Select";
import BarcodesScanner from "../../components/BarcodeScanner";
import Toast from "../../components/Toast";
import Button from "../../components/Button";
import Input from "../../components/Input";
import Table from "../../components/Table";
import ButtonList from "../../components/ButtonList";

import sound from '../../assets/error.mp3';

import { addErrorToSelectedField, getDevice, isValidForm, swalAction } from "../../libs/functions";
import { clientsList } from "../../services/clients";
import { warehousesShow } from "../../services/warehouses";
import { servicesDelete, servicesList, servicesSave } from "../../services/services";
import ServicesTable from "./ServicesTable";
import ModalServices from "../modals/Services";


const ServicesForm = ({loader})=>{
    const tableRef = useRef();
    const modalService = useRef();

    const navigate = useNavigate();
    const {id} = useParams();

    const [clients, setClients] = useState([]);
    const [warehouses, setWarehouses] = useState([]);
    const tableConfig = {
        columns:[
            {
                label: 'Cliente/Bodega',
                selector: row => (
                    <Fragment>
                        <img src={row.col1} />
                    </Fragment>
                ),
                show:false,
                width:'15%'
            },
            {
                label: 'Confirmación',
                selector: row => row.col2,
                show:true,
                width:'15%'
            },
            {
                label: 'Nombre',
                selector: row => row.col3,
                show:true,
                width:'15%'
            },
            {
                label: 'Dirección',
                selector: row => row.col4,
                show:true,
                width:'30%'
            },
            {
                label: 'Teléfono(s)',
                selector: row => row.col5,
                show:true,
                width:'15%'
            },
            {
                label:'',
                show:true,
                width:'100px',            
                selector: row => {
                    return(
                        <Fragment>
                            <ButtonToolbar>
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
        ]
    };
    const [tableList, setTableList] = useState([]);
    const [dataService, setDataService] = useState({
        clients_id:'',
        warehouses_id:'',
        code:'',
        services:[]
    });
    const [isMobile, setIsMobile] = useState(false);
    

    const onLoad = async ()=>{
        let mobile = getDevice();
        setIsMobile(mobile);

        let response = await clientsList();
        if(response){
            setClients(response);
            if(response.length > 0){
                setDataService({
                    ...dataService,
                    clients_id: response[0].value
                });

                await getWarehouse(response[0].value);

                await getData(response[0].value);
            }
            
        }

        
    }

    const getData = async (id = dataService.clients_id)=>{
        let response = await servicesList({clients_id: id});
        if(response){
            let data = dataService.services;

            response.forEach((res)=>{
                data.push(res);
            });            

            await setDataOnTable(data);
        }
    }

    const setDataOnTable = async (data)=>{
        setDataService({
            ...dataService,
            services: data
        });

        let items = data.map((res)=>{
            let item = {
                id: res.id,
                col1: res.client+' - '+res.warehouse,
                col2: res.confirmation,
                col3: res.contact_name,
                col4: res.address+' '+res.colony+', '+res.zip_code+', '+res.municipality,
                col5: res.phones
            };

            return item;
        });

        if(isMobile){
            await setTableList(items);
        }else{
            await tableRef.current.resetTable(); //restablece el listado

            await setTableList(items);

            setTimeout(async ()=>{
                await tableRef.current.setTable();
            }, 0);   
        }
        
    }

    const getWarehouse = async (id)=>{
        let response = await warehousesShow(id);
        if(response){
            setWarehouses(response);
        }
    }

    const handleChange = (e)=>{
        let name = e.target.name;
        let value = e.target.value;

        let data = dataService;
        data = {
            ...data,
            [name]: value
        };

        setDataService(data);

        if(name === 'warehouses_id' && value !== ''){
            addErrorToSelectedField(name, value);
        }
        
    }

    const readCode = async (e)=>{
        let error = '';
        let scanText = dataService.code;
        let arrayScan = scanText.split('|');
        
        /*solo estafeta*/
        let data = {
            date: moment().format('YYYY-MM-DD'),
            time: moment().format('HH:mm:ss'),
            guide_number:'',
            route_number:'',
            confirmation: arrayScan[0],
            contact_name: arrayScan[11],
            address: arrayScan[12],
            zip_code: arrayScan[7],
            colony: arrayScan[13],
            state: arrayScan[14],
            municipality: arrayScan[15],
            phone: arrayScan[16],
            clients_id: dataService.clients_id,
            warehouses_id: dataService.warehouses_id,
        }

        if(!addErrorToSelectedField('warehouses_id', dataService.warehouses_id)){
            error = 'Campos incompletos';
        }
        
        if(!isValidForm('div.form-service')){
            error = 'Campos incompletos';
        }

        let index = dataService.services.findIndex(obj => obj.confirmation === data.confirmation);
        if(index !== -1){
            error = 'El servicio que intenga agregar ya se encuentra registrado';
        }

        if(error === ''){
            saveData(data)
        }else{
            Toast.fire('Error', error, 'error');
        }
    }

    const saveData = async (data)=>{
        await loader.current.handleShow('Agregando...');

        let response = await servicesSave(data);
        if(response){
            if(response.error){
                Toast.fire({
                    title:'Error',
                    text: 'Error al intengar agregar el servicio',
                    icon:'error',
                    timer:6000
                });
            }else{
                let data = dataService.services;

                data.push(response);

                setDataOnTable(data);
                
                Toast.fire({title:'Correcto',text:'El servicio que agrego correctamente', icon:'success'});
            }
        }

        await loader.current.handleClose();
    }

    const onAddService = (service)=>{
        let data = dataService;

        let index = data.services.findIndex(obj => obj.confirmation === service.confirmation);
        
        if(index === -1){
            service = {
                ...service,
                clients_id: data.clients_id,
                warehouses_id: data.warehouses_id,
            }
            saveData(service);
            //data.services.push(service);
            Toast.fire({title:'Correcto',text:'El servicio que agrego correctamente', icon:'success'});
        }else{
            new Audio(sound).play();
            Toast.fire({title:'Error',text:'El servicio que intenga agregar ya se encuentra registrado', icon:'error', timer:6000});
        }

    }

    /**
     * elimina un registro 
     * @param {*} id identificador de registro
     */
    const deleteItem = async(id)=>{
        await loader.current.handleShow('Eliminando...');
        
        let response = await servicesDelete(id);
        if(response){
            if(response.error){
                Toast.fire({title:'Error', text:response.error, icon:'error', timer:8000});
            }else{                
                let data = [];
                tableList.forEach((table)=>{
                    if(table.id !== id){
                        data.push(table);
                    }
                });
                await tableRef.current.resetTable(); //restablece el listado
        
                await setTableList(data);

                setTimeout(async ()=>{
                    await tableRef.current.setTable();
                }, 0);   

                let items = [];
                dataService.services.forEach((service)=>{
                    if(service.id !== id){
                        items.push(service);
                    }
                });

                setDataService({
                    ...dataService,
                    services: items
                });

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
            textCancel      : 'No, cancelar',
            values          : id,
            fn              : deleteItem
        });
    }

    const openModalService = async ()=>{
        await getData();
        await modalService.current.handleShow();
    }
    
    useEffect(()=>{
        onLoad();                
    },[]);
    
    return(
        <Grid fluid className='content'>
            <Grid fluid>
                <Col xs={24} className="mb-2">
                    <Title screen="Servicios" action={id ? 'Edición' : "Registro"} />
                </Col>
            </Grid>            
            <Divider style={{marginTop:0}} />
            <Grid fluid>                
                <Col xs={24}>
                    <div className='p-1 shadow rounded form-content'>
                        <div className='p-2 row justify-content-center'>
                            <div className='p-2 col-12 col-sm-10 col-md-12 col-lg-11'>
                                <form id="service-form">
                                    <Row>                                        
                                        <Col xs={20} lg={22} id="fields-service" className="flex align-items-end form-service">
                                            {/*<Col xs={24} lg={6}>
                                                <label>Cliente</label>
                                                <SelectField 
                                                    id="clients_id"
                                                    value={dataService.clients_id}
                                                    handleChange={handleChange}
                                                    options={clients}
                                                    required
                                                />
                                            </Col>*/}
                                            <Col xs={24} lg={6}>
                                                <label>Bodega</label>                                                
                                                <SelectField 
                                                    id="warehouses_id"
                                                    value={dataService.warehouses_id}
                                                    handleChange={handleChange}
                                                    options={warehouses}
                                                    required                                                    
                                                />
                                            </Col>
                                            {!isMobile ? (
                                                <>
                                                    <Col xs={24} lg={6}>
                                                        <label>Código</label>
                                                        <Input
                                                            id="code"
                                                            value={dataService.code}
                                                            handleChange={handleChange}
                                                            required
                                                        />
                                                    </Col>
                                                    <Col xs={24} lg={2}>
                                                        <Button title="Agregar" appearance="ghost" action={()=>readCode()} />
                                                    </Col>
                                                </>                                                
                                            ): null}
                                            
                                        </Col>
                                        {isMobile ? (
                                            <>
                                                <Col xs={4}>
                                                    <div 
                                                        style={document.getElementById('fields-service') !== null ? {
                                                            height: document.getElementById('fields-service').offsetHeight
                                                        } : {}}
                                                        className="flex justify-content-center align-items-end"
                                                    >
                                                        <IconButton 
                                                            size="sm"
                                                            appearance="ghost" 
                                                            icon={<FaSearch />} 
                                                            onClick={()=>openModalService()}
                                                        />
                                                    </div>
                                                </Col>

                                                <Col xs={24} className="mt-2">                                            
                                                    <BarcodesScanner loader={loader} onAddService={onAddService} />
                                                </Col>
                                            </>                                            
                                        ) : (
                                            <Col xs={24}>
                                                <Divider />
                                                <ServicesTable 
                                                    loader={loader}
                                                    tableConfig={tableConfig}
                                                    tableList={tableList}
                                                    tableRef={tableRef}
                                                />
                                            </Col>
                                        )}
                                                                                
                                        <Col xs={24} className="mt-3 text-center">
                                            <Button 
                                                title="Asignar"
                                                appearance="primary"
                                                classes={isMobile ? "full-width" : ""}
                                            />
                                        </Col>
                                    </Row>
                                </form>
                            </div>
                        </div>
                    </div>
                </Col>
            </Grid>
            
            <ModalServices 
                loader={loader}
                tableConfig={tableConfig}
                tableList={tableList}
                ref={modalService}
            />
        </Grid>
    )
}

export default ServicesForm;