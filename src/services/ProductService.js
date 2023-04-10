import axios from "axios";
const baseUrl = process.env.VUE_APP_API_BASE_URL+"api/product/";
import BorneService from "@/services/BorneService";
import auth from "@/services/auth";
const requestOptions = {
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': ""
    }
};
export default {
        checkout(products) {
            requestOptions.headers.Authorization = "Bearer "+auth.actions.getCLientToken();
            return axios.post(baseUrl + "checkout",{"products":products}, requestOptions);
        },
        findAllByStationId() {
            return axios.get(baseUrl + "findAllByStationId/"+BorneService.getStationId(), requestOptions);
        },
        getImageByProductId(id) {
            return axios.get(baseUrl + "getImageByProductId/"+id, requestOptions);
        },


}