import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { TextField, Button, Grid, Typography, MenuItem, IconButton } from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import { toast } from 'react-toastify';
import InvoiceService from '../../services/InvoiceService';
import ProductService from '../../services/ProductService';
import UserService from '../../services/UserService';

const InvoiceForm = () => {
  const { control, handleSubmit, register, watch, setValue } = useForm({
    defaultValues: {
      customerId: '',
      products: [{ productId: '', quantity: 1, price: 0, subtotal: 0 }],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'products',
  });
  const watchFields = watch('products');
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [store, setStore] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [total, setTotal] = useState(0);
  const [tax, setTax] = useState(0);

  useEffect(() => {
    // Fetch products and customers
    ProductService.getProducts().then((response) => {
      console.log("Productos:", response.results);
      setProducts(response.results);
    });

    UserService.getUsers().then((response) => {
      console.log("Clientes:", response.results);
      setCustomers(response.results);
    });

    const storedStore = JSON.parse(localStorage.getItem('selectedStoreId'));
    const storedAdmin = JSON.parse(localStorage.getItem('currentAdmin'));
    console.log("Store:", storedStore);
    console.log("Admin:", storedAdmin);

    setStore(storedStore);
    setAdmin(storedAdmin);
  }, []);

  useEffect(() => {
    const subtotal = watchFields.reduce((acc, curr) => acc + (curr.subtotal || 0), 0);
    const calculatedTax = subtotal * 0.13; // Assuming 13% tax
    setTax(calculatedTax);
    setTotal(subtotal + calculatedTax);
  }, [watchFields]);

  const onSubmit = (data) => {
    if (!store || !admin) {
      toast.error('Error: Store or Admin information is missing');
      return;
    }

    const invoiceData = {
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString(),
      customerId: data.customerId,
      storeId: store.id,
      type: 'Factura',
      details: data.products.map((product) => ({
        productId: product.productId,
        quantity: product.quantity,
        total: product.subtotal,
      })),
      subtotal: watchFields.reduce((acc, curr) => acc + curr.subtotal, 0),
      taxAmount: tax,
      total: total,
    };

    InvoiceService.createInvoice(invoiceData)
      .then(() => {
        toast.success('Factura registrada con éxito');
      })
      .catch(() => {
        toast.error('Error al registrar la factura');
      });
  };

  const handleProductChange = (index, field, value) => {
    const product = products.find((p) => p.id === value);
    if (product) {
      setValue(`products.${index}.price`, product.price);
      setValue(`products.${index}.subtotal`, product.price * watchFields[index].quantity);
    }
  };

  const handleQuantityChange = (index, value) => {
    const price = watchFields[index].price;
    setValue(`products.${index}.subtotal`, price * value);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Typography variant="h4" align="center" gutterBottom>
        Registrar Factura
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <TextField
            label="Fecha"
            value={new Date().toLocaleDateString()}
            fullWidth
            InputProps={{
              readOnly: true,
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Sucursal"
            value={store ? store.name : 'Cargando...'}
            fullWidth
            InputProps={{
              readOnly: true,
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <Controller
            name="customerId"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                select
                label="Cliente"
                fullWidth
                onChange={(e) => {
                  field.onChange(e.target.value);
                  const customer = customers.find((c) => c.id === e.target.value);
                  if (customer) {
                    setValue('customerName', customer.name);
                    setValue('customerEmail', customer.email);
                  }
                }}
              >
                {customers.map((customer) => (
                  <MenuItem key={customer.id} value={customer.id}>
                    {customer.name}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Encargado"
            value={admin ? admin.name : 'Cargando...'}
            fullWidth
            InputProps={{
              readOnly: true,
            }}
          />
        </Grid>
      </Grid>
      <Typography variant="h5" gutterBottom marginTop={4}>
        Detalle de Productos/Servicios
      </Typography>
      {fields.map((item, index) => (
        <Grid container spacing={3} key={item.id} alignItems="center">
          <Grid item xs={4}>
            <Controller
              name={`products.${index}.productId`}
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="Producto/Servicio"
                  fullWidth
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    handleProductChange(index, field, e.target.value);
                  }}
                >
                  {products.map((product) => (
                    <MenuItem key={product.id} value={product.id}>
                      {product.name}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              label="Precio"
              {...register(`products.${index}.price`)}
              InputProps={{
                readOnly: true,
              }}
              fullWidth
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              label="Cantidad"
              type="number"
              {...register(`products.${index}.quantity`)}
              onChange={(e) => handleQuantityChange(index, e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              label="Subtotal"
              {...register(`products.${index}.subtotal`)}
              InputProps={{
                readOnly: true,
              }}
              fullWidth
            />
          </Grid>
          <Grid item xs={2}>
            <IconButton onClick={() => remove(index)}>
              <Delete />
            </IconButton>
          </Grid>
        </Grid>
      ))}
      <Button
        variant="contained"
        color="primary"
        onClick={() => append({ productId: '', quantity: 1, price: 0, subtotal: 0 })}
        startIcon={<Add />}
        style={{ marginTop: '16px' }}
      >
        Añadir Producto/Servicio
      </Button>
      <Grid container spacing={3} marginTop={4}>
        <Grid item xs={6}>
          <TextField label="Subtotal" value={watchFields.reduce((acc, curr) => acc + (curr.subtotal || 0), 0)} fullWidth readOnly />
        </Grid>
        <Grid item xs={6}>
          <TextField label="Impuesto (13%)" value={tax} fullWidth readOnly />
        </Grid>
        <Grid item xs={6}>
          <TextField label="Total" value={total} fullWidth readOnly />
        </Grid>
      </Grid>
      <Button type="submit" variant="contained" color="primary" style={{ marginTop: '16px' }}>
        Registrar Factura
      </Button>
    </form>
  );
};

export default InvoiceForm;
