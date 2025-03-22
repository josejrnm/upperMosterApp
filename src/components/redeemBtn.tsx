import { TFunction } from "i18next";
import { getCookie } from "../utils/cookiesManage";
import { MdPublishedWithChanges } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { Dispatch, SetStateAction } from "react";

interface btnRedeemProps {
    t: TFunction;
    theme: boolean;
    setRedeemActive: Dispatch<SetStateAction<boolean>>;
}

const ButtonRedeem: React.FC<btnRedeemProps> = ({ t, theme, setRedeemActive }) => {
    const navigate = useNavigate();


    function goToProfile() {
        if (getCookie('loggedin') && getCookie('loggedin') === 'true') {
            navigate('/personal-Account');
        } else {
            setRedeemActive(true)
        }
    }
    return (
        <>
            <button onClick={goToProfile} className={`${theme ? "bg-teal-600 text-white hover:bg-teal-950 " : "bg-teal-600 text-white "} rounded-md p-[6px] mt-2 mx-0 md:mt-0 md:mx-2`}>
                <h1 className="capitalize">
                    <MdPublishedWithChanges className="inline-block mr-1" size={'1.5em'} />
                    {t('redeem')}
                </h1>
            </button>
        </>
    );
};

export default ButtonRedeem;
