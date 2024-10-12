import logoLight from "../assets/lightTheme.svg"
import logoDark from "../assets/darkTheme.svg"

const lightTheme = {
    bgColor: "bg-[#ffffdf]",
    bgColorCats: "bg-[#fefecd]",
    bgColorSubCats: "bg-[#ffffef]",
    bgColorgradient: "bg-gradient-to-br from-[#fff] to-[#efefef]",
    bgColorTopBar: "md:bg-gradient-to-b md:from-[#24A2B3] md:to-[#337780]",
    bgColorFooter: "bg-gradient-to-b from-[#2a4241] to-[#293233]",
    textColor: "text-[#000]",
    BW: "#000",
    borderCol: "#777",
    textColor2: "text-[#fff]",
    themeLogo: logoLight,
    toggleBtnColor: "bg-[#ffff00]",
    iconColor: "black",
    btn_login: "border-[#bbffbb] shadow-[0px_0px_2px_1px_#88aa88] hover:shadow-[0px_4px_2px_1px_#88aa88] hover:scale-[102%] hover:border-none hover:bg-[#aaffaa]",
    btn_guest: "border-[#bbbbff] shadow-[0px_0px_2px_1px_#8888aa] hover:shadow-[0px_4px_2px_1px_#8888aa] hover:scale-[102%] hover:border-none hover:bg-[#aaaaff]",
    LoaderTransitionIn: "z-[9999] top-0 rounded-none backdrop-blur-[10em] bg-[#abdada]",
    LoaderTransitionOut: "z-[9999] top-[-100%] rounded-3xl backdrop-blur-[20px] bg-[#fffa]"
}
const darkTheme = {
    bgColor: "bg-[#050805]",
    bgColorCats: "bg-[#000800]",
    bgColorSubCats: "bg-[#]",
    bgColorgradient: "bg-gradient-to-br from-[#fff] to-[#efefef]",
    BW: "#fff",
    borderCol: "#fff",
    bgColorTopBar: "md:bg-gradient-to-b md:from-[#263323] md:to-[#1D3318]",
    bgColorFooter: "bg-gradient-to-b from-[#000400] to-[#000200]",
    textColor: "text-[#fff]",
    textColor2: "text-[#000]",
    themeLogo: logoDark,
    toggleBtnColor: "bg-[#aaaaff]",
    iconColor: "white",
    btn_login: "border-[#043304] shadow-[0px_0px_2px_1px_#015501] hover:shadow-[0px_4px_2px_1px_#015501] hover:scale-[102%] hover:border-none hover:bg-[#018801]",
    btn_guest: "border-[#040433] shadow-[0px_0px_2px_1px_#010155] hover:shadow-[0px_4px_2px_1px_#010155] hover:scale-[102%] hover:border-none hover:bg-[#010188]",
    LoaderTransitionIn: "z-[9999] top-0 rounded-none backdrop-blur-[10em] bg-[#327171]",
    LoaderTransitionOut: "z-[9999] top-[-100%] rounded-3xl backdrop-blur-[20px] bg-[#555e]"
}

const ThemeColors = (theme: boolean = true) => theme ? lightTheme : darkTheme;

export default ThemeColors;