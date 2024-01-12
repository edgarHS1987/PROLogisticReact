import { useZxing } from "react-zxing";
import success from '../assets/beep.mp3';
import error from '../assets/error.mp3';
import Toast from "./Toast";
const BarcodeScanner = ({
    onAddService,
    loader
})=>{
    
    let audioSuccess = new Audio(success);
    let audioError = new Audio(error);

    const {ref} = useZxing({
        onDecodeResult(result){
            onScan(result)
        }
    });

    const onScan = async (result)=>{
        await loader.current.handleShow('Cargando...');
        let scanText = result.getText();
        let arrayScan = scanText.split('|');
        
        /*solo estafeta*/
        let data = {
            date: moment().format('YYYY-MM-DD'),
            time: moment().format('HH:mm:ss'),
            guide_number:'',
            route_number:'',
            confirmation: arrayScan[0],
            contact_name: arrayScan[11],
            address: arrayScan[12],
            zip_code: arrayScan[7],
            colony: arrayScan[13],
            state: arrayScan[14],
            municipality: arrayScan[15],
            phone: arrayScan[16]
        }        

        if(arrayScan.length < 30){
            await audioError.play();
            Toast.fire('Error', 'Formato no valido', 'error');
        }else{
            await audioSuccess.play();
            await onAddService(data);            
        }

        await loader.current.handleClose();       
        
    }

    return(
        <div id="scanner" style={{border:'1px solid', height:window.innerHeight - 340}}>
            <div className="flex justify-content-center mt-2">
                <video ref={ref} style={{width:window.innerWidth - 60, height:'100%'}} />
            </div>
        </div>
    )
}

export default BarcodeScanner;