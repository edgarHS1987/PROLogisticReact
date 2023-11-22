import React from 'react'
import { Form, Button } from 'rsuite';
import {useForm} from '../../hooks/useForm';
import { Schema } from 'rsuite'

export const NewDriverForm = () => {

  const model = Schema.Model({
    nameDriver: Schema.Types.StringType().isRequired('Este Campo es Requerido')
        .containsLetterOnly('Ingresa un Nombre Valido'),
    last1: Schema.Types.StringType().isRequired('Este Campo es Requerido'),
    last2: Schema.Types.StringType().isRequired('Este Campo es Requerido'),
    phone1: Schema.Types.StringType().isRequired('Este Campo es Requerido'),

    phone2: Schema.Types.StringType().isRequired('Este Campo es Requerido'),

    email: Schema.Types.StringType().isEmail('Ingresa un Email Valido'),

  });

  const {formState,onInputChange,onResetForm} = useForm(
    {
      nameDriver: '',
      email:'',
      last1: '',
      last2: '',
      phone1: '',
      phone2: '',
    }
  );

  const {nameDriver,email,last1,last2,phone1,phone2} = formState;

  const handleChange = (e,event) =>{
    onInputChange(event);
  }

  return (
    <>
      <Form layout="inline" model={model}>
      <Form.Group controlId="namesDriver">
        <Form.ControlLabel>Nombre</Form.ControlLabel>
        <Form.Control 
          name = "nameDriver"
          style={{ width: 160 }} 
          value = {nameDriver}
          onChange={handleChange}
          size="sm"
          />
        <Form.HelpText tooltip>Obligatorio</Form.HelpText>
      </Form.Group>

      <Form.Group controlId="lastname1">
        <Form.ControlLabel>Apellido Paterno</Form.ControlLabel>
        <Form.Control 
          name="last1" 
          style={{ width: 150 }}
          value = {last1}
          onChange={handleChange}
          size="sm"
        />
        <Form.HelpText tooltip>Obligatorio</Form.HelpText>
      </Form.Group>

      <Form.Group controlId="lastname2">
        <Form.ControlLabel>Apellido Materno</Form.ControlLabel>
        <Form.Control 
          name="last2" 
          style={{ width: 150 }} 
          value = {last2}
          onChange={handleChange}
          size="sm"
        />
      </Form.Group>

      <br />

      <Form.Group controlId="MainPhone">
        <Form.ControlLabel>Telefono</Form.ControlLabel>
        <Form.Control 
          name="phone1" 
          style={{ width: 155 }}
          value = {phone1}
          onChange={handleChange}
          size="sm"
        />
        <Form.HelpText tooltip>Obligatorio</Form.HelpText>
      </Form.Group>

      <Form.Group controlId="AditionalPhone">
        <Form.ControlLabel>Telefono Adicional</Form.ControlLabel>
        <Form.Control 
          name="phone2" 
          style={{ width: 150 }} 
          value = {phone2}
          onChange={handleChange}
          size="sm"
        />
      </Form.Group>

      <Form.Group controlId="emailGroup">
        <Form.ControlLabel> Email</Form.ControlLabel>
        <Form.Control 
          name="email" 
          style={{ width: 200 }} 
          value = {email}
          onChange={handleChange}
          size="sm"
        />
        <Form.HelpText tooltip>Obligatorio</Form.HelpText>
      </Form.Group>

      <br />

      <Button color="blue" appearance="primary" type="submit">Guardar</Button>
    </Form>
    </>
  )
}

export default NewDriverForm
