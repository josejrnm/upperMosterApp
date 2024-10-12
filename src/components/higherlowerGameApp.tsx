import React, { memo, useEffect, useState } from "react";
import { TFunction } from 'i18next';
import ThemeColors from "../utils/themeColors.ts";
import { getCookie } from "../utils/cookiesManage.ts";
import Countriese from "../data/country";
import { ColorRing } from 'react-loader-spinner'
import HigherLowerCard from "./higherLowerCard.tsx";



interface AppProps {
    t: TFunction;

    theme: boolean;
}


interface CountryData {
    [key: string]: any; // O define un tipo más específico si sabes las claves y valores
}

const countries: CountryData[] = Countriese;



const HigherLowerGameApp: React.FC<AppProps> = memo(({ t, theme }) => {
    const tS = ThemeColors(theme);
    const [onCounter, setOnCounter] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isMoved, setIsMoved] = useState(true);
    const [increasedNumer, setIncreasedNumer] = useState(false)
    // const [moveB, setMoveB] = useState(false)
    // const [moveC, setMoveC] = useState(false)

    useEffect(() => {
        const timer_moved = setTimeout(() => {
            setIsMoved(false)
        }, 300)
        const timer = setTimeout(() => {
            setIsLoading(true);
        }, 1000); // Cambia 2000 por el tiempo que quieras que la pantalla de carga se muestre en milisegundos

        return () => { clearTimeout(timer_moved); clearTimeout(timer) }; // Limpia el temporizador cuando el componente se desmonte
    }, []);



    // Recuperar la categoría seleccionada desde la cookie
    const subCatSelected: string | undefined = getCookie('categorySelected');
    // Inicializar un arreglo vacío para almacenar los resultados
    let data: { country: string; var: any }[] = [];

    // Verificar si se obtuvo correctamente el valor desde la cookie
    if (subCatSelected) {
        // Recorrer la lista de países y construir el nuevo arreglo
        if (subCatSelected === 'military_expenditure') {
            countries.forEach((country) => {
                data.push({ country: country.country, var: (country["gdp"] * country[subCatSelected] * 1000000) / 100 });
            });
        } else {
            countries.forEach((country) => {
                data.push({ country: country.country, var: country[subCatSelected] });
            });
        }
        data = fisherYatesShuffle(data)
    }
    let [optionA, setoptionA] = useState(data[onCounter])
    let [optionB, setoptionB] = useState(data[onCounter + 1])
    let [optionC, setoptionC] = useState(data[onCounter + 2])
    let [score, setScore] = useState(0);

    function fisherYatesShuffle<T>(array: T[]): T[] {
        let m = array.length, t: T, i: number;

        while (m) {
            i = Math.floor(Math.random() * m--);

            t = array[m];
            array[m] = array[i];
            array[i] = t;
        }

        return array;
    }

    const correctAnswerAnimation = () => {
        setIncreasedNumer(true)
        setTimeout(() => {
            setIncreasedNumer(false)
            setoptionA(optionB)
            setoptionB(optionC)
            setoptionC(data[onCounter + 2])
            setOnCounter(onCounter + 1)
            setScore(score + 1)
        }, 4000);
    }


    function higherAnswer() {
        if (optionB.var >= optionA.var) {
            correctAnswerAnimation()
        } else {
            setScore(0);
        }
    }
    function lowerAnswer() {
        if (optionB.var <= optionA.var) {
            correctAnswerAnimation()
        } else {
            setScore(0);
        }
    }

    return (
        <>

            <div className={`z-[9999] w-full h-full fixed left-0 flex flex-col justify-center items-center ${isMoved ? tS.LoaderTransitionIn : tS.LoaderTransitionOut} transition-all duration-[650ms] ease-in-out loading-screen ${!isLoading ? "hidden" : ""}`}>
                <ColorRing visible={true}
                    height="80"
                    width="80"
                    ariaLabel="color-ring-loading"
                    wrapperStyle={{}}
                    wrapperClass="color-ring-wrapper"
                    colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']} />
            </div>
            <div className={`w-full h-full absolute top-0 left-0 text-white`}>
                <div className="relative w-full h-[7em] top-0 left-0 flex flex-col justify-center items-center z-[30] ">
                    <section className="flex flex-col-reverse mt-[-1em] md:pt-0 md:flex-col justify-center items-center bg-[#ff00] backdrop-blur-[2px] opacity-60">
                        <h1 className={`uppercase text-[1.5em] md:text-[2em] font-extralight tracking-widest`}>{t('higherlower')}</h1>
                        <p className={`uppercase text-[0.7em] md:text-[1em] font-extralight tracking-widest`}>{t(`phraseGame_${subCatSelected}`)}</p>
                    </section>
                    <section className="flex flex-row justify-evenly w-[50%] font-extralight tracking-widest">
                        <h1 className={`text-[0.9em] md:text-[1.1em]`}>Score: {score}</h1>
                        <h1 className="text-[0.9em] md:text-[1.1em]">Record: {1}</h1>
                    </section>
                </div>
                <div className="absolute top-0 flex flex-col md:flex-row w-full h-full">

                    <div className="absolute w-full left-0 md:w-[50%] h-[50%] md:h-full bg-red-400">
                        <HigherLowerCard option={optionA} key={1} t={t} increasedNumer={true} index={0} subCatSelected={subCatSelected} />
                    </div>

                    <div className="absolute w-full right-0 bottom-0 md:top-0 md:w-[50%] h-[50%] md:h-full">
                        <HigherLowerCard option={optionB} key={2} t={t} increasedNumer={increasedNumer} index={1} subCatSelected={subCatSelected} />
                        <section className="absolute md:h-[10em] w-full md:w-auto flex md:flex-col justify-evenly items-center bottom-[1em]  md:bottom-[4em] md:right-0 md:left-0 md:m-auto z-[999] tracking-widest">
                            <button className="w-[8.2em] md:w-[9em] h-[3.5em] text-[1.2em] capitalize rounded-full bg-[#1d17] backdrop-blur-[10px] hover:bg-[#1a1d] active:bg-[#6a1] text-[white] font-bold hover:scale-105 transition-all duration-[400ms] ease-in-out" onClick={higherAnswer}>
                                {t('higher')}
                            </button>
                            <button className="w-[8em] md:w-[9em] h-[3.5em] text-[1.2em] capitalize rounded-full bg-[#f117] backdrop-blur-[10px] hover:bg-[#f11d] active:bg-[#f61] text-[white] font-bold hover:scale-105 transition-all duration-[400ms] ease-in-out" onClick={lowerAnswer}>
                                {t('lower')}
                            </button>
                        </section>
                    </div>

                </div>
            </div >

        </>
    )
})
// style={{ backgroundImage: `url("../img/higherlower/countries/${afghanistan}.png")` }}
export default HigherLowerGameApp

{/* <li key={country.country}>{t(country.country)}: {country.var}</li> */ }
