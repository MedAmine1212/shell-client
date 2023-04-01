import axios from "axios";
const baseUrl = process.env.VUE_APP_API_BASE_URL+"api/advertisement/";
const requestOptions = {
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': ""
    }
};
export default {
    getARandomAd(borne_id) {
        return axios.get(baseUrl+"getARandomAd/"+borne_id,requestOptions);
    }
}