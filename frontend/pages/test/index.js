import {TestList} from "../../components/test/TestList";
import {useEffect, useState} from "react";
import {getTests} from "../../utils/api";

export default function Home() {
    const [tests, setTests] = useState([]);

    useEffect(() => {
        getTests().then((tests) => setTests(tests));
    }, []);

    return (
        <div>
            <TestList tests={tests}/>
        </div>
    );
}