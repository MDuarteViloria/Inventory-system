import { useState, useEffect, useMemo, useContext } from "react";
import api from "../Sources/Api";
import Contexts from "../Sources/Contexts";
import { Container, Heading, Table, Button } from "@medusajs/ui";
import { DocumentText } from "@medusajs/icons";
import { useNavigate } from "react-router-dom";

export default function Products() {
  const [data, setData] = useState([]);

  const navigate = useNavigate();

  // LANG DATA
  const lang = useContext(Contexts.langContext);

  // FETCH DATA
  useEffect(() => {
/*************  ✨ Codeium Command ⭐  *************/
  /**
   * Fetches products from the API and updates the data state
   */
/******  4a1979e7-d7be-4f82-8e2b-c1bb2f46d70c  *******/
    const fetchData = async () => {
      const productResponse = await api.get("/products");
      setData(productResponse.data);
    };
    fetchData();
  }, []);

  // PAGINATION LOGIC
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10; // CHANGE TO MORE
  const pageCount = Math.ceil(data.length / pageSize);
  const canNextPage = useMemo(
    () => currentPage < pageCount - 1,
    [currentPage, pageCount]
  );
  const nextPage = () => {
    if (canNextPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  const previousPage = () => {
    if (canPreviousPage) {
      setCurrentPage(currentPage - 1);
    }
  };

  const canPreviousPage = useMemo(() => currentPage - 1 >= 0, [currentPage]);

  return (
    <>
      <div className="flex flex-col gap-4">
        <Container className="bg-primary text-white">
          <Heading level="h1">{lang.navPaths.products}</Heading>
        </Container>
        <div>
          <Button variant="secondary"><DocumentText/>{lang.products.new}</Button>
        </div>
        <div className="p-2 overflow-auto">
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>#</Table.HeaderCell>
                <Table.HeaderCell>{lang.products.headers.code}</Table.HeaderCell>
                <Table.HeaderCell>{lang.products.headers.name}</Table.HeaderCell>
                <Table.HeaderCell>{lang.products.headers.description}</Table.HeaderCell>
                <Table.HeaderCell></Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {data.map((product) => {
                return (
                  <Table.Row
                    className="cursor-pointer"
                    onClick={() => navigate("/products/edit/" + product.id)}
                    key={product.id}
                  >
                    <Table.Cell>{product.id}</Table.Cell>
                    <Table.Cell className="w-1/5">{product.Code}</Table.Cell>
                    <Table.Cell className="w-1/3 truncate">
                      {product.Name}
                    </Table.Cell>
                    <Table.Cell className="w-full truncate">
                      {product.Description}
                    </Table.Cell>
                    <Table.Cell></Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table>
        </div>
          <Table.Pagination
            count={data.length}
            pageSize={pageSize}
            pageIndex={currentPage}
            pageCount={Number.parseInt(data.length / pageSize)}
            canPreviousPage={canPreviousPage}
            canNextPage={canNextPage}
            previousPage={previousPage}
            nextPage={nextPage}
          />
      </div>
    </>
  );
}
