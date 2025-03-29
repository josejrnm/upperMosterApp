import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { TFunction, i18n as I18nType } from 'i18next';
import CatSubCat from "./hlCats.tsx";
import Footer from "./footer.tsx";
import "../styles/home.css"
import "../styles/footer.css"
import ThemeColors from "../utils/themeColors.ts"
import HLLogo from "../assets/higherlower.svg"
import Categories from "../data/higherlowercats.json"
import tablePosition from "../img/util/positionTable.jpeg"
import BackBTn from "./backBtn.tsx";
import Loader from "./loader.tsx";
import { ColorRing } from 'react-loader-spinner'
import GuestName from "./guestName.tsx";
import AdScript from "./adscript.tsx";
import RedeemEmailBox from "./redeemEmail.tsx";
import TopBar from "./topBar.tsx";
import { Link, useNavigate } from "react-router-dom";


interface HomeProps {
    t: TFunction;
    i18n: I18nType;
    theme: boolean;
    loader: boolean;
    guestName: string | undefined;
    totalPoints: number;
    loggedIn: boolean;
    username: String | undefined;
    userpoints: number;
    setTheme: Dispatch<SetStateAction<boolean>>;
    setLoader: Dispatch<SetStateAction<boolean>>;
    setGuestName: Dispatch<SetStateAction<string | undefined>>;
}

const HigherLower: React.FC<HomeProps> = ({ t, i18n, theme, setTheme, setLoader, loader, guestName, setGuestName, totalPoints, loggedIn, username, userpoints }) => {
    const tS = ThemeColors(theme);
    const country = Categories[0];
    const [isScrolled, setIsScrolled] = useState(false);
    const [scrollValueY, setscrollValueY] = useState(0);
    const [editName, setEditName] = useState(false)
    const [redeemActive, setRedeemActive] = useState(false);


    const [isLoading, setIsLoading] = useState(true);
    const [isMoved, setIsMoved] = useState(true);


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
    }, [window.scrollY]);

    const switchLoader = () => {
        setLoader(loader => !loader);
    }
    const navigate = useNavigate();

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

            <TopBar i18n={i18n} theme={theme} setEditName={setEditName} editName={editName} username={username} userpoints={userpoints} setTheme={setTheme} loggedIn={loggedIn} totalPoints={totalPoints} guestName={guestName} setGuestName={setGuestName} t={t} isScrolled={isScrolled} setRedeemActive={setRedeemActive} />
            {window.innerWidth <= 720 && (<div key={"divfooter1"} className="static invisible bottom-0 left-0 right-0 m-[auto] bg-slate-400">
                <AdScript keyValue={3} atOptions={{
                    'key': '4579ed5f9089da6a442187f2056adfda',
                    'format': 'iframe',
                    'height': 50,
                    'width': 320,
                    'params': {}
                }} />
            </div>)}
            {window.innerWidth > 720 && (<div key={"divfooter2"} className="static invisible bottom-0 left-0 right-0 m-[auto] bg-slate-400">
                <AdScript keyValue={3} atOptions={{
                    'key': 'f2525a336948ec91dd454fa763b70b78',
                    'format': 'iframe',
                    'height': 90,
                    'width': 728,
                    'params': {}
                }} />
            </div>)}

            <BackBTn />
            <div className={`z-20 ${isScrolled ? "" : "hidden"} bg-transparent h-[8.05rem] md:h-[6rem] w-full`}></div>
            <section className={`h-[200px] text-[2.5em] md:text-[3em]  ${tS.textColor} font-thin flex flex-col justify-center items-center transition-all duration-[250ms] ease-in`}>
                <h1 className={`w-[auto] capitalize ${["ru", "kr", "jp"].includes(i18n.language) ? "text-[0.8em] md:text-[1.2em]" : "text-[1em] md:text-[1.3em]"}`}>
                    {t('higherlower')}<img src={HLLogo} alt='higherlower' className="h-auto w-[1.2em] inline" />
                </h1>
                <h2 className="capitalize text-[0.5em]">
                    {t('um_edition')}
                </h2>
            </section>
            <section className={`w-auto ${tS.textColor}`}>
                <h1 id="Categorie" className={`w-[4em] text-[2.3em] font-extralight md:text-[2.3em] text-center mb-5 capitalize`}>{t(country.name)}</h1>
            </section>
            <div id="Content" className={`w-[100%] flex flex-col mb-6 items-center h-auto z-10`}>
                <div id="Content" className={`w-[100%] flex flex-col mb-6 md:flex-row md:w-[80em] h-auto z-10`}>
                    <ul className="flex flex-col justify-center items-center md:flex-row md:flex-wrap">
                        {country.metrics.map((subcat) => (

                            <CatSubCat key={subcat} i18n={i18n} theme={theme} t={t} subCat={subcat} index={country.metrics.indexOf(subcat)} scrollValueY={scrollValueY} setLoader={setLoader} loader={loader} />
                        ))}
                    </ul>
                </div>
                <section
                    className={`overflow-hidden rounded-3xl relative tracking-tighter group flex flex-col w-[90%] md:w-[30em] h-[10em] my-[1.2em] md:my-[2em] transition-all duration-[250ms] ease-in`}
                    style={{ boxShadow: `0px 0px 2px 0px ${tS.BW}`, border: `0.1em solid ${tS.borderCol}` }}
                >
                    <section
                        className={`absolute inset-0 bg-cover bg-center transition-transform duration-[450ms] ${window.innerWidth < 720 ? ((scrollValueY >= 1700 && scrollValueY <= 1900) ? "scale-150" : "scale-105") : ""} md:scale-105 ease-in-out transform group-hover:scale-105`}
                        style={{ backgroundImage: `url(${tablePosition})` }}
                    />
                    <Link
                        to="" className={`active:bg-[#1ee] active:text-[#110] ${window.innerWidth < 720 ? ((scrollValueY >= 1700 && scrollValueY <= 1900) ? "bg-[#773a] backdrop-blur-[0em] text-[#fffefe]" : "text-[#642e13] bg-[#ffffff7c] backdrop-blur-[0.2em]") : ""} flex flex-col justify-center w-[100%] h-[100%] md:text-[#642e13] hover:text-[#fffefe] md:bg-[#ffffff7c] hover:bg-[#033a] backdrop-blur-[0.2em] hover:backdrop-blur-[0em] transition-all duration-[450ms] ease-in-out z-[900]`}
                        onClick={() => onLoader("../uppersAwards")}
                    >
                        <h1 className='font-bold pl-2 text-[1.4em] text-center capitalize'>{t('tableParticipants')}</h1>
                    </Link>
                </section>
            </div>
            <Loader theme={theme} loader={loader} />
            <Footer t={t} theme={theme} />

        </>
    );
};
export default HigherLower;