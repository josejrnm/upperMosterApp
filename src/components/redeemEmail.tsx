import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { TFunction } from 'i18next';
import { redeemPoints } from '../utils/loggedOut.ts';
import { ColorRing } from 'react-loader-spinner'
import { getCookie } from '../utils/cookiesManage.ts';


interface GuestNameProps {
    t: TFunction;
    setRedeemActive: Dispatch<SetStateAction<boolean>>;
}

const RedeemEmailBox: React.FC<GuestNameProps> = ({ t, setRedeemActive }) => {
    const [error, setError] = useState<string>('');
    const [message, setMessage] = useState('');
    const [email, setEmail] = useState('');
    const [loader, setLoader] = useState(false);
    const [theme, setTheme] = useState(false);

    useEffect(() => {
        if (getCookie('userTheme')) {
            setTheme(getCookie('userTheme') === 'true');
        }
    }, [getCookie('userTheme')])

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (!value.includes('@')) {
            setError(t('invalid_mail'));
        } else {
            setError('');
            setEmail(value);
        }
        setEmail(e.target.value)
    };

    const [notEnoughPointsWarning, setNotEnoughPointsWarning] = useState(false);


    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault(); // Evitar el comportamiento por defecto del formulario
        const guestPointsUpdate = parseInt(getCookie('totalPoints') || '0');

        if (guestPointsUpdate >= 1000) {

            if (!error && email.includes('@')) {
                setLoader(true);
                await redeemPoints(false, email.toLowerCase())
                setMessage(t('points_redeemed'));
                setLoader(false);
                window.location.reload();
            } else {
                setMessage(t('invalid_mail'));
                setTimeout(() => { setMessage('') }, 1000);
            }
        } else {
            setNotEnoughPointsWarning(true);
            setTimeout(() => { setNotEnoughPointsWarning(false) }, 2000)
        }
    };


    function hideRedeemBox() {
        setRedeemActive(false)
    }

    return (
        // <div className={`${guestName !== "" ? "hidden" : ""} w-full h-full fixed top-0 left-0  bg-gradient-to-bl from-[#481c1c8e] to-[#032c35d5] backdrop-blur-3xl z-[9998] uppercase`}>
        <div className={` w-full h-full fixed top-0 left-0  bg-gradient-to-bl from-[#481c1c8e] to-[#032c35d5] backdrop-blur-3xl z-[9998] uppercase`}>
            {!loader &&
                <div className={`w-[85%] md:w-[25em] h-max flex flex-col items-center justify-center fixed top-0 bottom-0 left-0 right-0 m-auto rounded-3xl bg-[#fffa] z-[9998]`}>
                    <form onSubmit={handleSubmit} className="px-4 pt-4 md:pt-8 w-full md:h-full flex flex-col justify-center items-center">
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                            <h1 className='py-2 text-[0.9em] text-justify'>
                                {t('redeemEmailWarning')}
                            </h1>
                            <input
                                type="text"
                                value={email}
                                onChange={handleEmailChange}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-xl"
                                required
                            />
                        </label>
                        {error && <p className="text-[#522] text-[0.6em] mb-2 uppercase text-center">{error}</p>}
                        <button
                            type="submit"
                            className="uppercase items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 transition-all duration-300 ease-in-out"
                            disabled={!!error}
                        >
                            {t('redeem')}
                        </button>
                    </form>
                    <button
                        className="uppercase items-center mx-2 m-2 px-4 py-2 border border-transparent text-sm font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 z-[9999] transition-all duration-300 ease-in-out"
                        onClick={hideRedeemBox}
                    >
                        {t('back')}
                    </button>
                    <div className='w-full flex flex-col items-center bg-[#555e] rounded-br-3xl rounded-bl-3xl mt-2 px-6'>
                        <h1 className='text-[0.9em] text-white mt-4 text-center'>
                            *{t('loginForFive')}
                        </h1>
                        <button
                            className="uppercase items-center m-2 mb-2 px-4 py-2 border border-transparent text-sm font-medium rounded-xl text-[#11f] bg-blue-100 hover:bg-blue-300 z-[9999] transition-all duration-300 ease-in-out"
                            onClick={() => { window.location.replace('/LoginPage') }}
                        >
                            {t('login')}
                        </button>
                    </div>
                </div>
            }
            <div className={`${(notEnoughPointsWarning && window.innerWidth > 720) ? "opacity-100 top-[10%] left-0 right-0 m-auto" : (notEnoughPointsWarning && window.innerWidth <= 720) ? "opacity-100 top-[20%] left-0 m-auto right-0" : (!notEnoughPointsWarning && window.innerWidth <= 720) ? "opacity-0 top-[0%] left-0 m-auto right-0" : "opacity-0 top-[0%] left-0 m-auto right-0"} w-max px-2 py-2 h-max ${theme ? "bg-[#222a] text-[#fff]" : "bg-[#fffa] text-[#111]"} backdrop-blur-3xl rounded-full text-center fixed z-[99999] m-auto transition-all duration-500 ease-in-out uppercase text-[0.85em] md:text-[1em]`}>
                {t('insufficient_points')}
            </div>
            {loader &&
                <div className={`absolute rounded-3xl w-[12em] h-[12em] top-0 left-0 bottom-0 right-0 m-auto transition-all duration-[250ms] ease-in-out flex flex-col justify-center items-center bg-black z-[999]`}>
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
        </div>
    );
};

export default RedeemEmailBox;
