import axios from "axios";
import borneService from "@/services/BorneService";
import auth from "@/services/auth";
const baseUrl = process.env.VUE_APP_API_BASE_URL+"api/wheel/";
const requestOptions = {
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': ""
    }
};

export default {
    play() {
        requestOptions.headers.Authorization = "Bearer "+auth.actions.getCLientToken();
        return axios.post(baseUrl+"play",{'borne_id': borneService.getBorneId()}, requestOptions);
    },
    getChancesByBorneId() {
        requestOptions.headers.Authorization = "Bearer "+auth.actions.getCLientToken();
        return axios.get(baseUrl+"getChancesByBorneId/"+borneService.getBorneId(), requestOptions);

    }
}