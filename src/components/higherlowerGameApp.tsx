import React, { memo, useEffect, useState, Dispatch, SetStateAction } from "react";
import { TFunction } from 'i18next';
import ThemeColors from "../utils/themeColors.ts";
import { getCookie, setCookie } from "../utils/cookiesManage.ts";
import Countriese from "../data/country";
import { ColorRing } from 'react-loader-spinner'
import HigherLowerCard from "./higherLowerCard.tsx";
import { useNavigate } from "react-router-dom";
import pointLogo from "../assets/pointLogo.svg"




interface AppProps {
    t: TFunction;
    theme: boolean;
    loggedIn: boolean;
    totalPoints: number;
    setTotalPoints: Dispatch<SetStateAction<number>>;
    userPoints: number;
    setUserPoints: Dispatch<SetStateAction<number>>;
}


interface CountryData {
    [key: string]: any; // O define un tipo más específico si sabes las claves y valores
}

const countries: CountryData[] = Countriese;

interface DataItem {
    country: string;
    var: number;
}


const HigherLowerGameApp: React.FC<AppProps> = memo(({ t, theme, totalPoints, setTotalPoints, userPoints, setUserPoints, loggedIn }) => {


    const tS = ThemeColors(theme);
    const [isLoading, setIsLoading] = useState(true);
    const [isMoved, setIsMoved] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const timer_moved = setTimeout(() => {
            setIsMoved(false)
        }, 300)
        const timer = setTimeout(() => {
            setIsLoading(true);
        }, 1000); // Cambia 2000 por el tiempo que quieras que la pantalla de carga se muestre en milisegundos

        return () => { clearTimeout(timer_moved); clearTimeout(timer) }; // Limpia el temporizador cuando el componente se desmonte
    }, []);

    const [increasedNumer, setIncreasedNumer] = useState(false)
    const [moveB, setMoveB] = useState(false)
    const [moveC, setMoveC] = useState(false)
    const [wrongAns, setWrongAns] = useState(false)

    const subCatSelected: string | undefined = getCookie('categorySelected');
    document.title = `UpperMoster - ` + t(subCatSelected || '');
    let data: { country: string; var: any }[] = [];
    const [dataOrder, setDataOrder] = useState<DataItem[]>([]);

    function fisherYatesShuffle<T>(array: T[]): T[] {
        let m = array.length, t, i;

        while (m) {
            i = Math.floor(Math.random() * m--);

            t = array[m];
            array[m] = array[i];
            array[i] = t;
        }

        return array;
    }

    function sortDataWithConstraint(data: DataItem[]): DataItem[] {
        if (data.length <= 1) return data;

        for (let i = 0; i < data.length - 1; i++) {
            if (!((Math.abs(data[i].var - data[i + 1].var) / data[i].var) <= 0.25)) {
                for (let j = i + 2; j < data.length; j++) {
                    if ((Math.abs(data[i].var - data[j].var) / data[i].var) <= 0.25) {
                        [data[i + 1], data[j]] = [data[j], data[i + 1]];
                        break;
                    }
                }
            }
        }
        return data;
    }
    const [onCounter, setOnCounter] = useState(0);
    const [optionA, setOptionA] = useState<DataItem | null>(null);
    const [optionB, setOptionB] = useState<DataItem | null>(null);
    const [optionC, setOptionC] = useState<DataItem | null>(null);

    if (subCatSelected) {
        if (subCatSelected === 'military_expenditure') {
            countries.forEach((country) => {
                data.push({ country: country.country, var: (country["gdp"] * country[subCatSelected] * 1000000) / 100 });
            });
        } else {
            countries.forEach((country) => {
                data.push({ country: country.country, var: country[subCatSelected] });
            });
        }
        data = fisherYatesShuffle(data);
    }

    useEffect(() => {
        const sortedData = sortDataWithConstraint(data);
        setDataOrder(sortedData);
    }, [subCatSelected]); // Solo ejecuta este efecto cuando cambia subCatSelected

    useEffect(() => {
        if (dataOrder.length > 2) {
            setOptionA(dataOrder[onCounter]);
            setOptionB(dataOrder[onCounter + 1]);
            setOptionC(dataOrder[onCounter + 2]);
        }
    }, [dataOrder, onCounter]);


    // Recuperar la categoría seleccionada desde la cookie

    const [recordHigherLower, setRecordHigherLower] = useState<number>(parseInt(getCookie('recordHigherLower') || "0"));
    const [score, setScore] = useState(0);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [multiplier, setMultiplier] = useState<number>(1);



    useEffect(() => {
        // Actualiza el multiplicador en función del score
        if (score > 200) {
            setMultiplier(20);
        } else if (score > 100) {
            setMultiplier(10);
        } else if (score > 50) {
            setMultiplier(5);
        } else if (score > 25) {
            setMultiplier(3);
        } else if (score > 10) {
            setMultiplier(2);
        } else if (score < 10) {
            setMultiplier(1);
        }

        // Actualiza el récord si se supera
        if (score > recordHigherLower) {
            setRecordHigherLower(score);
            setCookie('recordHigherLower', score.toString(), { expires: 365 });
        }
    }, [score, recordHigherLower]);

    useEffect(() => {
        // Actualiza la cookie de puntos totales cada vez que cambie totalPoints
        setCookie('totalPoints', totalPoints.toString(), { expires: 365 });
    }, [totalPoints]);
    useEffect(() => {
        setCookie('userPoints', userPoints.toString(), { expires: 365 });
    }, [userPoints]);

    const correctAnswerHandler = () => {
        setIncreasedNumer(true);
        setWrongAns(false);
        onCounter == 4 ? setInitialCount(12) : onCounter == 9 ? setInitialCount(10) : onCounter == 14 ? setInitialCount(8) : onCounter == 19 ? setInitialCount(5) : undefined
        setTimeout(() => {
            setMoveB(true);
            setTimeout(() => {
                setMoveB(false);
                setCount(initialCount)
                setIncreasedNumer(false);
                setOptionA(optionB);
                setOptionB(optionC);
                setOptionC(dataOrder[onCounter + 2]);
                setOnCounter(onCounter + 1);
                setCorrectAnswers(correctAnswers + 1)
                setScore(prevScore => {
                    const newScore = prevScore + multiplier;
                    !loggedIn ? setTotalPoints(prevTotal => Math.ceil(prevTotal + multiplier)) : setUserPoints(prevUser => Math.ceil(prevUser + multiplier)); // Actualiza el total de puntos
                    return newScore;
                });
            }, 600);
        }, 1200);
    };

    const wrongAnswerHandler = () => {
        setWrongAns(true);
        setIncreasedNumer(true);
        if (score > recordHigherLower) {
            setScore(prevScore => {
                const newScore = prevScore + 50; // Bonificación por superar el récord
                !loggedIn ? setTotalPoints(prevTotal => prevTotal + 50) : setUserPoints(prevTotal => prevTotal + 50);
                return newScore;
            });
        }
        setTimeout(() => {
            setCorrectAnswers(0)
            // setScore(0);
            setMoveC(true);
        }, 1200);
    };

    const [retryAns, setRetryAns] = useState(false);
    function retry() {
        setRetryAns(true);
        setOnCounter(0)
        setIncreasedNumer(false);
        setMoveC(false);
        setTimeout(() => {
            setScore(0);
            setCorrectAnswers(0)
            setInitialCount(15)
            setCount(initialCount)
            const sortedData = sortDataWithConstraint(data);
            setDataOrder(sortedData);
            setOptionA(dataOrder[0]);
            setOptionB(dataOrder[1]);
            setOptionC(dataOrder[2]);
            setTimeout(() => {
                setWrongAns(false);
                setRetryAns(false);
            }, 10);
        }, 500);
    }

    function goBack() {
        navigate(-1);
    }

    function higherAnswer() {
        if (optionA && optionB) {
            if (optionB.var >= optionA.var) {
                correctAnswerHandler();
            } else {
                wrongAnswerHandler();
            }
        } else {
            console.error('OptionA or OptionB is null');
        }
    }
    function lowerAnswer() {
        if (optionA && optionB) {
            if (optionB.var <= optionA.var) {
                correctAnswerHandler();
            } else {
                wrongAnswerHandler();
            }
        } else {
            console.error('OptionA or OptionB is null');
        }
    }

    const [initialCount, setInitialCount] = useState(15)
    const [count, setCount] = useState(initialCount);

    useEffect(() => {
        // Reiniciar la cuenta regresiva cuando cambie la dependencia
        setCount(initialCount);
    }, [initialCount, moveB]);

    useEffect(() => {
        if (count <= 0) {
            wrongAnswerHandler()
            return; // Si el contador llega a 0, detener el efecto
        }

        const timerId = setInterval(() => {
            setCount(prevCount => prevCount - 1);
        }, 1000);

        // Limpiar el intervalo cuando el componente se desmonte o cuando se reinicie la cuenta
        return () => clearInterval(timerId);
    }, [count]);


    return (
        <>
            <div className={`${wrongAns ? "" : "hidden"} ${retryAns ? "opacity-100" : "opacity-0"} w-full h-full bg-black absolute top-0 left-0 z-[2999] transition-all duration-[250] ease-in`}></div>
            <div className={`z-[9999] w-full h-full fixed left-0 flex flex-col justify-center items-center ${isMoved ? tS.LoaderTransitionIn : tS.LoaderTransitionOut} transition-all duration-[650ms] ease-in-out loading-screen ${!isLoading ? "hidden" : ""}`}>
                <ColorRing visible={true}
                    height="80"
                    width="80"
                    ariaLabel="color-ring-loading"
                    wrapperStyle={{}}
                    wrapperClass="color-ring-wrapper"
                    colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']} />
            </div>

            <div className={`${wrongAns ? "" : "hidden"} ${moveC ? "z-[9999] opacity-100" : "opacity-0"} absolute w-full h-full top-0 bottom-0 m-auto bg-[#1243] backdrop-blur-[0.5em] transition-all duration-300 ease-out flex flex-col justify-center items-center`}>
                <div className="md:w-[25%] h-[55%] w-[90%] bg-[#334] rounded-[3em] shadow-[0px_0px_px_0px_#d55] flex flex-col justify-evenly items-center transition-all duration-300 ease-out text-white">
                    <h1>{score > 0 ? `${t('goodjob').toUpperCase()}!` : score > 20 ? `${t('excelent').toUpperCase()}!` : t('goodtry').toUpperCase()}</h1>
                    <h1>{t('yougot').toLocaleUpperCase()}: {score}<img src={pointLogo} alt="points" className="h-[1.8em] w-auto inline-block invert" /></h1>
                    <button className="uppercase w-[70%] bg-[#433] hover:bg-[#633] active:bg-[#833] h-[4em] rounded-[3em] text-white transition-all duration-[250ms] ease-out " onClick={retry}>{t('retry')}</button>
                    <button className="uppercase w-[70%] bg-[#223] hover:bg-[#335] active:bg-[#339] h-[4em] rounded-[3em] text-white" onClick={goBack}>{t('back')}</button>
                </div>
            </div >

            {/* VS circle*/}
            < div className={`${moveB ? "opacity-0 h-[0.1em]" : "h-[3em]"} ${increasedNumer && !wrongAns ? "bg-[#1f1]" : increasedNumer && wrongAns ? "bg-[#f55]" : "bg-[yellow]"} absolute top-0 bottom-0 m-auto flex flex-col justify-center items-center w-[3.3em] h-[3.5em] rounded-full text-black z-[999] transition-all duration-[250ms] ease-in-out font-medium`
            }>
                <h1 className={`bg-transparent transition-all duration-200 ease-in-out h-[50%]  w-full  text-center`} >VS</h1>
                <h1 className={`transition-all duration-200 ease-in-out bg-transparent text-center h-[50%] w-full`} >{count}</h1>

            </div >
            <div className={`w-full h-full absolute top-0 left-0 text-white`}>
                <div className="relative w-full h-[7em] top-0 left-0 flex flex-col justify-center items-center z-[30] ">
                    <section className="flex mt-[-1em] md:pt-0 pt-4 flex-col justify-center items-center bg-[#ff00] backdrop-blur-[2px] opacity-60">
                        <h1 className={`uppercase text-[1.3em] md:text-[2em] md:mt-2 font-extralight tracking-widest`}>{t('higherlower')}</h1>
                        <p className={`uppercase text-[0.6em] md:text-[1em] font-extralight tracking-widest`}>{t(`phraseGame_${subCatSelected}`)}</p>
                    </section>
                    <section className="flex flex-row justify-evenly w-[70%] md:w-[70%] pt-4 font-extralight tracking-widest">
                        <h1 className={`text-[0.9em] md:text-[1.1em] uppercase`}>{t('uppers')}: {score}</h1>
                        <h1 className={`text-[0.9em] md:text-[1.1em] uppercase`}>{t('score')}: {correctAnswers}</h1>
                        <h1 className="text-[0.7em] md:text-[1em] uppercase absolute top-2 right-2">{t('record')}: {recordHigherLower}</h1>
                    </section>
                </div>
                <div className="absolute top-0 flex flex-col md:flex-row w-full h-full overflow-hidden">

                    <div className={`${moveB ? "md:left-[-50%] top-[-50%] transition-all duration-300 ease-in-out" : "md:left-0 top-0"} absolute w-full md:top-0 md:w-[50%] h-[50%] md:h-full`}>
                        <HigherLowerCard option={optionA} key={1} t={t} increasedNumer={true} index={0} subCatSelected={subCatSelected} />
                    </div>

                    <div className={`${moveB ? "md:right-[50%] bottom-[50%] transition-all duration-300 ease-in-out" : "md:right-0 bottom-0"} absolute w-full md:top-0 md:w-[50%] h-[50%] md:h-full`}>
                        <HigherLowerCard option={optionB} key={2} t={t} increasedNumer={increasedNumer} index={1} subCatSelected={subCatSelected} />
                    </div>
                    <section className="absolute md:h-[10em] w-full md:w-auto flex md:flex-col justify-evenly items-center bottom-[1em]  md:bottom-[4em] md:right-0 md:left-[50%] md:m-auto z-[999] tracking-widest">
                        <button className={`${increasedNumer ? "pointer-events-none scale-90 opacity-50 bg-gray-700" : ""} w-[6.5em] md:w-[9em] h-[3.5em] text-[1em] capitalize rounded-full bg-[#1d17] backdrop-blur-[10px] hover:bg-[#1a1d] active:bg-[#6a1] text-[white] font-bold hover:scale-105 transition-all duration-[400ms] ease-in-out `} onClick={higherAnswer}>
                            {t('higher')}
                        </button>
                        <button className={`${increasedNumer ? "pointer-events-none scale-90 opacity-50 bg-gray-800" : ""} w-[6.5em] md:w-[9em] h-[3.5em] text-[1em] capitalize rounded-full bg-[#f117] backdrop-blur-[10px] hover:bg-[#f11d] active:bg-[#f61] text-[white] font-bold hover:scale-105 transition-all duration-[400ms] ease-in-out`} onClick={lowerAnswer}>
                            {t('lower')}
                        </button>
                    </section>
                    <div className={`${moveB ? "md:left-[50%] top-[50%] transition-all duration-300 ease-in-out" : "md:left-[100%] top-[100%]"} absolute w-full md:top-0 md:w-[50%] h-[50%] md:h-full`}>
                        <HigherLowerCard option={optionC} key={3} t={t} increasedNumer={true} index={2} subCatSelected={subCatSelected} />
                    </div>

                </div>
            </div >

        </>
    )
})
export default HigherLowerGameApp

{/* <li key={country.country}>{t(country.country)}: {country.var}</li> */ }
