import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/global.css';

import {AuthProvider} from "../utils/AuthProvider";
import Header from "../components/header/Header";
import {useRouter} from "next/router";
import Head from 'next/head'


function MyApp({Component, pageProps}) {
    const router = useRouter();
    const noHeaderRoutes = ["/login", "/register"];
    const showHeader = !noHeaderRoutes.includes(router.pathname);

    return (
        <AuthProvider>
            <Head>
                <title>test.thewireup.com</title>
            </Head>
            {showHeader && <Header/>}
            <Component {...pageProps} />
        </AuthProvider>
    );
}

export default MyApp;
