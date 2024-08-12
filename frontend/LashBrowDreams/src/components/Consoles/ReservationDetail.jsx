import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Grid, Card, CardContent, CardHeader, Divider } from '@mui/material';
import ReservationServices from '../../services/ReservationServices';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  margin: theme.spacing(2),
  boxShadow: theme.shadows[3],
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.default,
}));

const StyledCardHeader = styled(CardHeader)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
}));

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(3),
}));

const InfoTypography = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(1),
}));

export function ReservationDetail() {
  const { id } = useParams();

  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    ReservationServices.getReservationById(id)
      .then(response => {
        setData(response.results[0]);
        setLoaded(true);
      })
      .catch(error => {
        setError(error);
        setLoaded(true);
      });
  }, [id]);

  if (!loaded) return <p>Cargando...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <Container component="main" sx={{ mt: 8, mb: 2 }}>
      {data && (
        <StyledCard>
          <StyledCardHeader
            title={`Reserva ${data.id}`}
            subheader={`Cliente: ${data.customerId}`}
          />
          <Divider />
          <StyledCardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <InfoTypography variant="h6">Fecha:</InfoTypography>
                <Typography>{data.date}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <InfoTypography variant="h6">Hora:</InfoTypography>
                <Typography>{data.time}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <InfoTypography variant="h6">Sucursal:</InfoTypography>
                <Typography>{data.storeId}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <InfoTypography variant="h6">Servicio:</InfoTypography>
                <Typography>{data.serviceId}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <InfoTypography variant="h6">Encargado:</InfoTypography>
                <Typography>{data.admin}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <InfoTypography variant="h6">Estado:</InfoTypography>
                <Typography>{data.status}</Typography>
              </Grid>
            </Grid>
          </StyledCardContent>
        </StyledCard>
      )}
    </Container>
  );
}
