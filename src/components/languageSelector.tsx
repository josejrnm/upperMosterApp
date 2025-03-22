import React, { useEffect, useRef, useState } from 'react';
import { i18n as I18nType } from 'i18next';
import { getCookie, setCookie } from "../utils/cookiesManage"
import "/node_modules/flag-icons/css/flag-icons.min.css"
import useClickOutside from '../utils/clickOut';
import { IoLanguage } from "react-icons/io5";



interface LangProps {
    i18n: I18nType;
}

const LanguageSelector: React.FC<LangProps> = ({ i18n }) => {

    const myRef = useRef<HTMLDivElement>(null);
    const [isOpen, setIsOpen] = useState(false);
    useClickOutside(myRef, setIsOpen);
    const [theme, setTheme] = useState(true);

    useEffect(() => {
        if (getCookie('userTheme')) {
            setTheme(getCookie('userTheme') === 'true')
        }
    }, [getCookie('userTheme')])

    const languages = [
        { code: 'en', label: 'English' },
        { code: 'es', label: 'Español' },
        { code: 'fr', label: 'Français' },
        { code: 'pt', label: 'Português' },
        { code: 'jp', label: '日本語' },
        { code: 'it', label: 'Italiano' },
        { code: 'de', label: 'Deutsch' },
        { code: 'kr', label: '한국어' },
        { code: 'ru', label: 'Русский' },
    ];

    /*const getLabelByLanguage = () => {
        const language = languages.find(lang => lang.code === i18n.language);
        return language ? language.label : 'Language not found';
    };

    const currentLabel = getLabelByLanguage();*/

    let langSelected = {
        code: `${i18n.language == 'en' ? 'um' : i18n.language}` /*label: `${currentLabel}`*/
    }

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
        setIsOpen(false); // Cierra el menú después de seleccionar un idioma
        setCookie('userLanguage', lng, { expires: 365 });
    };

    return (
        <div ref={myRef} className="relative w-min rounded-lg ml-6 z-50">
            <button
                onClick={toggleMenu}
                className={`${theme ? 'bg-gray-800 text-white' : 'bg-gray-400 text-black'}  w-[5.2em] h-[2rem] focus:outline-none z-50 flex flex-row cursor-pointer justify-start p-1 text-[0.9em] items-center rounded-lg ${isOpen ? "rounded-b-none rounded-t-lg" : ""} shadow-[#004400] shadow-sm`}>
                <section>
                </section>
                <IoLanguage size={'1.2em'} />
                <span className={`fi fi-${langSelected.code} ml-1 mr-1`}></span>
                <h2 className='inline-block'>{`${langSelected.code == 'um' ? "EN" : langSelected.code}`.toUpperCase()}</h2>
            </button>
            {isOpen && (
                <ul className={`rounded-lg fixed z-50 transition-all duration-100 ease-in-out`}>
                    {
                        languages.map((lang) => (
                            <li key={lang.code}>
                                <button
                                    onClick={() => { changeLanguage(lang.code) }}
                                    className={`backdrop-blur-[1px] ${theme ? 'bg-gray-800 text-white hover:bg-black' : 'bg-gray-400 text-black hover:bg-white'} w-[5.2em] focus:outline-none flex flex-row cursor-pointer justify-start p-1 text-[0.9em] items-center ${lang.code == 'ru' ? "rounded-t-none rounded-b-lg" : ""} hover:bg-black  hover:translate-y-[0.08rem] transition-all duration-[150ms] ease-in`}
                                >
                                    <IoLanguage size={'1.2em'} />
                                    <span className={`fi fi-${lang.code == 'en' ? 'um' : lang.code} ml-1 mr-1`}></span>
                                    <h2 className='inline-block'>{lang.code.toUpperCase()}</h2>
                                </button>
                            </li>
                        ))
                    }
                </ul >
            )
            }

        </div >
    );
};

export default LanguageSelector;












