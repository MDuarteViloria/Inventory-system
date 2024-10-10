import { Container, Heading } from "@medusajs/ui";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import api from "../Sources/Api";

export default function Home() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await api.get("/products");
      const productLength = await response.json().length;

      setData({
        productLength,
        movementsLength: 0,
        entriesLenght: 0,
        chartData: {
          labels: [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
          ],
          datasets: [
            {
              label: "My First Dataset",
              data: [65, 59, 80, 81, 56, 55, 40],
              fill: false,
              borderColor: "rgb(75, 192, 192)",
              tension: 0.1,
            },
          ],
        },
      });
    };
    fetchData();
  }, []);

  return (
    <>
      <Container>
        <Heading level="h1">Inventory Management System</Heading>
      </Container>
      <div className="flex justify-stretch mt-8 gap-4 [&_>div]:flex [&_>div]:justify-between [&_>div]:py-10">
        <Container>
          <Heading level="h3">Productos</Heading>
          <Heading level="h1" className="text-2xl">
            0
          </Heading>
        </Container>
        <Container>
          <Heading level="h3">
            Entradas de
            <br />
            Inventario
          </Heading>
          <Heading level="h1" className="text-2xl">
            0
          </Heading>
        </Container>
        <Container>
          <Heading level="h3">
            Movimientos de
            <br />
            Inventario
          </Heading>
          <Heading level="h1" className="text-2xl">
            0
          </Heading>
        </Container>
      </div>
      {data && <Line data={data?.chartData} options={{ responsive: true }} />}
    </>
  );
}
