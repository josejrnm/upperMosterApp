import React, { Dispatch, memo, SetStateAction } from "react";
import { TFunction, i18n as I18nType } from 'i18next';
import { Link, useNavigate } from "react-router-dom";
import "../styles/home.css";
import ThemeColors from "../utils/themeColors.ts";
import detectedSubCategory from "../utils/detectedsubcategory.ts";

interface HomeProps {
    t: TFunction;
    i18n: I18nType;
    theme: boolean;
    loader: boolean;
    setLoader: Dispatch<SetStateAction<boolean>>;
    subCat: string;
    scrollValueY: number;
    index: number;
    // setHigherLowerCategorie: Dispatch<SetStateAction<any[]>>;
}

const CatSubCat: React.FC<HomeProps> = memo(({ t, i18n, theme, subCat, scrollValueY, index, setLoader, loader }) => {
    const tS = ThemeColors(theme);
    const navigate = useNavigate();

    return (
        <section
            className={`overflow-hidden rounded-3xl relative tracking-tighter group flex flex-col w-[90%] md:w-[15em] h-[10em] m-[0.4em] transition-all duration-[250ms] ease-in`}
            style={{ boxShadow: `0px 0px 2px 0px ${tS.BW}`, border: `0.1em solid ${tS.borderCol}` }}
        >
            <section
                className={`absolute inset-0 bg-cover bg-center transition-transform duration-[450ms] ease-in-out transform md:group-hover:scale-125 ${window.innerWidth < 720 ? ((scrollValueY > (index * 160 + 1) && scrollValueY < (index * 160 + 165)) ? "scale-125" : "scale-100") : ""}`}
                style={{ backgroundImage: `url(/src/img/higherlower/countries/material/${subCat}.jpeg)` }}
            />
            <Link
                id="categoryBox"
                to=""
                className={`active:bg-[#eee] active:text-[#110] ${window.innerWidth < 720 ? ((scrollValueY > (index * 160 + 1) && scrollValueY < (index * 160 + 165)) ? "bg-[#033a] backdrop-blur-[0em] text-[#fffefe]" : "text-[#4b1616] bg-[#ffffffaa] pointer-events-none") : ""} flex flex-col justify-center w-[100%] h-[100%] md:text-[#7e1919] md:hover:text-[#fffefe]  md:bg-[#ffffff8a] md:hover:bg-[#033a] backdrop-blur-[0.2em] hover:backdrop-blur-[0em] transition-all duration-[300ms] md:duration-[450ms] ease-in-out z-[900]`}
                onClick={() => detectedSubCategory(subCat, setLoader, loader, navigate)}
            >
                <h1 className='font-bold pl-2 text-[1.2em] text-center'>{t(subCat)}</h1>
                <p className={`{} block font-extralight mx-2 ${["ru", "kr", "jp"].includes(i18n.language) ? "text-[0.9rem] md:text-[0.8em]" : "text-[1em] md:text-[0.9em]"} text-center`}>{t(`${subCat}_ph`)}</p>
            </Link>
        </section>
    );
});

export default CatSubCat;