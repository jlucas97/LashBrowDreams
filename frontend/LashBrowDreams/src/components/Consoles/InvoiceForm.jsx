import React, { useState, useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import {
  TextField,
  Button, Grid, Typography, MenuItem, IconButton,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { toast } from "react-toastify";
import InvoiceService from "../../services/InvoiceService";
import ProductService from "../../services/ProductService";
import ServiceServices from "../../services/ServiceService";
import UserService from "../../services/UserService";

const InvoiceForm = () => {
  const { control, handleSubmit, register, watch, setValue, reset } = useForm({
    defaultValues: {
      customerId: '',
      products: [{ productId: '', quantity: 1, price: 0, subtotal: 0, tax: 0, total: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "products" });
  const watchFields = watch("products");
  const [items, setItems] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [store, setStore] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [total, setTotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [proformas, setProformas] = useState([]);
  const [hasProformas, setHasProformas] = useState(false); // Variable para manejar si hay proformas
  const [selectedProformaId, setSelectedProformaId] = useState(null); // Estado para el ID de la proforma seleccionada
  const taxRate = 0.13;

  useEffect(() => {
    // Cargar productos y servicios
    Promise.all([ProductService.getProducts(), ServiceServices.getServices()])
      .then(([productResponse, serviceResponse]) => {
        const products = productResponse.data || productResponse.results;
        const services = serviceResponse;

        const combinedItems = [
          ...products.map((product) => ({ ...product, type: 'product' })),
          ...services.map((service) => ({ ...service, type: 'service' }))
        ];

        setItems(combinedItems);
      })
      .catch(() => { toast.error("Error al obtener productos o servicios"); });

    // Cargar clientes
    UserService.getUsers()
      .then((response) => { setCustomers(response.data || response.results); })
      .catch(() => { toast.error("Error al obtener los clientes"); });

    // Cargar información de la tienda y administrador desde localStorage
    const storedStore = localStorage.getItem("selectedStoreId");
    const storedAdmin = localStorage.getItem("adminName");

    setStore(storedStore);
    setAdmin(storedAdmin);
  }, []);

  useEffect(() => {
    // Calcular subtotal, impuesto y total
    const subtotal = watchFields.reduce((acc, curr) => acc + (curr.subtotal || 0), 0);
    const calculatedTax = subtotal * taxRate;
    setTax(calculatedTax);
    setTotal(subtotal + calculatedTax);
  }, [watchFields]);

  const onSubmit = (data) => {
    if (!data.customerId) {
      toast.error("Debe seleccionar un cliente");
      return;
    }

    if (!store || !admin) {
      toast.error("Error: Store o Admin information is missing");
      return;
    }

    const invoiceData = {
      id: selectedProformaId, // Usar el ID de la proforma si está presente
      date: new Date().toISOString().split("T")[0],
      time: new Date().toLocaleTimeString(),
      customerId: data.customerId,
      storeId: store,
      type: "Facturado", // Cambiar el tipo a "Facturado"
      details: data.products.map((product) => ({
        productId: product.productId,
        quantity: product.quantity,
        subtotal: product.subtotal,
        tax: product.tax,
        total: product.total,
      })),
      subtotal: watchFields.reduce((acc, curr) => acc + curr.subtotal, 0),
      taxAmount: tax,
      total: total,
    };

    // Si se seleccionó una proforma, actualizar en lugar de crear
    const submitPromise = selectedProformaId 
      ? InvoiceService.updateInvoice(invoiceData) 
      : InvoiceService.createInvoice(invoiceData);

    submitPromise
      .then(() => { 
        toast.success(selectedProformaId ? "Factura actualizada con éxito" : "Factura registrada con éxito"); 
      })
      .catch(() => { 
        toast.error("Error al registrar la factura"); 
      });
  };

  const handleCustomerChange = (customerId) => {
    setValue("customerId", customerId);
    InvoiceService.getProformasByUser(customerId)
      .then((response) => {
        const proformaArray = Object.values(response); // Convertir el objeto en un array
        console.log("Proformas obtenidas después de conversión a array:", proformaArray);
        if (proformaArray.length > 0) {
          setProformas(proformaArray);
          setHasProformas(true); // Habilitar el dropdown si hay proformas
        } else {
          setProformas([]);
          setHasProformas(false); // Deshabilitar el dropdown si no hay proformas
        }
      })
      .catch(() => {
        toast.error("Error al obtener las proformas del cliente");
      });
  };

  const handleProformaSelect = (proformaId) => {
    console.log("Proforma seleccionada:", proformaId); // Verificación de la selección
    setSelectedProformaId(proformaId); // Guardar el ID de la proforma seleccionada
    InvoiceService.getInvoiceData(proformaId)
      .then((proformaData) => {
        console.log("Datos de la proforma cargados:", proformaData.results.details); // Verificación de los datos recibidos
        
        const products = proformaData.results.details.map(detail => {
          const matchedItem = items.find(item => item.name === detail.Servicio);
          return {
            productId: matchedItem ? matchedItem.id : '', 
            item: matchedItem ? matchedItem.name : '', 
            quantity: detail.quantity || 1, 
            price: detail.Subtotal, 
            subtotal: detail.Subtotal,
            tax: detail.Subtotal  * taxRate,
            total: detail.Subtotal * taxRate + detail.Subtotal,
          };
        });

        // Mantener el valor del cliente al hacer reset
        const currentCustomerId = watch("customerId");

        reset({ ...proformaData.results.heading, customerId: currentCustomerId, products });
        updateTotals();
      })
      .catch(() => { toast.error("Error al cargar la proforma seleccionada"); });
  };

  const handleItemChange = (index, value) => {
    const item = items.find((p) => p.id === value);
    if (item) {
      const quantity = item.type === 'service' ? 1 : watchFields[index].quantity;
      const subtotal = item.price * quantity;
      const tax = subtotal * taxRate;
      const total = subtotal + tax;

      setValue(`products.${index}.price`, item.price);
      setValue(`products.${index}.quantity`, quantity);
      setValue(`products.${index}.subtotal`, subtotal);
      setValue(`products.${index}.tax`, tax);
      setValue(`products.${index}.total`, total);

      updateTotals();
    }
  };

  const handleQuantityChange = (index, value) => {
    const price = watchFields[index].price;
    const subtotal = price * value;
    const tax = subtotal * taxRate;
    const total = subtotal + tax;

    setValue(`products.${index}.subtotal`, subtotal);
    setValue(`products.${index}.tax`, tax);
    setValue(`products.${index}.total`, total);

    updateTotals();
  };

  const updateTotals = () => {
    const subtotal = watchFields.reduce((acc, curr) => acc + (curr.subtotal || 0), 0);
    const calculatedTax = subtotal * taxRate;
    setTax(calculatedTax);
    setTotal(subtotal + calculatedTax);
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
            value={store}
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
                  handleCustomerChange(e.target.value);
                  field.onChange(e.target.value);
                }}
              >
                {customers.map((customer) => (
                  <MenuItem key={customer.email} value={customer.email}>
                    {customer.name} ({customer.email})
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Seleccionar Proforma"
            select
            fullWidth
            disabled={!hasProformas} // Deshabilitado si no hay proformas
            onChange={(e) => handleProformaSelect(e.target.value)}
          >
            {proformas.map((proforma) => (
              <MenuItem key={proforma.ID_Factura} value={proforma.ID_Factura}>
                ID: #{proforma.ID_Factura} - {proforma.Fecha} - ₡{proforma.Total}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Encargado"
            value={admin}
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
        <Grid container spacing={2} key={item.id} alignItems="center">
          <Grid item xs={3}>
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
                    setValue(`products.${index}.productId`, e.target.value);
                    field.onChange(e.target.value);
                    handleItemChange(index, e.target.value);
                  }}
                >
                  {items.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.name} {item.Nombre}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Grid>
          <Grid item xs={1.5}>
            <TextField
              label="Precio"
              {...register(`products.${index}.price`)}
              value={`₡${watch(`products.${index}.price`) || 0}`}
              InputProps={{
                readOnly: true,
              }}
              fullWidth
            />
          </Grid>
          <Grid item xs={1.5}>
            <TextField
              label="Cantidad"
              type="number"
              {...register(`products.${index}.quantity`)}
              onChange={(e) => handleQuantityChange(index, e.target.value)}
              fullWidth
              InputProps={{
                readOnly: items[index]?.type === 'service',
              }}
            />
          </Grid>
          <Grid item xs={1.5}>
            <TextField
              label="Subtotal"
              {...register(`products.${index}.subtotal`)}
              value={`₡${watch(`products.${index}.subtotal`) || 0}`}
              InputProps={{
                readOnly: true,
              }}
              fullWidth
            />
          </Grid>
          <Grid item xs={1.5}>
            <TextField
              label="Impuesto"
              {...register(`products.${index}.tax`)}
              value={`₡${watch(`products.${index}.tax`) || 0}`}
              InputProps={{
                readOnly: true,
              }}
              fullWidth
            />
          </Grid>
          <Grid item xs={1.5}>
            <TextField
              label="Total"
              {...register(`products.${index}.total`)}
              value={`₡${watch(`products.${index}.total`) || 0}`}
              InputProps={{
                readOnly: true,
              }}
              fullWidth
            />
          </Grid>
          <Grid item xs={0.5}>
            <IconButton onClick={() => remove(index)}>
              <Delete />
            </IconButton>
          </Grid>
        </Grid>
      ))}
      <Button
        variant="contained"
        color="primary"
        onClick={() =>
          append({ productId: "", quantity: 1, price: 0, subtotal: 0, tax: 0, total: 0 })
        }
        startIcon={<Add />}
        style={{ marginTop: "16px" }}
      >
        Añadir Producto/Servicio
      </Button>
      <Grid container spacing={3} marginTop={4}>
        <Grid item xs={4}>
          <TextField
            label="Subtotal"
            value={`₡${watchFields.reduce(
              (acc, curr) => acc + (curr.subtotal || 0),
              0
            )}`}
            fullWidth
            readOnly
          />
        </Grid>
        <Grid item xs={4}>
          <TextField label="Impuesto (13%)" value={`₡${tax}`} fullWidth readOnly />
        </Grid>
        <Grid item xs={4}>
          <TextField label="Total" value={`₡${total}`} fullWidth readOnly />
        </Grid>
      </Grid>
      <Button
        type="submit"
        variant="contained"
        color="primary"
        style={{ marginTop: "16px" }}
      >
        Registrar Factura
      </Button>
    </form>
  );
};

export default InvoiceForm;
