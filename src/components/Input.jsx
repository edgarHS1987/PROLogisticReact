import PropTypes from 'prop-types';

const Input = ({
    type,
    id,
    value,
    classes = '',
    handleChange = ()=>{},
    required,
    disabled
})=>{
    return (
        <input 
            type={type}
            className={"form-control form-control-sm "+classes}
            name={id}
            id={id}
            value={value}
            onChange={(e)=>handleChange(e)}
            required={required}
            disabled={disabled}
        />
    )
}

export default Input;

Input.defaultProps = {
    type: 'text',
    classes: '',
    handleChange: ()=>{},
    required: false,
    disabled: false
}

Input.prototype = {
    id: PropTypes.string.required
}