import {useEffect, useState} from "react";
import {SubmittedTestList} from "../../../../components/test/SubmittedTestList";
import {getSubmittedTests} from "../../../../utils/api";
import {useRouter} from "next/router";

export default function Home() {
    const router = useRouter();
    const {id} = router.query;
    const [tests, setTests] = useState([]);

    useEffect(() => {
        getSubmittedTests(id).then((tests) => setTests(tests));
    }, [id]);

    return (
        <div>
            <SubmittedTestList tests={tests}/>
        </div>
    );
}