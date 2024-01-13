import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Col, Divider, Grid, Message } from "rsuite";

import Title from "../../components/Title"
import Button from "../../components/Button";

import { decript, getDevice } from "../../libs/functions";
import { servicesTotalUnsigned } from "../../services/services";

import ModalUnsignedService from "../modals/UnsignedServices";

const ServicesList = ()=>{
    const unsignedModal = useRef();
    
    const navigate = useNavigate();

    const [totalServiceUnsigned, setTotalServiceUnsigned] = useState(0);

    const onLoad = ()=>{
        getServiceUnsigned();
    }

    const getServiceUnsigned = async ()=>{
        let clients_id = decript('clients_id');

        let response = await servicesTotalUnsigned(clients_id);

        if(response){
            setTotalServiceUnsigned(response);

            if(response > 0){
                unsignedModal.current.handleShow(response);
            }
        }
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
            <Grid fluid className='p-4 shadow rounded form-content'>
                {totalServiceUnsigned > 0 && (
                    <Message style={{padding:5}} type="error">Servicios sin asignar: {totalServiceUnsigned}</Message>
                )}
                
                <Col xs={24} className="p-2 flex justify-content-end">                    
                    <Button 
                        title="Nuevo"
                        appearance="ghost"
                        classes="btn-new"
                        action={()=>navigate('/services/new')}
                    />
                </Col>
                <Col xs={24} className='p-2 border rounded justify-content-center'>

                </Col>
            </Grid>     

            <ModalUnsignedService 
                ref={unsignedModal}
            />       
        </Grid>
    )
}

export default ServicesList;