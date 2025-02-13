import {TestList} from "../../components/test/TestList";
import {useEffect, useState} from "react";
import {getAllTests} from "../../utils/api";

export default function Home() {
    const [tests, setTests] = useState([]);

    useEffect(() => {
        getAllTests().then((tests) => setTests(tests));
    }, []);

    return (
        <div>
            <TestList tests={tests}/>
        </div>
    );
}