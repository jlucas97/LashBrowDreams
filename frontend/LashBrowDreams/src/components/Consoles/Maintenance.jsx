import { Link } from "react-router-dom";
import {
  Grid,
  Card,
  CardHeader,
  CardActions,
  Button,
  Typography,
} from "@mui/material";

export function Maintenance() {
  const maintenances = [
    {
      id: 1,
      title: "Mantenimiento Productos",
    },
    {
      id: 2,
      title: "Mantenimiento Servicios",
      form: "service"
    },
    {
      id: 3,
      title: "Mantenimiento Sucursal",
      form: "productOrder",
    },
    {
      id: 4,
      title: "Mantenimiento horario"
    }
  ];

  return (
    <div>
      <Typography variant="h2" align="center" gutterBottom marginBottom={"120px"}>
        Página de Mantenimientos
      </Typography>
      <Grid container spacing={6}>
        {maintenances.map((maintenance) => (
          <Grid item xs={4} key={maintenance.id}>
            <Card>
              <CardHeader
                title={maintenance.title}
                style={{
                  backgroundColor: "#A8CEC0",
                  color: "white",
                  textAlign: "center",
                  
                }}
              />
              <CardActions style={{ justifyContent: "center",  }}>
                <Button
                  component={Link}
                  to={`/maintenance/${maintenance.form}`}
                  variant="contained"
                  color="primary"
                  style={{backgroundColor: "#FF7AA2",
                    color: "white"
                  }}
                >
                  Ir a {maintenance.title}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
