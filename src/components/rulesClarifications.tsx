import { TFunction } from "i18next"
import { Link } from "react-router-dom";
import React, { Dispatch, SetStateAction, } from "react";
import ChangeTheme from "./changeTheme";
import { FcRules } from "react-icons/fc";
import upperMoster from "../assets/title.svg"
import mainLogo from "../assets/mainLogo.svg"
import LanguageSelector from "./languageSelector";
import i18n from "../i18n";
import BackBTn from "./backBtn";
import AdScript from "./adscript";



interface InfoProps {
    t: TFunction;
    theme: boolean;
    setTheme: Dispatch<SetStateAction<boolean>>;
}

const RulesClarifications: React.FC<InfoProps> = ({ t, theme, setTheme }) => {
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8];

    return (
        <>
            <div className={`${theme ? 'bg-[#fee]' : 'bg-[#100]'} absolute top-0 left-0 w-full h-max py-8`}>

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
                    <section id="ads" className={`md:flex flex-row w-[15%] h-full m-2`}>
                        {window.innerWidth > 720 && (<div key={"divfooter2"} className="static bottom-0 left-0 right-0 m-[auto] bg-slate-400">
                            <AdScript keyValue={3} atOptions={{
                                'key': '8e9a9be6062ab8e934786da634816ee3',
                                'format': 'iframe',
                                'height': 600,
                                'width': 160,
                                'params': {}
                            }} />
                        </div>)}
                    </section>
                    <div className={`${theme ? "text-black bg-[#fa73]" : "text-white bg-[#2117]"} md:w-[55em] mx-2 md:m-0 h-max rounded-lg font-titles text-justify mb-4`}>
                        <h1 className={`text-[1.2em] md:text-[2em] flex flex-row items-center font-semibold ${theme ? "bg-[#fe3141]" : "bg-[#431212]"} w-full px-4 py-4 rounded-t-lg`}>
                            <FcRules />
                            {t('rulesClarifications')}
                        </h1>
                        <section id="termscond" className={`scale-y-100 h-max p-4 mb-8 opacity-100 md:p-7 md:mt-4 transition-all duration-[250ms] ease-out tracking-wide`}>
                            <h1 className="font-extralight italic">{t('finalAdvice')}</h1>
                            {numbers.map((number) => (
                                <>
                                    <h2 className={`text-[1.2em] mt-2`}>{t(`rule${number}`)}</h2>
                                    <ul className="list-disc mb-2">
                                        <li className={`ml-10 mt-2 mr-2 font-normal text-[1em]`}>{t(`rule${number}_1`)}</li>
                                        <li className={`ml-10 mt-2 mr-2 font-normal text-[1em]`}>{t(`rule${number}_2`)}</li>
                                    </ul>
                                </>
                            ))}
                        </section>
                        <section id="ads">
                            {window.innerWidth <= 720 && (<div key={"divfooter1"} className="static bottom-0 left-0 right-0 m-[auto] bg-slate-400">
                                <AdScript keyValue={3} atOptions={{
                                    'key': '4579ed5f9089da6a442187f2056adfda',
                                    'format': 'iframe',
                                    'height': 50,
                                    'width': 320,
                                    'params': {}
                                }} />
                            </div>)}
                        </section>
                    </div>
                    <section id="ad" className={`md:flex flex-row w-[15%] h-full m-2`}>
                        {/* {window.innerWidth > 720 && (<div key={"divfooter2"} className="static bottom-0 left-0 right-0 m-[auto] bg-slate-400">
                            <AdScript keyValue={3} atOptions={{
                                'key': '8e9a9be6062ab8e934786da634816ee3',
                                'format': 'iframe',
                                'height': 600,
                                'width': 160,
                                'params': {}
                            }} />
                        </div>)} */}
                    </section>
                </div>
            </div>
        </>
    )
}

export default RulesClarifications;