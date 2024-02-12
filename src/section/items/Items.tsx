import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { DataGrid, GridRowsProp, GridColDef } from "@mui/x-data-grid";
import { DashboardOutletContext } from "../../outlets/dashboard-outlet/DashBoardOutlet";
import {
  getData,
  getItemsData,
  sendData,
  urlConst,
} from "../../utils/httpRequests";
import { useDebounce } from "../../hooks/useDebounce";
import AddNewItemModal from "../../components/adde-new-item-modal/AddNewItemModal";
import { SearchBar } from "../../components/search-bar/SearchBar";
import { columns, formFields } from "./table.const";
import { toast } from "react-toastify";
type Props = {};

const colNames: any = columns.map((item) => item.field);

const Items = (props: Props) => {
  const [openAddNew, setOpenAddNew] = useState(false);
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [pageInfo, setPageInfo] = useState({ page: 0, pageSize: 25 });
  const [editRowData, setEditRowData] = useState({});
  const searchParm = useDebounce(search, 150);

  const getdataFromServer = async () => {
    const data = await getData(urlConst.itemout, {
      page: +pageInfo.page,
      size: +pageInfo.pageSize,
      search: searchParm,
    });

    setTotal(1000);
    setRows(data);
  };

  useEffect(() => {
    getdataFromServer();
  }, [searchParm, pageInfo]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const data: any = {};

    const formData = new FormData(e.target);
    for (let [key, value] of formData.entries()) {
      data[key] = value;
    }
    console.log(data);
    await sendData(urlConst.itemIn, data);
    getdataFromServer();
    toast.success("Successfully Added");
  };
  return (
    <div className="flex h-full">
      {
        <AddNewItemModal
          hadleSubmit={handleSubmit}
          open={openAddNew}
          onClose={() => setOpenAddNew(false)}
          list={formFields}
          values={editRowData}
          isNew={!rows.length}
          newItemData={{ name: search }}
        />
      }
      {!!document.getElementById("dashboardOutletUtiltiyContainer") && (
        <>
          {createPortal(
            <SearchBar
              heading={"Item"}
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

export default Items;
