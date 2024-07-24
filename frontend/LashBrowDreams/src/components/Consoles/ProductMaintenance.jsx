import { useState, useEffect } from "react";
import {
  Grid,
  TextField,
  Button,
  Card,
  CardHeader,
  CardContent,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box,
  Typography,
  duration,
} from "@mui/material";
import ProductServices from "../../services/ProductService";
import CategoryService from "../../services/CategoryService";
import SubCategoryService from "../../services/SubCategoryService";

export function ProductMaintenance() {
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [subcategories, setSubCategories] = useState([]);
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState("");
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description: "",
    category: "",
    subcategory: "",
    price: "",
    brand: "",
    usage: "",
  });


  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState("");

  useEffect(() => {
    ProductServices.getProducts()
      .then((response) => {
        console.log("Lista de productos:", response);
        const mappedProducts = response.results.map((product) => ({
          id: product.id,
          name: product.name,
          description: product.description || "",
          category: product.category,
          subcategory: product.subcategory,
          price: product.price,
          brand: product.brand,
          usage: product.usage,
        }));
        setProducts(mappedProducts);
      })
      .catch((error) => {
        console.error("Error al obtener los productos:", error);
      });
  }, []);

  useEffect(() => {
    CategoryService.getCategories()
      .then((response) => {
        console.log("Lista de categorías:", response);
        const mappedCategories = response.results.map((category) => ({
          id: category.id,
          name: category.name,
        }));
        setCategories(mappedCategories);
      })
      .catch((error) => {
        console.error("Error al obtener las categorías:", error);
      });
  }, []);

  console.log("num",selectedCategoryId);
  useEffect(() => {
    SubCategoryService.getSubCategoryByCategoryId(selectedCategoryId)
      .then((response) => {
        console.log("Lista de subcategorías:", response);
        const mappedSubCategories = response.results.map((subcategory) => ({
          id: subcategory.id,
          name: subcategory.name,
        }));
        setSubCategories(mappedSubCategories);
      })
      .catch((error) => {
        console.error("Error al obtener las subcategorías:", error);
      });
  }, []);


  const handleProductChange = (event) => {
    const productId = event.target.value;
    setSelectedProductId(productId);
    const selectedProduct = products.find(
      (product) => product.id === productId
    );
    if (selectedProduct) {
      setFormData({
        id: selectedProduct.id,
        name: selectedProduct.name,
        description: selectedProduct.description,
        category: selectedProduct.category,
        subcategory: selectedProduct.subcategory,
        price: selectedProduct.price,
        brand: selectedProduct.brand,
        usage: selectedProduct.usage,
      });
    }
  };

  const handleCategoryChange = (event) => {
    const categoryId = Number(event.target.value);
    setSelectedCategoryId(categoryId);
    setFormData((prevFormData) => ({
      ...prevFormData,
      category: categoryId,
    }));
  };

  const handleSubCategoryChange = (event) => {
    const subCategoryId = event.target.value;
    setSelectedSubCategoryId(subCategoryId);
    setFormData((prevFormData) => ({
      ...prevFormData,
      subcategory: subCategoryId,
    }));
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    ProductService.updateProduct(formData)
      .then((response) => {
        console.log("test");
        setUpdateSuccess(true);
        setUpdateError("");
      })
      .catch((error) => {
        console.error(error);
        setUpdateSuccess(false);
        setUpdateError(
          "Error al actualizar el producto. Por favor, inténtelo de nuevo."
        );
      });
  };

  return (
    <Grid container spacing={3} justifyContent="center" marginTop={12}>
      <Grid item xs={12} sm={8} md={6}>
        <Card>
          <CardHeader title="Mantenimiento de Productos" />
          <CardContent>
            {updateSuccess && (
              <Typography variant="body1" color="primary" gutterBottom>
                ¡Producto actualizado con éxito!
              </Typography>
            )}
            {updateError && (
              <Typography variant="body1" color="error" gutterBottom>
                {updateError}
              </Typography>
            )}
            <form onSubmit={handleSubmit}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Seleccionar Producto</InputLabel>
                <Select
                  value={selectedProductId}
                  onChange={handleProductChange}
                  label="Seleccionar Producto"
                  required
                >
                  {products.length > 0 ? (
                    products.map((product) => (
                      <MenuItem key={product.id} value={product.id}>
                        {product.name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem value="" disabled>
                      No hay productos disponibles
                    </MenuItem>
                  )}
                </Select>
              </FormControl>
              <TextField
                name="id"
                label="ID"
                fullWidth
                required
                margin="normal"
                type="text"
                value={formData.id}
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                name="name"
                label="Nombre"
                fullWidth
                required
                margin="normal"
                value={formData.name}
                onChange={handleChange}
              />
              <TextField
                name="description"
                label="Descripción"
                fullWidth
                required
                margin="normal"
                multiline
                rows={4}
                value={formData.description}
                onChange={handleChange}
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Categoría</InputLabel>
                <Select
                  value={formData.category}
                  onChange={handleCategoryChange}
                  label="Seleccionar Categoría"
                  required
                >
                  {categories.length > 0 ? (
                    categories.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem value="" disabled>
                      No hay categorías disponibles
                    </MenuItem>
                  )}
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal">
                <InputLabel>Subcategoría</InputLabel>
                <Select
                  value={formData.subcategory}
                  onChange={handleSubCategoryChange}
                  label="Seleccionar Subcategoría"
                  required
                >
                  {subcategories.length > 0 ? (
                    subcategories.map((subcategory) => (
                      <MenuItem key={subcategory.id} value={subcategory.id}>
                        {subcategory.name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem value="" disabled>
                      No hay subcategorías disponibles
                    </MenuItem>
                  )}
                </Select>
              </FormControl>
              <TextField
                name="price"
                label="Precio"
                fullWidth
                required
                margin="normal"
                type="number"
                value={formData.price}
                onChange={handleChange}
                inputProps={{
                  min: "0",
                }}
              />
              <TextField
                name="duration"
                label="Duración en minutos"
                fullWidth
                required
                margin="normal"
                type="number"
                value={formData.duration}
                onChange={handleChange}
                inputProps={{
                  min: "0",
                }}
              />
              
              
              <TextField
                name="type"
                label="Tipo"
                fullWidth
                required
                margin="normal"
                value={formData.type}
                InputProps={{
                  readOnly: true,
                }}
              />
              <Box mt={3}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  Crear / Actualizar servicio
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
