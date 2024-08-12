import React from 'react';
import { Link } from 'react-router-dom';
import { Grid, Card, CardHeader, CardActions, Button, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledContainer = styled('div')(({ theme }) => ({
  padding: theme.spacing(4),
  textAlign: 'center',
}));

const StyledCard = styled(Card)(({ theme }) => ({
  width: '400px',
  height: '150px', 
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  padding: theme.spacing(2),
}));

const StyledCardHeader = styled(CardHeader)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  textAlign: 'center',
  padding: theme.spacing(1),
}));

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  color: theme.palette.secondary.contrastText,
  '&:hover': {
    backgroundColor: theme.palette.secondary.dark,
  },
  marginTop: theme.spacing(1),
  padding: theme.spacing(1, 2),
}));

export function Management() {
  const management = [
    {
      id: 1,
      title: 'Gestión Reservas',
      form: 'reservation',
    },
    {
      id: 2,
      title: 'Gestión Facturas',
      form: 'invoice',
    },
  ];

  return (
    <StyledContainer>
      <Typography variant="h2" gutterBottom marginBottom={8}>
        Página de Gestión
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        {management.map((management) => (
          <Grid item xs={12} sm={8} md={6} key={management.id}>
            <StyledCard>
              <StyledCardHeader title={management.title} />
              <CardActions sx={{ justifyContent: 'center' }}>
                <StyledButton component={Link} to={`/management/${management.form}`} variant="contained">
                  Ir a {management.title}
                </StyledButton>
              </CardActions>
            </StyledCard>
          </Grid>
        ))}
      </Grid>
    </StyledContainer>
  );
}
