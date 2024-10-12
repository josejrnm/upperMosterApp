import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { TFunction, i18n as I18nType } from 'i18next';
import { Link } from "react-router-dom";
import LanguageSelector from "./languageSelector";
import CatSubCat from "./hlCats.tsx";
import Footer from "./footer.tsx";
import "../styles/home.css"
import "../styles/footer.css"
import ThemeColors from "../utils/themeColors.ts";
import ChangeTheme from "./changeTheme.tsx";
import mainLogo from "../assets/mainLogo.svg"
import upperMoster from "../assets/title.svg"
// import arrow from "../assets/arrow.svg"
import HLLogo from "../assets/higherlower.svg"
import Categories from "../data/higherlowercats.json"
import BackBTn from "./backBtn.tsx";
import Loader from "./loader.tsx";
import { ColorRing } from 'react-loader-spinner'






interface HomeProps {
    t: TFunction;
    i18n: I18nType;
    theme: boolean;
    loader: boolean;
    setTheme: Dispatch<SetStateAction<boolean>>;
    setLoader: Dispatch<SetStateAction<boolean>>;
}

const HigherLower: React.FC<HomeProps> = ({ t, i18n, theme, setTheme, setLoader, loader }) => {
    const tS = ThemeColors(theme);
    const country = Categories[0];
    const [isScrolled, setIsScrolled] = useState(false);
    const [scrollValueY, setscrollValueY] = useState(0);

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
    }, []);


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
            <section id='header' className={`${isScrolled ? theme ? "bg-[#eea8] fixed" : "bg-[#b9b9b995] fixed" : theme ? "bg-[#ffa8] relative" : "bg-[#91919195] relative"} w-full z-[99] flex flex-col-reverse top-0 h-[8rem] py-4 items-center justify-evenly shadow-sm backdrop-blur-[1em] md:h-[6rem] md:flex-row md:justify-between md:items-center md:px-12 md:backdrop-blur-[1px] ${tS.bgColorTopBar} md:transition-all md:duration-[250ms] md:ease-in`}>
                <Link to="/" className="h-[3rem] w-[100%] md:w-[auto] md:h-14 flex flex-row justify-center items-center">
                    <img className="h-[100%]" src={mainLogo} alt="UpperMoster" title="UpperMoster" />
                    <img src={upperMoster} alt="UpperMoster" className={`w-[11rem] md:w-[14rem] invert md:invert-0`} />
                </Link>
                <div className="w-[100%] md:w-[auto] flex md:flex-row items-center justify-between pl-4 pr-1 md:pr-0 md:pl-0 md:m-0">
                    <Link to="/LoginPage"><h2 className={`left-0 text-black md:text-white text-[1.1rem] font-semibold`}>{t('login')}</h2></Link>
                    <div className="flex flex-row items-center">
                        <LanguageSelector i18n={i18n} />
                        <ChangeTheme setTheme={setTheme} theme={theme} />
                    </div>
                </div>
            </section >

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
            <div id="Content" className={`w-[100%] flex flex-col mb-6 md:flex-row md:w-[80em] h-auto z-10`}>
                <ul className="flex flex-col justify-center items-center md:flex-row md:flex-wrap">
                    {country.metrics.map((subcat) => (

                        <CatSubCat key={subcat} i18n={i18n} theme={theme} t={t} subCat={subcat} index={country.metrics.indexOf(subcat)} scrollValueY={scrollValueY} setLoader={setLoader} loader={loader} />
                    ))}
                </ul>
            </div>
            <Loader theme={theme} loader={loader} />
            <Footer t={t} theme={theme} />

        </>
    );
};
export default HigherLower;