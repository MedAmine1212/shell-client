import axios from "axios";
const baseUrl = process.env.VUE_APP_API_BASE_URL+"api/consultation/";
import auth from "@/services/auth";
const requestOptions = {
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': ""
    }
};
export default {
    clientLastConsultation() {
        requestOptions.headers.Authorization = "Bearer "+auth.actions.getCLientToken();
        return axios.get(baseUrl+"clientLastConsultation",requestOptions);
    },
    create(type) {
        requestOptions.headers.Authorization = "Bearer "+auth.actions.getEmployeeToken();
        return axios.post(baseUrl+"createConsultationByEmployee",{"barCode": auth.actions.getClientBarCode(), "type":type}, requestOptions);
    },
}