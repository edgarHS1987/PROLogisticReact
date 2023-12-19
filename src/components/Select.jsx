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
    return (
        <Select        
            id={id}
            name={id}
            options={options}
            required={required}
            isDisabled={disabled}
            isMulti={multiple}
            value={options.find(obj => obj.value === value)}
            placeholder="Seleccione..."
            onChange={(e)=>handleChange({
                target:{
                    value: e.value,
                    name: id
                }
            })}
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