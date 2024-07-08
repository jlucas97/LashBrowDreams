import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import InvoiceService from "../../services/InvoiceService";
import moment from "moment";
import { appTheme } from "../../themes/theme";

/*const formatDate = (dateString) => {
  return moment(dateString).format("Do MMMM YYYY");
};*/

const columns = [
  { field: "ID_Factura", headerName: "ID Factura", width: 130 },
  {
    field: "Fecha",
    headerName: "Fecha",
    width: 130,
    //valueFormatter: (params) => formatDate(params.value),
  },
  { field: "Nombre", headerName: "Nombre", width: 130 },
  { field: "Total", headerName: "Total", width: 130 },
];

export function InvoiceList() {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [selectionModel, setSelectionModel] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    InvoiceService.getInvoiceList()
      .then((response) => {
        //console.log("API response:", response);
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
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={data}
        columns={columns}
        getRowId={(row) => row.ID_Factura}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
        onRowClick={(params) => {
          setSelectionModel([params.id]);
          navigate(`/billing/${params.id}`);
        }}
        disableRowSelectionOnClick
        sx={{
          '& .MuiDataGrid-root': {
            backgroundColor: appTheme.palette.background.main,
            borderColor: appTheme.palette.primary.dark,
          },
          '& .MuiDataGrid-cell': {
            borderBottom: `1px solid ${appTheme.palette.primary.main}`,
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: appTheme.palette.primary.main,
            color: appTheme.palette.primary.contrastText,
            fontSize: 16,
          },
          '& .MuiDataGrid-row:hover': {
            backgroundColor: appTheme.palette.primary.dark,
            color: appTheme.palette.primary.contrastText,
          },
          '& .Mui-selected': {
            backgroundColor: appTheme.palette.primary.main,
            color: appTheme.palette.primary.contrastText,
            '&:hover': {
              backgroundColor: appTheme.palette.primary.dark,
            },
          },
        }}
      />
    </div>
  );
}
