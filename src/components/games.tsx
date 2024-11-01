import React, { Dispatch, memo, SetStateAction, useEffect, useState } from "react";
import { TFunction, i18n as I18nType } from 'i18next';
import { Link, useNavigate } from "react-router-dom";
import LanguageSelector from "./languageSelector.tsx";
import Footer from "./footer.tsx";
import "../styles/footer.css"
import "../styles/home.css"
import ThemeColors from "../utils/themeColors.ts";
import ChangeTheme from "./changeTheme.tsx";
import mainLogo from "../assets/mainLogo.svg"
import pointLogo from "../assets/pointLogo.svg"
import loggoutIcon from "../assets/loggout.svg"
import upperMoster from "../assets/title.svg"
import higherlowerImg from "../img/util/higherlowerImg.jpeg"
import quizImg from "../img/util/quizImg.jpeg"
import { ColorRing } from 'react-loader-spinner'
import Loader from "./loader.tsx";
import GuestName from "./guestName.tsx";
import loggedOutUSer from "../utils/loggedOut.ts";




interface LangProps {
    t: TFunction;
    i18n: I18nType;
    theme: boolean;
    setTheme: Dispatch<SetStateAction<boolean>>;
    setGuestName: Dispatch<SetStateAction<string | undefined>>;
    guestName: string | undefined;
    totalPoints: number;
    loggedIn: boolean;
    username: String | undefined;
    userpoints: number;
}
// const Games: React.FC<LangProps> = memo(({ t, i18n, theme, setTheme, isLoading, isMoved, setIsLoading, setIsMoved, loader, setLoader }) => {
const Games: React.FC<LangProps> = memo(({ t, i18n, theme, setTheme, guestName, setGuestName, totalPoints, loggedIn, username, userpoints }) => {
    const tS = ThemeColors(theme);

    const [isScrolled, setIsScrolled] = useState(false);
    const [scrollValueY, setscrollValueY] = useState(0);
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(true);
    const [loaderGames, setLoaderGames] = useState(false);
    const [isMoved, setIsMoved] = useState(true);
    const [notAvailableWarning, setNotAvailableWarning] = useState(false);
    const [editName, setEditName] = useState(false)



    useEffect(() => {
        const timer_moved = setTimeout(() => {
            setIsMoved(false)
        }, 150)
        const timer = setTimeout(() => {
            setIsLoading(true);
        }, 1000); // Cambia 2000 por el tiempo que quieras que la pantalla de carga se muestre en milisegundos

        return () => { clearTimeout(timer_moved); clearTimeout(timer) }; // Limpia el temporizador cuando el componente se desmonte
    }, []);


    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            setscrollValueY(window.scrollY);
            // console.log('====================================');
            // console.log(scrollTop);
            // console.log('====================================');
            if (scrollTop > 0) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const switchLoader = () => {
        setLoaderGames(loaderGames => !loaderGames);
    }

    const onLoader = (route: string) => {
        switchLoader()
        setTimeout(() => {
            navigate(`${route}`);
            switchLoader()
        }, 300);
    }


    return (
        <>
            <div className={`${notAvailableWarning ? "opacity-100 top-[10%] bottom-[80%]" : "opacity-0 top-[15%] bottom-[50%]"} w-max px-4 h-max ${theme ? "bg-[#222a] text-[#fff]" : "bg-[#fffa] text-[#111]"} backdrop-blur-3xl rounded-full text-center fixed z-[99999] m-auto transition-all duration-500 ease-in-out`}>{t('not_available_warning')}</div>

            <div className={`z-[9999] w-full h-full fixed left-0 flex flex-col justify-center items-center ${isMoved ? tS.LoaderTransitionIn : tS.LoaderTransitionOut} transition-all duration-[650ms] ease-in-out loading-screen ${!isLoading ? "hidden" : ""}`}>
                <ColorRing visible={true}
                    height="80"
                    width="80"
                    ariaLabel="color-ring-loading"
                    wrapperStyle={{}}
                    wrapperClass="color-ring-wrapper"
                    colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']} />
            </div>

            {!loggedIn && (<GuestName t={t} guestName={guestName} setGuestName={setGuestName} setEditName={setEditName} />)}

            <section id='header' className={`${isScrolled ? theme ? "bg-[#eea8] fixed" : "bg-[#b9b9b995] fixed" : theme ? "bg-[#ffa8] relative" : "bg-[#91919195] relative"} w-full z-[99] flex flex-col-reverse top-0 ${editName ? "h-[12rem]" : "h-[9rem]"} py-4 items-center justify-evenly shadow-sm backdrop-blur-[1em] md:h-[6rem] md:flex-row md:justify-between md:items-center md:px-12 md:backdrop-blur-[1px] ${tS.bgColorTopBar} md:transition-all md:duration-[250ms] md:ease-in`}>
                <Link to="/" className="h-[3rem] w-[100%] md:w-[auto] md:h-14 flex flex-row justify-center items-center">
                    <img className="h-[100%]" src={mainLogo} alt="UpperMoster" title="UpperMoster" />
                    <img src={upperMoster} alt="UpperMoster" className={`w-[11rem] md:w-[14rem] invert md:invert-0`} />
                </Link>
                <div className="w-[100%] md:w-[auto] h-full flex md:flex-row items-center justify-between pl-4 pr-1 pt-4 pb-2 md:pt-0 md:pb-0 md:pr-0 md:pl-0 md:m-0 ">
                    <section className={`w-max h-max md:h-full flex md:flex-row flex-col items-center`}>
                        {(loggedIn || totalPoints != 0) && (<section className={`${!theme ? "text-white md:text-white" : "text-black md:text-[#ffa]"}  w-full h-full flex flex-row justify-center items-center pl-2 md:pl-4 md:pr-4`}>
                            <h2 className="text-[1.4em]">{loggedIn ? userpoints : totalPoints}</h2>
                            <img src={pointLogo} alt="points" className="h-[1.8em] w-auto md:invert-[1]" />
                        </section>
                        )}
                        <h1 className={`left-0 ${theme ? "text-black md:text-[#eea]" : "text-white"} ${loggedIn ? "pointer-events-none" : ""} text-[1.1rem] font-semibold uppercase cursor-pointer`} onClick={() => setEditName(!editName)}>{loggedIn ? username : guestName}</h1>
                        <button className={`${editName ? "display " : "hidden"} w-max h-max p-2 m-2 rounded-md tracking-widest ${!theme ? "bg-[#338] text-[#ddd]" : "bg-[#ee4]"} font-bold  text-[0.8em] capitalize`} onClick={() => setGuestName('')}>{t('edit')}</button>
                    </section>
                    <div className="flex flex-row items-center">
                        <LanguageSelector i18n={i18n} />
                        <ChangeTheme setTheme={setTheme} theme={theme} />
                        <button onClick={loggedOutUSer} className={`${loggedIn ? "" : "hidden"} hover:bg-red-500 hover:invert mr-2 bg-gradient-to-tr from-[#ff3e] to-[#8e4a] rounded-xl`}><img className="w-10 h-[auto] p-1 border-solid border-[1px] border-purple-950 rounded-xl" src={loggoutIcon} alt="Log out" /></button>
                    </div>
                </div>
            </section >
            <div className={`z-20 ${isScrolled ? "" : "hidden"} bg-transparent h-[9rem] md:h-[6rem] w-full`}></div>
            <div className={`${loggedIn ? "" : guestName === "" ? "hidden" : ""} w-full md:w-auto h-[auto] md:h-[37rem] pb-[2rem] md:pb-[10rem] flex flex-col flex-nowrap justify-evenly items-center transition-all duration-[200ms] ease-linear z-10`}>
                <h1 id="games" className={`${tS.textColor} font-extralight h-[1.7em] w-full text-center tracking-wider text-[3rem] capitalize`}>{t('games')}</h1>
                <div className="w-[95%] mt-4 md:-mt-10 flex flex-col md:flex-row justify-evenly items-center">

                    <section
                        className={`overflow-hidden rounded-3xl relative tracking-tighter group flex flex-col w-[90%] md:w-[15em] h-[8em] m-[0.4em] transition-all duration-[250ms] ease-in`}
                        style={{ boxShadow: `0px 0px 2px 0px ${tS.BW}`, border: `0.1em solid ${tS.borderCol}` }}
                    >
                        <section
                            className={`absolute inset-0 bg-cover bg-center transition-transform duration-[450ms] ease-in-out transform `}
                            style={{ backgroundImage: `url(${quizImg})` }}
                        />
                        <Link
                            to=""
                            className={`flex flex-col justify-center w-[100%] h-[100%] text-[#888] bg-[#222a] backdrop-blur-[0.2em] transition-all duration-[450ms] ease-in-out z-[900]`}
                            onClick={() => { setNotAvailableWarning(true); setTimeout(() => { setNotAvailableWarning(false) }, 2000) }}
                        >
                            <h1 className='font-bold capitalize pl-2 text-[1.5em] text-center'>{t('quiz')}</h1>
                        </Link>
                    </section >
                    {/* <section
                        className={`overflow-hidden rounded-3xl relative tracking-tighter group flex flex-col w-[90%] md:w-[15em] h-[8em] m-[0.4em] transition-all duration-[250ms] ease-in`}
                        style={{ boxShadow: `0px 0px 2px 0px ${tS.BW}`, border: `0.1em solid ${tS.borderCol}` }}
                    >
                        <section
                            className={`absolute inset-0 bg-cover bg-center transition-transform duration-[450ms] ease-in-out transform ${window.innerWidth < 720 ? ((scrollValueY <= 140) ? "scale-105" : "scale-150") : ""} scale-105 group-hover:scale-150`}
                            style={{ backgroundImage: `url(${quizImg})` }}
                        />
                        <Link
                            to=""
                            className={`active:bg-[#1e1] active:text-[#110] ${window.innerWidth < 720 ? ((scrollValueY <= 140) ? "bg-[#303a] backdrop-blur-[0em] text-[#fffefe]" : "text-[#246e13] bg-[#ffffff7c] backdrop-blur-[0.2em]") : ""} flex flex-col justify-center w-[100%] h-[100%] text-[#af2d31] hover:text-[#fffefe] md:bg-[#c4c4c47c] hover:bg-[#303a] backdrop-blur-[0.2em] hover:backdrop-blur-[0em] transition-all duration-[450ms] ease-in-out z-[900]`}
                            onClick={() => onLoader("LoginPage")}
                        >
                            <h1 className='font-bold capitalize pl-2 text-[1.5em] text-center'>{t('quiz')}</h1>
                        </Link>
                    </section > */}

                    <section
                        className={`overflow-hidden rounded-3xl relative tracking-tighter group flex flex-col w-[90%] md:w-[15em] h-[8em] m-[0.4em] transition-all duration-[250ms] ease-in`}
                        style={{ boxShadow: `0px 0px 2px 0px ${tS.BW}`, border: `0.1em solid ${tS.borderCol}` }}
                    >
                        <section
                            className={`absolute inset-0 bg-cover bg-center transition-transform duration-[450ms] ${window.innerWidth < 720 ? ((scrollValueY <= 285) ? "scale-105" : "scale-150") : ""} md:scale-150 ease-in-out transform md:x   group-hover:scale-105`}
                            style={{ backgroundImage: `url(${higherlowerImg})` }}
                        />
                        <Link
                            to="" className={`active:bg-[#1ee] active:text-[#110] ${window.innerWidth < 720 ? ((scrollValueY <= 285) ? "bg-[#773a] backdrop-blur-[0em] text-[#fffefe]" : "text-[#246e13] bg-[#ffffff7c] backdrop-blur-[0.2em]") : ""} flex flex-col justify-center w-[100%] h-[100%] text-[#246e13] hover:text-[#fffefe] md:bg-[#ffffff7c] hover:bg-[#033a] backdrop-blur-[0.2em] hover:backdrop-blur-[0em] transition-all duration-[450ms] ease-in-out z-[900]`}
                            onClick={() => onLoader("higherlower")}
                        >
                            <h1 className='font-bold pl-2 text-[1.4em] text-center capitalize'>{t('higherlower')}</h1>
                        </Link>
                    </section>
                </div >
            </div >
            <Loader theme={theme} loader={loaderGames} />
            <Footer t={t} theme={theme} />
        </>
    );
});
export default Games;