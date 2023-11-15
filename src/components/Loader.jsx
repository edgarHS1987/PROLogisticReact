import React, {forwardRef, useState, useImperativeHandle } from 'react';
import { Grid, Loader as Spin, Col, Modal } from 'rsuite';


const Loader = forwardRef((props, ref)=>{
	const [show, setShow] = useState(false);
	const [title, setTitle] = useState('');

	const handleShow = (title)=>{
		setTitle(title);
		setShow(true);
	}

	const handleClose = ()=>{
		setShow(false);
		setTitle('');
	}

	useImperativeHandle(ref, ()=>({
        handleShow,
		handleClose
    }));

    return(
        show &&
            <Modal open={show} backdrop={true} keyboard={false} size="xs" className='modal-loader'>
                <Modal.Body>
                    <Grid fluid>
                        <div className='flex justify-content-center align-items-center'>
                            <Col xs={24} className="text-center">
                                <Spin size="lg" />

                                <h3 style={{color:'#fff', fontWeight:'bold'}}>{title}</h3>
                            </Col>
                        </div>
                    </Grid>
                </Modal.Body>
            </Modal>
    )

});

export default Loader;