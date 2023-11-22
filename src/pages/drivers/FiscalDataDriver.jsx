import React from 'react'
import { Form, Button } from 'rsuite';

export const FiscalDataDriver = () => {
  return (
    <>
      
      <Form layout="inline">

      <Form.Group controlId="RFCLine">
        <Form.ControlLabel>RFC</Form.ControlLabel>
        <Form.Control name="RFC" style={{ width: 210 }} 
          size="sm"/>
        <Form.HelpText tooltip>Obligatorio</Form.HelpText>
      </Form.Group>

      <br />

      <Form.Group controlId="address1">
        <Form.ControlLabel>Calle</Form.ControlLabel>
        <Form.Control name="Street" style={{ width: 200 }} 
          size="sm"/>
        <Form.HelpText tooltip>Obligatorio</Form.HelpText>
      </Form.Group>

      <Form.Group controlId="number1">
        <Form.ControlLabel>Numero Exterior</Form.ControlLabel>
        <Form.Control name="ExtNumber" style={{ width: 125 }} 
          size="sm"/>
        <Form.HelpText tooltip>Obligatorio</Form.HelpText>
      </Form.Group>

      <Form.Group controlId="number2">
        <Form.ControlLabel>Numero Interior</Form.ControlLabel>
        <Form.Control name="IntNumber" style={{ width: 125 }} 
          size="sm"/>
      </Form.Group>

      <br />

      <Form.Group controlId="CP">
        <Form.ControlLabel>Codigo Postal</Form.ControlLabel>
        <Form.Control name="Zip" style={{ width: 130 }} 
          size="sm"/>
        <Form.HelpText tooltip>Obligatorio</Form.HelpText>
      </Form.Group>

      <Form.Group controlId="Col">
        <Form.ControlLabel>Colonia</Form.ControlLabel>
        <Form.Control name="coloniaA" style={{ width: 200 }} 
          size="sm"/>
        <Form.HelpText tooltip>Obligatorio</Form.HelpText>
      </Form.Group>

      <Form.Group controlId="munD">
        <Form.ControlLabel>Municipio</Form.ControlLabel>
        <Form.Control name="city" style={{ width: 180 }} 
          size="sm"/>
        <Form.HelpText tooltip>Obligatorio</Form.HelpText>
      </Form.Group>

      <br />

      <Form.Group controlId="stateD">
        <Form.ControlLabel>Estado</Form.ControlLabel>
        <Form.Control name="state" style={{ width: 185 }} 
          size="sm"/>
        <Form.HelpText tooltip>Obligatorio</Form.HelpText>
      </Form.Group>

      <Form.Group controlId="countryD">
        <Form.ControlLabel>Pais</Form.ControlLabel>
        <Form.Control name="country" style={{ width: 150 }} 
          size="sm"/>
        <Form.HelpText tooltip>Obligatorio</Form.HelpText>
      </Form.Group>

      <br />

      <Button color="blue" appearance="primary">Guardar</Button>
    </Form>
    </>
  )
}

export default FiscalDataDriver
