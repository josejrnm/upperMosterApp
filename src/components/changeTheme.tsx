import React from "react";
import { Dispatch, SetStateAction } from "react";
import { setCookie } from "../utils/cookiesManage"
import ThemeColors from "../utils/themeColors";
import { FaRegMoon, FaRegSun } from "react-icons/fa";

interface ChangeThemeProps {
    theme: boolean;
    setTheme: Dispatch<SetStateAction<boolean>>;
}
const ChangeTheme: React.FC<ChangeThemeProps> = ({ setTheme, theme }) => {
    const tS = ThemeColors(theme);
    const toggleTheme = () => {
        setTheme(theme => !theme);
        setCookie('userTheme', !theme, { expires: 365 });
    }
    return (
        <>
            <div className={`flex flex-row w-[3.5rem] h-[2.2rem] shadow-[#004400] shadow-sm ${tS.bgColor} m-2 ${theme ? "pl-[0.1rem]" : "pl-[1.5rem]"} items-center rounded-full cursor-pointer transition-all duration-[250ms] ease-in`} onClick={toggleTheme}>
                <button className={`w-[2rem] h-[2rem] ${tS.bgColor} rounded-full focus:border-0 hover:contrast-125 transition-all duration-200 ease-in`} >

                    <section className={`w-[2rem] h-[2rem] p-1 bg-yellow-400 ${!theme ? "invert" : ""} rounded-full transition-all duration-[250ms] ease-linear`}>
                        {theme && theme ?
                            <FaRegSun size={'1.5em'} />
                            : <FaRegMoon color="blue" size={'1.5em'} />}
                    </section>

                    {/* <img src={tS.themeLogo} alt="Theme" className={`w-[2rem] h-[2rem] p-1 bg-yellow-400 ${!theme ? "invert" : ""} rounded-full transition-all duration-[250ms] ease-linear`} /> */}
                </button >
            </div>
        </>
    )
}


export default ChangeTheme;