import React, { Dispatch, memo, SetStateAction, useEffect, useState } from "react";
import { TFunction, i18n as I18nType } from 'i18next';
import { Link, useNavigate } from "react-router-dom";
import Footer from "./footer.tsx";
import "../styles/footer.css"
import "../styles/home.css"
import ThemeColors from "../utils/themeColors.ts";
import higherlowerImg from "../img/util/higherlowerImg.jpeg"
import quizImg from "../img/util/quizImg.jpeg"
import tablePosition from "../img/util/positionTable.jpeg"
import { ColorRing } from 'react-loader-spinner'
import Loader from "./loader.tsx";
import GuestName from "./guestName.tsx";
import AdScript from "./adscript.tsx";
import RedeemEmailBox from "./redeemEmail.tsx";
import TopBar from "./topBar.tsx";
import BackBTn from "./backBtn.tsx";



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
const Games: React.FC<LangProps> = memo(({ t, i18n, theme, setTheme, guestName, setGuestName, totalPoints, loggedIn, username, userpoints }) => {
    const tS = ThemeColors(theme);

    const [isScrolled, setIsScrolled] = useState(false);
    const [scrollValueY, setscrollValueY] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [loaderGames, setLoaderGames] = useState(false);
    const [isMoved, setIsMoved] = useState(true);
    const [notAvailableWarning, setNotAvailableWarning] = useState(false);
    const [redeemActive, setRedeemActive] = useState(false);
    const [editName, setEditName] = useState(false)



    const navigate = useNavigate();


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

    const isSupportedBrowser = (): boolean => {
        const userAgent = navigator.userAgent;
        // Detectar Chrome
        const isChrome = /Chrome/.test(userAgent) && /Google Inc/.test(navigator.vendor);
        // Detectar Safari
        const isSafari = /Safari/.test(userAgent) && /Apple Computer/.test(navigator.vendor);
        // Detectar Edge
        const isEdge = /Edg/.test(userAgent);
        // Retornar true si es uno de los navegadores permitidos
        if (/SamsungBrowser/i.test(userAgent)) {
            return false
        } else {
            return isChrome || isSafari || isEdge
        };
    };

    useEffect(() => {
        if (!isSupportedBrowser()) {
            // Redirigir a otra página
            navigate('/unsupported-browser');
            // O mostrar un mensaje
            alert('Su navegador no es compatible con esta aplicación. Por favor, use un navegador diferente.');
        }
    }, [navigate]);


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
            {redeemActive && (<RedeemEmailBox t={t} setRedeemActive={setRedeemActive} />)}

            <BackBTn />
            <TopBar i18n={i18n} theme={theme} setEditName={setEditName} editName={editName} username={username} userpoints={userpoints} setTheme={setTheme} loggedIn={loggedIn} totalPoints={totalPoints} guestName={guestName} setGuestName={setGuestName} t={t} isScrolled={isScrolled} setRedeemActive={setRedeemActive} />
            {(window.innerWidth <= 720) && (<div key={"divfooter1"} className="static invisible bottom-0 left-0 right-0 m-[auto] bg-slate-400">
                <AdScript keyValue={3} atOptions={{
                    'key': '4579ed5f9089da6a442187f2056adfda',
                    'format': 'iframe',
                    'height': 50,
                    'width': 320,
                    'params': {}
                }} />
            </div>)}
            {(window.innerWidth > 720) && (<div key={"divfooter2"} className="static invisible bottom-0 left-0 right-0 m-[auto] bg-slate-400">
                <AdScript keyValue={3} atOptions={{
                    'key': 'f2525a336948ec91dd454fa763b70b78',
                    'format': 'iframe',
                    'height': 90,
                    'width': 728,
                    'params': {}
                }} />
            </div>)}
            <div className={`z-20 ${isScrolled ? "" : "hidden"} bg-transparent h-[12.5rem] md:h-[6rem] w-full`}></div>
            <div className={`${loggedIn ? "" : guestName === "" ? "hidden" : ""} w-full md:w-auto h-[auto] md:h-max pb-[2rem] md:pb-[10rem] flex flex-col flex-nowrap justify-evenly items-center transition-all duration-[200ms] ease-linear z-10`}>
                <h1 id="games" className={`${tS.textColor} font-extralight md:mb-[1.5em] h-[1.7em] w-full text-center tracking-wider text-[3rem] capitalize`}>{t('games')}</h1>
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

                    <section
                        className={`overflow-hidden rounded-3xl relative tracking-tighter group flex flex-col w-[90%] md:w-[15em] h-[8em] m-[0.4em] transition-all duration-[250ms] ease-in`}
                        style={{ boxShadow: `0px 0px 2px 0px ${tS.BW}`, border: `0.1em solid ${tS.borderCol}` }}
                    >
                        <section
                            className={`absolute inset-0 bg-cover bg-center transition-transform duration-[450ms] ${window.innerWidth < 720 ? (!(scrollValueY >= 160 && scrollValueY <= 260) ? "scale-105" : "scale-150") : ""} md:scale-150 ease-in-out transform md:x   group-hover:scale-105`}
                            style={{ backgroundImage: `url(${higherlowerImg})` }}
                        />
                        <Link
                            to="" className={`active:bg-[#1ee] active:text-[#110] ${window.innerWidth < 720 ? (!(scrollValueY >= 160 && scrollValueY <= 260) ? "bg-[#773a] backdrop-blur-[0em] text-[#fffefe]" : "text-[#246e13] bg-[#ffffff7c] backdrop-blur-[0.2em]") : ""} flex flex-col justify-center w-[100%] h-[100%] text-[#246e13] hover:text-[#fffefe] md:bg-[#ffffff7c] hover:bg-[#033a] backdrop-blur-[0.2em] hover:backdrop-blur-[0em] transition-all duration-[450ms] ease-in-out z-[900]`}
                            onClick={() => onLoader("higherlower")}
                        >
                            <h1 className='font-bold pl-2 text-[1.4em] text-center capitalize'>{t('higherlower')}</h1>
                        </Link>
                    </section>
                </div >
                <section
                    className={`overflow-hidden rounded-3xl relative tracking-tighter group flex flex-col w-[85%] md:w-[30em] h-[8em] my-[1.2em] md:my-[2em] transition-all duration-[250ms] ease-in`}
                    style={{ boxShadow: `0px 0px 2px 0px ${tS.BW}`, border: `0.1em solid ${tS.borderCol}` }}
                >
                    <section
                        className={`absolute inset-0 bg-cover bg-center transition-transform duration-[450ms] ${window.innerWidth < 720 ? (!(scrollValueY >= 260 && scrollValueY <= 400) ? "scale-105" : "scale-150") : ""} md:scale-150 ease-in-out transform md:x   group-hover:scale-105`}
                        style={{ backgroundImage: `url(${tablePosition})` }}
                    />
                    <Link
                        to="" className={`active:bg-[#1ee] active:text-[#110] ${window.innerWidth < 720 ? (!(scrollValueY >= 260 && scrollValueY <= 400) ? "bg-[#773a] backdrop-blur-[0em] text-[#fffefe]" : "text-[#642e13] bg-[#ffffff7c] backdrop-blur-[0.2em]") : ""} flex flex-col justify-center w-[100%] h-[100%] text-[#642e13] hover:text-[#fffefe] md:bg-[#ffffff7c] hover:bg-[#033a] backdrop-blur-[0.2em] hover:backdrop-blur-[0em] transition-all duration-[450ms] ease-in-out z-[900]`}
                        onClick={() => onLoader("../uppersAwards")}
                    >
                        <h1 className='font-bold pl-2 text-[1.4em] text-center capitalize'>{t('tableParticipants')}</h1>
                    </Link>
                </section>
            </div >
            <Loader theme={theme} loader={loaderGames} />
            <Footer t={t} theme={theme} />
        </>
    );
});
export default Games;