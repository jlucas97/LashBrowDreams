import axios from "axios";
const BASE_URL = "http://localhost:81/lashbrowdreams";

class UserService {
    getUserOnSearchBar(id) {
        return axios.get(`${BASE_URL}/user/get/${id}`)
            .then(response => {
                console.log("User API response:", response); // Log the API response
                return response.data;
            })
            .catch(error => {
                console.error("Error al obtener el usuario:", error);
                throw error;
            });
    }

    getCustomerById(customerId) {
        return axios.get(`${BASE_URL}/user/get/${customerId}`)
            .then(response => response.data.results[0])
            .catch(error => {
                throw error;
            });
    }

    getUsers() {
        return axios.get(`${BASE_URL}/user`)
            .then(response => response.data)
            .catch(error => {
                throw error;
            });
    }

    getAdminByStore(storeId) {
        return axios.get(`${BASE_URL}/user/getAdminByStore/${storeId}`)
            .then(response => {
                console.log("Admin API response:", response); // Log the API response
                return response.data;
            })
            .catch(error => {
                console.error("Error al obtener el administrador:", error);
                throw error;
            });
    }

    login(email, password) {
        return axios.post(`${BASE_URL}/user/login`, {
            email: email,
            password: password,
        })
        .then(response => {
            console.log("Login API response:", response);
            return response.data;
        })
        .catch(error => {
            console.error("Error during login:", error);
            throw error;
        });
    }

    
}

export default new UserService();
