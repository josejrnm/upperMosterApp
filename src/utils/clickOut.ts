import { useEffect } from 'react';

const useClickOutside = (ref: React.RefObject<HTMLElement>, setIsOpen: React.Dispatch<React.SetStateAction<boolean>>) => {
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setIsOpen(false); // Cambiar el estado a false
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [ref, setIsOpen]); // Asegúrate de incluir setIsOpen en la lista de dependencias
};

export default useClickOutside;