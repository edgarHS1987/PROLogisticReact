import { useEffect, useState } from "react";
import { Col, Grid } from "rsuite";
import { FaCar } from "react-icons/fa";

import { zonesAssignDriver, zonesUnsignedDrivers } from "../services/zones";
import { decript, swalAction } from "../libs/functions";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import Toast from "../components/Toast";

const Home = ({loader})=>{
	const navigate = useNavigate();
	const [driverUnsignedZone, setDriverUnsignedZone] = useState([]);

	const onLoad = ()=>{
		getDriversUnsigned();
	}

	const getDriversUnsigned = async ()=>{
		let user_id = decript('user_id');

		let response = await zonesUnsignedDrivers(user_id);
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

	useEffect(()=>{
		onLoad();
	},[]);

	return(
		<>
			<Grid fluid>
				<Col xs={24} className="mt-3">
					{driverUnsignedZone.length > 0 && (
						<Col xs={24} md={6} className="p-2 shadow rounded">
							<Col xs={24} className="flex align-items-center pt-2 pb-2" style={{background:'var(--primary)', color:'#fff'}}>
								<Col xs={24} md={6}>
									<FaCar size={60} />
								</Col>
								<Col xs={24} md={18} className="text-end">
									<span>{driverUnsignedZone.length}</span>
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
					
				</Col>
			</Grid>
		</>
	)
}

export default Home;