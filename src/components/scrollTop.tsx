import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';


const smoothScrollToTop = () => {
    const scrollInterval = setInterval(() => {
        const scrollStep = window.scrollY / (-100 / 15);
        if (window.scrollY !== 0) {
            window.scrollY - scrollStep < 0 ? window.scrollTo(0, 0) : window.scrollBy(scrollStep, scrollStep)
        } else {
            clearInterval(scrollInterval);
        }
    }, 14);
};
const ScrollToTop: React.FC = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        smoothScrollToTop();
    }, [pathname]);

    return (<></>)
};

export default ScrollToTop;
