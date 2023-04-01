import axios from "axios";
const baseUrl = process.env.VUE_APP_API_BASE_URL+"api/borne/";
import CryptoJS from "crypto-js";
const BORNE_ID ="borne_id";
const STATION_ID ="station_id";
const requestOptions = {
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': ""
    }
};
export default {
    setStationId(station_id) {
        this.removeStationId();
        window.localStorage.setItem(STATION_ID, CryptoJS.AES.encrypt(station_id.toString(), process.env.VUE_APP_SHELL_SECRET).toString());
    },
    getStationId() {
        if(window.localStorage.getItem(STATION_ID))
            return CryptoJS.AES.decrypt(window.localStorage.getItem(STATION_ID), process.env.VUE_APP_SHELL_SECRET).toString(CryptoJS.enc.Utf8);
        return null;
    },
    removeStationId() {
        if(window.localStorage.getItem(STATION_ID))
            window.localStorage.removeItem(STATION_ID);
    },
    setBorneId(borne_id) {
        this.removeBorneId();
        window.localStorage.setItem(BORNE_ID, CryptoJS.AES.encrypt(borne_id.toString(), process.env.VUE_APP_SHELL_SECRET).toString());
    },
    getBorneId() {
        if(window.localStorage.getItem(BORNE_ID))
            return CryptoJS.AES.decrypt(window.localStorage.getItem(BORNE_ID), process.env.VUE_APP_SHELL_SECRET).toString(CryptoJS.enc.Utf8);
        return null;
    },
    removeBorneId() {
        if(window.localStorage.getItem(BORNE_ID))
            window.localStorage.removeItem(BORNE_ID);
    },
    pingBorne(borne_id) {
        return axios.get(baseUrl+"heartbeat/"+borne_id,requestOptions);
    },
    findBorneById(borne_id) {
        return axios.get(baseUrl+"findBorneById/"+borne_id,requestOptions);
    }
}