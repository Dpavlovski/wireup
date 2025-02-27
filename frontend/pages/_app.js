import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/global.css'

import {AuthProvider} from "../utils/AuthProvider";

function MyApp({Component, pageProps}) {

    return <AuthProvider><Component {...pageProps} />;</AuthProvider>
}

export default MyApp;
