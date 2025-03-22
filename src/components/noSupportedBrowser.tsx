import React from 'react';
import { MdErrorOutline } from "react-icons/md";


const UnsupportedBrowser: React.FC = () => {


    return (
        <div className='fixed top-0 left-0 w-full h-full flex flex-col items-center justify-center bg-white'>
            <MdErrorOutline size={'14em'} />
            <h1 className='font-[console] text-red-500 text-[1.5em] text-center md:text-[3em]'>Your browser is not supported by this application.</h1>
            <p className='font-[console] text-center text-[0.9em] m-4 md:text-[1.3em]'>Your browser is not supported by this application. Please use a different browser.</p>
        </div>
    );
};

export default UnsupportedBrowser;
