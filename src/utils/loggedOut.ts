import { setCookie } from "./cookiesManage";

const loggedOutUSer = () => {
    setCookie('loggedin', 'false', { expires: 365 });
    window.location.replace('/')
    window.location.reload;
}

export default loggedOutUSer;