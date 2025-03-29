import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TFunction } from 'i18next';
import { firestore } from '../utils/firebaseConfig';
import { collection, getDocs, query, where, addDoc } from 'firebase/firestore';
import bcrypt from 'bcryptjs';
import { getCookie, setCookie } from "../utils/cookiesManage"
import { ColorRing } from 'react-loader-spinner'
import Loader from "./loader.tsx";
import ThemeColors from "../utils/themeColors.ts";
import AdScript from './adscript.tsx';
import { IoMailOutline } from "react-icons/io5";
import { RiLockPasswordLine } from "react-icons/ri";
import { FaRegUser } from "react-icons/fa";


interface formProps {
    t: TFunction;
    theme: boolean;
}

const SignupForm: React.FC<formProps> = ({ t, theme }) => {

    const tS = ThemeColors(theme);


    const [email, setEmail] = useState('');
    const [emailUsername, setEmailUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confimrPassword, setConfirmPassword] = useState('');
    const [username, setUsername] = useState('');
    const [message, setMessage] = useState('');
    const [loginSignup, setLoginSignup] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [passwordValid, setPasswordValid] = useState(true);
    const [loaderGames, setLoaderGames] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isMoved, setIsMoved] = useState(true);



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

    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;

        // Expresión regular para permitir solo letras, números y guiones bajos
        const regex = /^[a-zA-Z0-9_]*$/;

        // Verificar si el valor coincide con la expresión regular
        if (regex.test(value)) {
            setUsername(value); // Solo actualizar si es válido
        }
    };
    const handleShowPasswordChange = () => setShowPassword(!showPassword); // Alternar la visibilidad de la contraseña
    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
    const handleEmailUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => setEmailUsername(e.target.value);


    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setPassword(value); // Actualiza el estado con el valor actual

        // Expresión regular para verificar los criterios de la contraseña
        const passwordCriteria = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        // Verificar si la contraseña cumple con los criterios
        if (passwordCriteria.test(value)) {
            setPasswordValid(true); // Cambia a verdadero si es válida
        } else {
            setPasswordValid(false); // Cambia a falso si no es válida
        }
    };
    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)


    const handleSubmitLogin = async (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault(); // Evitar el comportamiento por defecto del formulario
        setLoaderGames(true);
        const usersRef = collection(firestore, 'users');
        const qEmail = query(usersRef, where('Email', '==', emailUsername));
        const qUsername = query(usersRef, where('Username', '==', emailUsername));

        try {
            const querySnapshotEmail = await getDocs(qEmail);
            const querySnapshotUsername = await getDocs(qUsername);
            const querySnapshot = await getDocs(qUsername);
            const usernamePersistance = getCookie('username');
            console.log(usernamePersistance);
            const hashPersistance = getCookie('userHash') || '';
            if (usernamePersistance == emailUsername && hashPersistance != '') {
                bcrypt.compare(password, hashPersistance, (err, result) => {
                    if (err) {
                        console.error("Error al comparar la contraseña:", err);
                        return;
                    }

                    if (result) {
                        setMessage(t('validPassword').toUpperCase());
                        setCookie('loggedin', 'true', { expires: 365 })
                        setTimeout(() => {
                            navigate('/games');
                            window.location.reload();
                        }, 800)
                    } else {
                        setLoaderGames(false);
                        setMessage(t('wrongPassword').toUpperCase());
                        setTimeout(() => { setMessage('') }, 800)
                        // Lógica para el inicio de sesión fallido
                    }
                });
            } else if (querySnapshotEmail.empty && querySnapshotUsername.empty) {
                setLoaderGames(false);
                setMessage(t('noThereIsUser').toUpperCase());
                setTimeout(() => { setMessage('') }, 900)
            } else {
                // Procesar el primer documento encontrado
                const userDoc = querySnapshot.docs[0]; // Acceder al primer documento
                const userData = userDoc.data(); // Obtener los datos del documento

                // Aquí puedes usar userData para verificar la contraseña
                const storedHash = userData.Hashpwd; // Asegúrate de que el campo se llama 'Hashpwd'

                bcrypt.compare(password, storedHash, (err, result) => {
                    if (err) {
                        console.error("Error al comparar la contraseña:", err);
                        return;
                    }

                    if (result) {
                        setMessage(t('validPassword').toUpperCase());
                        setCookie('username', userData["Username"], { expires: 365 });
                        setCookie('email', userData["Email"], { expires: 365 });
                        setCookie('loggedin', 'true', { expires: 365 })
                        setCookie('userPoints', userData["Points"], { expires: 365 });
                        setCookie('guestName', '', { expires: 365 })
                        setCookie('userHash', userData["Hashpwd"], { expires: 365 });
                        setCookie('profit', userData["Profit"], { expires: 365 });
                        setTimeout(() => {
                            navigate('/games');
                            window.location.reload();
                        }, 800)
                    } else {
                        setLoaderGames(false);
                        setMessage(t('wrongPassword').toUpperCase());
                        setTimeout(() => { setMessage('') }, 800)
                        // Lógica para el inicio de sesión fallido
                    }
                });
            }
        } catch (error) {
            console.error('Error al verificar el correo electrónico: ', error);
            setMessage(t('errorEmailVerification').toUpperCase());
            setTimeout(() => { setMessage('') }, 800)
        }
    };

    const pointsGuest = parseInt(getCookie('totalPoints') || '0');

    const handleSubmitSignup = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoaderGames(true);
        // setTimeout(() => { setLoaderGames(false) }, 440);
        if (email.includes('@')) {
            if (passwordValid) {
                if (password == confimrPassword) {
                    try {
                        // Generar un hash de la contraseña
                        const salt = await bcrypt.genSalt(10);
                        const hashPwd = await bcrypt.hash(password, salt);

                        // Obtener la referencia a la colección "usersData"
                        const usersRef = collection(firestore, 'users');
                        const qEmail = query(usersRef, where('Email', '==', email));
                        const qUsername = query(usersRef, where('Username', '==', username));
                        const querySnapshotEmail = await getDocs(qEmail);
                        const querySnapshotUsername = await getDocs(qUsername);

                        try {
                            if (querySnapshotEmail.empty && querySnapshotUsername.empty) {
                                // Agregar un nuevo documento a la colección
                                await addDoc(usersRef, {
                                    Username: username,
                                    Email: email,
                                    Hashpwd: hashPwd,
                                    Points: pointsGuest > 0 ? pointsGuest : 0,
                                    Profit: 5
                                });

                                setLoaderGames(false);
                                setMessage(t('userRegistrationSuccesful').toUpperCase());
                                setCookie('username', username, { expires: 365 });
                                setCookie('email', email, { expires: 365 });
                                setCookie('loggedin', 'true', { expires: 365 })
                                setCookie('guestName', '', { expires: 365 })
                                setCookie('userPoints', (pointsGuest > 0 ? pointsGuest : 0)?.toString(), { expires: 365 });
                                setCookie('userHash', hashPwd, { expires: 365 });
                                setCookie('profit', '5', { expires: 365 });
                                if (pointsGuest > 0) setCookie('totalPoints', '0', { expires: 365 });
                                // Limpiar los campos del formulario
                                setTimeout(() => {
                                    setMessage('')
                                    setUsername('');
                                    setEmail('');
                                    setPassword('');
                                    setConfirmPassword('');
                                    setTimeout(() => {
                                        navigate('/games')
                                        window.location.reload();
                                    }, 600)
                                }, 1000)
                            } else {
                                setLoaderGames(false);
                                setMessage(`${t('noAvalaible').toUpperCase()}: ${!querySnapshotEmail.empty ? email : username} `)
                            }
                        } catch (e) {
                            console.log(e);
                        }
                    } catch (e) {
                        console.log(e);
                    }

                } else {
                    setLoaderGames(false);
                    setMessage(t('noMatchPasswords').toUpperCase())
                }
            }
        } else {
            setLoaderGames(false);
            setMessage(t('invalidEmail').toUpperCase())
            setTimeout(() => { setMessage('') }, 1000);
        }
    };


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
        return isChrome || isSafari || isEdge || !(/SamsungBrowser/i.test(userAgent));
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
        <div className='w-full h-[55em] md:pt-[1em] pt-[10em] z-[0] top-0 left-0 flex flex-col justify-between items-center bg-gradient-to-br from-[#135252] to-[#1f0919]'>

            <div className={`z-[9999] w-full h-full fixed left-0 flex flex-col justify-center items-center ${isMoved ? tS.LoaderTransitionIn : tS.LoaderTransitionOut} transition-all duration-[650ms] ease-in-out loading-screen ${!isLoading ? "hidden" : ""}`}>
                <ColorRing visible={true}
                    height="80"
                    width="80"
                    ariaLabel="color-ring-loading"
                    wrapperStyle={{}}
                    wrapperClass="color-ring-wrapper"
                    colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']} />
            </div>

            {loginSignup ? (<>
                <h1 className='font-bold text-[3em] md:text-[6em] text-white'>{t('login')}</h1>
                <section className='w-max h-max py-4 flex fkex-col justify-center items-center'>
                    <form onSubmit={handleSubmitLogin} className='flex flex-col justify-center items-center'>
                        <div className='relative w-[20em] my-1'>
                            <label htmlFor="email" />
                            <input
                                className='rounded-full focus:rounded-2xl w-full p-4 pl-10 transition-all duration-200 ease-linear'
                                type="text"
                                id="emailUsername"
                                placeholder={` ${t('email')} or ${t('username')}`}
                                value={emailUsername}
                                onChange={handleEmailUsernameChange}
                                required
                            />
                            <IoMailOutline className='absolute left-3 top-1/2 transform -translate-y-1/2' size={'1.5em'} />
                        </div>
                        <div className='relative w-[20em] my-1'>
                            <label htmlFor="password" />
                            <input
                                className='rounded-full focus:rounded-2xl w-full p-4 pl-10 transition-all duration-200 ease-linear'
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                placeholder={t('password')}
                                value={password}
                                onChange={handlePasswordChange}
                                required
                            />
                            <RiLockPasswordLine className='absolute left-3 top-1/2 transform -translate-y-1/2' size={'1.5em'} />
                        </div>
                        <div className="flex items-center self-end">
                            <input
                                type="checkbox"
                                id="showPassword"
                                checked={showPassword}
                                onChange={handleShowPasswordChange}
                            />
                            <label htmlFor="showPassword" className="m-2 text-white">
                                {t('showpwd')}
                            </label>
                        </div>
                        <button type="submit" className='rounded-3xl focus:rounded-2xl px-12 py-3 my-2 transition-all duration-200 ease-linear bg-green-400'>{t('login')}</button>
                    </form>
                </section>
                <section>
                {/* <button className='text-blue-400 text-[1.2em] font-semibold' onClick={() => { setLoginSignup(!loginSignup), setEmail(''), setPassword(''), setConfirmPassword(''), setUsername('') }}>{t('forgetPsw')}</button> */}
                    <h1 className='pb-4 text-white text-[1.2em]'>{t('donthaveaccount')} <button className='text-blue-400 font-semibold' onClick={() => { setLoginSignup(!loginSignup), setEmail(''), setPassword(''), setConfirmPassword(''), setUsername('') }}>{t('signup')}</button></h1>
                </section>
            </>) : (<>
                <h1 className='font-bold text-[3em] md:text-[6em] text-white'>{t('signup')}</h1>
                <section className='w-max h-max py-4 flex fkex-col justify-center items-center'>
                    <form onSubmit={handleSubmitSignup} className='flex flex-col justify-center items-center'>
                        <div className='relative w-[20em] my-1'>
                            <label htmlFor="username" />
                            <input
                                className='rounded-full focus:rounded-2xl w-full p-4 pl-10 transition-all duration-200 ease-linear'
                                type="text"
                                id="username"
                                maxLength={8}
                                placeholder={`${t('username')}`}
                                value={username}
                                onChange={handleUsernameChange}
                                required
                            />
                            <FaRegUser className='absolute left-3 top-1/2 transform -translate-y-1/2' size={'1.5em'} />
                        </div>
                        <div className='relative w-[20em] my-1'>
                            <label htmlFor="email" />
                            <input
                                className='rounded-full focus:rounded-2xl w-full p-4 pl-10 transition-all duration-200 ease-linear'
                                type="email"
                                id="email"
                                placeholder={`${t('email')}`}
                                value={email}
                                onChange={handleEmailChange}
                                required
                            />
                            <IoMailOutline className='absolute left-3 top-1/2 transform -translate-y-1/2' size={'1.5em'} />
                        </div>
                        <div className='relative w-[20em] my-1'>
                            <label htmlFor="password" />
                            <input
                                className='rounded-full focus:rounded-2xl w-full p-4 pl-10 transition-all duration-200 ease-linear'
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                placeholder={t('password')}
                                value={password}
                                onChange={handlePasswordChange}
                                required
                            />
                            <RiLockPasswordLine className='absolute left-3 top-1/2 transform -translate-y-1/2' size={'1.5em'} />

                        </div>
                        {!passwordValid && (
                            <div className='text-white text-sm text-justify p-2 absolute top-0 left-0'><h6>{t('passwordAdvice')}</h6></div>
                        )}
                        <div className='relative w-[20em] my-1'>
                            <label htmlFor="confirmpassword" />
                            <input
                                className='rounded-full focus:rounded-2xl w-full p-4 pl-10 transition-all duration-200 ease-linear'
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                placeholder={t('confirmpwd')}
                                value={confimrPassword}
                                onChange={handleConfirmPasswordChange}
                                required
                            />
                            <RiLockPasswordLine className='absolute left-3 top-1/2 transform -translate-y-1/2' size={'1.5em'} />

                        </div>
                        <div className="flex items-center self-end">
                            <input
                                type="checkbox"
                                id="showPassword"
                                checked={showPassword}
                                onChange={handleShowPasswordChange}
                            />
                            <label htmlFor="showPassword" className="m-2 text-white">
                                {t('showpwd')}
                            </label>
                        </div>
                        <button type="submit" disabled={!passwordValid ? true : false}  className='rounded-3xl focus:rounded-2xl px-12 py-3 my-2 transition-all duration-200 ease-linear disabled bg-green-400'>{t('signup')}</button>
                    </form>
                </section>
                <section>
                    <h1 className='py-4 text-white text-[1.2em]'>¿Ya tienes una cuenta? <button className='text-blue-600 font-bold' onClick={() => { setLoginSignup(!loginSignup), setEmail(''), setPassword(''), setConfirmPassword(''), setUsername('') }}>{t('login')}</button></h1>
                </section>
            </>)
            }
            <button onClick={() => onLoader('/')} className='text-[1.5em] text-white px-4 py-2 bg-gradient-to-bl from-[#1baae1f4] to-[#213129a7] rounded-full hover:from-[#bb4411f4] hover:to-[#eaa129a7] transition-all duration-200 ease-out'>{t('home')}</button>
            <Loader theme={theme} loader={loaderGames} />
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

            {message && <p className='text-white font-normal md:font-bold md:text-[1.5em] p-4 absolute top-0 bottom-[75%] md:bottom-[85%] m-auto h-max w-max bg-gradient-to-tr from-[#52ae39fa] to-[#212bdeb7] backdrop-blur-[2px] rounded-full'>{message}</p>}
        </div>
    );
};

export default SignupForm;