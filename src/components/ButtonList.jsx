import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import { GoPasskeyFill } from "react-icons/go";
import { RiLockPasswordLine } from "react-icons/ri";
import { MdManageAccounts } from "react-icons/md";
import { IconButton, Tooltip, Whisper } from "rsuite";

const ButtonList = ({
    controlId,
    title,
    type,
    appearance = 'primary',
    color = 'blue',
    action = ()=>{}
})=>{
    return(
        <Whisper placement="bottom" controlId={controlId} trigger={'hover'} speaker={
            <Tooltip>{title}</Tooltip>
        }>
            <IconButton 
                circle
                size="sm"
                appearance={appearance}
                color={color}
                icon={
                    type === 'edit' ? 
                        <FaPencilAlt />
                    :type === 'assign_permission' ? 
                        <GoPasskeyFill />
                    :type === 'delete' ?
                        <FaTrashAlt />
                    :type === 'reset' ?
                        <RiLockPasswordLine />
                    :type === 'config' ?
                        <MdManageAccounts />
                    : null
                } 
                onClick={()=>action()}
            />
        </Whisper>
    )
}

export default ButtonList;
