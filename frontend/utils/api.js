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

export const register = async (username, password) => {
    const response = await api.post(`/auth/register`, {username, password}, {withCredentials: true});
    return response.data;
};

export const login = async (username, password) => {
    const response = await api.post(`/auth/login`, {username, password}, {withCredentials: true});
    return response.data;
};

export const logout = async () => {
    await api.post(`/auth/logout`, {}, {withCredentials: true});
};

export const fetchUser = async () => {
    try {
        const response = await api.get(`/auth/me`, {withCredentials: true});
        return response.data;
    } catch (error) {
        return null;
    }
};


export const getTests = async () => {
    try {
        const response = await api.get("/test?is_template=False");
        console.log("API Response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching tests:", error);
    }
}

export const getActiveTests = async () => {
    try {
        const response = await api.get("/test/active");
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
        console.error('Error submitting tests:', error);
    }
};

export const getTest = async (id) => {
    try {
        const response = await api.get('/test/' + id);
        return response.data;
    } catch (error) {
        console.error('Error fetching tests:', error);
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
        console.error('Error fetching tests:', error);
    }
}

export const getSubmittedTemplatesByUser = async (id) => {
    try {
        const response = await api.get('/test/submitted/' + id);
        return response.data;
    } catch (error) {
        console.error('Error fetching tests:', error);
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
        console.error('Error adding tests:', error);
    }
}


export const activateTest = async (id) => {
    try {
        const response = await api.post('/test/activate/' + id);
        return response.data;
    } catch (error) {
        console.error('Error adding tests:', error);
    }
}
