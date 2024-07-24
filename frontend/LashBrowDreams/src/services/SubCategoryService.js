import axios from "axios";
const BASE_URL = "http://localhost:81/lashbrowdreams";


class SubCategoryServices {

    // Obtener las subcategorías según la categoría padre
    getSubCategoryByCategoryId(id) {
        return axios.get(`${BASE_URL}/subcategory/${id}`)
            .then(response => {
                //console.log("Detalle de servicios:", response);
                return response;
            })
            .catch(error => {
                console.error("Error al obtener la subcategoría:", error);
                throw error;
            });
    }
}

export default new SubCategoryServices();