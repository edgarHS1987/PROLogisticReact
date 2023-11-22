import React from 'react'
import StepsForRegister from './StepsForRegister'
import {Button, Grid, Col, Divider} from 'rsuite';
import Title from '../../components/Title';
import Table from '../../components/Table';

const NewDriver = () => {
  return (
    <Grid fluid className='content'>
            <Grid fluid>
                <Col xs={24} className="mb-2">
                    <Title screen="Drivers" action="Nuevo" />
                </Col>
            </Grid>            
            <Divider style={{marginTop:0}} />
            <Grid fluid>
               <Col xs={24}>
                    <div className='p-4 shadow rounded form-content'>
                        <StepsForRegister
                        />                        
                    </div>                    
                </Col>
            </Grid>   
    </Grid>
  )
}

export default NewDriver
