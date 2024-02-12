import { GridColDef } from "@mui/x-data-grid";

export const generateProductionColums = (data: any[]): GridColDef[] => {
  let set = new Set();
  for (let i of data) {
    set = new Set([...set.values(), ...i.sizes]);
  }
  const list: GridColDef[] = [
    {
      field: "styleName",
      headerName: "Style Name",
      renderHeader: (param) => (
        <div className="font-bold">{param.colDef.headerName}</div>
      ),
    },
  ];
  [...set.values()].forEach((item: any) => {
    list.push({
      field: item,
      headerName: item,
      minWidth: 200,
      renderHeader: (param) => (
        <div className="font-bold">{param.colDef.headerName}</div>
      ),
      renderCell: (param) => {
        console.log(param);

        return param.row.sizes.includes(param.colDef.field) ? (
          <input
            name={item}
            className="border border-slate-600 h-10 w-44 text-lg"
          />
        ) : (
          <></>
        );
      },
    });
  });
  return list;
};
export const getStyles = () => [
  { id: 1, styleName: "Style 1", sizes: ["S", "M", "L"] },
  { id: 2, styleName: "Style 2", sizes: ["M", "L", "XL"] },
  { id: 3, styleName: "Style 3", sizes: ["S", "M", "L"] },
  { id: 4, styleName: "Style 4", sizes: ["XL", "XXL"] },
  { id: 5, styleName: "Style 5", sizes: ["S", "M", "L"] },
];
