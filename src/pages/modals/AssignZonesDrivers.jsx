import { forwardRef, useImperativeHandle, useState } from "react";
import { Col, Grid, Modal, Row } from "rsuite";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import Button from "../../components/Button";
import { DndZone } from "../../components/DndZone";
import { DndDriver } from "../../components/DndDriver";
import Toast from '../../components/Toast';

import { decript } from "../../libs/functions";
import { zonesAssignDriver, zonesDrivers } from "../../services/zones";

const ModalAssignZonesDrivers = forwardRef((props, ref)=>{
    const {loader, getData} = props;
    const [open, setOpen] = useState(false);
    const [zones, setZones] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [sizeZone, setSizeZone] = useState(4);
    const ItemTypes = {
        BOX:'box'
    };

    const handleShow = async ()=>{
        let clients_id = decript('clients_id');

        let response = await zonesDrivers(clients_id);
        if(response){
            let zoneItems = response.zones.map((zone)=>{
                zone.accepts = [ItemTypes.BOX],
                zone.lastDroppedItem = [];

                return zone;
            })
            setZones(zoneItems);

            if(zoneItems.length === 1){
                setSizeZone(24);
            }else if(zoneItems.length === 2){
                setSizeZone(12);
            }else if(zoneItems.length === 3){
                setSizeZone(8);
            }else{
                setSizeZone(6);
            }

            let driverItems = response.drivers.map((driver)=>{
                driver.type = ItemTypes.BOX;

                return driver;
            });            
            setDrivers(driverItems);

            setOpen(true);
        }
        
    }

    const handleClose = ()=>{
        setOpen(false);
        setZones([]);
        setDrivers([]);
        setSizeZone(4);
    }

    const onAddToZone = (item, index)=>{
        let dataZones = zones;
        let dataDrivers = [];

        dataZones[index].lastDroppedItem.push(item);        
        setZones(dataZones);
        
        let indexDriver = drivers.findIndex(obj => obj.id === item.id);
        drivers.forEach((driver, i)=>{
            if(i !== indexDriver){
                dataDrivers.push(driver);
            }
        });

        setDrivers(dataDrivers);
    }

    const onDeleteFromeZone = (indexZone, indexDriver)=>{
        let zoneItems = [];
        let driverItems = drivers;

        zoneItems = zones.map((zone, i)=>{            
            let item = {
                id: zone.id,
                name: zone.name,
                accepts: zone.accepts,
                lastDroppedItem:[]
            }
            if(i === indexZone){
                let last = [];
                zone.lastDroppedItem.forEach((item, j)=>{
                    if(j !== indexDriver){
                        last.push(item);
                    }else{
                        driverItems.push(item);
                    }
                })

                item.lastDroppedItem = last;
            }else{
                item.lastDroppedItem = zone.lastDroppedItem;
            }

            return item;
        });

        setZones(zoneItems);
        setDrivers(driverItems);        
    }

    const onAssignDriversToZone = async ()=>{
        let errors = [];

        if(drivers.length > 0){
            errors.push('Debe asignar los drivers a una zona');
        }

        let zoneNoDriver = false;
        zones.forEach((zone)=>{
            if(zone.lastDroppedItem.length > 0){
                zoneNoDriver = true;
            }
        });

        if(!zoneNoDriver){
            errors.push('Existen zonas sin driver');
        }

        if(errors.length === 0){
            let obj = [];
            zones.forEach((zone)=>{
                zone.lastDroppedItem.forEach((last)=>{
                    let item = {
                        zones_id: zone.id,
                        drivers_id: last.id
                    };

                    obj.push(item);
                });
            })
            
            await loader.current.handleShow('Asignando...');

            let response = await zonesAssignDriver(obj);
            if(response){
                if(response.error){
                    Toast.fire('Error', 'Error al asignar driver', 'error');
                }else{
                    Toast.fire('Correcto', response.message, 'success');
                    handleClose();
                    getData();
                }
            }

            await loader.current.handleClose();

        }else{
            let error = '<div class="full-width">';
            errors.forEach((e)=>{
                error += '<p>'+e+'<p>';
            });
            error += '</div>';

            Toast.fire({
                title:'Error', 
                html:error,
                icon:'error',
                timer:6000
            });
        }
    }

    useImperativeHandle(ref, ()=>({
        handleShow
    }));

    return(
        <Modal size="lg" open={open} onClose={handleClose}>
            <Modal.Title>
                Asignar driver a zona
            </Modal.Title>
            <Modal.Body>
                <Grid fluid>
                    <Col xs={24}>
                        <DndProvider backend={HTML5Backend}>
                            <Col xs={24}>
                                <h6>Seleccione el nombre del driver y arrastrelo a una zona para asignarlo</h6>
                            </Col>
                            <Col xs={18}>
                                <Row>
                                    <Col xs={24}>
                                        <h6 className="text-center full-width">Zonas</h6>
                                    </Col>
                                </Row>
                                <Row style={{display:'flex', gap:4}}>
                                    {zones.map((zone, i)=>
                                        <Col xs={sizeZone} key={i} className="rounded border">
                                            <DndZone 
                                                accept={zone.accepts}
                                                lastDroppedItem={zone.lastDroppedItem}
                                                name={zone.name}
                                                onDrop={(item)=>onAddToZone(item, i)}
                                                onDelete={(indexDriver)=>onDeleteFromeZone(i, indexDriver)}
                                            />
                                        </Col>
                                    )}
                                </Row>                                
                            </Col>
                            <Col xs={6}>
                                <Col xs={24}>
                                    <h6 className="text-center full-widtth">Drivers</h6>
                                </Col>                                
                                {drivers.map((driver, i)=>
                                    <Col xs={24} key={i} className="border rounded mb-2">
                                        <DndDriver 
                                            id={driver.id}
                                            name={driver.name}
                                            type={driver.type}
                                        />
                                    </Col>
                                )}
                            </Col>
                        </DndProvider>
                    </Col>
                </Grid>
            </Modal.Body>
            <Modal.Footer>
                <Grid className="flex">
                    <Col xs={24} className="text-center">
                        <Button
                            title="Cancelar"
                            appearance="ghost"
                            classes="me-2"
                            action={()=>handleClose()}
                        />

                        <Button
                            title="Asignar"
                            appearance="primary"
                            action={()=>onAssignDriversToZone()}
                        />
                    </Col>
                </Grid>
            </Modal.Footer>
        </Modal>
    )
});

export default ModalAssignZonesDrivers;