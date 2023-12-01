import { useEffect, useRef, useState } from "react";
import { Col, Divider, Grid, Panel, PanelGroup, Row } from "rsuite"

import Title from "../../../components/Title"
import Button from "../../../components/Button";
import MunicipalitiesModal from "../../modals/municipalities";
import { statesDetails } from "../../../services/states";
import Table from "../../../components/Table";
import ModalStates from "../../modals/States";
import { municipalitiesShow } from "../../../services/municipalities";

const StatesList = ({loader})=>{   
    const statesRef = useRef();
    const municialityRef = useRef();
    const tableRef = useRef([]);
    const tableColumns = [
        {
            label: 'Código postal',
            selector: row => row.col1,
            show:true,
            width:'15%'
        },
        {
            label: 'Nombre',
            selector: row => row.col2,
            show:true,
            width:'60%'
        },
        {
            label: 'Tipo',
            selector: row => row.col3,
            show:true,
            width:'15%'
        }
    ]
    const [activePanel, setActivePanel] = useState(-1);
    const [statesList, setSatesList] = useState([]);

    /**
     * Obtiene datos del listado de estados
     */
    const onLoad = ()=>{
        getData();
    }

    const getData = async ()=>{
        await loader.current.handleShow('Cargando...');
        let response = await statesDetails();
        if(response){
            response.forEach((res)=>{
                res.municipalities = [];
            });
            setSatesList(response);
        }

        await loader.current.handleClose();
    }

    /**
     * Obtiene municipios por estado
     * @param {*} id identificador de estado
     */
    const getDataMunicipalities = async (id)=>{
        let index = statesList.findIndex(obj => obj.id === id);
        if(statesList[index].municipalities.length === 0){
            let response = await municipalitiesShow(id);
            if(response){
                let data = statesList.map((state, i)=>{
                    if(i === index){
                        response.map((res)=>{
                            res.zip_codes = res.zip_codes.map((zip)=>{
                                let item = {
                                    col1: zip.zip_code,
                                    col2: zip.name,
                                    col3: zip.type
                                };
        
                                return item;
                            });
                        });

                        state.municipalities = response;
                    }

                    return state;
                });

                setSatesList(data);
            }
        }
    }

    /**
     * Abre modal para cargar los archivos de cada municipio con su codigo postal
     *  */
    const openModalStates = ()=>{
        statesRef.current.handleShow();
    }

    /**
     * Abre modal para cargar los datos de ubicacion de codigo postal
     *  */
    const openModalMunicipalities = ()=>{
        municialityRef.current.handleShow();
    }

    const onSelectMunicipality = async (index)=>{
        await loader.current.handleShow('');
        await tableRef.current[index].resetTable();

        await setTimeout(()=>{
            tableRef.current[index].setTable();
        }, 0);

        await loader.current.handleClose();
    }

    useEffect(()=>{
        onLoad();
    },[]);

    return(
        <Grid fluid className='content'>
            <Grid fluid>
                <Col xs={24} className="mb-2">
                    <Title screen="Estados" action="Listado" />
                </Col>
            </Grid>            
            <Divider style={{marginTop:0, marginBottom:10}} />
            <Grid fluid>
                <Row>
                    
                        <Col xs={24} className="flex justify-content-end mb-3">
                            {statesList.length === 0 && (
                                <Button 
                                    title="Agregar"
                                    appearance="ghost"
                                    classes="btn-new"
                                    action={()=>openModalStates()}
                                />
                            )}

                                <Button 
                                    title="Cargar ubicación"
                                    appearance="ghost"
                                    classes="btn-new"
                                    action={()=>openModalMunicipalities()}
                                />

                        </Col>
                    
                    
                    <Col xs={24}>
                        <div>
                            <PanelGroup accordion defaultActiveKey={activePanel} onSelect={(state_id)=>getDataMunicipalities(state_id)} bordered>                                
                                {statesList.map((state, index)=>
                                    <Panel header={state.name} key={index} eventKey={state.id}>
                                        <Col xs={24}>
                                            <PanelGroup accordion onSelect={(e)=>onSelectMunicipality(e)}>
                                                {state.municipalities.map((municipality, j)=>
                                                    <Panel header={municipality.name} bordered key={j} eventKey={j}>                                                        
                                                        <Col xs={24}>
                                                            <Table 
                                                                columns={tableColumns}
                                                                data={municipality.zip_codes}
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

            <ModalStates 
                loader={loader}
                getData={getData} 
                ref={statesRef} 
            />
            <MunicipalitiesModal 
                loader={loader}
                getData={getData} 
                ref={municialityRef}
            />
        </Grid>
    )
}

export default StatesList;