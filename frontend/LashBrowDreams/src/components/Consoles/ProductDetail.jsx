import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Grid } from '@mui/material';
import ProductService from '../../services/ProductService';

export function ProductDetails() {
  const routeParams= useParams();
  //console.log(routeParams)

   //Resultado de consumo del API, respuesta
 const[data,setData]=useState(null);
 //Error del API
 const[error,setError]=useState('');
 //Booleano para establecer sí se ha recibido respuesta
 const[loaded,setLoaded]=useState(false);
   useEffect(()=>{


   
    ProductService.getProductById(routeParams.id)
    .then( response=>{
      setData(response.data.results)
      //console.log(response.data)
      setError(response.error)
      setLoaded(true)
    }
    ).catch( error=>{
      //console.log(error)
      setError(error)
      throw new Error("Respuesta no válida del servidor")
    }      
    )
  },[routeParams.id]) 

  console.log(data)
  if(!loaded) return <p>Cargando...</p>
  if(error) return <p>Error: {error.message}</p>
  return (
    <Container component='main' sx={{ mt: 8, mb: 2 }} >
      {data && ( 
        
        <Grid container spacing={2}
        sx={{ boxShadow: 3, borderRadius: 2, p: 2, backgroundColor: 'background.paper' }}>
          <Grid item={true} xs={7}>  
                      
              <Typography variant='h4' component='h1' gutterBottom>
                
               {data.product_name}
              </Typography>
              <Typography variant='subtitle1' component='h1' gutterBottom>
               {data.description}
              </Typography>
              <Typography component='span' variant='subtitle1' display='block'>
                <Box fontWeight='bold' display='inline'>
                  Precio:  
                </Box>{' '} {data.price} {' '}
                  Colones
              </Typography>
              <Typography component='span' variant='subtitle1' display='block'>
                <Box fontWeight='bold' display='inline'>
                  Cantidad de usos:
                </Box>{' '} {data.usage}
                
              </Typography>
              <Typography component='span' variant='subtitle1' display='block'>
                <Box fontWeight='bold' display='inline'>
                  Marca:
                </Box>{' '} {data.brand}
                
              </Typography>
              
              <Typography component='span' variant='subtitle1' display='block'>
                <Box fontWeight='bold' display='inline'>
                  Categoria:
                </Box>{' '} {data.category_name}
                
              </Typography>
              <Typography component='span' variant='subtitle1' display='block'>
                <Box fontWeight='bold' display='inline'>
                  SubCategoria:
                </Box>{' '} {data.subcategory_name}
                
              </Typography>
          </Grid>
        </Grid>
     )}
    </Container>
  );
}
