import { useEffect } from 'react';
import Select from 'react-select';

const SelectField = ({
    options,
    id,
    required,
    disabled,
    handleChange,
    multiple,
    value
})=>{
    useEffect(()=>{
        let index = options.findIndex(obj => obj.value === '');
        if(index === -1){
            options.unshift({value:'', label:'Seleccione...'});
        }
    },[options]);

    
    const customStyles = {
        container:  (provided, state) => ({
            ...provided,
            padding: '0',
            border: '0',
            fontSize: '0.85rem',
        }),
        control:  (provided, state) => ({
            ...provided,
            height: 'calc(1.5em + 0.5rem + 2px)',
            minHeight: 'calc(1.5em + 0.5rem + 2px)',
            fontSize: '0.85rem',
            borderColor: '#d8dbe0',
            boxShadow: 'inset 0 1px 1px rgba(0, 0, 0, 0.075)',
            transition: 'background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
            ':hover': {
                borderColor: state.isFocused ? '#66afe9' : '#d8dbe0',
                boxShadow: state.isFocused ? 
                'inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(102, 175, 233, 0.6)' : 
                'inset 0 1px 1px rgba(0, 0, 0, 0.075)',
            }
        }),
        valueContainer: (provided, state) => ({
            ...provided,
            marginTop: '0',
            marginLeft: '6px',
            padding: '0',
            border: '0',
        }),
        dropdownIndicator: (provided, state) => ({
            ...provided,
            marginTop: '0',
            padding: '0',
            border: '0',
            width: '16px',
        }),
        clearIndicator: (provided, state) => ({
            ...provided,
            marginTop: '0',
            padding: '0',
            border: '0',
            width: '16px',
        }),
        indicatorsContainer: (provided, state) => ({
            ...provided,
            paddingRight: '4px',
            border: '0',
        }),
    }

    return (
        <Select    
            styles={customStyles} 
            id={id}
            name={id}
            options={options}
            required={required}
            isDisabled={disabled}
            isMulti={multiple}
            value={options.find(obj => obj.value === value)}
            placeholder="Seleccione..."
            isClearable={true}
            onChange={(e)=>{                
                handleChange({
                    target:{
                        value: e === null ? '' : e.value,
                        name: id
                    }
                })
            }}
        />
    )
}

export default SelectField;

SelectField.defaultProps = {
    options:[],
    required:false,
    disabled:false,
    multiple:false
}