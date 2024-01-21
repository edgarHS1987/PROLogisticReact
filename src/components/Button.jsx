import {Button as Btn} from "rsuite";
const Button = ({
    title,
    color = 'blue',
    appearance = 'default',
    action = ()=>{},
    classes = '',
    disabled=false
})=>{
    return(
        <Btn 
            title={title}
            appearance={appearance}
            className={classes}
            size="sm"
            color={color}
            onClick={action}
            disabled={disabled}
        >
            {title}
        </Btn>
    )
}

export default Button;