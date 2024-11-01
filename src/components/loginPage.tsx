import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TFunction } from 'i18next';
import { collection, getDocs, query, where, addDoc } from 'firebase/firestore';
import { firestore } from '../utils/firebaseConfig';
import bcrypt from 'bcryptjs';
import { getCookie, setCookie } from "../utils/cookiesManage"


interface formProps {
    t: TFunction;
}

const SignupForm: React.FC<formProps> = ({ t }) => {

    const [email, setEmail] = useState('');
    const [emailUsername, setEmailUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confimrPassword, setConfirmPassword] = useState('');
    const [username, setUsername] = useState('');
    const [message, setMessage] = useState('');
    const [loginSignup, setLoginSignup] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [passwordValid, setPasswordValid] = useState(true);

    const navigate = useNavigate();

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
                        setMessage("¡Contraseña válida! Acceso concedido.");
                        setCookie('loggedin', 'true', { expires: 365 })
                        setTimeout(() => {
                            navigate('/games');
                            window.location.reload();
                        }, 800)
                    } else {
                        setMessage("Contraseña incorrecta");
                        setTimeout(() => { setMessage('') }, 800)
                        // Lógica para el inicio de sesión fallido
                    }
                });
            } else if (querySnapshotEmail.empty && querySnapshotUsername.empty) {
                setMessage('No existe un usuario con este correo o nombre de usuario');
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
                        setMessage("¡Contraseña válida! Acceso concedido.");
                        setCookie('username', userData["Username"], { expires: 365 });
                        setCookie('loggedin', 'true', { expires: 365 })
                        setCookie('userPoints', userData["Points"], { expires: 365 });
                        setCookie('userHash', userData["Hashpwd"], { expires: 365 });
                        setTimeout(() => {
                            navigate('/games');
                            window.location.reload();
                        }, 800)
                    } else {
                        setMessage("Contraseña incorrecta");
                        setTimeout(() => { setMessage('') }, 800)
                        // Lógica para el inicio de sesión fallido
                    }
                });
            }
        } catch (error) {
            console.error('Error al verificar el correo electrónico: ', error);
            setMessage('Hubo un error al verificar el correo electrónico.');
            setTimeout(() => { setMessage('') }, 800)
        }
    };


    const handleSubmitSignup = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();



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
                                    Points: 0
                                });

                                setMessage('Usuario registrado con éxito.');
                                // Limpiar los campos del formulario
                                setTimeout(() => {
                                    setMessage('')
                                    setUsername('');
                                    setEmail('');
                                    setPassword('');
                                    setConfirmPassword('');
                                    setTimeout(() => {
                                        navigate('/games')
                                    }, 600)
                                }, 1000)
                            } else {
                                setMessage(`No está disponible: ${!querySnapshotEmail.empty ? email : username} `)
                            }
                        } catch (e) {
                            console.log(e);
                        }
                    } catch (e) {
                        console.log(e);
                    }

                } else {
                    setMessage('Las contraseñas no coinciden')
                }
            }
        } else {
            setMessage('Correo no válido')
            setTimeout(() => { setMessage('') }, 1000);
        }
    };

    return (
        <div className='w-full h-full absolute top-0 left-0 flex flex-col justify-center items-center bg-gradient-to-br from-[#ac4040f5] to-[#191919f5]'>
            {loginSignup ? (<>
                <h1 className='font-bold text-[3em] md:text-[6em] text-white'>{t('login')}</h1>
                <section className='w-max h-max py-4 flex fkex-col justify-center items-center'>
                    <form onSubmit={handleSubmitLogin} className='flex flex-col justify-center items-center'>
                        <div>
                            <label htmlFor="email" />
                            <input
                                className='rounded-full focus:rounded-2xl w-[20em] p-4 my-1 transition-all duration-200 ease-linear'
                                type="text"
                                id="emailUsername"
                                placeholder={`${t('email')} or ${t('username')}`}
                                value={emailUsername}
                                onChange={handleEmailUsernameChange}
                                required
                            />
                        </div>
                        <div className='flex flex-col'>
                            <label htmlFor="password" />
                            <input
                                className='rounded-full focus:rounded-2xl w-[20em] p-4 my-1 transition-all duration-200 ease-linear'
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                placeholder={t('password')}
                                value={password}
                                onChange={handlePasswordChange}
                                required
                            />
                        </div>
                        <div className="flex items-center self-end">
                            <input
                                type="checkbox"
                                id="showPassword"
                                checked={showPassword}
                                onChange={handleShowPasswordChange}
                            />
                            <label htmlFor="showPassword" className="m-2 text-white">
                                Mostrar contraseña
                            </label>
                        </div>
                        <button type="submit" className='rounded-3xl focus:rounded-2xl px-12 py-3 my-2 transition-all duration-200 ease-linear bg-green-400'>{t('login')}</button>
                    </form>
                </section>
                <section>
                    <h1 className='py-4 text-white text-[1.2em]'>¿No tienes una cuenta? <button className='text-blue-600 font-bold' onClick={() => { setLoginSignup(!loginSignup), setEmail(''), setPassword(''), setConfirmPassword(''), setUsername('') }}>{t('signup')}</button></h1>
                </section>
            </>) : (<>
                <h1 className='font-bold text-[3em] md:text-[6em] text-white'>{t('signup')}</h1>
                <section className='w-max h-max py-4 flex fkex-col justify-center items-center'>
                    <form onSubmit={handleSubmitSignup} className='flex flex-col justify-center items-center'>
                        <div>
                            <label htmlFor="username" />
                            <input
                                className='rounded-full focus:rounded-2xl w-[20em] p-4 my-1 transition-all duration-200 ease-linear'
                                type="text"
                                id="username"
                                maxLength={8}
                                placeholder={`${t('username')}`}
                                value={username}
                                onChange={handleUsernameChange}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="email" />
                            <input
                                className='rounded-full focus:rounded-2xl w-[20em] p-4 my-1 transition-all duration-200 ease-linear'
                                type="email"
                                id="email"
                                placeholder={`${t('email')}`}
                                value={email}
                                onChange={handleEmailChange}
                                required
                            />
                        </div>
                        <div className='flex flex-col'>
                            <label htmlFor="password" />
                            <input
                                className='rounded-full focus:rounded-2xl w-[20em] p-4 my-1 transition-all duration-200 ease-linear'
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                placeholder={t('password')}
                                value={password}
                                onChange={handlePasswordChange}
                                required
                            />
                        </div>
                        {!passwordValid && (
                            <div className='text-white text-sm text-justify p-2 absolute top-0 left-0'><h6>La contraseña debe tener al menos 8 caracteres, una letra mayúscula, una letra minúscula, un número y un carácter especial.</h6></div>
                        )}
                        <div className='flex flex-col'>
                            <label htmlFor="confirmpassword" />
                            <input
                                className='rounded-full focus:rounded-2xl w-[20em] p-4 my-1 transition-all duration-200 ease-linear'
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                placeholder={t('confirmpassword')}
                                value={confimrPassword}
                                onChange={handleConfirmPasswordChange}
                                required
                            />
                        </div>
                        <div className="flex items-center self-end">
                            <input
                                type="checkbox"
                                id="showPassword"
                                checked={showPassword}
                                onChange={handleShowPasswordChange}
                            />
                            <label htmlFor="showPassword" className="m-2 text-white">
                                Mostrar contraseña
                            </label>
                        </div>
                        <button type="submit" className='rounded-3xl focus:rounded-2xl px-12 py-3 my-2 transition-all duration-200 ease-linear bg-green-400'>{t('signup')}</button>
                    </form>
                </section>
                <section>
                    <h1 className='py-4 text-white text-[1.2em]'>¿Ya tienes una cuenta? <button className='text-blue-600 font-bold' onClick={() => { setLoginSignup(!loginSignup), setEmail(''), setPassword(''), setConfirmPassword(''), setUsername('') }}>{t('login')}</button></h1>
                </section>
            </>)
            }

            {message && <p className='text-white font-normal md:font-bold md:text-[1.5em] p-4 absolute top-0 bottom-[75%] md:bottom-[85%] m-auto h-max w-max bg-gradient-to-tr from-[#52ae39fa] to-[#212bdeb7] backdrop-blur-[2px] rounded-full'>{message}</p>}
        </div>
    );
};

export default SignupForm;
