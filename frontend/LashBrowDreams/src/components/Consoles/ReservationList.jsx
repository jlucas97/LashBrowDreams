import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { appTheme } from "../../themes/theme";
import ReservationServices from "../../services/ReservationServices";
import StatusCircle from "../../context/StatusCircle";

const columns = [
  { field: "id", headerName: "ID", width: 50 },
  {
    field: "date",
    headerName: "Fecha",
    width: 130,
  },
  { field: "time", headerName: "Hora", width: 130 },
  { field: "customerId", headerName: "Cliente", width: 130 },
  { field: "serviceId", headerName: "Servicio", width: 200 },
  { field: "storeId", headerName: "Sucursal", width: 160 },
  {
    field: "status",
    headerName: "Estado de la cita",
    width: 160,
    renderCell: (params) => (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%', marginRight: '1000%' }}>
        <StatusCircle status={params.value} />
      </div>
    ),
  },
  {
    field: "admin", headerName: "Encargado", width: 180
  }
];

export function ReservationList() {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  const storeId = localStorage.getItem("selectedStoreId");

  useEffect(() => {
    if (storeId) {
      ReservationServices.getReservationsByStoreAndUser(storeId)
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
    } else {
      setError("Store ID not found in localStorage");
      setLoaded(true);
    }
  }, [storeId]);

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const handleSearch = () => {
    if (storeId) {
      ReservationServices.getReservationsByStoreAndUser(storeId, null, search)
        .then((response) => {
          setData(response.results);
        })
        .catch((error) => {
          console.error("Error:", error);
          setError(error.message || "Sucedió un error");
        });
    }
  };

  console.log("Data", data);

  if (!loaded) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <div>
        <TextField
          label="Buscar por cliente"
          value={search}
          onChange={handleSearchChange}
        />
        <Button onClick={handleSearch} variant="contained" color="primary">
          Buscar
        </Button>
      </div>
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={data}
          columns={columns}
          getRowId={(row) => row.id}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          pageSizeOptions={[5, 10]}
          onRowClick={(params) => {
            navigate(`/reservation/${params.id}`);
          }}
          disableRowSelectionOnClick
          sx={{
            "& .MuiDataGrid-root": {
              backgroundColor: appTheme.palette.background.main,
              borderColor: appTheme.palette.primary.dark,
            },
            "& .MuiDataGrid-cell": {
              borderBottom: `1px solid ${appTheme.palette.primary.main}`,
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: appTheme.palette.primary.main,
              color: appTheme.palette.primary.contrastText,
              fontSize: 16,
            },
            "& .MuiDataGrid-row:hover": {
              backgroundColor: appTheme.palette.primary.dark,
              color: appTheme.palette.primary.contrastText,
            },
            "& .Mui-selected": {
              backgroundColor: appTheme.palette.primary.main,
              color: appTheme.palette.primary.contrastText,
              "&:hover": {
                backgroundColor: appTheme.palette.primary.dark,
              },
            },
          }}
        />
      </div>
    </>
  );
}
