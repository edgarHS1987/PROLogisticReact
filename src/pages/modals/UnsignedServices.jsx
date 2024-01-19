import { forwardRef, useImperativeHandle, useState } from "react";
import { Col, Grid, Modal } from "rsuite";
import { useNavigate } from "react-router-dom";

import { CiCircleInfo } from "react-icons/ci";

import Button from "../../components/Button";
import Toast from '../../components/Toast';

import { decript, swalAction } from "../../libs/functions";
import { gMapsByAddress, servicesAssignToDriver, servicesUpdateLocation, servicesWithoutLocation } from "../../services/services";

const ModalUnsignedService = forwardRef(({
    loader,
    getData
}, ref)=>{
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [total, setTotal] = useState(0);

    const handleShow = (number)=>{        
        setTotal(number);
        setOpen(true);
    }

    const onAssignService = async ()=>{
        let obj = {
            clients_id: decript('clients_id')
        };

        await loader.current.handleShow('Asignando...');
        let response = await servicesAssignToDriver(obj);
        if(response){
            if(response.error){
                Toast.fire('Error', response.error, 'error');
            }else{
                Toast.fire('Correcto', response.message, 'success');
                setOpen(false);
                setTotal(0);
                getLocationServices();
            }
        }else{
            await loader.current.handleClose();
        }
        
    }

    const getLocationServices = async ()=>{
		let clients_id = decript('clients_id');
		let response = await servicesWithoutLocation(clients_id);
		if(response){
			let platform = '';
			
			await response.platforms.forEach((p)=>{
				if(p.platform === 'gmaps'){
					if(p.total <= 10000){
						platform = 'gmaps';
					}
				}
			})

			let services = await Promise.all(
				response.services.map(async (res)=>{
					let address = res.address+', '+res.zip_code+', '+res.state;

					address = address.replaceAll(' ', '%20');

					if(platform === 'gmaps'){
						let request = await gMapsByAddress(address);
						if(request){
							request.results.forEach((result, i)=>{
								if(i === 0){
									res.latitude = result.geometry.location.lat;
									res.longitude = result.geometry.location.lng;
									res.full_address = result.formatted_address;
								}
							})
						}
					}

					return res;
				})
			);

			let obj = {
				services: services,
				platform: platform
			};

			let request = await servicesUpdateLocation(obj);
			if(request){
				getData();
			}
		}

		await loader.current.handleClose();
	}

    useImperativeHandle(ref, ()=>({
        handleShow
    }));

    return (
        <Modal size="xs" open={open} onClose={()=>setOpen(false)}>
            <Modal.Title></Modal.Title>
            <Modal.Body>
                <Grid fluid>
                    <Col xs={24} className="flex justify-content-center">
                        <Col xs={24} md={18} className="text-center p-3">
                            <CiCircleInfo size={80} style={{color:'var(--bs-warning)'}}/>
                        </Col>
                    </Col>

                    <Col xs={24} className="text-center">
                        <h4>Alerta</h4>    
                        <label>
                            {'Existen ('+total+') servicios sin asignar, seleccione una de las opciones para continuar'}
                        </label>
                    </Col>
                </Grid>
            </Modal.Body>
            <Modal.Footer>
                <Grid fluid>
                    <Col xs={24} className="flex justify-content-center gap-2">
                        <Col xs={24}>
                            <Col xs={12}>
                                <Button 
                                    title="Asignar"
                                    appearance="ghost"
                                    action={()=>onAssignService()}
                                    classes="full-width"
                                />
                            </Col>
                            <Col xs={12}>
                                <Button 
                                    title="Seguir registrando"
                                    appearance="ghost"
                                    action={()=>navigate('/services/new')}
                                    classes="full-width"
                                />
                            </Col>
                        </Col>
                    </Col>
                </Grid>
            </Modal.Footer>
        </Modal>
    )
});

export default ModalUnsignedService;