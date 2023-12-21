import Swal from "sweetalert2";
import '../assets/css/toast.css';

const Toast = Swal.mixin({
    toast:true,
    position:'top-right',
    iconColor:'white',
    customClass:{popup:'colored-toast'},
    showConfirmButton:false,
    timer:3000,
});

export default Toast;