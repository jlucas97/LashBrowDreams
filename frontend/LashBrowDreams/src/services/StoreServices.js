import axios from "axios";
const BASE_URL = "http://localhost:81/lashbrowdreams";

const WEATHER_API_KEY = "3c0438352314bba7fae97ccf68bf51b5";


class StoreServices {

    // Obtener las subcategorías según la categoría padre
    getStores() {
        return axios.get(`${BASE_URL}/store`)
            .then(response => {
                //console.log("Detalle de servicios:", response);
                return response;
            })
            .catch(error => {
                console.error("Error al obtener la sucursal:", error);
                throw error;
            });
    }

    getWeather(city) {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_API_KEY}&units=metric&lang=es`;
        return axios.get(url)
            .then(response => {
                return response;
            })
            .catch(error => {
                console.error("Error al obtener los datos del clima:", error);
                throw error;
            });
    }
}

export default new StoreServices();