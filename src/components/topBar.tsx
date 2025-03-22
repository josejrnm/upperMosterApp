import { Link, useNavigate } from "react-router-dom";
import ChangeTheme from "./changeTheme.tsx";
import mainLogo from "../assets/mainLogo.svg"
import pointLogo from "../assets/pointLogo.svg"
import loggoutIcon from "../assets/loggout.svg"
import upperMoster from "../assets/title.svg"
import { loggedOutUSer } from "../utils/loggedOut.ts";
import ButtonRedeem from "./redeemBtn.tsx";
import { Dispatch, SetStateAction } from "react";
import LanguageSelector from "./languageSelector.tsx";
import { TFunction, i18n as I18nType } from "i18next";
import ThemeColors from "../utils/themeColors.ts";
import { TbUserHexagon } from "react-icons/tb";


interface TopProps {
    t: TFunction;
    i18n: I18nType;
    theme: boolean;
    editName: boolean;
    setEditName: Dispatch<SetStateAction<boolean>>
    setTheme: Dispatch<SetStateAction<boolean>>;
    setGuestName: Dispatch<SetStateAction<string | undefined>>;
    setRedeemActive: Dispatch<SetStateAction<boolean>>;
    guestName: string | undefined;
    totalPoints: number;
    loggedIn: boolean;
    username: String | undefined;
    userpoints: number;
    isScrolled: boolean;
}

const TopBar: React.FC<TopProps> = ({ theme, editName, setEditName, username, userpoints, i18n, totalPoints, loggedIn, setTheme, guestName, setGuestName, t, isScrolled, setRedeemActive }) => {
    const tS = ThemeColors(theme);
    const navigate = useNavigate();

    return (
        <>
            <section id='header' className={`${isScrolled ? theme ? "bg-[#eea8] fixed" : "bg-[#b9b9b995] fixed" : theme ? "bg-[#ffa8] relative" : "bg-[#91919195] relative"} w-full z-[99] flex flex-col-reverse top-0 ${editName ? "h-[13rem]" : "h-[12rem]"} py-4 items-center justify-evenly shadow-sm backdrop-blur-[1em] md:h-[6rem] md:flex-row md:justify-between md:items-center md:px-12 md:backdrop-blur-[1px] ${tS.bgColorTopBar} md:transition-all md:duration-[250ms] md:ease-in`}>
                <Link to="/" className="h-[3rem] w-[100%] md:w-[auto] md:h-14 flex flex-row justify-center items-center">
                    <img className="h-[100%]" src={mainLogo} alt="UpperMoster" title="UpperMoster" />
                    <img src={upperMoster} alt="UpperMoster" className={`w-[11rem] md:w-[14rem] invert md:invert-0`} />
                </Link>
                <div className="w-[100%] md:w-[auto] h-full flex md:flex-row items-center justify-between pl-4 pr-1 pt-0 pb-0 md:pt-0 md:pb-0 md:pr-0 md:pl-0 md:m-0 ">
                    <section className={`w-max h-max md:h-full flex md:flex-row flex-col items-center`}>
                        <div className={`flex ${window.innerWidth > 720 ? "flex-col" : "flex-row"} justify-center items-center`}>
                            <h1 className={`left-0 ${theme ? "text-black md:text-[#eea]" : "text-white"} w-max text-[1.1rem] font-semibold cursor-pointer`} onClick={() => { loggedIn ? navigate('/personal-Account') : setEditName(!editName) }}>
                                <TbUserHexagon className="inline-block mr-1" size={'1.4em'} />
                                {loggedIn ? username : guestName}
                            </h1>
                            <button className={`${editName ? "display " : "hidden"} w-max h-max p-2 m-2 rounded-md tracking-widest ${!theme ? "bg-[#338] text-[#ddd]" : "bg-[#ee4]"} font-bold  text-[0.8em] capitalize`} onClick={() => setGuestName('')}>{t('edit')}</button>
                        </div>
                        {(loggedIn || totalPoints != 0) && (<section className={`${!theme ? "text-white md:text-white" : "text-black md:text-[#ffa]"}  w-full h-full flex ${window.innerWidth > 720 ? "flex-row" : "flex-col"} justify-center items-center pl-2 md:pl-4 md:pr-4`}>
                            <section className="flex flex-row justify-center items-center">
                                <h2 className="text-[1.2em]">{loggedIn ? userpoints : totalPoints}</h2>
                                <img src={pointLogo} alt="points" className="h-[1.5em] w-auto md:invert-[1]" />
                            </section>
                            {(userpoints >= 0 || totalPoints >= 0) && <ButtonRedeem t={t} theme={theme} setRedeemActive={setRedeemActive} />}
                        </section>
                        )}
                    </section>
                    <div className="flex flex-row items-center">
                        <LanguageSelector i18n={i18n} />
                        <ChangeTheme setTheme={setTheme} theme={theme} />
                        <button onClick={loggedOutUSer} className={`${loggedIn ? "" : "hidden"} hover:bg-red-500 hover:invert mr-2 bg-gradient-to-tr from-[#ff3e] to-[#8e4a] rounded-xl`}><img className="w-10 h-[auto] p-1 border-solid border-[1px] border-purple-950 rounded-xl" src={loggoutIcon} alt="Log out" /></button>
                    </div>
                </div>
            </section >
        </>
    )
}

export default TopBar;