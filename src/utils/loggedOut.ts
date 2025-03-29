import { firestore } from './firebaseConfig';
import { collection, getDocs, query, where, doc, updateDoc, addDoc } from 'firebase/firestore';
import { getCookie, setCookie } from "./cookiesManage";



const loggedOutUSer = async () => {
    const pointsUpdate = parseInt(getCookie('userPoints') || '0');
    const userName = getCookie('username');

    setCookie('loggedin', 'false', { expires: 365 });
    setCookie('totalPoints', '0', { expires: 365 });
    setCookie('guestName', '', { expires: 365 });
    setCookie('userPoints', '0', { expires: 365 });
    setCookie('username', '0', { expires: 365 });
    setCookie('profit', '0', { expires: 365 });

    if (pointsUpdate > 0) {
        const usersRef = collection(firestore, 'users');
        const qUser = query(usersRef, where('Username', '==', userName));
        const querySnapshotUser = await getDocs(qUser);

        if (!querySnapshotUser.empty) {
            // Asumimos que solo hay un documento por usuario (email único)
            const userDoc = querySnapshotUser.docs[0]; // Tomamos el primer documento

            // Obtener la referencia al documento del usuario
            const userDocRef = doc(firestore, 'users', userDoc.id);

            // Actualizar el campo "Points" en el documento del usuario
            await updateDoc(userDocRef, {
                Points: pointsUpdate, // Aquí newPoints es la nueva cantidad de puntos que quieres asignar
            });

            console.log('Puntos actualizados exitosamente');
        } else {
            console.log('Usuario no encontrado');
        }
    }

    window.location.replace('/')
    window.location.reload();
}


const redeemPoints = async (loggedin: boolean, emailGuestUser = '') => {
    const guestPointsUpdate = parseInt(getCookie('totalPoints') || '0');
    const pointsUpdate = parseInt(getCookie('userPoints') || '0');
    if (loggedin) {

        const emailUser = getCookie('email');
        if (!emailUser) {
            console.error("No email found in cookies");
            return;
        }

        const participantsRef = collection(firestore, 'participants');
        const qParticipant = query(participantsRef, where('Email', '==', emailUser));
        const querySnapshotParticipant = await getDocs(qParticipant);

        if (!querySnapshotParticipant.empty) {
            const participantDoc = querySnapshotParticipant.docs[0]; // Tomamos el primer documento
            const participantData = participantDoc.data();
            const participantDocRef = doc(firestore, 'participants', participantDoc.id);

            await updateDoc(participantDocRef, {
                Points: parseInt(participantData["Points"]) + pointsUpdate,
            });

            console.log('Puntos actualizados exitosamente');
        } else {
            await addDoc(participantsRef, {
                Email: emailUser,
                Points: pointsUpdate,
            });

            console.log('Nuevo participante agregado exitosamente');
        }
        setCookie('userPoints', 0, { expires: 365 });

    } else {
        const participantsRef = collection(firestore, 'participants');
        const qParticipant = query(participantsRef, where('Email', '==', emailGuestUser));
        const querySnapshotParticipant = await getDocs(qParticipant);

        if (!querySnapshotParticipant.empty) {
            const participantDoc = querySnapshotParticipant.docs[0]; // Tomamos el primer documento
            const participantData = participantDoc.data();
            const participantDocRef = doc(firestore, 'participants', participantDoc.id);

            await updateDoc(participantDocRef, {
                Points: parseInt(participantData["Points"]) + guestPointsUpdate,
            });

            console.log('Puntos actualizados exitosamente');
        } else {
            await addDoc(participantsRef, {
                Email: emailGuestUser,
                Points: guestPointsUpdate,
            });
        }
        setCookie('totalPoints', 0, { expires: 365 })
    }
    // window.location.replace('/');
    // window.location.reload();
};


const redeemPointsSorteo = async (points: string) => {
    const pointsUpdateA = parseInt(points);
    const pointsUpdate = parseInt(getCookie('userPoints') || '0');



    const emailUser = getCookie('email');
    if (!emailUser) {
        console.error("No email found in cookies");
        return;
    }

    ////
    const participantsRefA = collection(firestore, 'users');
    const qParticipantA = query(participantsRefA, where('Email', '==', emailUser));
    const querySnapshotParticipantA = await getDocs(qParticipantA);

    ///////
    const participantsRef = collection(firestore, 'participants');
    const qParticipant = query(participantsRef, where('Email', '==', emailUser));
    const querySnapshotParticipant = await getDocs(qParticipant);

    if (!querySnapshotParticipant.empty) {
        const participantDoc = querySnapshotParticipant.docs[0]; // Tomamos el primer documento
        const participantData = participantDoc.data();
        const participantDocRef = doc(firestore, 'participants', participantDoc.id);

        await updateDoc(participantDocRef, {
            Points: parseInt(participantData["Points"]) + pointsUpdateA,
        });

        if (!querySnapshotParticipant.empty) {
            const participantDocA = querySnapshotParticipantA.docs[0]; // Tomamos el primer documento
            const participantDocRefA = doc(firestore, 'users', participantDocA.id);
    
            await updateDoc(participantDocRefA, {
                Points: Math.ceil((pointsUpdate - pointsUpdateA) * 100) / 100,
            });
            }

        console.log('Puntos actualizados exitosamente');
    } else {
        await addDoc(participantsRef, {
            Email: emailUser,
            Points: pointsUpdateA,
        });

        console.log('Nuevo participante agregado exitosamente');
    }
    setCookie('userPoints', pointsUpdate - pointsUpdateA, { expires: 365 });

    // window.location.replace('/');
    // window.location.reload();
};


const redeemPointsMoney = async (points: string) => {
    const profitUpdate = parseFloat(points);
    const pointsUpdate = parseInt(getCookie('userPoints') || '0');



    const emailUser = getCookie('email');
    if (!emailUser) {
        console.error("No email found in cookies");
        return;
    }

    const participantsRef = collection(firestore, 'users');
    const qParticipant = query(participantsRef, where('Email', '==', emailUser));
    const querySnapshotParticipant = await getDocs(qParticipant);

    if (!querySnapshotParticipant.empty) {
        const participantDoc = querySnapshotParticipant.docs[0]; // Tomamos el primer documento
        const participantData = participantDoc.data();
        const participantDocRef = doc(firestore, 'users', participantDoc.id);

        await updateDoc(participantDocRef, {
            Profit: Math.ceil((parseFloat(participantData["Profit"]) + profitUpdate) * 100) / 100,
            Points: Math.ceil((pointsUpdate - (profitUpdate * 100000)) * 100) / 100,
        });

        console.log('¨Profit actualizado exitosamente');
        setCookie('profit', Math.ceil((parseFloat(participantData["Profit"]) + profitUpdate) * 100) / 100, { expires: 365 });
        setCookie('userPoints', pointsUpdate - (profitUpdate * 100000), { expires: 365 });

    }

    // window.location.replace('/');
    // window.location.reload();
};


const withdrawMoney = async () => {
    const profitUSD = getCookie('profit')||'0';
    const emailUser = getCookie('email');


    const withdrawRef = collection(firestore, 'withdrawer');
    const qWithdrawer = query(withdrawRef, where('Email', '==', emailUser));
    const querySnapshotWithdraw = await getDocs(qWithdrawer);

    if (!querySnapshotWithdraw.empty) {
        const withdrawDoc = querySnapshotWithdraw.docs[0]; // Tomamos el primer documento
        const withdrawData = withdrawDoc.data();
        const withdrawDocRef = doc(firestore, 'withdrawer', withdrawDoc.id);

        await updateDoc(withdrawDocRef, {
            Withdraw: parseFloat(withdrawData["Withdraw"]) + parseFloat(profitUSD),
        });
        const participantsRef = collection(firestore, 'users');
    const qParticipant = query(participantsRef, where('Email', '==', emailUser));
    const querySnapshotParticipant = await getDocs(qParticipant);

    if (!querySnapshotParticipant.empty) {
        const participantDoc = querySnapshotParticipant.docs[0];
        const participantDocRef = doc(firestore, 'users', participantDoc.id);

        await updateDoc(participantDocRef, {
            Profit: 0,
        });
    }

        console.log('Puntos actualizados exitosamente');
    } else {
        await addDoc(withdrawRef, {
            Email: emailUser,
            Withdraw: profitUSD,
        });

        console.log('Nuevo retiro agregado exitosamente');
    }
    setCookie('profit', 0.0, { expires: 365 });

};

export { loggedOutUSer, redeemPoints, redeemPointsSorteo, redeemPointsMoney, withdrawMoney };

