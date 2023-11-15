import React from "react"
import { decript } from "../libs/functions";

import SystemContext from "./SystemContext";

const SystemState = ({children})=>{
    const getPermission = (name)=>{
        let permissions = JSON.parse(decript('permissions'));
    
        let exist = permissions.findIndex(item => item === name);

        return exist !== -1        
    }

    return(
        <SystemContext.Provider value={{
            getPermission
        }}>
            {children}            
        </SystemContext.Provider>
    )

}

export default SystemState;