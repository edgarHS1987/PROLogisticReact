import React from 'react'
import { useState } from 'react';
import { Steps, Panel, Placeholder, ButtonGroup, Button } from 'rsuite';
import NewDriverForm from './NewDriverForm';
import FiscalDataDriver from './FiscalDataDriver';
import DocsDriverForm from './DocsDriverForm';

const StepsForRegister = () => {
    const [step, setStep] = useState(0);
    
    const onChange = nextStep => {
        setStep(nextStep < 0 ? 0 : nextStep > 3 ? 3 : nextStep);
    };

  const onNext = () => onChange(step + 1);
  const onPrevious = () => onChange(step - 1);

  return (

    <div>
      <Steps current={step}>
        <Steps.Item title="Datos Personales" />
        <Steps.Item title="Datos Fiscales"  />
        <Steps.Item title="Documentacion"  />
        <Steps.Item title="Vehiculo" />
      </Steps>
      <hr />
      <Panel >
        {
          (() => {
            if(step === 0) {
              return(
                <NewDriverForm />
              )
              
            } else if (step === 1) {
              return (
                <FiscalDataDriver />
              )
            } else if (step === 2){
              return (
                <DocsDriverForm />
              )
            } else if (step === 3){
              return (
                <p>Vehiculo</p>
              )
            }
          })()
        }
        
        {/* <Placeholder.Paragraph /> */}
      </Panel>
      <hr />
      <ButtonGroup>
        <Button onClick={onPrevious} disabled={step === 0}>
          Anterior
        </Button>
        <Button onClick={onNext} disabled={step === 3}>
          Siguiente
        </Button>
      </ButtonGroup>
    </div>
  );
}

export default StepsForRegister
