import React from "react"
import { TFunction } from "i18next"
import { Link } from "react-router-dom"
import { SocialIcon } from "react-social-icons/component"
import ThemeColors from "../utils/themeColors"
import "../styles/footer.css"
import 'react-social-icons/x'
import 'react-social-icons/pinterest'
import 'react-social-icons/tiktok'
import 'react-social-icons/youtube'
import 'react-social-icons/threads'
import 'react-social-icons/instagram'
import 'react-social-icons/facebook'

interface LangProps {
    t: TFunction;
    theme: boolean;
}

const Footer: React.FC<LangProps> = ({ t, theme }) => {
    const tS = ThemeColors(theme);
    const icons = [
        { network: 'instagram', url: 'https://www.instagram.com/uppermoster_hub/' },
        { network: 'x', url: 'https://x.com/uppermoster' },
        // { network: 'facebook', url: '' },
        // { network: 'pinterest', url: '' },
        // { network: 'tiktok', url: '' },
        // { network: 'youtube', url: '' },
        { network: 'threads', url: 'https://www.threads.net/@uppermoster_hub' }
    ]
    return (
        <div className={`${tS.bgColorFooter} h-[max-content] w-[auto] pt-4 text-[#8a8b8b] static bottom-0 left-0 flex flex-col`}>
            <div className=" w-[100%] h-[min-content] text-center py-2 flex flex-col-reverse justify-center items-center md:flex-row md:justify-evenly md:items-start font-semibold">
                <section className="w-[100%] md:w-[40%] h-[100%] mb-2 md:mb-0 flex flex-col text-justify items-center ">
                    <h1 className="text-[1rem] w-[80%] md:mb-2 text-start capitalize">UpperMoster</h1>
                    <p className="text-[0.8rem] w-[80%] font-normal">{t('advise')}</p>
                </section>
                <section className="w-[80%] mt-8 mb-8 md:mt-0 md:mb-0 md:w-[15%] h-[100%] flex flex-col text-justify items-start">
                    <h1 className="text-[1rem] mb-1 capitalize">{t('company')}</h1>
                    <ul className="font-normal text-[0.8rem] capitalize">
                        <li><Link className="hover:text-yellow-300 transition-all duration-75 ease-in" to="/">{t('home')}</Link></li>
                        <li><Link className="hover:text-yellow-300 transition-all duration-75 ease-in" to="/rules&clarifications">{t('rulesClarifications')}</Link></li>
                        {/* <li><Link className="hover:text-yellow-300 transition-all duration-75 ease-in" to="/companyInfo">{t('aboutus')}</Link></li> */}
                        <li><Link className="hover:text-yellow-300 transition-all duration-75 ease-in" to="/LoginPage">{t('login')}</Link></li>
                    </ul>
                </section>
                <section className="w-[80%] md:w-[15%] h-[100%] flex flex-col justify-start text-justify">
                    <h1 className="text-[1rem] mb-1 capitalize">{t('termpols')}</h1>
                    <ul className="font-normal capitalize text-[0.8rem]">
                        <li className="mb-[2px]"><Link className="w-[auto] hover:text-cyan-300 transition-all duration-75 ease-in" to="/companyInfo">{t('termsconds')}</Link></li>
                        <li className="mb-[2px]"><Link className="hover:text-cyan-300 transition-all duration-75 ease-in" to="/companyInfo">{t('privatepols')}</Link></li>
                        <li className="mb-[2px]"><Link className="hover:text-cyan-300 transition-all duration-75 ease-in" to="/companyInfo">{t('cookiespols')}</Link></li>
                    </ul>
                </section>

            </div>
            <div className="text-center w-[100%] flex flex-col self-end justify-center h-[max-content] py-2 mt-4">
                <h1 className="h-[20%] mb-[4px] pb-2 flex flex-col justify-end capitalize" id="followus">{t('followus')}</h1>
                <section id="social-media" className="w-[100%] h-[min-content] flex flex-col justify-center" >
                    <ul className="flex flex-row justify-center items-center flex-wrap">
                        {icons.map((icon) => (<li key={icon.network} className={`rounded-full w-[min-content] h-[min-content] m-1 border-[#F5E4D7] hover:bg-[#979393] transition-colors duration-[250ms] ease-in hover:ease-out`} title={`${icon.network}`}><SocialIcon target="_blank" key={icon.network} className="socialIcon rounded-full" bgColor="transparent" fgColor={tS.iconColor} network={icon.network} url={icon.url} /></li>))}
                    </ul>
                </section>
                <h1 className="h-[30%] self-center w-[70%] mt-8">Copyright &copy; 2024 <span className="font-bold">UpperMoster</span> | {t('madefun')}</h1>
            </div>
        </div>
    )
}

export default Footer;