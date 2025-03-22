import { TFunction } from 'i18next';
import { getCookie, setCookie } from "../utils/cookiesManage"
import { useEffect, Dispatch, SetStateAction } from 'react';

interface CookiesProps {
    t: TFunction;
    theme: boolean;
    acceptedCookies: boolean | null; // o simplemente boolean si nunca será null
    setAcceptedCookies: Dispatch<SetStateAction<boolean>>; // o simplemente boolean si nunca será null
}

const CookieBanner: React.FC<CookiesProps> = ({ t, acceptedCookies, setAcceptedCookies }) => {


    useEffect(() => {
        const storedConsent = getCookie('acceptedCookies');
        if (storedConsent === 'true') {
            setAcceptedCookies(true);
        } else if (storedConsent === 'false') {
            setAcceptedCookies(false);
        }
    }, []);

    const handleAccept = () => {
        setAcceptedCookies(true);
        setCookie('acceptedCookies', 'true', { expires: 365 }); // Cookie válida por un año
    };

    // const handleReject = () => {
    //     setAcceptedCookies(false);
    //     setCookie('acceptedCookies', 'false', { expires: 365 }); // Cookie válida por un año
    // };

    return (
        <>
            {!acceptedCookies && (
                <div className='backdrop-blur-3xl w-[100%] h-full fixed top-0 left-0'>
                </div>
            )}
            {!acceptedCookies && (
                <div className={`absolute "flex flex-col" : "hidden"} justify-center items-center top-[15%] md:top-[20%] left-[10%] md:left-[28%] w-[80%] md:w-[45%] h-[28rem] md:h-[25rem] backdrop-blur-lg md:scr text-white bg-black/20 shadow-[0px_0px_5px_0px_white] p-8 rounded-3xl`}>
                    <section className={`h-[80%] text-[0.8rem] md:text-[0.9rem] text-justify md:px-4 font-light overflow-auto overscroll-none rounded-sm`}>
                        <h1 className='mb-2 text-[1rem] text-start md:text-[1.6rem] font-bold'>{t('cookiestitle')}</h1>
                        <p className='mb-2'>{t('cookiesP1')}</p>
                        <h2 className='mb-2'>{t('cookiesP2')}</h2>
                        <li className='mb-2'>{t('cookiesP3')}</li>
                        <p className='mb-2'>{t('cookiesP4')}</p>
                        <p className='mb-2'>{t('cookiesP5')}</p>
                        <p className='mb-2'>{t('cookiesP6')}</p>
                        <p className='mb-2'>{t('cookiesP7')}</p>
                        <p className='mb-2'>{t('cookiesdate')}</p>
                    </section>
                    <section className={`text-[1.4rem] font-light w-[100%] h-[20%] flex flex-row justify-evenly mt-6 rounded-3xl`}>
                        {/* <button onClick={handleReject} className={`rounded-3xl backdrop-blur-xl w-[48%] md:w-[35%] h-[85%] md:h-[100%] bg-[#afaf0f] hover:bg-[#bfbf02] transition-all duration-[100ms] ease-in`}>Rechazar</button> */}
                        <button onClick={handleAccept} className={`rounded-3xl backdrop-blur-xl w-[48%] md:w-[35%] h-[85%] md:h-[100%] bg-[#22cc22] hover:bg-[#09bf09] transition-all duration-[100ms] ease-in`}>Aceptar</button>
                    </section>
                </div >
            )}
        </>
    )
}

export default CookieBanner;