import {Button as Btn} from "rsuite";
const Button = ({
    title,
    color = 'blue',
    appearance = 'default',
    action = ()=>{},
    classes = ''
})=>{
    return(
        <Btn 
            title={title}
            appearance={appearance}
            className={classes}
            size="sm"
            color={color}
            onClick={action}
        >
            {title}
        </Btn>
    )
}

export default Button;