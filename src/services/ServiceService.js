import axios from "axios";
const baseUrl = process.env.VUE_APP_API_BASE_URL+"api/service/";
import auth from './../services/auth.js'
import BorneService from "@/services/BorneService";
const requestOptions = {
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': ""
    }
};
export default {
        findAllByStationId() {
            requestOptions.headers.Authorization = "Bearer " + auth.actions.getEmployeeToken();
            return axios.get(baseUrl + "findAllByStationId/"+BorneService.getStationId(), requestOptions);
        },

}