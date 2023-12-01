import React, { forwardRef, useImperativeHandle, useState } from "react";
import { Button, Col, Grid, Message, Modal, Uploader } from "rsuite";
import Select from "react-select";
import makeAnimated from 'react-select/animated';
import Toast from "../../components/Toast";
import {statesItems } from "../../services/states";
import { mapboxByZipCode, municipalitiesItems, municipalitiesUpdate, municipalityVerify } from "../../services/municipalities";

const animatedComponents = makeAnimated();

const MunicipalitiesModal = forwardRef(({loader, getData}, ref)=>{
    const [open, setOpen] = useState(false);
    const [states, setStates] = useState([]);
    const [municipalities, setMunicipalities] = useState([]);
    const [state, setState] = useState('');
    const [municipalitiesSelected, setMunicipalitiesSelected] = useState([]);    
    const [errorMessage, setErrorMessage] = useState('');

    const handleShow = async ()=>{        
        let response = await statesItems();
        if(response){
            await setStates(response);
            
        }

        await setOpen(true);
        
    }

    const handleClose = ()=>{
        setOpen(false);
        setStates([]);
        setMunicipalities([]);
        setState('');
        setMunicipalitiesSelected([]);
        setErrorMessage('');
    }

    const onSelectState = async (e)=>{
        let value = e.value;
        await setState(e);

        let response = await municipalitiesItems(value);
        if(response){
            await setMunicipalities(response);
        }
    }

    const onSelectMunicipality = (e)=>{
        let values = e;
        setMunicipalitiesSelected(values);
    }

    const onGetLocation = async ()=>{
        let error = '';
        
        if(state === '' || municipalitiesSelected.length === 0){
            error = 'Debe seleccionar un estado y por lo menos un municipio';
        }

        if(error === ''){
            verifyLocation();
        }else{
            Toast.fire('Error', error, 'error');
        }
        
    }

    const verifyLocation = async ()=>{
        await loader.current.handleShow('Guardando...');
        let items = {
            states_id: state.value,
            municipalities: municipalitiesSelected.map((item)=>{
                return item.value;
            })
        }
        
        let response = await municipalityVerify(items);
        if(response){
            if(response.error){
                await loader.current.handleClose();
            }else{
                let data = [];

                response.forEach(async (res, i)=>{
                    let item = {
                        municipalities_id: res.municipality_id,
                        zip_code_id: res.zip_code_id
                    }

                    item = await getLocationByMap(res, item);
                    
                    data.push(item);

                    if(data.length === response.length){
                        await onDataUpdate(data);
                    }
                });
            }
            
        }
    }

    const getLocationByMap = async (res, item)=>{
        let location = await mapboxByZipCode(res.zip_code);
        if(location){
            location.features.forEach((feat, j)=>{
                if(j === 0){
                    item = {
                        ...item,
                        latitude: feat.center[1],
                        longitude: feat.center[0],
                        bbox: feat.bbox.toString()
                    };
                }
            });                    
        }

        return item;
    }

    const onDataUpdate = async (data)=>{
        let response = await municipalitiesUpdate(data);
        if(response){
            if(response.error){
                await loader.current.handleClose();
                Toast.fire('Error', 'Error al guardar datos', 'error');                
            }else{
                Toast.fire('Correcto', response.message, 'success');
                handleClose();
                getData();
            }
        }

        await loader.current.handleClose();
    }
    
    useImperativeHandle(ref, ()=>({
        handleShow
    }));


    return(
        <Modal size="sm" open={open} onClose={handleClose} backdrop={false}>
            <Modal.Header>
                <Modal.Title>Ubicación de códigos postales</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{overflow:'unset'}}>
                <div className="container-fluid">
                    <Grid fluid>
                        {errorMessage !== '' && (
                            <Col xs={24} className="mb-2">
                                <Message type="error">{errorMessage}</Message>
                            </Col>
                        )}
                        
                        <Col xs={24} className="mb-2">
                            <label>Estado</label>
                            <Select 
                                options={states} 
                                onChange={(e)=>onSelectState(e)}
                                value={state}
                            />
                            
                        </Col>

                        <Col xs={24} className="mb-2">
                            <label>Municipios</label>
                            <Select 
                                closeMenuOnSelect={false}
                                components={animatedComponents}
                                options={municipalities} 
                                isMulti={true}
                                onChange={(e)=>onSelectMunicipality(e)}
                                value={municipalitiesSelected}
                            />
                            
                        </Col>
                        
                    </Grid>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <div className="text-center">
                    <Button appearance="ghost" onClick={()=>handleClose()}>Cancelar</Button>
                    <Button appearance="primary" onClick={()=>onGetLocation()}>Obtener ubicación</Button>
                </div>
            </Modal.Footer>
        </Modal>
    )
})

export default MunicipalitiesModal;