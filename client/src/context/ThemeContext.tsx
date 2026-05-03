import { useEffect, useState } from "react";
import { ThemeContext } from "./theme-context";

export function ThemeProvider({children}: {children: React.ReactNode}){

    const [theme, setTheme] = useState(()=>localStorage.getItem('theme') || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));

    // Update theme when state changes
    useEffect(()=>{
        const root = window.document.documentElement;
        root.classList.remove('light', "dark");
        root.classList.add(theme)
        localStorage.setItem('theme', theme)
    },[theme])

     const toggleTheme = () => {
        setTheme((prev)=> (prev === 'light' ? 'dark' : "light"))
     }

    return <ThemeContext.Provider value={{theme, toggleTheme}}>
        {children}
    </ThemeContext.Provider>
}
