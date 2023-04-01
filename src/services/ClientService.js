import axios from "axios";
const baseUrl = process.env.VUE_APP_API_BASE_URL+"api/client/";
const requestOptions = {
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': ""
    }
};

export default {
    add(client) {
        return axios.post(baseUrl+"addClient",{'firstName': client.firstName, 'lastName': client.lastName, 'phone':client.phone,'email': client.email}, requestOptions);
    }
}