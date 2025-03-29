import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { firestore } from '../utils/firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import upperMoster from "../assets/title.svg";
import Loader from './loader';
import { getCookie, setCookie } from '../utils/cookiesManage';
import { t } from 'i18next';
import LanguageSelector from './languageSelector';
import dollars from "../img/util/dollars.jpg"
import ChangeTheme from './changeTheme';
import i18n from '../i18n';
import moment from 'moment-timezone';
import pointLogo from "../assets/pointLogo.svg"
import { AiOutlineUsergroupDelete, } from "react-icons/ai";
import AdScript from './adscript';
import { Link, useNavigate } from 'react-router-dom';
import BackBTn from './backBtn';
import { ColorRing } from 'react-loader-spinner';
import { IoLogoUsd } from "react-icons/io";
import { BsFillPersonXFill } from "react-icons/bs";
import ThemeColors from '../utils/themeColors';

interface LobbyProps {
    setTheme: Dispatch<SetStateAction<boolean>>;
    theme: boolean;
}


const formatDate = (dateString: string, locale: string) => {
    // Parsear la fecha desde el string
    const [day, month, year] = dateString.split('/').map(Number);
    const date = new Date(year, month - 1, day);
  
    // Formatear la fecha usando Intl.DateTimeFormat
    return new Intl.DateTimeFormat(locale).format(date);
  };


const ParticipantsGiftCard: React.FC<LobbyProps> = ({ theme, setTheme }) => {
    const [participants, setParticipants] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [partipantsLength, setParticipantsLength] = useState(parseInt(getCookie('participantsLengt') || '0'));
    const [participantsLimit, setParticipantsLimit] = useState<any[]>([]);
    const [isMoved, setIsMoved] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
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
        setParticipantsLimit(participants);
        const updateNewYorkTime = () => {
            const currentTime = moment.tz("America/New_York");
            // setNewYorkTime(currentTime.format('YYYY-MM-DD HH:mm:ss'));
            // setNewYorkDay(currentTime.format('dddd'));

            const dayOfMonth = currentTime.format('DD');
            const monthOfYear = currentTime.format('MM');

            const dayUpdateTable = getCookie('dayUpdateTable');
            const monthUpdateTable = getCookie('monthUpdateTable');
            const participantsCookies = getCookie('participants');

            if (dayUpdateTable && monthUpdateTable) {
                if (dayUpdateTable !== dayOfMonth || (dayUpdateTable === dayOfMonth && monthUpdateTable !== monthOfYear)) {
                    fetchParticipants();
                    setCookie('dayUpdateTable', dayOfMonth, { expires: 365 });
                    setCookie('monthUpdateTable', monthOfYear, { expires: 365 });
                } else if (participantsCookies) {
                    setParticipants(orderParticipants(JSON.parse(participantsCookies)));
                } else {
                    fetchParticipants();
                }
            } else {
                setCookie('dayUpdateTable', dayOfMonth, { expires: 365 });
                setCookie('monthUpdateTable', monthOfYear, { expires: 365 });
                fetchParticipants();
            }
            setParticipantsLength(participants.length);
            if (partipantsLength > 20) {
                setCookie('participantsLengt', partipantsLength, { expires: 365 });
                setParticipantsLimit(participants.slice(0, 20));
                setCookie('participants', JSON.stringify(participantsLimit), { expires: 365 }); // La cookie expirará en 1 día
            } else {
                setParticipantsLimit(participants);
            }
        };

        // Actualizar la hora y el día al montar el componente
        setTimeout(() => {
            updateNewYorkTime();
        }, 300)
    }, [participants]);

    useEffect(() => {
        if (getCookie('userTheme')) {
            setTheme(getCookie('userTheme') === 'true');
        }
    }, [])

    function manualFetchParticipants() {
        setLoading(true);
        const currentTime = moment.tz("America/New_York");
        // setNewYorkTime(currentTime.format('YYYY-MM-DD HH:mm:ss'));
        // setNewYorkDay(currentTime.format('dddd'));

        const dayOfMonth = currentTime.format('DD');
        const monthOfYear = currentTime.format('MM');

        const dayUpdateTable = getCookie('dayUpdateTable');
        const monthUpdateTable = getCookie('monthUpdateTable');
        const participantsCookies = getCookie('participants');

        fetchParticipants();
        setCookie('dayUpdateTable', dayOfMonth, { expires: 365 });
        setCookie('monthUpdateTable', monthOfYear, { expires: 365 });

        setParticipantsLength(participants.length);
        if (partipantsLength > 20) {
            setCookie('participantsLengt', partipantsLength, { expires: 365 });
            setParticipantsLimit(participants.slice(0, 20));
            setCookie('participants', JSON.stringify(participantsLimit), { expires: 365 }); // La cookie expirará en 1 día
        } else {
            setParticipantsLimit(participants);
        }
        console.log('====================================');
        console.log('AQuii: ', getCookie('participantsLengt'));
        console.log('day: ', dayUpdateTable);
        console.log('month: ', monthUpdateTable);
        console.log('participants: ', participantsCookies);
        console.log('====================================');
    }
    const fetchParticipants = async () => {
        try {
            const participantsRef = collection(firestore, 'participants');
            // Agrega una condición para excluir documentos donde el campo "Email" es igual a "test"
            const qParticipant = query(participantsRef, where("Email", "!=", "test"));
            const querySnapshotParticipant = await getDocs(qParticipant);
    
            if (!querySnapshotParticipant.empty) {
                const participantDocs = querySnapshotParticipant.docs.map(doc => doc.data());
                setParticipants(orderParticipants(participantDocs));
    
                // Guardar los participantes en una cookie
                setLoading(false);
                setCookie('participants', JSON.stringify(participantDocs), { expires: 365 }); // La cookie expirará en 1 año
            } else {
                setParticipants([]);
            }
        } catch (error) {
            console.error("Error fetching participants:", error);
            setParticipants([]);
        } finally {
            setLoading(false);
        }
    };

    const orderParticipants = (participants: any[]) => {
        return participants.sort((a, b) => parseInt(b.Points) - parseInt(a.Points));
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

    const switchLoader = () => {
        setLoading(loading => !loading);
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
                        <Link to='' onClick={() => { onLoader('/') }} className="h-[3rem] w-full md:w-[auto] md:h-14 flex flex-row justify-center items-center">
                            <img src={upperMoster} alt="UpperMoster" className={`w-[11rem] md:w-[14rem] ${theme ? "invert" : "invert-0"}`} />
                        </Link>
                    </div>
                    <section className="md:absolute top-2 right-2 flex flex-row justify-center items-center z-[9999]">
                        <LanguageSelector i18n={i18n} />
                        <ChangeTheme setTheme={setTheme} theme={theme} />
                    </section>

                    <div className={` w-full h-full absolute left-0 transition-all duration-200 ease-in`}><Loader loader={loading} theme={theme} /></div>
                    <section
                        className={`overflow-hidden rounded-full relative tracking-tighter group flex flex-col w-[16em] h-[16em] md:w-[20em] md:h-[20em] m-[0.4em] transition-all duration-[250ms] ease-in`}
                        style={{ boxShadow: `0px 0px 2px 0px ${tS.BW}`, border: `0.1em solid ${tS.borderCol}` }}
                    >
                        <section
                            className={`w-[20em] h-[20em] absolute inset-0 bg-cover bg-center transition-transform duration-[450ms] ease-in-out transform `}
                            style={{ backgroundImage: `url(${dollars})` }}
                        />
                        <Link
                            to=""
                            className={`pointer-events-none flex flex-col justify-center items-center w-[100%] h-[100%]  ${theme?'text-[#6a6a21] bg-[#dd9d]':'text-[#111131] bg-[#166d]'} backdrop-blur-[0.3em] transition-all duration-[450ms] ease-in-out z-[900]`}
                        >
                            <h1 className='font-semibold uppercase pl-2 text-[0.8em] md:text-[1em] text-center mt-5'>{t('prizeNextDraw')}</h1>
                            <h1 className='flex flex-row items-center justify-center font-extrabold uppercase pl-2 text-[6em] -mt-2 text-center'>
                            <IoLogoUsd className='inline-block -mr-3 duration-200 ease-out transition-all' color={`${theme ? '#6a6a21' : '#111139'}`} size={'0.85em'}/>25
                                </h1>
                            <h1 className='font-semibold uppercase pl-2 md:text-[1em] text-[0.8em] text-center'>{formatDate('15/04/2025',i18n.language)}</h1>
                            <h1 className='font-semibold uppercase pl-2 md:text-[1em] text-[0.8em] text-center'>{t('dateNextDraw')}</h1>
                        </Link>
                    </section >
                    <h1 className={`text-center text-[0.85em] px-7 ${theme ? 'text-[#6a6a21]' : 'text-[#3586f2]'}`}>{t('increaseAnnounce')}</h1>

                    {!loading ? (participantsLimit.length > 0) ?

                        <div className={`md:w-[90%] w-[95%] h-full ${theme ? 'bg-[#efefa9]' : 'bg-[#2a6565]'} flex flex-col items-center justify-center rounded-3xl p-2 md:px-8 m-8`}>

                            <div className='pt-8 flex flex-row items-center justify-center'>
                                <h1 className={`capitalize text-center text-[1.8em] md:text-[2.8em] font-bold ${theme ? 'text-[#8a8a41]' : 'text-[#111139]'}`}>
                                    <section className='inline-block'>
                                        <AiOutlineUsergroupDelete size={'1.5em'} color={`${theme ? '#8a8a41' : '#111139'}`} />
                                    </section>
                                    {t('participants')}
                                </h1>
                            </div>
                            <div className={`flex flex-row justify-between items-center h-full ${theme ? 'text-[#8a8a41]' : 'text-[#111139]'} text-center text-[0.95em] md:text-[0.95em] tracking-tight`}>
                                <h1>{t('updateAnnounce')}</h1>
                            </div>
                            <div className={`rounded-2xl w-full py-10`}>
                                <section className={`flex flex-row justify-between w-full h-full ${theme ? 'text-[#8a8a41]' : 'text-[#111139]'}`}>
                                    <section className='w-[10%] text-[1em] md:text-[1.5em] pl-2 md:pl-10'>
                                        <h1 className='capitalize font-semibold'>
                                            {t('position')}
                                        </h1>
                                    </section>
                                    <section className='w-[42%] text-[1em] md:text-[1.5em] border-solid border-l-[1px] border-[#bbb] pl-2 m d:pl-6'>
                                        <h1 className='capitalize font-semibold'>{t('player')}</h1>
                                    </section>
                                    <section className='w-[25%] text-right text-[1em] md:text-[1.5em] border-solid border-l-[1px] border-[#bbb] pl-0 pr-2 md:pr-10'>
                                        <h1 className='capitalize font-semibold'>
                                            {t('uppers')}
                                            <img src={pointLogo} alt="points" className="h-[1.0em] w-auto inline-block" />
                                        </h1>
                                    </section>
                                </section>
                                {
                                    (participantsLimit.length > 0) ? (
                                        <>
                                            {participantsLimit.map((participant, index) => (
                                                <ListParticipants
                                                    theme={theme}
                                                    key={index}
                                                    index={index}
                                                    email={participant.Email}
                                                    points={participant.Points}
                                                    indexLast={participants.length}
                                                />
                                            ))}
                                            {(participants.length > 20)
                                                ?
                                                <section className={`${theme ? 'text-[#435214]' : 'text-[#2dbfd3]'} text-center font-semibold`}>
                                                    +{Math.abs(participants.length - participantsLimit.length)} {t('participants')}
                                                </section> : null
                                            }
                                        </>
                                    ) : (
                                        <div>
                                            <BsFillPersonXFill size={'4em'} color={`${theme ? '#8a8a41' : '#212149'}`} />
                                        </div>
                                    )
                                }
                            </div>
                        </div> :
                        <div className={`md:w-[90%] w-[95%] h-[18em] ${theme ? 'bg-[#efefa9]' : 'bg-[#2a6565]'} flex flex-col items-center justify-center rounded-3xl px-4 md:px-8 m-8`}>
                            <BsFillPersonXFill size={'4em'} color={`${theme ? '#8a8a41' : '#212149'}`} />
                            <h1 className={`${theme ? 'text-[#8a8a41]' : 'text-[#212149]'} md:text-[1.5em] text-[0.84em] uppercase font-bold text-center `}>{t('noParticipants')}</h1>
                        </div> :
                        null
                        // <div className={`fixed w-[100%] h-[100%] top-0 left-0 bottom-0 right-0 m-auto transition-all duration-[250ms] ease-in-out flex flex-col justify-center items-center bg-black z-[99999]`}>
                        //     <ColorRing visible={true}
                        //         height="80"
                        //         width="80"
                        //         ariaLabel="color-ring-loading"
                        //         wrapperStyle={{}}
                        //         wrapperClass="color-ring-wrapper"
                        //         colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']} />
                        // </div>

                    }
                    <button onClick={manualFetchParticipants} className={`hidden rounded-2xl px-4 py-2 text-[1.4em] mb-8 -mt-4 ${theme ? 'bg-[#330] text-[#aa2]' : ''} pointer-events-auto z-[1]`}>{t('update')}</button>
                    <div className='pb-10 text-left px-4'>
                        <div className={`flex flex-row justify-between items-center h-full ${theme ? 'text-[#8a8a41]' : 'text-[#3a8585]'} text-[0.6em] md:text-[0.85em] my-2`}>
                            <h1>* {t('clarification1')}</h1>
                        </div>
                        <div className={`flex flex-row justify-between items-center h-full ${theme ? 'text-[#8a8a41]' : 'text-[#3a8585]'} text-[0.6em] md:text-[0.85em] my-2`}>
                            <h1>* {t('clarification2')}</h1>
                        </div>
                        <div className={`flex flex-row justify-between items-center h-full ${theme ? 'text-[#8a8a41]' : 'text-[#3a8585]'} text-[0.6em] md:text-[0.85em] my-2`}>
                            <h1>* {t('clarification3')}</h1>
                        </div>
                        <div className={`flex flex-row justify-between items-center h-full ${theme ? 'text-[#8a8a41]' : 'text-[#3a8585]'} text-[0.6em] md:text-[0.85em] my-2`}>
                            <h1>* {t('clarification4')}</h1>
                        </div>
                    </div>
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
                </div>
            </div >
            <Loader theme={theme} loader={loading} />
        </>
    );
};

export default ParticipantsGiftCard;

const ListParticipants = ({ index, email, points, indexLast, theme }: { index: number, email: string, points: number, indexLast: number, theme: boolean }) => {

    return (
        <section className={`bg-transparent flex flex-row justify-between w-full h-full text-[0.8em] md:text-[1.2em] font-semibold border-[#bbb] ${index == (indexLast - 1) ? '' : 'border-b-[0.1px]'} ${!theme ? 'text-[#66f5fa]' : 'text-[#5a5a1a]'}`}>
            <section className='w-[10%] py-4 pl-2 md:pl-10'>
                <h1>{index + 1}</h1>
            </section>
            <section className='w-[42%] border-solid border-l-[1px] border-[#bbb] pl-2 py-4'>
                <h1>{formatEmail(email)}</h1>
            </section>
            <section className='w-[25%] py-4 text-right border-solid border-l-[1px] border-[#bbb] pl-2 pr-2 md:pr-10'>
                <h1>{points}</h1>
            </section>
        </section>
    );
};

const formatEmail = (email: string): string => {
    // Separar el email en el nombre de usuario y el dominio
    const [username, domain] = email.split('@');
    if (username.length <= 2) {
        // Si el nombre de usuario tiene 2 caracteres o menos, devolver el email sin cambios
        return email;
    }

    // Tomar los primeros dos caracteres del nombre de usuario
    const visiblePart = username.slice(0, 3);

    // Reemplazar el resto del nombre de usuario con asteriscos
    const maskedPart = '*'.repeat(username.length - 3);

    // Combinar las partes visibles con el dominio
    return `${visiblePart}${maskedPart}@${domain}`;
};
