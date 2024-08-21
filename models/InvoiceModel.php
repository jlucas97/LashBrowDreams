<?php

class InvoiceModel {
    private $link;

    public function __construct() {
        $this->link = new MySqlConnect();
    }

    public function getInvoiceListByStore($id, $query = '') {
        try {
            $vSQL = "select i.id as ID_Factura, i.date as Fecha, u.name as Nombre, it.Total, i.type as Tipo
                    from invoice as i inner join user as u on i.customerId = u.email
                    inner join invoice_total as it on i.id = it.invoiceId
                    inner join store as s on i.storeId = s.id
                    where s.id = ?";

            $params = [$id];
            if ($query) {
                $vSQL .= " AND u.name LIKE ?";
                $params[] = $query[0] . '%'; // Solo aplica el LIKE a la primera letra
            }

            $vSQL .= " Order by i.id";
            $vResult = $this->link->executeSQL($vSQL, 'obj', $params);

            return $vResult;
        } catch (Exception $e) {
            die('' . $e->getMessage());
        }
    }

    public function getInvoiceListByUser($userEmail, $query = '') {
        try {
            $vSQL = "SELECT i.id as ID_Factura, i.date as Fecha, u.name as Nombre, it.Total, i.type as Tipo
                     FROM invoice as i 
                     INNER JOIN user as u ON i.customerId = u.email
                     INNER JOIN invoice_total as it ON i.id = it.invoiceId
                     WHERE u.email = ?";
    
            $params = [$userEmail];
    
            if ($query) {
                $vSQL .= " AND u.name LIKE ?";
                $params[] = $query . '%'; // Filtrar por nombre de usuario si se proporciona un query
            }
    
            $vSQL .= " ORDER BY i.id";
            $vResult = $this->link->executeSQL($vSQL, 'obj', $params);
    
            return $vResult;
        } catch (Exception $e) {
            die('' . $e->getMessage());
        }
    }
    
    public function getProformaInvoicesByUser($userEmail, $query = '') {
        try {
            // Reutiliza la función existente para obtener todas las facturas del usuario
            $invoices = $this->getInvoiceListByUser($userEmail, $query);
    
            // Filtra las facturas que son de tipo 'Proforma'
            $proformaInvoices = array_filter($invoices, function($invoice) {
                return $invoice->Tipo === 'Proforma';
            });
    
            return $proformaInvoices;
        } catch (Exception $e) {
            die('' . $e->getMessage());
        }
    }
    

    public function getInvoiceHeading($id) {
        try {
            $vSQL = "select i.id as ID_Factura, i.date as Fecha, u.email as Correo_Electronico, u.name as Nombre,
                    s.name as Tienda, s.address as Direccion, it.subtotal as Subtotal, it.taxAmount as IVA, it.total, i.type as Tipo
                    from invoice as i inner join user as u on i.customerId = u.email
                    inner join invoice_total as it on i.id = it.invoiceId
                    inner join store as s on s.id = i.storeId
                    where i.id = ?";

            $params = [$id];
            $vResult = $this->link->executeSQL($vSQL, 'obj', $params);

            return $vResult;
        } catch (Exception $e) {
            die('' . $e->getMessage());
        }
    }

    public function getInvoiceDetailList($id) {
        try {
            $vSQL = "SELECT ind.id as ID, p.name as Producto, s.name as Servicio, ind.quantity as Cantidad, ind.total as Subtotal
                     FROM invoice_detail as ind
                     Left Join product as p on p.id = ind.productId
                     Left Join service as s on s.id = ind.serviceId
                     Where ind.invoiceId = ?
                     Order by ind.id desc";

            $params = [$id];
            $vResult = $this->link->executeSQL($vSQL, 'obj', $params);

            return $vResult;
        } catch (Exception $e) {
            die('' . $e->getMessage());
        }
    }

    public function getInvoiceMasterDetail($id) {
        try {
            $heading = $this->getInvoiceHeading($id);
            $details = $this->getInvoiceDetailList($id);
    
            if ($heading || $details) {
                return array(
                    'heading' => $heading ? $heading : 'No hay encabezado disponible',
                    'details' => $details ? $details : 'No hay detalles disponibles',
                );
            } else {
                return array(
                    'heading' => null,
                    'details' => null
                );
            }
        } catch (Exception $e) {
            die('' . $e->getMessage());
        }
    }
    

    public function createInvoice($data) {
        $this->link->connect();
        $this->link->link->begin_transaction();

        try {
            $invoiceId = $this->createInvoiceHeader($data);
            if (!$invoiceId) {
                throw new Exception("Error al crear el encabezado de la factura");
            }

            foreach ($data['details'] as $detail) {
                $detail['invoiceId'] = $invoiceId;
                $result = $this->createInvoiceDetail($detail);
                if (!$result) {
                    throw new Exception("Error al crear el detalle de la factura");
                }
            }

            $totals = [
                'invoiceId' => $invoiceId,
                'subtotal' => $data['subtotal'],
                'taxAmount' => $data['taxAmount'],
                'total' => $data['total'],
            ];

            $result = $this->createInvoiceTotal($totals);
            if (!$result) {
                throw new Exception("Error al crear los totales de la factura");
            }

            $this->link->link->commit();
            return $invoiceId;
        } catch (Exception $e) {
            $this->link->link->rollback();
            die('' . $e->getMessage());
        } finally {
            $this->link->close();
        }
    }

    private function createInvoiceHeader($data) {
        $sql = "INSERT INTO invoice (date, time, customerId, storeId, type) VALUES (?, ?, ?, ?, ?)";
        $params = [$data['date'], $data['time'], $data['customerId'], $data['storeId'], $data['type']];
        return $this->link->executeSQL_DML_last($sql, $params);
    }

    private function createInvoiceDetail($data) {
        $sql = "INSERT INTO invoice_detail (invoiceId, serviceId, productId, quantity, total) VALUES (?, ?, ?, ?, ?)";
        $params = [$data['invoiceId'], $data['serviceId'], $data['productId'], $data['quantity'], $data['total']];
        return $this->link->executeSQL_DML($sql, $params);
    }

    private function createInvoiceTotal($data) {
        $sql = "INSERT INTO invoice_total (invoiceId, subtotal, taxAmount, total) VALUES (?, ?, ?, ?)";
        $params = [$data['invoiceId'], $data['subtotal'], $data['taxAmount'], $data['total']];
        return $this->link->executeSQL_DML($sql, $params);
    }
}
