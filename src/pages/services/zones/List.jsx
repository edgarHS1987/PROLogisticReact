import { Col, Divider, Grid, Row } from "rsuite"

import Title from "../../../components/Title"
import Button from "../../../components/Button";


const ZonesList = ()=>{
    return(
        <Grid fluid className='content'>
            <Grid fluid>
                <Col xs={24} className="mb-2">
                    <Title screen="Zonas" action="Listado" />
                </Col>
            </Grid>            
            <Divider style={{marginTop:0, marginBottom:10}} />
            <Grid fluid>
                <Row>
                    <Col xs={24} className="container-buttons">
                        
                        <Button 
                            title="Configurar"
                            appearance="ghost"
                            classes="btn-new"
                            action={()=>openConfiguration()}
                        />
                    
                    </Col>
                    <Col xs={24}>
                        <div className='p-4 shadow rounded form-content' style={{height:'55vh'}}></div>
                    </Col>
                </Row>
                
            </Grid>
        </Grid>
    )
}

export default ZonesList;