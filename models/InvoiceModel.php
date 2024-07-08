<?php

class InvoiceModel
{
    //Connect to DB
    public $link;

    public function __construct()
    {
        $this->link = new MySqlConnect();
    }

    /**
     * Get all Invoices
     * @param
     * @return $vResult - List of object
     */

    public function getInvoiceList()
    {
        try {
            //SQL Query
            $vSQL = "select i.id as ID_Factura, i.date as Fecha, u.name as Nombre, it.Total
                    from invoice as i inner join user as u on i.customerId = u.email
                    inner join invoice_total as it on i.id = it.invoiceId
                    Order by i.id desc";
            //Query execution
            $vResult = $this->link->executeSQL($vSQL);

            return $vResult;
        } catch (Exception $e) {
            die('' . $e->getMessage());
        }
    }

    public function getInvoiceHeading($id)
    {
        try {
            $vSQL = "select i.id as ID_Factura, i.date as Fecha, u.email as Correo_Electronico, u.name as Nombre,
                    s.name as Tienda, s.address as Direccion, it.subtotal as Subtotal, it.taxAmount as IVA, it.total
                    from invoice as i inner join user as u on i.customerId = u.email
                    inner join invoice_total as it on i.id = it.invoiceId
                    inner join store as s on s.id = i.storeId
                    where i.id = $id";

            $vResult = $this->link->executeSQL(($vSQL));

            return $vResult;
        } catch (Exception $e) {
            die('' . $e->getMessage());
        }
    }

    public function getInvoiceDetailList($id)
    {
        try {
            $vSQL = "SELECT  ind.id as ID, p.name as Producto, s.name as Servicio, ind.quantity as Cantidad, ind.total as Subtotal
                     FROM invoice_detail as ind
                     Left Join product as p on p.id = ind.productId
                     Left Join service as s on s.id = ind.serviceId
                     Where ind.invoiceId = $id
                     Order by ind.id desc";

            $vResult = $this->link->executeSQL(($vSQL));

            return $vResult;
        } catch (Exception $e) {
            die('' . $e->getMessage());
        }
    }

    public function getInvoiceMasterDetail($id)
    {
        try {
            $heading = $this->getInvoiceHeading($id);
            $details = $this->getInvoiceDetailList($id);

            return array(
                'heading' => $heading,
                'details' => $details
            );
        } catch (Exception $e) {
            die('' . $e->getMessage());
        }
    }
}
