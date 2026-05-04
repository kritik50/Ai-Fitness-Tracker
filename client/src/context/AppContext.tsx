import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { type ActivityEntry, type Credentials, type FoodEntry, type User } from "../types";
import { useNavigate } from "react-router-dom";
import api from "../configs/api";
import toast from "react-hot-toast";
import { AppContext } from "./app-context";
import { getApiErrorMessage } from "../utils/api";

export const AppProvider = ({children} : {children: React.ReactNode})=>{

    const navigate = useNavigate()
    const [user, setUser] = useState<User>(null)
    const [isUserFetched, setIsUserFetched] = useState(localStorage.getItem('token') ? false : true);
    const [onboardingCompleted, setOnboardingCompleted] = useState(false)
    const [allFoodLogs, setAllFoodLogs] = useState<FoodEntry[]>([])
    const [allActivityLogs, setAllActivityLogs] = useState<ActivityEntry[]>([])

    const clearSession = useCallback(() => {
        localStorage.removeItem('token')
        setUser(null)
        setOnboardingCompleted(false)
        setAllActivityLogs([])
        setAllFoodLogs([])
        delete api.defaults.headers.common['Authorization'];
    }, [])

    const signup = useCallback(async (credentials: Credentials)=>{

        try {
            const {data} = await api.post('/api/auth/local/register', credentials)

            setUser({...data.user, token: data.jwt})
            if(data?.user?.age && data?.user?.weight && data?.user?.goal){
                setOnboardingCompleted(true)
            }
            localStorage.setItem('token', data.jwt)
            api.defaults.headers.common['Authorization'] = `Bearer ${data.jwt}`;

        } catch (error: unknown) {
            console.log(error);
            toast.error(getApiErrorMessage(error))
        }
    }, [])

    const login = useCallback(async (credentials: Credentials)=>{
        try {
            const { data } = await api.post('/api/auth/local', {identifier: credentials.email, password: credentials.password})

            setUser({...data.user, token: data.jwt})
            if(data?.user?.age && data?.user?.weight && data?.user?.goal){
                setOnboardingCompleted(true)
            }
            localStorage.setItem('token', data.jwt)
            api.defaults.headers.common['Authorization'] = `Bearer ${data.jwt}`;
        } catch (error: unknown) {
            console.log(error);
            toast.error(getApiErrorMessage(error))
        }
    }, [])

    const fetchUser = useCallback(async (token: string)=>{
        try {
            const { data } = await api.get('/api/users/me', {headers: {Authorization: `Bearer ${token}`}})

            setUser({...data, token})
            if(data?.age && data?.weight && data?.goal){
                setOnboardingCompleted(true)
            }
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            return true;
        } catch (error: unknown) {
            console.log(error);
            clearSession();

            if (axios.isAxiosError(error) && error.response?.status === 401) {
                // Token expired or invalid — silently clear, show Login
                return false;
            }

            // Network error, timeout, or other — clear session and show Login
            // Only toast if it's not a connection error (server might just be starting)
            if (axios.isAxiosError(error) && error.code !== 'ECONNREFUSED' && error.code !== 'ERR_NETWORK') {
                toast.error(getApiErrorMessage(error))
            }
            return false;
        } finally {
            setIsUserFetched(true);
        }
    }, [clearSession])


    const fetchFoodLogs = useCallback(async (token: string)=>{
        try {
            const {data} = await api.get('/api/food-logs', {headers: { Authorization: `Bearer ${token}` }})
            setAllFoodLogs(data)

        } catch (error: unknown) {
            console.log(error);
            toast.error(getApiErrorMessage(error))
        }
    }, [])

    const fetchActivityLogs = useCallback(async (token: string)=>{
        try {
            const {data} = await api.get('/api/activity-logs', {headers: { Authorization: `Bearer ${token}` }})
            setAllActivityLogs(data)
            
        } catch (error: unknown) {
            console.log(error);
            toast.error(getApiErrorMessage(error))
        }
    }, [])

     const logout = useCallback(()=>{
        clearSession();
        navigate('/')
     }, [clearSession, navigate])

    useEffect(()=>{
        const token = localStorage.getItem('token')
        if(token){
            (async ()=>{
                const userLoaded = await fetchUser(token)
                if (userLoaded) {
                    await fetchFoodLogs(token)
                    await fetchActivityLogs(token)
                }
            })();
        }
    },[fetchActivityLogs, fetchFoodLogs, fetchUser])


    const value = {
        user, setUser, isUserFetched, fetchUser,
        signup, login, logout,
        onboardingCompleted, setOnboardingCompleted,
        allFoodLogs, allActivityLogs,
        setAllFoodLogs, setAllActivityLogs
    }

    return <AppContext.Provider value={value}>
        {children}
    </AppContext.Provider>
}
