import { useEffect, useState } from "react";
import { Col, Grid } from "rsuite";
import { useNavigate } from "react-router-dom";

import { FaCar } from "react-icons/fa";
import { FiPackage } from "react-icons/fi";

import Button from "../components/Button";
import Toast from "../components/Toast";

import { zonesAssignDriver, zonesUnsignedDrivers } from "../services/zones";
import { servicesAssignToDriver, servicesTotalUnsigned } from "../services/services";
import { decript, swalAction } from "../libs/functions";

const Home = ({loader})=>{
	const navigate = useNavigate();
	const [driverUnsignedZone, setDriverUnsignedZone] = useState([]);
	const [serviceUnsigned, setServiceUnsigned] = useState(0);

	const onLoad = ()=>{
		getDriversUnsigned();
		getServicesUnsigned();
	}

	const getDriversUnsigned = async ()=>{
		let response = await zonesUnsignedDrivers();
		if(response !== undefined){
			setDriverUnsignedZone(response);
		}
	}

	const onAssignZoneToDriver = async ()=>{
		await loader.current.handleShow('Asignando...');
		let response = await zonesAssignDriver(driverUnsignedZone);
		if(response){
			if(response.error){
				swalAction({
					title:'Alerta',
					text:response.error,
					icon:'warning',
					textConfirm:'Configurar zonas',
					fn:()=>{
						navigate('/services/zones/list');
					}
				})
			}else{
				getDriversUnsigned();

				Toast.fire({
					title:'Correcto',
					text:response.message,
					icon:'success',
					timer:4000
				});

			}
		}

		await loader.current.handleClose();
	}

	const getServicesUnsigned = async ()=>{
		let clients_id = decript('clients_id');
		let response = await servicesTotalUnsigned(clients_id);
				
		if(response){
			setServiceUnsigned(response.services);
		}
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
                getServicesUnsigned();
            }
        }
		await loader.current.handleClose();
    }

	useEffect(()=>{
		onLoad();
	},[]);

	return(
		<>
			<Grid fluid>
				<Col xs={24} className="mt-3">
					{driverUnsignedZone.length > 0 && (
						<Col xs={24} md={6} className="p-2 shadow rounded">
							<Col xs={24} className="flex align-items-center pt-2 pb-2 rounded" style={{background:'var(--primary)', color:'#fff'}}>
								<Col xs={24} md={6}>
									<FaCar size={60} />
								</Col>
								<Col xs={24} md={18} className="text-end">
									<span style={{display:'block'}}>{driverUnsignedZone.length}</span>
									<label>Conductores sin zona asignada</label>
								</Col>
							</Col>
							<Col xs={24} className="pt-2">
								<Button 
									title="Asignar a zona" 
									appearance="ghost"
									classes="full-width"
									action={()=>onAssignZoneToDriver()}
								/>
							</Col>
						</Col>
					)}

					{serviceUnsigned > 0 && (
						<Col xs={24} md={6} className="p-2 shadow rounded">
							<Col xs={24} className="flex align-items-center pt-2 pb-2 rounded" style={{background:'var(--primary)', color:'#fff'}}>
								<Col xs={24} md={6}>
									<FiPackage size={60} />
								</Col>
								<Col xs={24} md={18} className="text-end">
									<span style={{display:'block'}}>{serviceUnsigned}</span>
									<label>Servicios sin asignar</label>
								</Col>
							</Col>
							<Col xs={24} className="pt-2">
								<Col xs={24} md={12}>
									<Button 
										title="Asignar a driver" 
										appearance="ghost"
										classes="full-width"
										action={()=>onAssignService()}
									/>
								</Col>
								<Col xs={24} md={12}>
									<Button 
										title="Ir a registro" 
										appearance="ghost"
										classes="full-width"
										action={()=>navigate('/services/new')}
									/>
								</Col>
							</Col>
						</Col>
					)}
					
				</Col>
			</Grid>
		</>
	)
}

export default Home;