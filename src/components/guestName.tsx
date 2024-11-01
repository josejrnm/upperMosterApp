import React, { Dispatch, useState, SetStateAction } from 'react';
import { TFunction } from 'i18next';
import { setCookie } from "../utils/cookiesManage.ts";

interface GuestNameProps {
    t: TFunction;
    guestName: string | undefined;
    setGuestName: Dispatch<SetStateAction<string | undefined>>;
    setEditName: Dispatch<SetStateAction<boolean>>
}

const GuestName: React.FC<GuestNameProps> = ({ t, guestName, setGuestName, setEditName }) => {
    const [error, setError] = useState<string>('');
    const [name, setName] = useState<string>('');

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        if (value.length > 12) {
            setError(t('length_error'));
        } else if (!/^[a-zA-Z]*$/.test(value)) {
            setError(t('spacing_error'));
        } else {
            setError('');
            setName(value);
        }
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (!error && name) {
            setEditName(false)
            setGuestName(name);
            setCookie('guestName', name, { expires: 365 }); // Usar `name` en lugar de `guestName`
        }
    };

    return (
        <div className={`${guestName !== "" ? "hidden" : ""} w-full h-full fixed top-0 left-0  bg-gradient-to-bl from-[#481c1c8e] to-[#032c35d5] backdrop-blur-3xl z-[9998] uppercase`}>
            <div className={`w-[85%] md:w-max h-max md:p-4 fixed top-0 bottom-0 left-0 right-0 m-auto rounded-3xl bg-[#fffa] z-[9998]`}>
                <form onSubmit={handleSubmit} className="w-full h-[10em] md:h-full flex flex-col justify-center items-center">
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                        {t('setNameGuest')}
                        <input
                            type="text"
                            value={name}
                            onChange={handleInputChange}
                            maxLength={9}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-xl"
                            required
                        />
                    </label>
                    {error && <p className="text-[#522] text-[0.6em] mb-2 uppercase text-center">{error}</p>}
                    <button
                        type="submit"
                        className="uppercase items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700"
                        disabled={!!error}
                    >
                        {t('save')}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default GuestName;
