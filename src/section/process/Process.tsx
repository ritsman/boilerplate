import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "react-toastify";
import ProcessFormModal from "../../components/process-form-modal/ProcessFormModal";
import { SearchBar } from "../../components/search-bar/SearchBar";
import SizeFormModal from "../../components/size-form-modal/SizeFormModal";
import UnitFormModal from "../../components/unit-form-modal/UnitFormModal";
import { useDebounce } from "../../hooks/useDebounce";
import {
  getData,
  getItemsData,
  sendData,
  urlConst,
} from "../../utils/httpRequests";
import { columns, formField } from "./table.const";

const colNames: any = columns.map((item) => item.field);

const Process = () => {
  const [openAddNew, setOpenAddNew] = useState(false);
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [pageInfo, setPageInfo] = useState({ page: 0, pageSize: 25 });
  const [editRowData, setEditRowData] = useState<any>({});
  const searchParm = useDebounce(search, 150);
  const getdataFromServer = async () => {
    const data = await getData(urlConst.processout, {
      page: +pageInfo.page,
      size: +pageInfo.pageSize,
      search: searchParm,
    });
    // const items = data.data.map((item: any, idx: number) => {
    //   const temp: any = {};
    //   item.forEach((obj: any, idx: number) => {
    //     temp[colNames[idx]] = obj;
    //   });
    //   temp["id"] = idx;
    //   temp["activities"] = [
    //     "Cutting",
    //     "Drillind",
    //     "Cutting",
    //     "Welding",
    //     "Embosing",
    //   ];
    //   return temp;
    // });
    setTotal(1000);
    setRows(data);
  };

  useEffect(() => {}, []);
  useEffect(() => {
    getdataFromServer();
  }, [searchParm, pageInfo]);
  const handleSubmit = async (e: any) => {
    console.log(e);
    await sendData(urlConst.processin, e);
    toast.success("Sucessfully added");
    getdataFromServer();
  };
  return (
    <div className="flex h-full">
      {openAddNew && (
        <ProcessFormModal
          onSubmit={handleSubmit}
          open={openAddNew}
          onClose={() => setOpenAddNew(false)}
          list={formField}
          values={editRowData}
          isNew={!rows.length}
          newItemData={{ process_name: search }}
          options={[
            { label: "Cutting", value: "Cutting" },
            { label: "Welding", value: "Welding" },
            { label: "Drillind", value: "Drillind" },
            { label: "Embosing", value: "Embosing" },
          ]}
        />
      )}
      {!!document.getElementById("dashboardOutletUtiltiyContainer") && (
        <>
          {createPortal(
            <SearchBar
              heading={"Process"}
              rows={rows}
              setSearch={setSearch}
              search={search}
              setOpenAddNew={() => setOpenAddNew(true)}
              isVisible={true}
            />,
            document.getElementById("dashboardOutletUtiltiyContainer")!
          )}
        </>
      )}
      <div style={{ height: "100%", width: "100%" }}>
        <DataGrid
          sx={{
            header: { fontStyle: "bold" },
            "& .super-app-theme--header": { fontWeight: "bold" },
          }}
          rows={rows}
          rowCount={total}
          columns={columns}
          onRowClick={(item) => {
            setEditRowData(item.row);
            setOpenAddNew(true);
          }}
          paginationMode={"server"}
          paginationModel={pageInfo}
          onPaginationModelChange={(e) => setPageInfo({ ...e })}
        />
      </div>
    </div>
  );
};

export default Process;
