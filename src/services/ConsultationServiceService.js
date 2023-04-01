import axios from "axios";
const baseUrl = process.env.VUE_APP_API_BASE_URL+"api/consultation_service/";
import auth from "@/services/auth";
const requestOptions = {
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': ""
    }
};
export default {
    addServicesToConsultation(services, consultation_id) {
        requestOptions.headers.Authorization = "Bearer "+auth.actions.getEmployeeToken();
        return axios.post(baseUrl+"addServicesToConsultation/"+consultation_id,{"services": services}, requestOptions);
    }
}