import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { Link } from "react-router-dom";
import { DateRange, Info, ModelTrainingOutlined } from "@mui/icons-material";
import { useEffect, useState } from "react";
import ProductService from "../../services/ProductService.js";

export function ProductList() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    ProductService.getProducts()
      .then((response) => {
        console.log("API response:", response);
        setData(response.results);
        setLoaded(true);
      })
      .catch((error) => {
        console.error("Error:", error);
        setError(error.message || "Sucedió un error");
        setLoaded(true);
      });
  }, []);

  if (!loaded) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <Grid container sx={{ p: 2 }} spacing={3}>
      {data &&
        data.map((item) => (
          <Grid item xs={4} key={item.id}>
            <Card>
              <CardHeader
                sx={{
                  p: 0,
                  backgroundColor: (theme) => theme.palette.secondary.main,
                  color: (theme) => theme.palette.common.white,
                }}
                style={{ textAlign: "center" }}
                title={item.name}
                subheader={item.model}
              />
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  <ModelTrainingOutlined /> Descripción: {item.description}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <DateRange /> Precio: {item.price}
                </Typography>
              </CardContent>
              <CardActions
                disableSpacing
                sx={{
                  backgroundColor: (theme) => theme.palette.action.focus,
                  color: (theme) => theme.palette.common.white,
                }}
              >
                <IconButton
                  component={Link}
                  to={`/product/${item.id}`}
                  aria-label="Detalle"
                  sx={{ ml: "auto" }}
                >
                  <Info />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
    </Grid>
  );
}
