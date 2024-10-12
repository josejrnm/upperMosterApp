import Cookies from 'js-cookie';


// Función para guardar un valor en una cookie
export const setCookie = (name: string, value: string | number | boolean, options?: Cookies.CookieAttributes) => {
    Cookies.set(name, value.toString(), options);
};

// Función para leer el valor de una cookie
export const getCookie = (name: string): string | undefined => {
    return Cookies.get(name);
};

// Función para eliminar una cookie
export const deleteCookie = (name: string) => {
    Cookies.remove(name);
};




// import React, { useState, useEffect } from 'react';
// import { setCookie, getCookie } from './cookies'; // Asegúrate de importar tus funciones

// const MyComponent: React.FC = () => {
//   const [points, setPoints] = useState(0);
//   const [language, setLanguage] = useState('es'); // Idioma por defecto: español
//   const [theme, setTheme] = useState('light'); // Tema por defecto: light

//   useEffect(() => {
//     // Cargar datos desde las cookies al montar el componente
//     const storedPoints = getCookie('points');
//     if (storedPoints) {
//       setPoints(parseInt(storedPoints, 10));
//     }

//     const storedLanguage = getCookie('language');
//     if (storedLanguage) {
//       setLanguage(storedLanguage);
//     }

//     const storedTheme = getCookie('theme');
//     if (storedTheme) {
//       setTheme(storedTheme);
//     }
//   }, []);

//   useEffect(() => {
//     // Guardar datos en las cookies cuando cambian
//     setCookie('points', points);
//     setCookie('language', language);
//     setCookie('theme', theme);
//   }, [points, language, theme]);

//   // ... resto de tu componente, donde puedes usar points, language y theme
// };