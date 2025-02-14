import axios from 'axios';

export const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

export class TestSubmission {
    constructor(testId, userId, answers) {
        this.test_id = testId;
        this.user_id = userId;
        this.answers = answers;
    }
}

export class Answer {
    constructor(question_id, option_id) {
        this.question_id = question_id;
        this.option_id = option_id;
    }
}

export const getAllTests = async () => {
    try {
        const response = await api.get("/test");
        console.log("API Response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching tests:", error);
    }
}

export const submitTest = async (test) => {
    try {
        const response = await api.post('/test/submit', test);
        return response.data;
    } catch (error) {
        console.error('Error submitting test:', error);
        throw error;
    }
};

export const getTest = async (id) => {
    try {
        const response = await api.get('/test/' + id);
        return response.data;
    } catch (error) {
        console.error('Error fetching test:', error);
        throw error;
    }
}

export const getQuestionsForTest = async (id) => {
    try {
        const response = await api.get('/questions' + id);
        return response.data;
    } catch (error) {
        console.error('Error fetching test:', error);
        throw error;
    }
}