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
      });
    };
    fetchData();
  }, []);

  return (
    <>
      <Container className="bg-primary text-white">
        <Heading level="h1">Inventory Management System</Heading>
      </Container>
      <div className="flex mt-8 gap-4 h-auto flex-wrap container-responsive-wrap">
        <Container>
          <Heading level="h2">Productos</Heading>
          <Heading level="h1" className="text-2xl">
            0
          </Heading>
        </Container>
        <Container>
          <Heading level="h2">
            Entradas de
            <br />
            Inventario
          </Heading>
          <Heading level="h1" className="text-2xl">
            0
          </Heading>
        </Container>
        <Container>
          <Heading level="h2">
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
