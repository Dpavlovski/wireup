import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/global.css'

import {AuthProvider} from "../utils/AuthProvider";
import Header from "../components/header/Header";
import {useRouter} from "next/router";

function MyApp({Component, pageProps}) {
    const router = useRouter();
    const noHeaderRoutes = ["/login", "/register"];
    const showHeader = !noHeaderRoutes.includes(router.pathname);

    return (
        <AuthProvider>
            {showHeader && <Header/>}
            <Component {...pageProps} />
        </AuthProvider>
    );
}

export default MyApp;
