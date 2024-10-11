import { Container, Heading } from "@medusajs/ui";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import api from "../Sources/Api";
import { useContext } from "react";
import Contexts from "../Sources/Contexts";

export default function Home() {
  const [data, setData] = useState(null);

  const lang = useContext(Contexts.langContext);

  useEffect(() => {
    const fetchData = async () => {
      const productResponse = await api.get("/products");

      setData({
        productLength: productResponse.data.length,
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
          <Heading level="h2">{lang.dashboard.products}</Heading>
          <Heading level="h1" className="text-2xl">
            {data?.productLength}
          </Heading>
        </Container>
        <Container>
          <Heading level="h2">{lang.dashboard.entries}</Heading>
          <Heading level="h1" className="text-2xl">
            {data?.entriesLenght}
          </Heading>
        </Container>
        <Container>
          <Heading level="h2">{lang.dashboard.movements}</Heading>
          <Heading level="h1" className="text-2xl">
            {data?.movementsLength}
          </Heading>
        </Container>
      </div>
      {/* {data && <Line data={data?.chartData} options={{ responsive: true }} />} */}
    </>
  );
}
