import { Col, Divider, Grid, Panel, PanelGroup, Row } from "rsuite"

import Title from "../../../components/Title"
import Button from "../../../components/Button";
import ModalConfigureZones from "../../modals/ConfigureZones";
import { useContext, useEffect, useRef, useState } from "react";
import {  zonesByClient } from "../../../services/zones";
import { clientsList } from "../../../services/clients";
import Table from "../../../components/Table";
import SystemContext from "../../../context/SystemContext";


const ZonesList = ({loader})=>{
    const {getPermission} = useContext(SystemContext);
    const configure = useRef();
    const tableRef = useRef([]);

    const tableColumns = [
        {
            label: 'Código postal',
            selector: row => row.col1,
            show:true,
            width:'20%'
        },
        {
            label: 'Colonia',
            selector: row => row.col2,
            show:true,
            width:'80%'
        },
    ]

    const [activePanel, setActivePanel] = useState(-1);
    const [clients, setClients] = useState([]);

    const getData = async ()=>{
        let response = await clientsList();
        if(response){
            response.forEach((res)=>{
                res.zones = [];
            });
            setClients(response);
        }
    }

    const getDataZones = async (id)=>{        
        let index = clients.findIndex(obj => obj.value === id);

        if(index !== -1){
            if(clients[index].zones.length === 0){
                let response = await zonesByClient(id);
                if(response){
                    let items = clients.map((client)=>{
                        if(client.value === id){
                            response.forEach((res)=>{
                                let codes = res.zip_codes.map((zip)=>{
                                    let item = {
                                        id: zip.id,
                                        col1: zip.zip_code,
                                        col2: zip.colony
                                    };

                                    return item;
                                });

                                res.zip_codes = codes;
                            });

                            client.zones = response;
                        }

                        return client;
                    });

                    setClients(items);
                }
            }
        }
        
    }

    const openConfiguration = ()=>{
        configure.current.handleShow();
    }

    const onSelectZone = async (index)=>{
        await loader.current.handleShow('Cargando...');
        await tableRef.current[index].resetTable();

        await setTimeout(()=>{
            tableRef.current[index].setTable();
        }, 0);

        await loader.current.handleClose();
    }

    useEffect(()=>{
        getData();
    },[]);

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
                    <Col xs={24} className="text-end">
                        {getPermission('services_zones_configure') && (
                            <Button 
                                title="Configurar"
                                appearance="ghost"
                                classes="btn-new"
                                action={()=>openConfiguration()}
                            />
                        )}
                        
                    </Col>
                    <Col xs={24}>
                        <div className='p-4 shadow rounded form-content'>
                            <PanelGroup accordion defaultActiveKey={activePanel} onSelect={(client_id)=>getDataZones(client_id)} bordered>
                                {clients.map((client, i)=>
                                    <Panel key={i} header={client.label} eventKey={client.value}>
                                        <Col xs={24}>
                                            <PanelGroup accordion onSelect={(e)=>onSelectZone(e)}>
                                                {client.zones.map((zone, j)=>
                                                    <Panel header={zone.name} bordered key={j} eventKey={j}>
                                                        <Col xs={24}>
                                                            <Table
                                                                columns={tableColumns}
                                                                data={zone.zip_codes}
                                                                isSmall={true}
                                                                id={'table'+j}
                                                                ref={el => tableRef.current[j] = el}
                                                            />                                                            
                                                        </Col>
                                                    </Panel>
                                                )}
                                            </PanelGroup>
                                        </Col>
                                    </Panel>
                                )}
                            </PanelGroup>
                        </div>
                    </Col>
                </Row>
                
            </Grid>

            <ModalConfigureZones loader={loader} getData={getData} ref={configure} />
        </Grid>
    )
}

export default ZonesList;