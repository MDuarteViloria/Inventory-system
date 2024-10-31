import Contexts from "../../Sources/Contexts";
import { useContext, useMemo, useState } from "react";
import { Table, DropdownMenu, IconButton } from "@medusajs/ui";
import { EllipsisHorizontal, PencilSquare, Eye, Trash } from "@medusajs/icons";
import seeProduct from "../Utilities/seeProduct";

export default function ProductsTable({ data }) {
  const lang = useContext(Contexts.langContext);

  // PAGINATION LOGIC
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10; // CHANGE TO MORE
  const pageCount = Math.ceil(data.length / pageSize);
  const canNextPage = useMemo(
    () => currentPage < pageCount - 1,
    [currentPage, pageCount]
  );
  const canPreviousPage = useMemo(() => currentPage - 1 >= 0, [currentPage]);
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

  return (
    <div className="p-2 overflow-auto">
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>#</Table.HeaderCell>
            <Table.HeaderCell>{lang.products.headers.code}</Table.HeaderCell>
            <Table.HeaderCell>{lang.products.headers.name}</Table.HeaderCell>
            <Table.HeaderCell>
              {lang.products.headers.description}
            </Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {data.map((product) => {
            return (
              <Table.Row className="cursor-pointer" key={product.id}>
                <Table.Cell>{product.id}</Table.Cell>
                <Table.Cell className="w-1/5">{product.Code}</Table.Cell>
                <Table.Cell className="w-1/3 truncate">
                  {product.Name}
                </Table.Cell>
                <Table.Cell className="w-full truncate">
                  {product.Description}
                </Table.Cell>
                <Table.Cell>
                  <ProductDropdown product={product}/>
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
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
  );
}

export function ProductDropdown({ product }) {
  const lang = useContext(Contexts.langContext);

  return (
    <>
      <DropdownMenu>
        <DropdownMenu.Trigger asChild>
          <IconButton>
            <EllipsisHorizontal />
          </IconButton>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item onClick={() => {
            seeProduct(product, lang);
          }} className="gap-x-2">
            <Eye className="text-ui-fg-subtle" />
            {lang.general.see}
          </DropdownMenu.Item>
          <DropdownMenu.Item className="gap-x-2">
            <PencilSquare className="text-ui-fg-subtle" />
            {lang.general.edit}
          </DropdownMenu.Item>
          <DropdownMenu.Separator />
          <DropdownMenu.Item className="gap-x-2">
            <Trash className="text-ui-fg-subtle" />
            {lang.general.delete}
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>
    </>
  );
}