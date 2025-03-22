import { BrowserRouter as Router, Routes, Route, Navigate, } from 'react-router-dom';
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
import CompanyInfo from './components/companyInfo.tsx';
import SignupForm from './components/loginPage.tsx';
import ParticipantsGiftCard from './components/participantsLobby.tsx';
import RulesClarifications from './components/rulesClarifications.tsx';
import UnsupportedBrowser from './components/noSupportedBrowser.tsx';
import PersonalAccount from './components/personalAccount.tsx';
import ProtectedRoute from './components/protectedRoute.tsx';



function App() {
  const { t, i18n } = useTranslation();
  const [theme, setTheme] = useState(true);
  const [isAdblockEnabled, setIsAdblockEnabled] = useState(false);
  const [guestName, setGuestName] = useState<string | undefined>('')
  const [totalPoints, setTotalPoints] = useState<number>(parseInt(getCookie('totalPoints') || "0"));
  const [loggedIn, setLoggedIn] = useState(false);
  const [userName, setUserName] = useState<string | undefined>(getCookie('username') || '');
  const [userPoints, setUserPoints] = useState<number>(parseInt(getCookie('userPoints') || "0"));



  // const location = useLocation();
  const tS = ThemeColors(theme)

  useEffect(() => {
    const storedLanguage = getCookie('userLanguage');
    const storedTheme = getCookie('userTheme');
    const storedGuestName = getCookie('guestName');
    const storedTotalPoints = getCookie('totalPoints');
    const storedLoggedin = getCookie('loggedin');
    const storedUserName = getCookie('username');
    const storedUserPoints = getCookie('userPoints');
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
    if (storedGuestName) {
      setGuestName(storedGuestName)
    }
    if (storedTotalPoints) {
      setTotalPoints(parseInt(storedTotalPoints))
    }
    if (storedLoggedin) {
      setLoggedIn(storedLoggedin === 'true'); // Convertir la cadena a booleano
    }
    if (storedUserName) {
      setUserName(storedUserName)
    }
    if (storedUserPoints) {
      setUserPoints(parseInt(storedUserPoints))
    }
    checkAdblocker();
  }, []);
  const [loader, setLoader] = useState(false);
  const [delayHandler, setDelayHandler] = useState(true)
  const [acceptedCookies, setAcceptedCookies] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setDelayHandler(false);
    }, 120); // Cambia 2000 por el tiempo que quieras que la pantalla de carga se muestre en milisegundos

    return () => { clearTimeout(timer) }; // Limpia el temporizador cuando el componente se desmonte
  }, []);



  return (
    <Router>
      <div className={`App ${isAdblockEnabled || !acceptedCookies ? "hidden" : ""} ${tS.bgColor} flex flex-col justify-center items-center transition-all duration-[250ms]`}>
        <ScrollToTop />

        <Routes>
          <Route path='/' element={<Home t={t} i18n={i18n} theme={theme} setTheme={setTheme} loggedIn={loggedIn} userName={userName} />} />
          <Route path='games' element={<Games t={t} i18n={i18n} theme={theme} setTheme={setTheme} guestName={guestName} setGuestName={setGuestName} totalPoints={totalPoints} loggedIn={loggedIn} username={userName} userpoints={userPoints} />} />
          <Route path='/games/higherlower' element={<HigherLower t={t} i18n={i18n} theme={theme} setTheme={setTheme} loader={loader} setLoader={setLoader} guestName={guestName} setGuestName={setGuestName} totalPoints={totalPoints} loggedIn={loggedIn} username={userName} userpoints={userPoints} />} />
          <Route path='/games/higherlower/App' element={<HigherLowerGameApp t={t} theme={theme} totalPoints={totalPoints} setTotalPoints={setTotalPoints} userPoints={userPoints} setUserPoints={setUserPoints} loggedIn={loggedIn} />} />
          <Route path='/uppersAwards' element={<ParticipantsGiftCard theme={theme} setTheme={setTheme} />} />

          <Route
            path='/personal-Account'
            element={
              <ProtectedRoute loggedIn={loggedIn} redirectPath='/LoginPage'>
                <PersonalAccount t={t} theme={theme} setTheme={setTheme} />
              </ProtectedRoute>
            }
          />

          <Route
            path='/LoginPage'
            element={
              <ProtectedRoute loggedIn={!loggedIn} redirectPath='/personal-Account'>
                <SignupForm t={t} theme={theme} />
              </ProtectedRoute>
            }
          />


          {/* {loggedIn ? <Route path='/personal-Account' element={<PersonalAccount theme={theme} setTheme={setTheme} />} /> : <Route path='/LoginPage' element={<SignupForm t={t} theme={theme} />} />} */}
          <Route path='/companyInfo' element={<CompanyInfo t={t} theme={theme} setTheme={setTheme} />} />
          <Route path='/rules&clarifications' element={<RulesClarifications t={t} theme={theme} setTheme={setTheme} />} />
          <Route path="*" element={<Navigate to="/" />} />
          <Route path="/unsupported-browser" element={<UnsupportedBrowser />} />
        </Routes>
        <h6 className={`fixed bottom-0 right-2 ${tS.textColor} w-max h-max p-[0.2em] text-center backdrop-blur-sm bg-[#aaa7] rounded-full font-extralight text-[0.8em] tracking-widest`}>v1.14.1</h6>
      </div >

      {
        !acceptedCookies && (<div className={`${isAdblockEnabled || delayHandler ? "hidden" : ""} w-full h-full z-[999]`}>
          <div>
            <CookieBanner t={t} theme={theme} acceptedCookies={acceptedCookies} setAcceptedCookies={setAcceptedCookies} />
          </div>
        </div >
        )
      }
      {
        isAdblockEnabled && (<div className='fixed top-0 left-0 w-[100%] h-[100%] bg-gradient-to-b from-[#2f0209] to-[#a00a00] overflow-auto overscroll-none text-white text-justify px-4 md:px-[20rem] flex flex-col justify-center items-center'>
          <IconAlert />
          <h1 className='text-[1.4rem] font-bold text-center'>{t('adblockerdetected')}</h1><br />
          <p>{t('adblockerdetected1')}</p><br />
          <p>{t('adblockerdetected2')}</p>
        </div>
        )
      }
    </Router >
  )
}

export default App

