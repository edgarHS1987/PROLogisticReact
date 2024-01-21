import { forwardRef, useImperativeHandle, useState } from "react";
import { Col, Divider, Grid, Modal } from "rsuite";
import Button from "../../components/Button";
import { servicesDetails } from "../../services/services";
import moment from "moment";

const ModalDetailServices = forwardRef((props, ref)=>{
    const [open, setOpen] = useState(false);
    const [data, setData] = useState({
        id:'',
        date:'',
        contact_name:'',
        address:'',
        zip_code:'',
        colony:'',
        municipality:'',
        state:'',
        phones:'',
        guide_number:'',
        route_number:'',
        confirmation:'',
        details:[]
    })

    const handleShow = async (id)=>{
        let response = await servicesDetails(id);
        if(response){
            let item = {
                id: response.id,
                date: moment(response.date).format('DD/MM/YYYY'),
                contact_name: response.contact_name,
                address: response.address,
                zip_code: response.zip_code,
                colony: response.colony,
                municipality: response.municipality,
                state: response.state,
                phones: response.phones,
                guide_number: response.guide_number || "",
                route_number: response.route_number || "",
                confirmation: response.confirmation,
                details: response.details.map((detail)=>{
                    let el = {
                        date_time: moment(detail.date).format('DD/MM/YYYY')+' '+moment(detail.time, 'HH:mm:ss').format('HH:mm'),
                        driver: detail.names+' '+detail.lastname1+' '+detail.lastname2,
                        status: detail.status,
                        observations: detail.observations || "",
                        location: details.finish_location || ""
                    };

                    return el;
                })
            }

            setData(item);            

            setOpen(true);
        }
        
    }

    const handleClose = ()=>{
        setOpen(false);
    }

    useImperativeHandle(ref, ()=>({
        handleShow
    }));

    return(
        <Modal open={open} size="md" onClose={handleClose}>
            <Modal.Header>
                Detalles de servicio
            </Modal.Header>
            <Modal.Body>
                <Grid fluid>
                    <Col xs={24} style={{fontSize:12}}>
                        <label className="block">{data.date}</label>
                        <label className="block">{data.confirmation+' - '+data.guide_number+' - '+data.route_number}</label>
                        <label className="block">{data.contact_name+' '+data.phones}</label>
                        <label className="block">
                            {data.address+', '+data.colony+', '+data.zip_code+', '+data.municipality+', '+data.state}
                        </label>
                    </Col>
                    <Col xs={24}>
                        <Divider/>
                    </Col>
                    <Col xs={24}>
                        <table className="table responsive hover">
                            <thead>
                                <tr>
                                    <th>Fecha/hora</th>
                                    <th>Driver</th>
                                    <th>Estatus</th>
                                    <th>Observaciones</th>
                                    <th>Ubicación</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.details.map((detail, i)=>
                                    <tr key={i}>
                                        <td>{detail.date_time}</td>
                                        <td>{detail.driver}</td>
                                        <td>{detail.status}</td>
                                        <td>{detail.observations}</td>
                                        <td>{detail.location}</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </Col>
                </Grid>
            </Modal.Body>
            <Modal.Footer>
                <div className="text-end">
                    <Button title="Cerrar" appearance="ghost" action={()=>handleClose()} />
                </div>
            </Modal.Footer>
        </Modal>
    )
})

export default ModalDetailServices;