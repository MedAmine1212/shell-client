import axios from "axios";
import CryptoJS from 'crypto-js'

const baseUrl = process.env.VUE_APP_API_BASE_URL+"api/";
const CLIENT_TOKEN = "client_access_token";
const EMPLOYEE_TOKEN = "employee_access_token";
const BARCODE = "barcode";
const CLIENT_BARCODE = "client_barcode";
export default {
    actions: {

        setClientBarCode(barCode) {
            this.removeClientBarCode();
            window.localStorage.setItem(CLIENT_BARCODE, CryptoJS.AES.encrypt(barCode, process.env.VUE_APP_SHELL_SECRET).toString());
        },
        getClientBarCode() {
            if(window.localStorage.getItem(CLIENT_BARCODE))
                return CryptoJS.AES.decrypt(window.localStorage.getItem(CLIENT_BARCODE), process.env.VUE_APP_SHELL_SECRET).toString(CryptoJS.enc.Utf8);
            return null;
        },
        removeClientBarCode() {
            if(window.localStorage.getItem(CLIENT_BARCODE))
                window.localStorage.removeItem(CLIENT_BARCODE);
        },

        setBarCode(barCode) {
            this.removeBarCode();
            window.localStorage.setItem(BARCODE, CryptoJS.AES.encrypt(barCode, process.env.VUE_APP_SHELL_SECRET).toString());
        },
        getBarCode() {
            if(window.localStorage.getItem(BARCODE))
                return CryptoJS.AES.decrypt(window.localStorage.getItem(BARCODE), process.env.VUE_APP_SHELL_SECRET).toString(CryptoJS.enc.Utf8);
            return null;
        },
        removeBarCode() {
            if(window.localStorage.getItem(BARCODE))
                window.localStorage.removeItem(BARCODE);
        },
        setClientToken(token) {
            this.removeClientToken();
            window.localStorage.setItem(CLIENT_TOKEN, CryptoJS.AES.encrypt(token, process.env.VUE_APP_SHELL_SECRET).toString());
        },
        getCLientToken() {
            if(window.localStorage.getItem(CLIENT_TOKEN))
                return CryptoJS.AES.decrypt(window.localStorage.getItem(CLIENT_TOKEN), process.env.VUE_APP_SHELL_SECRET).toString(CryptoJS.enc.Utf8);
            return null;
        },
        removeClientToken() {
            if(window.localStorage.getItem(CLIENT_TOKEN))
                window.localStorage.removeItem(CLIENT_TOKEN);
        },

        setEmployeeToken(token) {
            this.removeEmployeeToken();
            window.localStorage.setItem(EMPLOYEE_TOKEN, CryptoJS.AES.encrypt(token, process.env.VUE_APP_SHELL_SECRET).toString());
        },
        getEmployeeToken() {
            if(window.localStorage.getItem(EMPLOYEE_TOKEN))
                return CryptoJS.AES.decrypt(window.localStorage.getItem(EMPLOYEE_TOKEN), process.env.VUE_APP_SHELL_SECRET).toString(CryptoJS.enc.Utf8);
            return null;
        },
        removeEmployeeToken() {
            if(window.localStorage.getItem(EMPLOYEE_TOKEN))
                window.localStorage.removeItem(EMPLOYEE_TOKEN);
        },
        authenticate(barCode) {
            return axios.post(baseUrl+"authenticate/client",{"barCode": barCode});
        }
    }
}