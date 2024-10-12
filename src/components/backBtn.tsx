import { Link } from "react-router-dom";
import backArrow from "../assets/backArrow.svg"


const BackBTn = () => {


    return (
        <>
            <div>
                <Link
                    to="/games"
                    className="fixed bottom-[4em] right-[2em] md:right-[4em] z-[999] flex flex-col justify-center items-center rounded-full w-[3.5rem] h-[3.5rem] bg-red-500 hover:rotate-[360deg] transition-all duration-[450ms] ease-in-out">
                    <img src={backArrow} alt="Back" className="w-[60%]" />
                </Link>
            </div>
        </>
    )
}


export default BackBTn;