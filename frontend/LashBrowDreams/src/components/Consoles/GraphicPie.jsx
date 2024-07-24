import { Pie } from "react-chartjs-2";
import { useEffect, useState } from "react";
import InvoiceService from "../../services/InvoiceService";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';

Chart.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const ReportePastel = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartData, setChartData] = useState({});

  const fetchData = () => {
    InvoiceService.getInvoiceList()
      .then((response) => {
        const data = response.results;
        console.log("Pie", data);
        const { nombres, totales } = processData(data);
        setChartData({
          labels: nombres,
          datasets: [
            {
              label: "Total",
              data: totales,
              backgroundColor: [
                "#82670a",
                "#4f4a17",
                "#f74617",
                "#21a556",
                "#e6cb7c",
                "#116af0",
                "#2edf9a",
                "#4b1d0c",
                "#bc4ed7",
                "#c5d5d5",
              ],
              borderWidth: 1,
            },
          ],
        });
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
        setError(error);
      });
  };

  const processData = (data) => {
    const nombres = [];
    const totales = [];
    data.forEach((element) => {
      nombres.push(element.Nombre);
      totales.push(element.Total);
    });
    return { nombres, totales };
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div style={{ maxWidth: "700px", margin: "0 auto" }}>
      <h2>Total consumido por cliente</h2>
      <Pie
        data={chartData}
        options={{
          plugins: {
            legend: {
              position: "right",
              labels: {
                boxWidth: 10,
                padding: 20,
                usePointStyle: true,
              },
            },
            datalabels: {
              formatter: (value, context) => {
                return context.chart.data.labels[context.dataIndex] + '\n' + value;
              },
              color: '#fff',
              font: {
                weight: 'bold'
              }
            },
          },
        }}
      />
    </div>
  );
};

export default ReportePastel;
