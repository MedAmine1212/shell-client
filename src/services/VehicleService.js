import axios from "axios";
const baseUrl = process.env.VUE_APP_API_BASE_URL+"api/vehicle/";
const requestOptions = {
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': ""
    }
};

export default {
    getAllCarBrands() {
        return axios.get(baseUrl+"getAllCarBrands",requestOptions);
    },
    getModelsByBrand(brand) {
        return axios.get(baseUrl+"getModelsByBrand/"+brand,requestOptions);
    },
    add(client_id,vehicle) {
        return axios.post(baseUrl+"add/"+client_id,{"matricule":vehicle.matricule,"brand": vehicle.brand,"model": vehicle.model,"year": vehicle.year,"fuelType": vehicle.fueltype, "mileage": vehicle.mileage, "lastOilChange": vehicle.lastOilChange},requestOptions);
    },
}