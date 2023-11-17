import { Grid, Col, Breadcrumb, Panel } from "rsuite";

const Title = (props)=>{
    return (
        <Grid fluid style={{margin:15, marginBottom:0}}>
            <Col xs={8}>
                <div className="title">
                    <h1>{props.screen}</h1>
                    <small>{props.action}</small>
                </div>
            </Col>
            <Col xs={16} className="right padding-7">
                <Col xs={10} style={{float:'right', width:'auto'}}>
                    <Panel shaded className='title route' style={{backgroundColor:'#fff'}}> 
                        <Breadcrumb className="left">
                            <Breadcrumb.Item className="breadcrumb-link" href="/">Inicio</Breadcrumb.Item>
                            {props.screen !== undefined ? props.screen : ''}
                        </Breadcrumb>
                    </Panel>
                </Col>
                
            </Col>
        </Grid>
    );
}

export default Title;