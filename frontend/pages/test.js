import {TestView} from "../components/test/TestView";
import {api} from "../utils/api";

const questions = [
    {id: 1, question: "How do you feel?", options: ["1", "2", "3", "4", "5"]},
    {id: 2, question: "Are you ok?", options: ["1", "2", "3", "4", "5"]}
];

export default function StartTest() {

    return (
        <div>
            <TestView title="Employee Test" description="This is a test" questions={questions}/>
        </div>
    );
}


export const getTests = async () => {
    try {
        const response = await api.get('/tests'); // Adjust the endpoint if necessary
        return response.data;
    } catch (error) {
        console.error('Error fetching tests:', error);
        throw error;
    }
};

export const submitTest = async (testId, answers) => {
    try {
        const response = await api.post('/submit', { testId, answers });
        return response.data;
    } catch (error) {
        console.error('Error submitting test:', error);
        throw error;
    }
};

export const getQuestionForTest = async (id) => {
    const questions = await api.get('/questions/' + id);
}

