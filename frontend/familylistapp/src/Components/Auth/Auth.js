import { getCurrentUser } from 'aws-amplify/auth';
import { useEffect } from 'react';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
export default function AuthRoute({ children }) {
    const [isAuth, setisAuth] = useState(false);

    let navigate = useNavigate();
    useEffect(() => {
        checkAuth();
    }, [])
    const checkAuth = async () => {
        try {
            await getCurrentUser();
        } catch (e) {
            console.log(e);
            navigate('/login');
        }
    }

    return children;
};