import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { checkAdBlock } from 'adblock-checker';
import { getCookie } from "./utils/cookiesManage";
import CookieBanner from "./components/cookiesPolicy";
import Home from './components/home';
import Games from './components/games';
import './App.css'
import IconAlert from './components/iconAlert';
import HigherLower from './components/higherLower';
import ThemeColors from "./utils/themeColors.ts";
import ScrollToTop from './components/scrollTop.tsx';
import HigherLowerGameApp from './components/higherlowerGameApp.tsx';
// import Loader from "./components/loader.tsx";



function App() {
  const { t, i18n } = useTranslation();
  const [theme, setTheme] = useState(true);
  const [loader, setLoader] = useState(false);
  const [acceptedCookies, setAcceptedCookies] = useState<boolean | null>(null);
  const [isAdblockEnabled, setIsAdblockEnabled] = useState(false);
  // const location = useLocation();
  const tS = ThemeColors(theme)


  useEffect(() => {
    const storedLanguage = getCookie('userLanguage');
    const storedTheme = getCookie('userTheme');
    const checkAdblocker = async () => {
      const isEnabled = await checkAdBlock();
      setIsAdblockEnabled(isEnabled);
    };
    if (storedLanguage) {
      i18n.changeLanguage(storedLanguage);
    }
    if (storedTheme) {
      setTheme(storedTheme === 'true'); // Convertir la cadena a booleano
    }
    checkAdblocker();
  }, []);

  return (
    <Router>
      <div className={`App ${isAdblockEnabled || !acceptedCookies ? "hidden" : ""} ${tS.bgColor} flex flex-col justify-center items-center transition-all duration-[250ms]`}>
        <ScrollToTop />
        {/* <Loader theme={theme} loader={loader} /> */}
        <Routes>

          <Route path='/' element={<Home t={t} i18n={i18n} theme={theme} setTheme={setTheme} />} />
          {/* <Route path='/' element={<Home t={t} i18n={i18n} theme={theme} setTheme={setTheme} setLoader={setLoader} loader={loader} isLoading={isLoading} isMoved={isMoved} setIsLoading={setIsLoading} setIsMoved={setIsMoved} />} /> */}

          {/* <Route path='games' element={<Games t={t} i18n={i18n} theme={theme} setTheme={setTheme} isLoading={isLoading} isMoved={isMoved} setIsLoading={setIsLoading} setIsMoved={setIsMoved} loader={loader} setLoader={setLoader} />} /> */}
          <Route path='games' element={<Games t={t} i18n={i18n} theme={theme} setTheme={setTheme} />} />

          <Route path='/games/higherlower' element={<HigherLower t={t} i18n={i18n} theme={theme} setTheme={setTheme} loader={loader} setLoader={setLoader} />} />

          {/* <Route path={`/games/higherlower/App`} element={<HigherLowerGameApp t={t} theme={theme} isLoading={isLoading} isMoved={isMoved} setIsLoading={setIsLoading} setIsMoved={setIsMoved} />} /> */}
          <Route path={`/games/higherlower/App`} element={<HigherLowerGameApp t={t} theme={theme} />} />

        </Routes>
        <h6 className={`fixed bottom-0 right-2 ${tS.textColor} font-extralight text-[0.8em] tracking-widest`}>v1.8.1</h6>
      </div >

      <div className={`${isAdblockEnabled ? "hidden" : ""} w-full h-full`}>
        <div className={`${acceptedCookies ? "hidden" : ""}`}>
          <CookieBanner t={t} theme={theme} acceptedCookies={acceptedCookies} setAcceptedCookies={setAcceptedCookies} />
        </div>
        {
          isAdblockEnabled && (<div className='fixed top-0 left-0 w-[100%] h-[100%] bg-gradient-to-b from-[#2f0209] to-[#a00a00] overflow-auto overscroll-none text-white text-justify px-4 md:px-[20rem] flex flex-col justify-center items-center'>
            <IconAlert />
            <h1 className='text-[1.4rem] font-bold text-center'>{t('adblockerdetected')}</h1><br />
            <p>{t('adblockerdetected1')}</p><br />
            <p>{t('adblockerdetected2')}</p>
          </div>
          )
        }
      </div >
    </Router >
  )
}

export default App