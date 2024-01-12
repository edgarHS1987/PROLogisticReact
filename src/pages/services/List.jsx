import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Col, Divider, Grid } from "rsuite";

import Title from "../../components/Title"
import Button from "../../components/Button";

import { getDevice } from "../../libs/functions";


const ServicesList = ()=>{
    const navigate = useNavigate();

    
    return(
        <Grid fluid className='content'>
            <Grid fluid>
                <Col xs={24} className="mb-2">
                    <Title screen="Servicios" action={"Listado"} />
                </Col>
            </Grid>            
            <Divider style={{marginTop:0}} />
            <Grid fluid className='p-4 shadow rounded form-content'>
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
        </Grid>
    )
}

export default ServicesList;