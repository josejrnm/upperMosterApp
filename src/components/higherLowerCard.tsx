import { TFunction } from 'i18next';
import { useState, useEffect } from 'react';


interface CardProps {
    option: any;
    t: TFunction;
    // formatNumber: (subCat: string | undefined, varA: number) => string;
    subCatSelected: string | undefined;
    increasedNumer: boolean;
    index: number
}


const HigherLowerCard: React.FC<CardProps> = ({ option, t, subCatSelected, increasedNumer, index }) => {

    const [numberUnknown, setNumberUnknown] = useState("")
    // let numberIncreased = Math.round(option.var / 100)
    //  () => {
    //     if (index === 1) {
    //         if (["population", "area", "military_expenditure"].includes(subCatSelected || "")) {
    //             return Math.ceil(option.var / 100);
    //         } else if (["unemployment_rate", "literacy_rate"].includes(subCatSelected || "")) {
    //             return (option.var / 100);
    //         } else {
    //             return (option.var / 100);
    //         }
    //     }
    // };

    useEffect(() => {
        if (index === 0) {
            if (["population", "area", "military_expenditure", "gdp", "gdp_per_capita"].includes(subCatSelected || "")) {
                setNumberUnknown(option.var.toLocaleString("en-US"));
            } else if (["unemployment_rate", "literacy_rate"].includes(subCatSelected || "")) {
                setNumberUnknown(option.var.toString() + "%");
            } else if (subCatSelected === "hdi") {
                setNumberUnknown(parseFloat(option.var.toFixed(3)).toString())
            } else {
                setNumberUnknown(option.var.toString());
            }
        }
    }, [subCatSelected, option, index]);

    let numberIncreased = ["hdi", "co2_per_capita", "unemployment_rate"].includes(subCatSelected || "") ? parseFloat((option.var / 100).toFixed(3)) : subCatSelected === "unemployment_rate" ? parseFloat((option.var / 100).toFixed(1)) : parseFloat((option.var / 100).toFixed(0))
    // let numberIncreased = parseFloat((option.var / 100).toFixed(3))
    let formatVar = 0;
    let count = false;
    const countedNumber = () => {
        const intervalId = setInterval(() => {
            if (formatVar >= option.var) {
                formatVar = option.var;
                count = true
                clearInterval(intervalId);
            }
            if (formatVar <= option.var) {
                if (["population", "area", "military_expenditure", "gdp", "gdp_per_capita"].includes(subCatSelected || "")) {
                    setNumberUnknown(formatVar.toLocaleString("en-US"));
                } else if (["literacy_rate"].includes(subCatSelected || "")) {
                    setNumberUnknown(formatVar.toString() + "%");
                } else if (["unemployment_rate"].includes(subCatSelected || "")) {
                    setNumberUnknown(formatVar.toFixed(1) + "%");
                } else if (["hdi"].includes(subCatSelected || "")) {
                    setNumberUnknown(formatVar.toFixed(3));
                } else if (["co2_per_capita", "life_expectancy"].includes(subCatSelected || "")) {
                    setNumberUnknown(formatVar.toFixed(1));
                }
                formatVar += numberIncreased;
            } else if (count) {
                clearInterval(intervalId);
                formatVar = 0;
                count = false
            }
        }, 10);
        // Cleanup function to clear the interval and timeout if the component unmounts
        return () => {
            clearInterval(intervalId);
        };
    }
    useEffect(() => {
        if (increasedNumer && index === 1) {
            countedNumber();
        }
    }, [increasedNumer])




    return (
        <>
            <div className={`absolute w-full h-full`}>
                {/* Imagen de fondo */}
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(/src/img/higherlower/countries/flags/${option.country}.png)` }}
                />
                {/* Backdrop */}
                <div className="absolute inset-0 bg-[#0009] backdrop-blur-[10px]" />

                {/* Contenido */}
                <div className="relative z-10 flex flex-col items-center justify-center pb-[4em] md:pb-[8em] w-full h-full text-white">
                    <section className={`relative md:h-[6em] text-center transition-all duration-1000 ease-out`}>
                        <h1 className={`${increasedNumer ? "opacity-100 scale-100" : "opacity-0 scale-50"} text-[1.5em] md:text-[3em] font-light transition-all duration-1000 ease-out`}>{numberUnknown}</h1>
                        <h2 className={`${increasedNumer ? "opacity-100 scale-10" : "opacity-0 scale-50"} font-extralight transition-all duration-[500ms] ease-out`}>unity</h2>
                    </section>
                    <h1 className="text-[1.5em] md:text-[2.2em] capitalize tracking-widest font-medium">{t(`${option.country}`)}</h1>
                </div>
            </div>
        </>
    )
}

export default HigherLowerCard;