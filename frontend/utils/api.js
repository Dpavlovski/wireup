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


export const getTests = async () => {
    try {
        const response = await api.get("/test?is_template=False");
        console.log("API Response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching tests:", error);
    }
}

export const getTemplates = async () => {
    try {
        const response = await api.get("/test?is_template=True");
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
    }
};

export const getTest = async (id) => {
    try {
        const response = await api.get('/test/' + id);
        return response.data;
    } catch (error) {
        console.error('Error fetching test:', error);
    }
}

export const getSubmittedTests = async (id) => {
    try {
        const response = await api.get("/test/" + id + "/submitted");
        console.log("API Response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching tests:", error);
    }
}


export const getSubmittedTest = async (id) => {
    try {
        const response = await api.get('/test/submitted/' + id);
        return response.data;
    } catch (error) {
        console.error('Error fetching test:', error);
    }
}

export const addTemplate = async (template) => {
    try {
        const response = await api.post('/test/add_template', template);
        return response.data;
    } catch (error) {
        console.error('Error adding template:', error);
    }
}


export const addTest = async (test) => {
    try {
        const response = await api.post('/test/add', test);
        return response.data;
    } catch (error) {
        console.error('Error adding test:', error);
    }
}

