import { AuthContext } from "../context/AuthContext.jsx";
import { useContext } from "react";

export const useAuthContext = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuthContext must be used within an AuthContextProvider');
    }

    //console.log('Context in useAuthContext:', context);

    return context;
}
