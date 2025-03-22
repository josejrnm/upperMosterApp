import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import upperMoster from "../assets/title.svg";
// import Loader from './loader';
import { getCookie } from '../utils/cookiesManage';
import { t, TFunction } from 'i18next';
import LanguageSelector from './languageSelector';
import ChangeTheme from './changeTheme';
import i18n from '../i18n';
import pointLogo from "../assets/pointLogo.svg"
import AdScript from './adscript';
import { Link, useNavigate } from 'react-router-dom';
import BackBTn from './backBtn';
import { CgProfile } from "react-icons/cg";
import { BiMoneyWithdraw } from "react-icons/bi";
import { MdPublishedWithChanges } from 'react-icons/md';
import ThemeColors from '../utils/themeColors';
import { ColorRing } from 'react-loader-spinner'
import { FaCircleDollarToSlot, FaSort, FaTableList } from "react-icons/fa6";
import { loggedOutUSer, redeemPointsMoney, redeemPointsSorteo, withdrawMoney } from '../utils/loggedOut';
import { CiLogout } from "react-icons/ci";



interface ProfileProps {
    t: TFunction;
    setTheme: Dispatch<SetStateAction<boolean>>;
    theme: boolean;
}

const PersonalAccount: React.FC<ProfileProps> = ({ theme, setTheme }) => {

    const [message, setMessage] = useState('');
    const [storedUserName, setStoredUserName] = useState('');
    const [storedUserPoints, setStoredUserPoints] = useState('');
    const [storedUserEmail, setStoredUserEmail] = useState('');
    const [storedUserProfit, setStoredUserProfit] = useState('');

    const [notEnoughPointsWarning, setNotEnoughPointsWarning] = useState(false);
    const [notEnoughPointsWarningMoney, setNotEnoughPointsWarningMoney] = useState(false);
    const [isMoved, setIsMoved] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [loaddingRedeem, setloaddingRedeem] = useState(false);
    const [insufficientMoney, setInsufficientMoney] = useState(false);
    const [withDrawSet, setWithdrawSet] = useState(false);

    const tS = ThemeColors(theme);


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
        setStoredUserName(getCookie('username') || '');
        setStoredUserPoints(getCookie('userPoints') || '');
        setStoredUserEmail(getCookie('email') || '');
        setStoredUserProfit(getCookie('profit') || ''); 
    }, []);

    useEffect(() => {
        if (getCookie('userTheme')) {
            setTheme(getCookie('userTheme') === 'true');
        }
    }, [getCookie('userTheme')])

    const handleRedeem = async () => {
        setloaddingRedeem(true);
    };

    const navigate = useNavigate();

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
    const logout = () => {
        setIsMoved(true);
        setIsLoading(true);
        loggedOutUSer()
    }

    async function withDraw(){
        if (parseFloat(storedUserProfit) < 10.0) {
            setInsufficientMoney(true);
            setWithdrawSet(false)
            setTimeout(()=>{
                setInsufficientMoney(false)
            },2000)
        }else {
            setloaddingRedeem(false);            
            await withdrawMoney();
            setStoredUserProfit('0');
            setWithdrawSet(true);
            setInsufficientMoney(true);
            setTimeout(()=>{
                setInsufficientMoney(false)
                setWithdrawSet(false);
                window.location.reload();
            },2000)
        }
    }

    return (
        <>
            {/* {redeemActive && (<RedeemEmailBox t={t} setRedeemActive={setRedeemActive} />)} */}

            <div className={`z-[9999] w-full h-full fixed left-0 flex flex-col justify-center items-center ${isMoved ? tS.LoaderTransitionIn : tS.LoaderTransitionOut} transition-all duration-[550ms] ease-in-out loading-screen ${!isLoading ? "hidden" : ""}`}>
                <ColorRing visible={true}
                    height="80"
                    width="80"
                    ariaLabel="color-ring-loading"
                    wrapperStyle={{}}
                    wrapperClass="color-ring-wrapper"
                    colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']} />
            </div>

            <div className={`absolute top-0 left-0 w-full h-full ${theme ? 'bg-[#d4d478]' : 'bg-slate-900'} flex flex-col justify-center items-center`}>
                <BackBTn />
                <div className={`absolute top-0 left-0 w-full h-max ${theme ? 'bg-[#d4d478]' : 'bg-slate-900'} flex flex-col justify-center items-center pb-8`}>
                    <div className="mt-8 z-[9998]">
                        <Link to="/" className="h-[3rem] w-full md:w-[auto] md:h-14 flex flex-row justify-center items-center">
                            <img src={upperMoster} alt="UpperMoster" className={`w-[11rem] md:w-[14rem] ${theme ? "invert" : "invert-0"}`} />
                        </Link>
                    </div>
                    <section className="md:fixed top-2 right-2 flex flex-row justify-center items-center z-[9999]">
                        <LanguageSelector i18n={i18n} />
                        <ChangeTheme setTheme={setTheme} theme={theme} />
                    </section>

                    {/* <div className={` w-full h-full absolute left-0 transition-all duration-200 ease-in`}><Loader loader={loading} theme={theme} /></div> */}


                    <div className={`md:w-[50%] w-[90%] h-max ${theme ? 'bg-[#efefa9]' : 'bg-[#0a4545]'} my-8 flex flex-col items-center justify-center rounded-3xl py-6 px-4 md:px-0`}>
                        <CgProfile className='my-2' size={'8em'} color={`${theme ? '#8a8a41' : '#a1a1f9'}`} />
                        <button onClick={logout} className={`${!loaddingRedeem ? 'opacity-100 max-h-[1000px]  w-[14em] rounded-md p-[6px] my-2 mx-0 md:mx-2 z-[1]' : 'opacity-0 max-h-0 overflow-hidden'} ${theme ? "bg-[#220] text-white hover:bg-[#660] " : "bg-teal-600 text-white hover:bg-teal-800 "} z-[999] transition-all duration-300 ease-out`}>
                            <h1 className="capitalize">
                                <CiLogout className="inline-block mr-1" size={'1.4em'} />
                                {t('logout')}
                            </h1>
                        </button>
                        <div className='md:w-[80%] w-full flex flex-col items-start mt-4'>
                            <h1 className={`${theme ? 'text-[#8a8a41]' : 'text-[#b1b1f9]'} w-full px-2 md:text-[1.1em] py-2 text-[0.9em] flex flex-row font-semibold border-b-solid border-b-[1px] border-b-gray-400`}>
                                <p className='mr-2 capitalize'>{t('username')}:</p>
                                {storedUserName}
                            </h1>
                            <h1 className={`${theme ? 'text-[#8a8a41]' : 'text-[#b1b1f9]'} px-2 w-full md:text-[1.1em] py-2 text-[0.9em] flex items-start justify-start font-semibold border-y-solid border-y-[1px] border-y-gray-400 overflow-hidden text-ellipsis whitespace-nowrap`}>
                                {t('email')}
                                {': '}
                                {storedUserEmail}
                            </h1>
                            <h1 className={`${theme ? 'text-[#8a8a41]' : 'text-[#b1b1f9]'} px-2 w-full md:text-[1.1em] py-2 text-[0.9em] flex flex-row items-start justify-start font-semibold border-y-solid border-y-[1px] border-y-gray-400`}>
                                <p className='mr-2 capitalize'>{t('profit')}:</p>
                                {storedUserProfit}{' $USD'}
                            </h1>
                            <h1 className={`capitalize ${theme ? 'text-[#8a8a41]' : 'text-[#b1b1f9]'} px-2 w-full md:text-[1.1em] py-2 text-[0.9em] flex flex-row font-semibold border-t-solid border-t-[1px] border-t-gray-400`}>
                                <p className='mr-2'>uppers:</p>
                                {storedUserPoints}
                                <img src={pointLogo} alt="points" className={`${!theme?'invert':''} h-[1.6em] w-auto inline-block`} />
                            </h1>
                        </div>

                        <div className={`transition-all duration-300 ease-in w-full ${loaddingRedeem ? 'opacity-100 max-h-[1000px]' : 'opacity-0 max-h-0 overflow-hidden'}`}>
                            <RedeemEmailBox t={t} theme={theme} setloaddingRedeem={setloaddingRedeem} setNotEnoughPointsWarning={setNotEnoughPointsWarning} setNotEnoughPointsWarningMoney={setNotEnoughPointsWarningMoney} storedUserPoints={storedUserPoints} setMessage={setMessage} message={message} />
                        </div>


                        <div className={`${(notEnoughPointsWarning && window.innerWidth > 720) ? "opacity-100 top-[10%]" : (notEnoughPointsWarning && window.innerWidth <= 720) ? "opacity-100 top-[20%] left-0 m-auto right-0" : (!notEnoughPointsWarning && window.innerWidth <= 720) ? "opacity-0 top-[0%] left-0 m-auto right-0" : "opacity-0 top-[0%] left-0 m-auto right-0"} w-max px-2 py-2 h-max ${theme ? "bg-[#222a] text-[#fff]" : "bg-[#fffa] text-[#111]"} backdrop-blur-3xl rounded-full text-center fixed z-[99999] m-auto transition-all duration-500 ease-in-out uppercase text-[0.85em] md:text-[1em]`}>
                            {t('insufficient_points')}
                        </div>
                        <div className={`${(notEnoughPointsWarningMoney && window.innerWidth > 720) ? "opacity-100 top-[10%]" : (notEnoughPointsWarningMoney && window.innerWidth <= 720) ? "opacity-100 top-[20%] left-0 m-auto right-0" : (!notEnoughPointsWarningMoney && window.innerWidth <= 720) ? "opacity-0 top-[0%] left-0 m-auto right-0" : "opacity-0 top-[0%] left-0 m-auto right-0"} w-max px-2 py-2 h-max ${theme ? "bg-[#222a] text-[#fff]" : "bg-[#fffa] text-[#111]"} backdrop-blur-3xl rounded-full text-center fixed z-[99999] m-auto transition-all duration-500 ease-in-out uppercase text-[0.85em] md:text-[1em]`}>
                            {t('insufficient_pointsMoney')}
                        </div>

                        <h1 className={`${insufficientMoney?'opacity-100':'opacity-0'} transition-all duration-200 ease-out mb-2 ${theme ? "text-[#230]" : "text-white "} text-center md:px-40`}>{!withDrawSet?t('needTenDollars'):t('succesfulWithdraw')}</h1>
                        <button onClick={handleRedeem} className={`${!loaddingRedeem ? 'opacity-100 max-h-[1000px] rounded-md p-[6px] w-[14em] mt-6 mx-0 md:mx-2 z-[1]' : 'opacity-0 max-h-0 overflow-hidden'} ${theme ? "bg-[#220] text-white hover:bg-[#660] " : "bg-teal-600 text-white "} transition-all duration-300 ease-out`}>
                            <h1 className="capitalize">
                                <MdPublishedWithChanges className="inline-block mr-1" size={'1.4em'} />
                                {t('redeem')}
                            </h1>
                        </button>
                        <button onClick={() => { navigate('/uppersAwards') }} className={`${!loaddingRedeem ? 'opacity-100 max-h-[1000px] w-[14em] rounded-md p-[6px] my-2 mx-0 md:mx-2 z-[1]' : 'opacity-0 max-h-0 overflow-hidden'} ${theme ? "bg-[#220] text-white hover:bg-[#660] " : "bg-teal-600 text-white "} transition-all duration-300 ease-out`}>
                            <h1 className="capitalize">
                                <FaTableList className="inline-block mr-1" size={'1.4em'} />
                                {t('tableParticipants')}
                            </h1>
                        </button>
                        <button onClick={withDraw} className={`${!loaddingRedeem ? 'opacity-100 max-h-[1000px] w-[14em] rounded-md p-[6px] my-0 mx-0 md:mx-2 z-[1]' : 'opacity-0 max-h-0 overflow-hidden'} ${theme ? "bg-[#220] text-white hover:bg-[#660] " : "bg-teal-600 text-white "} transition-all duration-300 ease-out`}>
                            <h1 className="capitalize">
                                <BiMoneyWithdraw className="inline-block mr-1" size={'1.4em'} />
                                {t('withdraw')}
                            </h1>
                        </button>
                    </div>
                    {/* {loaddingRedeem ? <div className={`fixed w-[100%] h-[100%] top-0 left-0 bottom-0 right-0 m-auto transition-all duration-[250ms] ease-in-out flex flex-col justify-center items-center bg-black z-[99999]`}>
                        <ColorRing visible={true}
                            height="80"
                            width="80"
                            ariaLabel="color-ring-loading"
                            wrapperStyle={{}}
                            wrapperClass="color-ring-wrapper"
                            colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']} />
                        <h1 className='text-white'>{t('redeem')}...</h1>
                    </div> : null} */}
                    {window.innerWidth <= 720 && (<div key={"divfooter1"} className="static bottom-0 left-0 right-0 m-[auto] bg-slate-400">
                        <AdScript keyValue={3} atOptions={{
                            'key': '4579ed5f9089da6a442187f2056adfda',
                            'format': 'iframe',
                            'height': 50,
                            'width': 320,
                            'params': {}
                        }} />
                    </div>)}
                    {window.innerWidth > 720 && (<div key={"divfooter2"} className="static bottom-0 left-0 right-0 m-[auto] bg-slate-400">
                        <AdScript keyValue={3} atOptions={{
                            'key': 'f2525a336948ec91dd454fa763b70b78',
                            'format': 'iframe',
                            'height': 90,
                            'width': 728,
                            'params': {}
                        }} />
                    </div>)}
                    {message && <p className='text-white font-normal md:font-bold md:text-[1.5em] p-4 absolute top-[200%] m-auto h-max w-max bg-gradient-to-tr from-[#52ae39fa] to-[#212bdeb7] backdrop-blur-[2px] rounded-full'>{message}</p>}
                </div>
            </div >
        </>
    );
};

export default PersonalAccount;


interface GuestNameProps {
    t: TFunction;
    setNotEnoughPointsWarning: Dispatch<SetStateAction<boolean>>;
    setNotEnoughPointsWarningMoney: Dispatch<SetStateAction<boolean>>;
    message: string
    setMessage: Dispatch<SetStateAction<string>>;
    setloaddingRedeem: Dispatch<SetStateAction<boolean>>;
    storedUserPoints: string
    theme: boolean;
}

const RedeemEmailBox: React.FC<GuestNameProps> = ({ t, theme, message, setMessage, setloaddingRedeem, setNotEnoughPointsWarning, setNotEnoughPointsWarningMoney, storedUserPoints }) => {
    const [points, setPoints] = useState('');
    const [loader, setLoader] = useState(false);
    const maxValue = parseInt(storedUserPoints);  // Ejemplo de valor máximo permitido
    const minValue = 1000;   // Ejemplo de valor mínimo permitido

    const handlePointsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Verificar si el valor es un número entero positivo
        if (/^\d*$/.test(value)) {
            const numericValue = parseInt(value, 10);

            // Verificar si el valor está dentro del rango permitido
            if (numericValue <= maxValue && numericValue >= minValue) {
                setPoints(numericValue.toString());
            } else if (numericValue > maxValue) {
                setPoints(maxValue.toString());
            } else {
                setPoints(value);
            }
        }
    };

    const handleSubmitSorteo = async (event: React.FormEvent) => {
        event.preventDefault(); // Evitar el comportamiento por defecto del formulario
        if (parseInt(points) >= 1000) {
            setLoader(true);
            await redeemPointsSorteo(points);
            setloaddingRedeem(false);
            setMessage(t('points_redeemed'));
            window.location.reload();
        } else {
            setNotEnoughPointsWarning(true);
            setTimeout(() => { setNotEnoughPointsWarning(false) }, 2000)
        }

    };
    const handleSubmitMoney = async (event: React.FormEvent) => {
        event.preventDefault(); // Evitar el comportamiento por defecto del formulario
        if (parseInt(points) >= 10000) {
            setLoader(true);
            await redeemPointsMoney((parseInt(points) / 100000).toString());
            setloaddingRedeem(false);
            setMessage(t('points_redeemed'));
            window.location.reload();
        } else {
            setNotEnoughPointsWarningMoney(true);
            setTimeout(() => { setNotEnoughPointsWarningMoney(false) }, 2000)
        }

    };

    return (
        <div>
            <div className={`md:w-[65%] p-4 flex flex-col items-center justify-center m-auto rounded-3xl `}>
                <h1 className={`${theme ? 'text-black' : 'text-[#aaf]'} px-10 mb-2 text-center text-[0.8em]`}>{t('canRedeemMoney')}</h1>
                <div className='flex flex-col items-center py-2'>
                    <form className="flex flex-row justify-center items-center h-[3em]">
                        <label className="block text-sm font-medium text-gray-700">
                            <input
                                type="number"
                                value={points}
                                placeholder='UPPERS'
                                onChange={handlePointsChange}
                                className="block p-4 text-[1em] mb-2 w-[20em] border border-gray-300 rounded-3xl focus:rounded-xl"
                                required
                                min={minValue}
                                max={maxValue}
                            />
                        </label>
                    </form>
                    <div className='flex flex-row'>
                        <button
                            className={`uppercase items-center m-2 px-4 py-2 border border-transparent text-sm font-medium rounded-xl ${theme ? 'text-[#aa4] bg-[#550] hover:bg-[#220]' : 'text-[#4aa] bg-[#005] hover:bg-[#002]'}`}
                            onClick={handleSubmitMoney}
                        >
                            <FaCircleDollarToSlot size={'2em'} />
                        </button>
                        <button
                            className={`uppercase items-center m-2 px-4 py-2 border border-transparent text-sm font-medium rounded-xl ${theme ? 'text-[#aa4] bg-[#550] hover:bg-[#220] ' : 'text-[#4aa] bg-[#005] hover:bg-[#002]'}`}
                            onClick={handleSubmitSorteo}
                        >
                            <FaSort size={'2em'} />
                        </button>
                    </div>
                    <h2 className={`${theme ? 'text-black' : 'text-white'} text-[0.7em] text-center`}>{t('redeem1')}</h2>
                    <h2 className={`${theme ? 'text-black' : 'text-white'} text-[0.7em] text-center`}>{t('redeem2')}</h2>
                    <h2 className={`${theme ? 'text-black' : 'text-white'} text-[0.7em] text-center`}>{t('redeem3')}</h2>
                </div>
                {!loader &&
                    <button
                        className="uppercase items-center mx-2 mb-2 px-4 py-2 border border-transparent text-sm font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 z-[9999]"
                        onClick={() => { setloaddingRedeem(false); setLoader(false) }}
                    >
                        {t('cancel')}
                    </button>
                }
            </div>
            {
                loader &&
                <div className={`absolute rounded-3xl w-full h-full top-0 left-0 bottom-0 right-0 m-auto transition-all duration-[250ms] ease-in-out flex flex-col justify-center items-center bg-black z-[999]`}>
                    <ColorRing visible={true}
                        height="80"
                        width="80"
                        ariaLabel="color-ring-loading"
                        wrapperStyle={{}}
                        wrapperClass="color-ring-wrapper"
                        colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']} />
                </div>
            }
            {message && <p className='text-white font-normal md:font-bold md:text-[1.5em] p-4 absolute top-0 bottom-[75%] md:bottom-[85%] m-auto h-max w-max bg-gradient-to-tr from-[#52ae39fa] to-[#212bdeb7] backdrop-blur-[2px] rounded-full'>{message}</p>}
        </div >
    );
};