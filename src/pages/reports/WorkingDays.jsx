import React, { useState,useEffect } from 'react'
import { Form, Button,Grid, Col, Divider,DatePicker,Table, Pagination } from 'rsuite';
import Title from '../../components/Title';

export const WorkingDays = () => {

  const [report,setReport] = useState( 'workDays' );
  const {dataSet,isLoading} = useFetchData( report );

  return (
    <>
      <Grid fluid className='content'>
            <Grid fluid>
                <Col xs={24} className="mb-2">
                    <Title screen="Reportes" action="Dias Activos por Driver" />
                </Col>
            </Grid>            
            <Divider style={{marginTop:0}} />
            <Grid fluid>
               <Col xs={24}>
                    <div className='p-4 shadow rounded form-content'>

                      <Form layout="inline">
                        <Form.Group controlId="dateInicial">
                          <Form.ControlLabel>Fecha Inicial</Form.ControlLabel>
                          <DatePicker placeholder="Selecciona Fecha" name="fechaInicio" 
                            style={{ width: 200 }} size="sm"/>
                          <Form.HelpText tooltip>Requerido</Form.HelpText>
                        </Form.Group>

                        <Form.Group controlId="dateFinal">
                          <Form.ControlLabel>Fecha Final</Form.ControlLabel>
                          <DatePicker placeholder="Selecciona Fecha" name="fechaFinal" 
                            style={{ width: 200 }} size="sm"/>
                          <Form.HelpText tooltip>Requerido</Form.HelpText>
                        </Form.Group>

                          <Button appearance="primary">Buscar</Button>
                        
                      </Form>
                        <hr />   

                      <div>
                        <Table height={420} data={data}>
                          <Column width={50} align="center" fixed>
                            <HeaderCell>Id</HeaderCell>
                            <Cell dataKey="id" />
                          </Column>

                          <Column width={100} fixed>
                            <HeaderCell>First Name</HeaderCell>
                            <Cell dataKey="firstName" />
                          </Column>

                          <Column width={100}>
                            <HeaderCell>Last Name</HeaderCell>
                            <Cell dataKey="lastName" />
                          </Column>

                          <Column width={200}>
                            <HeaderCell>City</HeaderCell>
                            <Cell dataKey="city" />
                          </Column>
                          <Column width={200} flexGrow={1}>
                            <HeaderCell>Email</HeaderCell>
                            <Cell dataKey="email" />
                          </Column>
                        </Table>
                        <div style={{ padding: 20 }}>
                          <Pagination
                            prev
                            next
                            first
                            last
                            ellipsis
                            boundaryLinks
                            maxButtons={5}
                            size="xs"
                            layout={['total', '-', 'limit', '|', 'pager', 'skip']}
                            total={defaultData.length}
                            limitOptions={[10, 30, 50]}
                            limit={limit}
                            activePage={page}
                            onChangePage={setPage}
                            onChangeLimit={handleChangeLimit}
                          />
                        </div>
                      </div>                     
                    </div>                    
                </Col>
            </Grid>   
      </Grid>


    </>
  )
}

export default WorkingDays;
