import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { TFunction, i18n as I18nType } from 'i18next';
import { Link, useNavigate } from "react-router-dom";
import LanguageSelector from "./languageSelector";
import Footer from "./footer.tsx";
import "../styles/home.css"
import ThemeColors from "../utils/themeColors.ts";
import ChangeTheme from "./changeTheme.tsx";
import mainLogo from "../assets/mainLogo.svg"
import upperMoster from "../assets/title.svg"
import loginImg from "../img/util/login.jpeg"
import guestImg from "../img/util/guest.jpeg"
import Loader from "./loader.tsx";
import { ColorRing } from 'react-loader-spinner'
import loggoutIcon from "../assets/loggout.svg"
import loggedOutUSer from "../utils/loggedOut.ts";





interface HomeProps {
    t: TFunction;
    i18n: I18nType;
    theme: boolean;
    setTheme: Dispatch<SetStateAction<boolean>>;
    loggedIn: boolean;
    userName: string | undefined;
    // setLoader: Dispatch<SetStateAction<boolean>>;
    // loader: boolean;
    // isLoading: boolean;
    // setIsLoading: Dispatch<SetStateAction<boolean>>;
    // isMoved: boolean;
    // setIsMoved: Dispatch<SetStateAction<boolean>>;
}
// const Home: React.FC<HomeProps> = ({ t, i18n, theme, setTheme, setLoader, loader, isLoading, isMoved, setIsLoading, setIsMoved }) => {
const Home: React.FC<HomeProps> = ({ t, i18n, theme, setTheme, loggedIn, userName }) => {
    const tS = ThemeColors(theme);


    const [isScrolled, setIsScrolled] = useState(false);
    const [scrollValueY, setscrollValueY] = useState(0);
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(true);
    const [isMoved, setIsMoved] = useState(true);
    const [loaderHome, setLoaderHome] = useState(false);
    const [notAvailableWarning, setNotAvailableWarning] = useState(false);


    useEffect(() => {
        const timer_moved = setTimeout(() => {
            setIsMoved(false)
            console.log('====================================');
            console.log("isMoved:" + isMoved);
            console.log('====================================');
        }, 150)
        const timer = setTimeout(() => {
            setIsLoading(true);
            console.log('====================================');
            console.log("isloading:" + isLoading);
            console.log('====================================');
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
        setLoaderHome(loaderGames => !loaderGames);
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

            <div className={`z-[9999] w-full h-full fixed left-0 flex flex-col justify-center items-center ${isMoved ? tS.LoaderTransitionIn : tS.LoaderTransitionOut} transition-all duration-[550ms] ease-in-out loading-screen ${!isLoading ? "hidden" : ""}`}>
                <ColorRing visible={true}
                    height="80"
                    width="80"
                    ariaLabel="color-ring-loading"
                    wrapperStyle={{}}
                    wrapperClass="color-ring-wrapper"
                    colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']} />
            </div>
            <section id='header' className={`${isScrolled ? theme ? "bg-[#eea8] fixed" : "bg-[#b9b9b995] fixed" : theme ? "bg-[#ffa8] relative" : "bg-[#91919195] relative"} w-full z-[99] flex flex-col-reverse top-0 h-[9rem] py-4 items-center justify-evenly shadow-sm backdrop-blur-[1em] md:h-[6rem] md:flex-row md:justify-between md:items-center md:px-12 md:backdrop-blur-[1px] ${tS.bgColorTopBar} md:transition-all md:duration-[250ms] md:ease-in`}>
                <Link to="/" className="h-[3rem] w-[100%] md:w-[auto] md:h-14 flex flex-row justify-center items-center">
                    <img className="h-[100%]" src={mainLogo} alt="UpperMoster" title="UpperMoster" />
                    <img src={upperMoster} alt="UpperMoster" className={`w-[11rem] md:w-[14rem] invert md:invert-0`} />
                </Link>
                <div className="w-[100%] md:w-[auto] flex md:flex-row items-center justify-between pl-4 pr-1 my-2 md:pr-0 md:pl-0 md:m-0">
                    <Link to="/LoginPage" className={loggedIn ? "pointer-events-none" : ''}><h2 className={`left-0 text-black md:text-white text-[1.1rem] font-semibold`}>{loggedIn ? userName : t('login')}</h2></Link>
                    <div className="flex flex-row items-center">
                        <LanguageSelector i18n={i18n} />
                        <ChangeTheme setTheme={setTheme} theme={theme} />
                        <button onClick={loggedOutUSer} className={`${loggedIn ? "" : "hidden"} hover:bg-red-500 hover:invert mr-2 bg-gradient-to-tr from-[#ff3e] to-[#8e4a] rounded-xl`}><img className="w-10 h-[auto] p-1 border-solid border-[1px] border-purple-950 rounded-xl" src={loggoutIcon} alt="Log out" /></button>
                    </div>
                </div>
            </section >
            <div className={`z-20 ${isScrolled ? "" : "hidden"} bg-transparent h-[8rem] md:h-[6rem] w-full`}></div>
            <div className={`bg-transparent z-10 h-[auto] md:h-[37rem] pb-[2rem] md:pb-[10rem] flex flex-col flex-nowrap justify-evenly items-center transition-all duration-[250ms] ease-linear`}>
                <h1 id="Welcome" className={`${["ru", "kr", "jp"].includes(i18n.language) ? "text-[2.2rem]" : "text-[2.5rem]"} md:text-[4.8em] font-sans font-[900] w-[100%] mt-[4rem] md:mt-[5rem] text-center ${tS.textColor} tracking-tight`} style={{ wordSpacing: `${window.innerWidth > 720 ? "-0.6rem" : "0rem"}` }}>
                    {t('welcome')}
                </h1>
                <h2 className={`${tS.textColor} capitalize ${["ru", "kr", "jp", "fr"].includes(i18n.language) ? "text-[0.55rem]" : "text-[0.65rem]"} md:text-[1rem] tracking-[0.2rem] md:tracking-[0.5rem]`}>{t('motto')}</h2>
                <section className={`w-[100%] h-[20rem] flex flex-col md:flex-row justify-between mt-12 mb-12 md:mb-auto md:justify-evenly items-center md:w-[35rem] md:h-[8rem] ${tS.textColor}`} >
                    {/* <section
                        className={`overflow-hidden rounded-3xl relative tracking-tighter group flex flex-col w-[90%] md:w-[15em] md:h-[8em] h-[9.5em] transition-all duration-[250ms] ease-in`}
                        style={{ boxShadow: `0px 0px 2px 0px ${tS.BW}`, border: `0.1em solid ${tS.borderCol}` }}
                    >
                        <section
                            className={`absolute inset-0 bg-cover bg-center transition-transform duration-[450ms] ease-in-out transform`}
                            style={{ backgroundImage: `url(${loginImg})` }}
                        />
                        <Link
                            to="/"
                            className={`cursor-default flex flex-col justify-center w-[100%] h-[100%] text-[#888] bg-[#222a] backdrop-blur-[0.2em] transition-all duration-[450ms] ease-in-out`}
                            onClick={() => { setNotAvailableWarning(true); setTimeout(() => { setNotAvailableWarning(false) }, 2000) }}
                        >
                            <h1 className='font-bold capitalize pl-2 text-[1.5em] text-center'>{t('login')}</h1>
                            <p className='block capitalize font-extralight mx-2 text-[1.1em] md:text-[0.8em] text-center'>{t('signup')}</p>
                        </Link>
                    </section> */}
                    <section
                        className={` overflow-hidden rounded-3xl relative tracking-tighter group ${loggedIn ? "hidden" : "flex flex-col"} w-[90%] md:w-[15em] md:h-[8em] h-[9.5em] transition-all duration-[250ms] ease-in`}
                        // className={`overflow-hidden rounded-3xl relative tracking-tighter group flex flex-col mb-8 md:mb-0 w-[90%] md:w-[15em] h-[8em] transition-all duration-[250ms] ease-in`}
                        style={{ boxShadow: `0px 0px 2px 0px ${tS.BW}`, border: `0.1em solid ${tS.borderCol}` }}
                    >
                        <section
                            className={`absolute inset-0 bg-cover bg-center transition-transform duration-[450ms] ease-in-out transform ${window.innerWidth < 720 ? ((scrollValueY >= 70 && scrollValueY <= 500) ? "scale-105" : "scale-150") : ""} md:scale-150 md:group-hover:scale-105`}
                            style={{ backgroundImage: `url(${loginImg})` }}
                        />
                        <Link
                            to="/LoginPage"
                            className={`active:bg-[#ee1] active:text-[#110] ${window.innerWidth < 720 ? ((scrollValueY >= 70 && scrollValueY <= 500) ? "bg-[#737a] backdrop-blur-[0em] text-[#fffefe]" : "text-[#ff7d71] bg-[#3a031db6]") : ""} flex flex-col justify-center w-[100%] h-[100%] text-[#ff7d71] hover:text-[#fffefe] bg-[#3a031db6] hover:bg-[#033a] backdrop-blur-[0.2em] hover:backdrop-blur-[0em] transition-all duration-[450ms] ease-in-out`}
                        >
                            <h1 className='font-bold capitalize pl-2 text-[1.5em] text-center'>{t('login')}</h1>
                            <p className='block capitalize font-extralight mx-2 text-[1.1em] md:text-[0.8em] text-center'>{t('signup')}</p>
                        </Link>
                    </section>

                    <section
                        className={`overflow-hidden rounded-3xl relative tracking-tighter group flex flex-col w-[90%] md:w-[15em] md:h-[8em] h-[9.5em] m-[0.4em] transition-all duration-[250ms] ease-in`}
                        style={{ boxShadow: `0px 0px 2px 0px ${tS.BW}`, border: `0.1em solid ${tS.borderCol}` }}
                    >
                        <section
                            className={`absolute inset-0 bg-cover bg-center transition-transform duration-[450ms] ${window.innerWidth < 720 ? ((scrollValueY >= 70 && scrollValueY <= 500) ? "scale-105" : "scale-150") : ""} ease-in-out transform md:scale-150 md:group-hover:scale-105`}
                            style={{ backgroundImage: `url(${guestImg})` }}
                        />
                        <Link
                            to="" className={`active:bg-[#e11] active:text-[#110] ${window.innerWidth < 720 ? ((scrollValueY >= 70 && scrollValueY <= 500) ? "bg-[#773a] backdrop-blur-[0em] text-[#fffefe]" : "text-[#7dff71] bg-[#1d3a03b6]") : ""} flex flex-col justify-center w-[100%] h-[100%] text-[#7dff71] hover:text-[#fffefe] bg-[#1d3a03b6] hover:bg-[#033a] backdrop-blur-[0.2em] hover:backdrop-blur-[0em] transition-all duration-[450ms] ease-in-out`}
                            onClick={() => onLoader("games")}
                        >
                            <h1 className='capitalize font-bold pl-2 text-[1.4em] text-center'>{loggedIn ? t('games') : t('guest')}</h1>
                        </Link>
                    </section>
                </section>
            </div >
            <Loader theme={theme} loader={loaderHome} />
            <Footer t={t} theme={theme} />
        </>
    );
};
export default Home;

