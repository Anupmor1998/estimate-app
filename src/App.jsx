import axios from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import DataTable from "./components/DataTable";

function App() {
  const [sections, setSections] = useState([]);
  const getData = useCallback(async () => {
    const res = await axios.get("/data.json");
    setSections(res.data?.data?.sections);
  }, []);

  useEffect(() => {
    getData();
  }, [getData]);

  const columns = useMemo(
    () => [
      { accessorKey: "item_type_display_name", header: "Type" },
      { accessorKey: "item_type_name", header: "Item Name" },
      {
        accessorKey: "quantity",
        header: "QTY",
        cell: ({ getValue }) => (getValue() !== "" ? getValue() : 0),
      },
      {
        accessorKey: "unit_cost",
        header: "Unit Cost",
        cell: ({ getValue }) => `$${Math.round(getValue() / 100).toFixed(2)}`,
      },
      { accessorKey: "unit", header: "Unit" },
      {
        accessorKey: "total",
        header: "Total",
        cell: ({ getValue }) => `$${getValue()}`,
      },
      { accessorKey: "tax_rate", header: "Tax" },
      { accessorKey: "subject", header: "Cost Code" },
    ],
    [],
  );

  const filteredSections = useMemo(
    () =>
      sections
        ?.filter((sec) => sec?.items?.length)
        ?.map((sec) => {
          const items = sec?.items?.map((item) => {
            return {
              ...item,
              unit_cost: `${Number(Math.round(item?.unit_cost / 100)).toFixed(
                2,
              )}`,
              total: `${Number(Math.round(item?.total / 100)).toFixed(2)}`,
            };
          });
          return {
            ...sec,
            items,
          };
        }) || [],
    [sections],
  );

  return (
    <div className="min-h-screen w-full p-4">
      {filteredSections?.map((section) => (
        <DataTable
          key={section?.section_id}
          sectionTotal={Math.round(
            Number(section?.section_total) / 100,
          ).toFixed(2)}
          sectionTitle={section?.section_name}
          columns={columns}
          data={section?.items}
        />
      ))}
    </div>
  );
}

export default App;
