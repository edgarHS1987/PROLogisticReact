import { useRef } from 'react';

import SystemState from './context/SystemState';

import Loader from './components/Loader';
import AppRoutes from './AppRoutes';

const App = ()=>{
    const loader = useRef();

    return(
        <SystemState>
            <AppRoutes 
                loader={loader}
            />

            <Loader ref={loader} />
        </SystemState>
    );
}

export default App
