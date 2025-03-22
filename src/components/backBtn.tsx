import { useEffect, useState } from "react";
import { GoHome } from "react-icons/go";
import { Link } from 'react-router-dom';
import { getCookie } from "../utils/cookiesManage";

const BackBTn = () => {
    const [theme, setTheme] = useState(true);

    useEffect(() => {
        if (getCookie('userTheme')) {
            setTheme(getCookie('userTheme') === 'true');
        }
    }, [getCookie('userTheme')])

    return (
        <>
            <div>
                <Link to="/" className={`fixed bottom-12 right-6 z-[9999] rounded-2xl ${theme ? 'bg-[#a2a226] hover:bg-[#c2c256]' : 'bg-[#a2affa] hover:bg-[#c2f286]'} w-[3em] h-[3em] flex items-center justify-center transition-all duration-300 ease-in-out`}>
                    <GoHome size={'1.5em'} color={`${theme ? "black" : 'black'}`} />
                </Link>
            </div>
        </>
    )
}


export default BackBTn;