import { TFunction } from "i18next"
import { Link } from "react-router-dom";
import React, { Dispatch, SetStateAction, useState } from "react";
import ChangeTheme from "./changeTheme";

import upperMoster from "../assets/title.svg"
import mainLogo from "../assets/mainLogo.svg"
import LanguageSelector from "./languageSelector";
import i18n from "../i18n";
import BackBTn from "./backBtn";



interface InfoProps {
    t: TFunction;
    theme: boolean;
    setTheme: Dispatch<SetStateAction<boolean>>;
}



const CompanyInfo: React.FC<InfoProps> = ({ t, theme, setTheme }) => {

    const [scaleA, setScaleA] = useState(true)
    const [scaleB, setScaleB] = useState(true)
    const [scaleC, setScaleC] = useState(true)


    return (
        <>
            <div className="bg-transparent w-full h-full">

                <BackBTn />
                <div className="mt-4">
                    <Link to="/" className="h-[3rem] w-[100%] md:w-[auto] md:h-14 flex flex-row justify-center items-center">
                        <img className="h-[100%]" src={mainLogo} alt="UpperMoster" title="UpperMoster" />
                        <img src={upperMoster} alt="UpperMoster" className={`w-[11rem] md:w-[14rem] ${theme ? "invert" : "invert-0"}`} />
                    </Link>
                </div>
                <section className="md:absolute top-2 right-2 flex flex-row justify-center items-center">
                    <LanguageSelector i18n={i18n} />
                    <ChangeTheme setTheme={setTheme} theme={theme} />
                </section>
                <div className={`flex flex-row justify-around w-full h-full my-8`}>
                    <section id="ads" className={`md:flex flex-row w-[15%] h-full m-2 bg-red-900 hidden`}>

                    </section>
                    <div className={`${theme ? "text-black bg-[#ff73]" : "text-white bg-[#0117]"} md:w-[55em] mx-2 md:m-0 h-max rounded-lg font-titles text-justify mb-4`}>
                        <h1 className={`text-[1.2em] md:text-[2em] font-semibold ${theme ? "bg-purple-200" : "bg-purple-900"} w-full px-4 rounded-t-lg`} onClick={() => setScaleA(scaleA)}>{t('termpols')}</h1>
                        <section id="termscond" className={`${scaleA ? "scale-y-100 h-max p-4 mb-8 opacity-100 md:p-7 md:mt-4" : "scale-y-0 h-0 p-0 mb-0 opacity-0"} transition-all duration-[250ms] ease-out tracking-wide`}>
                            <h1 className="text-[1.3em] font-medium transition-all duration-[250ms] ease-out">{t('termcondTitle')}</h1>
                            <h2 className={`text-[1.2em] mt-2`}>{t('termcondSub1')}</h2>
                            <p className={`ml-4 mt-2 font-normal text-[1em]`}>{t('termcondP1')}</p>
                            <h2 className={`text-[1.2em] mt-2`}>{t('termcondSub2')}</h2>
                            <p className={`ml-4 mt-2 font-normal text-[1em]`}>{t('termcondP2')}</p>
                            <h2 className={`text-[1.2em] mt-2`}>{t('termcondSub3')}</h2>
                            <ul className="list-disc mb-2">
                                <li className={`ml-8 mt-2 font-normal text-[1em]`}>{t('termcondP31')}</li>
                                <li className={`ml-8 mt-2 font-normal text-[1em]`}>{t('termcondP32')}</li>
                                <li className={`ml-8 mt-2 font-normal text-[1em]`}>{t('termcondP33')}</li>
                            </ul>
                            <h2 className={`text-[1.2em]`}>{t('termcondSub4')}</h2>
                            <p className={`ml-4 mt-2 font-normal text-[1em]`}>{t('termcondP4')}</p>
                            <h2 className={`text-[1.2em] mt-2`}>{t('termcondSub5')}</h2>
                            <p className={`ml-4 mt-2 font-normal text-[1em]`}>{t('termcondP5')}</p>
                        </section>
                        <h1 className={`text-[1.2em] md:text-[2em] font-semibold ${theme ? "bg-green-200" : "bg-green-900"} w-full px-4`} onClick={() => setScaleB(scaleB)}>{t('privatepols')}</h1>
                        <section id="privacypolicy" className={`${scaleB ? "scale-y-100 h-max p-4 mb-8 opacity-100 md:p-7 md:mt-4" : "scale-y-0 h-0 p-0 mb-0 opacity-0"} transition-all duration-[250ms] ease-out tracking-wide`}>
                            <h1 className="text-[1.3em] font-medium transition-all duration-[250ms] ease-out">{t('privatepolsTitle')}</h1>
                            <h2 className={`text-[1.2em] mt-2`}>{t('privatepolsSub1')}</h2>
                            <p className={`ml-4 mt-2 font-normal text-[1em]`}>{t('privatepolsP1')}</p>
                            <h2 className={`text-[1.2em] mt-2`}>{t('privatepolsSub2')}</h2>
                            <p className={`ml-4 mt-2 font-normal text-[1em]`}>{t('privatepolsP2')}</p>
                            <h2 className={`text-[1.2em] mt-2`}>{t('privatepolsSub3')}</h2>
                            <p className={`ml-4 mt-2 font-normal text-[1em]`}>{t('privatepolsP3')}</p>
                            <h2 className={`text-[1.2em] mt-2`}>{t('privatepolsSub4')}</h2>
                            <p className={`ml-4 mt-2 font-normal text-[1em]`}>{t('privatepolsP4')}</p>
                            <h2 className={`text-[1.2em] mt-2`}>{t('privatepolsSub5')}</h2>
                            <p className={`ml-4 mt-2 font-normal text-[1em]`}>{t('privatepolsP5')}</p>
                            <h2 className={`text-[1.2em] mt-2`}>{t('privatepolsSub6')}</h2>
                            <p className={`ml-4 mt-2 font-normal text-[1em]`}>{t('privatepolsP6')}</p>
                            <h2 className={`text-[1.2em] mt-2`}>{t('privatepolsSub7')}</h2>
                            <p className={`ml-4 mt-2 font-normal text-[1em]`}>{t('privatepolsP7')}</p>
                        </section>
                        <h1 className={`text-[1.2em] md:text-[2em] font-semibold ${scaleC ? "rounded-none" : "rounded-b-lg"} ${theme ? "bg-red-200" : "bg-red-900"} w-full px-4 transition-all duration-200 ease-in-out`} onClick={() => setScaleC(scaleC)}>{t('cookiespols')}</h1>
                        <section id="cookiespols" className={`${scaleC ? "scale-y-100 h-max p-4 mb-8 opacity-100 md:p-7 md:mt-4" : "scale-y-0 h-0 p-0 mb-0 opacity-0"} transition-all duration-[250ms] ease-out tracking-wide`}>
                            <h1 className="text-[1.3em] font-medium transition-all duration-[250ms] ease-out">{t('cookiespolsTitle')}</h1>
                            <h2 className={`text-[1.2em] mt-2`}>{t('cookiespolsSub1')}</h2>
                            <p className={`ml-4 mt-2 font-normal text-[1em]`}>{t('cookiespolsP1')}</p>
                            <h2 className={`text-[1.2em] mt-2`}>{t('cookiespolsSub2')}</h2>
                            <ul className="list-disc mb-2">
                                <li className={`ml-8 mt-2 font-normal text-[1em]`}>{t('cookiespolsP21')}</li>
                                <li className={`ml-8 mt-2 font-normal text-[1em]`}>{t('cookiespolsP22')}</li>
                                <li className={`ml-8 mt-2 font-normal text-[1em]`}>{t('cookiespolsP23')}</li>
                                <li className={`ml-8 mt-2 font-normal text-[1em]`}>{t('cookiespolsP24')}</li>
                            </ul>
                            <h2 className={`text-[1.2em] mt-2`}>{t('cookiespolsSub3')}</h2>
                            <p className={`ml-4 mt-2 font-normal text-[1em]`}>{t('cookiespolsP3')}</p>
                            <h2 className={`text-[1.2em] mt-2`}>{t('cookiespolsSub4')}</h2>
                            <p className={`ml-4 mt-2 font-normal text-[1em]`}>{t('cookiespolsP4')}</p>
                            <h2 className={`text-[1.2em] mt-2`}>{t('cookiespolsSub5')}</h2>
                            <p className={`ml-4 mt-2 font-normal text-[1em]`}>{t('cookiespolsP5')}</p>
                        </section>
                    </div>
                    <section id="ad" className={`md:flex flex-row w-[15%] h-full m-2 bg-red-900 hidden`}></section>
                </div>
            </div>
        </>
    )
}

export default CompanyInfo