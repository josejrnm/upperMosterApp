import { Dispatch, SetStateAction } from "react";
import { useNavigate } from "react-router-dom";
import { setCookie } from "../utils/cookiesManage"



const detectedSubCategory = (subCat: string, setLoader: Dispatch<SetStateAction<boolean>>, loader: boolean, navigate: ReturnType<typeof useNavigate>): void => {

    const switchLoader = () => {
        setLoader(loader => !loader);
        setCookie('stateLoader', !loader, { expires: 365 });
    }


    // Guardar la categoría seleccionada en una cookie
    setCookie('categorySelected', subCat, { expires: 365 });

    // setHigherLowerCategorie(arrayTest);
    switchLoader()

    setTimeout(() => {
        navigate(`App`);
        switchLoader()
    }, 400);
};

export default detectedSubCategory;