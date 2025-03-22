import React, { useEffect, useRef } from 'react';

interface AdsProps {
    keyValue: number;
    atOptions: {
        key: string;
        format: string;
        height: number;
        width: number;
        params: {};
    };
}

const AdScript: React.FC<AdsProps> = ({ atOptions }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (containerRef.current) {
            // Limpia el contenido previo para evitar problemas de recarga de anuncios
            containerRef.current.innerHTML = '';

            const script1 = document.createElement('script');
            script1.type = 'text/javascript';
            script1.innerHTML = `atOptions = ${JSON.stringify(atOptions)};`;

            const script2 = document.createElement('script');
            script2.type = 'text/javascript';
            script2.src = `//www.highperformanceformat.com/${atOptions.key}/invoke.js`;

            containerRef.current.appendChild(script1);
            containerRef.current.appendChild(script2);
        }
    }, []);

    return <div ref={containerRef} style={{ width: `${atOptions.width}px`, height: `${atOptions.height}px` }} />;
};

export default AdScript;

