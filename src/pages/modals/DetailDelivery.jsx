import React, { useState,useEffect } from 'react'
import { Modal, Button, ButtonToolbar, Placeholder,IconButton,Divider } from 'rsuite';
import {forwardRef, useImperativeHandle, useRef} from 'react';
import { FaMapMarker } from "react-icons/fa";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTruck } from '@fortawesome/free-solid-svg-icons';

import GoogleMapReact from 'google-map-react';
const AnyReactComponent = ({ text }) => <div>{text}</div>;

export const DetailDelivery = forwardRef(
  function DetailDelivery( { loader },ref ) {

  const [open, setOpen] = React.useState(false);
  
  useImperativeHandle(ref, () => {
    return {
      handleOpen,
    };
  }, []);  


  const defaultProps = {
    center: {
      lat: 22.09620,
      lng: -100.85838
    },
    zoom: 18
  };


  const handleClose = () => {
    setOpen(false);
    
  }

  const handleOpen = async ( id ) => {
    setOpen(true);
  }

  return (
    <>
        <Modal open={open} onClose={handleClose}>
          <Modal.Header closeButton={true}>
            <Modal.Title> Detalle de la Entrega </Modal.Title>
          </Modal.Header>
          <Divider />
          <Modal.Body>

            <div style={{ height: '400px', width: '550px' }}>
              <GoogleMapReact
                bootstrapURLKeys={{ key: "AIzaSyAbhq-10Dp9VaMq5-91n0lyknIX6-hP_XY" }}
                defaultCenter={defaultProps.center}
                defaultZoom={defaultProps.zoom}
              >
                <FontAwesomeIcon icon ={faTruck} style={{ color: 'green',fontSize: '16px' }}
                  lat={ 22.09620 }
                  lng={ -100.85838 }
                />

              </GoogleMapReact>
            </div>
          </Modal.Body>
          <Modal.Footer>

            {/* <Button appearance="primary" size='xs' onClick={handleClose}>
              Cerrar
            </Button> */}

          </Modal.Footer>
        </Modal>
      {/* </form> */}
    </>
  );
});

export default DetailDelivery;