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

    login(email, password, storeId ) {
        return axios.post(`${BASE_URL}/user/login`, { email, password, storeId })
            .then(response => {
                if (response.data.status === 200) {
                    const { token, user } = response.data.results;
                    localStorage.setItem("userToken", token);
                    localStorage.setItem("userRole", user.roleId);
                    localStorage.setItem("userEmail", user.email);
                    localStorage.setItem("userName", user.name);
    
                    if (user.roleId === 1 || user.roleId === 2) {
                        localStorage.setItem("adminEmail", user.email);
                        localStorage.setItem("adminName", user.name);
                    }
                    return user.roleId;
                } else {
                    throw new Error("Credenciales inválidas");
                }
            })
            .catch(error => {
                console.error("Error durante el inicio de sesión:", error);
                throw error;
            });
    }
    

    logout() {
        localStorage.removeItem("userToken");
        localStorage.removeItem("userRole");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userName");
        localStorage.removeItem("adminEmail");
        localStorage.removeItem("adminName");
    }

    getRole() {
        const role = localStorage.getItem("userRole");
        return role ? role : "guest";
    }
    

    isLoggedIn() {
        const role = this.getRole();
        return role !== "guest" && role !== null && role !== undefined;
    }
    

    getUserEmail() {
        return localStorage.getItem("userEmail");
    }

    getUserName() {
        return localStorage.getItem("userName");
    }

    getAdminEmail() {
        return localStorage.getItem("adminEmail");
    }

    getAdminName() {
        return localStorage.getItem("adminName");
    }
}

export default new UserService();
