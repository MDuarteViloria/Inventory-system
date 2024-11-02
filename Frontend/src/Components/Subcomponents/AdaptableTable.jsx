import { Table } from "@medusajs/ui";
import { useContext, useMemo, useState } from "react";
import Contexts from "../../Sources/Contexts";

function AdaptableTable({
  data = [],
  step = 10,
  columnModel = {
    order: ["Name", "id"],
    css: {
      Name: "w-full"
    },
    dataModel: {
      Name: "Nombre",
      id: "ID",
    },
  },
}) {

  const lang = useContext(Contexts.langContext);

  // PAGINATION LOGIC
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = step; // CHANGE TO MORE
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
    <>
      <div className="p-2 overflow-auto">
        <Table>
          <Table.Header>
            <Table.Row>
              {columnModel.order.map((column, i) => (
                <Table.HeaderCell className={columnModel.css && columnModel.css[column]} key={i}>
                  {columnModel.dataModel[column]}
                </Table.HeaderCell>
              ))}
              
            </Table.Row>
          </Table.Header>
          {data.slice(currentPage * pageSize, (currentPage + 1) * pageSize).map((row, i) => (
            <Table.Row key={i}>
              {columnModel.order.map((column, j) => (
                <Table.Cell key={j}>{row[column]}</Table.Cell>
              ))}
            </Table.Row>
          ))}
        </Table>
        <Table.Pagination
        className="flex flex-wrap"
        count={data.length}
        pageSize={pageSize}
        pageIndex={currentPage}
        pageCount={Number.parseInt(data.length / pageSize)}
        canPreviousPage={canPreviousPage}
        canNextPage={canNextPage}
        previousPage={previousPage}
        nextPage={nextPage}
        translations={lang.tables}
      />
      </div>
    </>
  );
}

export default AdaptableTable;
