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
        throw error;
    }
}

export const getActiveTests = async () => {
    try {
        const response = await api.get("/test/active");
        console.log("API Response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching tests:", error);
        throw error;
    }
}

export const getTemplates = async () => {
    try {
        const response = await api.get("/test?is_template=True");
        console.log("API Response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching tests:", error);
        throw error;
    }
}

export const submitTest = async (test) => {
    try {
        const response = await api.post('/test/submit', test);
        return response.data;
    } catch (error) {
        console.error('Error submitting tests:', error);
        throw error;
    }
};

export const getTest = async (id) => {
    try {
        const response = await api.get('/test/' + id);
        return response.data;
    } catch (error) {
        console.error('Error fetching tests:', error);
        throw error;
    }
}

export const getSubmittedTests = async (id) => {
    try {
        const response = await api.get("/test/" + id + "/submitted");
        console.log("API Response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching tests:", error);
        throw error;
    }
}


export const getSubmittedTest = async (id) => {
    try {
        const response = await api.get('/test/submitted/' + id);
        return response.data;
    } catch (error) {
        console.error('Error fetching tests:', error);
        throw error;
    }
}

export const getSubmittedTemplatesByUser = async (id) => {
    try {
        const response = await api.get('/test/submitted/user/' + id);
        return response.data;
    } catch (error) {
        console.error('Error fetching tests:', error);
        throw error;
    }
}
export const addTemplate = async (template) => {
    try {
        const response = await api.post('/template/add', template);
        return response.data;
    } catch (error) {
        console.error('Error adding template:', error);
        throw error;
    }
}

export const copyTemplate = async (id) => {
    try {
        const response = await api.post('/template/copy/' + id);
        return response.data;
    } catch (error) {
        console.error('Error copying template:', error);
        throw error;
    }
}

export const deleteTemplate = async (id) => {
    try {
        const response = await api.post('/template/delete/' + id);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const editTemplate = async (id, template) => {
    try {
        await addTemplate(template)
        await deleteTemplate(id)
    } catch (error) {
        throw error;
    }
}
export const addTest = async (test) => {
    try {
        const response = await api.post('/test/add', test);
        return response.data;
    } catch (error) {
        console.error('Error adding tests:', error);
        throw error;
    }
}


export const activateTest = async (id) => {
    try {
        const response = await api.post('/test/activate/' + id);
        return response.data;
    } catch (error) {
        console.error('Error adding tests:', error);
        throw error;
    }
}


export const checkExistingTests = async (id) => {
    try {
        const response = await api.get(`/template/check_existing_tests/` + id);
        return response.data;
    } catch (error) {
        console.error('Error checking existing tests:', error);
        throw error;
    }
}

export const checkTestSubmissions = async (testId) => {
    try {
        const response = await api.get(`/test/${testId}/has_submissions`);
        return response.data;
    } catch (error) {
        console.error('Error checking submissions:', error);
        return true;
    }
};


export const getEditTest = async (id) => {
    try {
        const response = await api.get('/test/edit/' + id);
        return response.data;
    } catch (error) {
        console.error('Error fetching test:', error);
        throw error;
    }
}


export const editTest = async (testId, test) => {
    return api.post(`/test/edit/${testId}`, test);
};

export const deleteTest = async (testId) => {
    return api.post(`/test/delete/${testId}`);
};
