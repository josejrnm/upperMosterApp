import React from 'react';
import { ColorRing } from 'react-loader-spinner'
import ThemeColors from '../utils/themeColors';


interface LoaderProps {
    loader: boolean;
    theme: boolean
}


const Loader: React.FC<LoaderProps> = ({ theme, loader }) => {
    const tS = ThemeColors(theme)
    return (
        <>
            <div className={`${!loader ? tS.LoaderTransitionOut : tS.LoaderTransitionIn} fixed w-full h-full transition-all duration-[250ms] ease-in-out flex flex-col justify-center items-center`}>
                <ColorRing visible={true}
                    height="80"
                    width="80"
                    ariaLabel="color-ring-loading"
                    wrapperStyle={{}}
                    wrapperClass="color-ring-wrapper"
                    colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']} />
            </div>
        </>
    )
}

export default Loader;