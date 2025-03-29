import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import TestService from "../api/tests/test.service";

export const useTemplateData = () => {
    const router = useRouter();
    const {id} = router.query;
    const [test, setTest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            try {
                const data = await TestService.getTest(id);
                setTest(data);
                setLoading(false);
            } catch (err) {
                setError("Test not found");
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    return {loading, error, test};
};