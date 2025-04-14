import {api} from "../api";

const TemplateService = {
    getTemplates: async () => {
        try {
            const response = await api.get("/test/?is_template=True");
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getSubmittedTemplatesByUser: async (id) => {
        try {
            const response = await api.get('/test/submitted/user/' + id);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    addTemplate: async (template) => {
        try {
            const response = await api.post('/template/add', template);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    copyTemplate: async (id) => {
        try {
            const response = await api.post('/template/copy/' + id);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    deleteTemplate: async (id) => {
        try {
            const response = await api.post('/template/delete/' + id);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    editTemplate: async (id, template) => {
        try {
            await TemplateService.addTemplate(template)
            await TemplateService.deleteTemplate(id)
        } catch (error) {
            throw error;
        }
    },
}

export default TemplateService;