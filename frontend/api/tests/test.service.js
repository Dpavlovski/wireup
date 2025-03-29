import {api} from "../api";

export class TestSubmission {
    constructor(testId, userId, answers) {
        this.test_id = testId;
        this.user_id = userId;
        this.answers = answers;
    }
}
const TestService = {

    getTests: async () => {
        try {
            const response = await api.get("/test?is_template=False");
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getActiveTests: async () => {
        try {
            const response = await api.get("/test/active");
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    submitTest: async (test) => {
        try {
            const response = await api.post('/test/submit', test);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getTest: async (id) => {
        try {
            const response = await api.get('/test/' + id);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getSubmittedTests: async (id) => {
        try {
            const response = await api.get("/test/" + id + "/submitted");
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getSubmittedTest: async (id) => {
        try {
            const response = await api.get('/test/submitted/' + id);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    addTest: async (test) => {
        try {
            const response = await api.post('/test/add', test);
            return response.data;
        } catch (error) {
            throw error;
        }
    },


    activateTest: async (id) => {
        try {
            const response = await api.post('/test/activate/' + id);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    checkExistingTests: async (id) => {
        try {
            const response = await api.get(`/template/check_existing_tests/` + id);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    checkTestSubmissions: async (testId) => {
        try {
            const response = await api.get(`/test/${testId}/has_submissions`);
            return response.data;
        } catch (error) {
            return true;
        }
    },

    getEditTest: async (id) => {
        try {
            const response = await api.get('/test/edit/' + id);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    editTest: async (testId, test) => {
        return api.post(`/test/edit/${testId}`, test);
    },

    deleteTest: async (testId) => {
        return api.post(`/test/delete/${testId}`);
    },

    exportTest: async (testId) => {
        return api.post(`/test/export/${testId}`, {}, {responseType: "blob"});
    }

}

export default TestService;