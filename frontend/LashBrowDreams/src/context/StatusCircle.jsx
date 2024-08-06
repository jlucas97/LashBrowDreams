import React from "react";
import { Tooltip, Box } from "@mui/material";

const StatusCircle = ({ status }) => {
  let color;
  switch (status) {
    case "Completado":
      color = "green";
      break;
    case "Pendiente":
      color = "orange";
      break;
    case "Cancelada":
      color = "red";
      break;
    default:
      color = "gray";
  }

  return (
    <Tooltip title={status}>
      <Box
        sx={{
          width: 12,
          height: 12,
          borderRadius: "50%",
          backgroundColor: color,
          margin: "auto 0",
        }}
      />
    </Tooltip>
  );
};

export default StatusCircle;
