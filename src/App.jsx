import { useRef } from 'react';

import SystemState from './context/SystemState';

import Loader from './components/Loader';
import AppRoutes from './AppRoutes';
import ModalResetPassword from './pages/modals/password';

const App = ()=>{
    const loader = useRef();
    const reset = useRef();

    return(
        <SystemState>
            <AppRoutes 
                loader={loader}
                reset={reset}
            />

            <Loader ref={loader} />
            <ModalResetPassword ref={reset} />
        </SystemState>
    );
}

export default App
