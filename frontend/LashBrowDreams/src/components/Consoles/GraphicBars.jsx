import { Chart } from "chart.js/auto";
import { useEffect, useRef } from "react";
import ProductService from '../../services/ProductService';

const GraphicBars = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    ProductService.getProducts()
      .then((response) => {
        const data = response.results;
        drawChart(data);
      })
      .catch((error) => console.error("Error fetching data: ", error));
  };

  const drawChart = (data) => {
    const labels = data.map((item) => item.name);
    const values = data.map((item) => item.price);

    const ctx = chartRef.current.getContext("2d");
    new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Precio Unitario",
            data: values,
            backgroundColor: "#f74617",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        indexAxis: "x",
        scales: {
          x: {
            beginAtZero: true,
          },
        },
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });
  };


  return (
    <div style={{ maxWidth: "540px", margin: "0 auto" }}>
      <h2>Precio Unitario por Producto</h2>
      <canvas ref={chartRef} width="400" height="400"></canvas>
    </div>
  );
};

export default GraphicBars;
