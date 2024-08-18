import axios from "axios";
const BASE_URL = "http://localhost:81/lashbrowdreams";

class UserService {
    getUserOnSearchBar(id) {
        return axios.get(`${BASE_URL}/user/get/${id}`)
            .then(response => response.data)
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
            .then(response => response.data)
            .catch(error => {
                console.error("Error al obtener el administrador:", error);
                throw error;
            });
    }

    login(email, password) {
        return axios.post(`${BASE_URL}/user/login`, { email, password })
            .then(response => {
                if (response.data.status === 200) {
                    localStorage.setItem("userToken", response.data.results.token);
                    localStorage.setItem("userRole", response.data.results.user.roleId);
                    return response.data.results.user.roleId;
                } else {
                    throw new Error("Credenciales inválidas");
                }
            })
            .catch(error => {
                console.error("Error during login:", error);
                throw error;
            });
    }

    logout() {
        localStorage.removeItem("userToken");
        localStorage.removeItem("userRole");
    }

    getRole() {
        return localStorage.getItem("userRole") || "guest";
    }

    isLoggedIn() {
        return this.getRole() !== "guest";
    }
}

export default new UserService();
