import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
//import moment from "moment";
import { appTheme } from "../../themes/theme";
import ReservationServices from "../../services/ReservationServices";
import StatusCircle from "../../context/StatusCircle";

/*const formatDate = (dateString) => {
  return moment(dateString).format("Do MMMM YYYY");
};*/

const columns = [
  { field: "ID", headerName: "ID", width: 50 },
  {
    field: "Fecha",
    headerName: "Fecha",
    width: 130,
  },
  { field: "hora", headerName: "Hora", width: 130 },
  { field: "cliente", headerName: "Cliente", width: 130 },
  { field: "servicio", headerName: "Servicio", width: 200 },
  { field: "tienda", headerName: "Sucursal", width: 160 },
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
  const [selectionModel, setSelectionModel] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    ReservationServices.getReservations()
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

  console.log("Data", data);

  if (!loaded) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={data}
          columns={columns}
          getRowId={(row) => row.ID}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          pageSizeOptions={[5, 10]}
          onRowClick={(params) => {
            setSelectionModel([params.id]);
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
