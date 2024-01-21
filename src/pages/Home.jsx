import { useContext, useEffect, useRef, useState } from "react";
import { Col, Grid } from "rsuite";
import { useNavigate } from "react-router-dom";

import { FaCar } from "react-icons/fa";
import { FiPackage } from "react-icons/fi";
import { GrMap } from "react-icons/gr";

import Button from "../components/Button";
import Toast from "../components/Toast";

import { zonesConfigured, zonesUnsignedDrivers } from "../services/zones";
import { gMapsByAddress, servicesAssignToDriver, servicesTotalUnsigned, servicesUpdateLocation, servicesWithoutLocation } from "../services/services";
import { decript } from "../libs/functions";
import ModalConfigureZones from "./modals/ConfigureZones";
import ModalAssignZonesDrivers from "./modals/AssignZonesDrivers";
import SystemContext from "../context/SystemContext";

const Home = ({loader})=>{
	const modalZones = useRef();
	const modalAssignZone = useRef();

	const {getPermission} = useContext(SystemContext);

	const navigate = useNavigate();

	const [driverUnsignedZone, setDriverUnsignedZone] = useState([]);
	const [serviceUnsigned, setServiceUnsigned] = useState(0);
	const [zones, setZones] = useState([]);
	const [isTodayZone, setIsTodayZone] = useState(false);

	const onLoad = ()=>{
		getDriversUnsigned();
		getServicesUnsigned();
	}

	const getZones = async (drivers)=>{
		let clients_id = decript('clients_id');

		let response = await zonesConfigured(clients_id);
		if(response){
			if(response.zones.length === 0){
				modalZones.current.handleShow(drivers);
			}else{
				setZones(response.zones);
				setIsTodayZone(response.today);
			}
		}
	}

	const getDriversUnsigned = async ()=>{
		let response = await zonesUnsignedDrivers();
		if(response !== undefined){
			setDriverUnsignedZone(response);
			
			getZones(response.length);			
		}
	}

	const onAssignZoneToDriver = async ()=>{		
		modalAssignZone.current.handleShow();
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
                getLocationServices();
            }
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
					<Col xs={24} md={6} className="p-2 shadow rounded">
						<Col xs={24} className="flex align-items-center pt-2 pb-2 rounded" style={{background:'var(--primary)', color:'#fff'}}>
							<Col xs={24} md={6}>
								<GrMap size={60} />
							</Col>
							<Col xs={24} md={18} className="text-end">
								<span style={{display:'block'}}>{zones.length}</span>
								<label>Zonas configuradas</label>
							</Col>
						</Col>
						<Col xs={24} className="pt-2">
							{getPermission('services_zones_configure') && (
								<Button 
									title="Configurar zonas" 
									appearance="ghost"
									classes="full-width"
									action={()=>modalZones.current.handleShow(driverUnsignedZone.length)}
									disabled={zones.length > 0 && isTodayZone}								
								/>
							)}
							
						</Col>
					</Col>

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
								{getPermission('services_zones_assign_driver') && (
									<Button 
										title="Asignar a zona" 
										appearance="ghost"
										classes="full-width"
										action={()=>onAssignZoneToDriver()}
										disabled={zones.length === 0}
									/>
								)}
								
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
									{getPermission('services_assign_drivers') && (
										<Button 
											title="Asignar a driver" 
											appearance="ghost"
											classes="full-width"
											action={()=>onAssignService()}
										/>
									)}
									
								</Col>
								<Col xs={24} md={12}>
									{getPermission('services_create') && (
										<Button 
											title="Ir a registro" 
											appearance="ghost"
											classes="full-width"
											action={()=>navigate('/services/new')}
										/>
									)}									
								</Col>
							</Col>
						</Col>
					)}
					
				</Col>
			</Grid>

			<ModalConfigureZones 
				loader={loader}
				getData={getZones}
				ref={modalZones}
			/>

			<ModalAssignZonesDrivers 
				loader={loader}
				getData={getDriversUnsigned}
				ref={modalAssignZone}
			/>
		</>
	)
}

export default Home;