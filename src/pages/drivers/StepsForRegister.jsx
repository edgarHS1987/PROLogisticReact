import React from 'react'
import { useState } from 'react';
import { Steps, Panel, Placeholder, ButtonGroup, Button } from 'rsuite';
import NewDriverForm from './NewDriverForm';
import FiscalDataDriver from './FiscalDataDriver';
import DocsDriverForm from './DocsDriverForm';
import DocsVehicle from './DocsVehicle';
import '../../assets/css/steps.css';

const StepsForRegister = ({loader}) => {

  const [step, setStep] = useState(0);
  const [idDriver,setIdDriver] = useState(0);
    
  const onChange = nextStep => {
    
    if ( idDriver === undefined || idDriver === 0 ) {
      console.log('no hay driver registrado');
    }else{
      setStep(nextStep < 0 ? 0 : nextStep > 3 ? 3 : nextStep);
    }
    
  };

  const handleIdDriver = (id) =>{
    console.log("id driver actualizado a: " + id);
    setIdDriver(id);
  }

  const onNext = () => onChange(step + 1);
  const onPrevious = () => onChange(step - 1);

  function handleStep( stepPar ){
    onChange( stepPar );
  }

  return (

    <div>
      <Steps current={step} small>
        <Steps.Item title="Datos Personales" onClick={ () => handleStep(0) } className="clickable-button" />
        <Steps.Item title="Datos Fiscales" onClick={ () => handleStep(1) } className="clickable-button" />
        <Steps.Item title="Documentacion"  onClick={ () => handleStep(2) } className="clickable-button" />
        <Steps.Item title="Vehiculo" onClick={ () => handleStep(3) } className="clickable-button" />
      </Steps>
      
      <Panel >
        {
          (() => {
            if(step === 0) {
              return(
                <NewDriverForm handleId = {handleIdDriver} idDriver={idDriver} loader={loader}/>
              )
              
            } else if (step === 1) {
              return (
                <FiscalDataDriver handleId = {handleIdDriver} idDriver={idDriver} loader={loader}/>
              )
            } else if (step === 2){
              return (
                <DocsDriverForm handleId = {handleIdDriver} idDriver={idDriver} loader={loader}/>
              )
            } else if (step === 3){
              return (
                <DocsVehicle handleId = {handleIdDriver} idDriver={idDriver} loader={loader}/>
              )
            }
          })()
        }
        
        {/* <Placeholder.Paragraph /> */}
      </Panel>
      {/* <ButtonGroup>
        <Button onClick={onPrevious} disabled={step === 0}>
          Anterior
        </Button>
        <Button onClick={onNext} disabled={step === 3}>
          Siguiente
        </Button>
      </ButtonGroup> */}
    </div>
  );
}

export default StepsForRegister
