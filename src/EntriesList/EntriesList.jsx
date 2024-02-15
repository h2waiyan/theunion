import { useState } from "react";
import { MdEdit } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Pagination from "react-js-pagination";

const EntriesList = () => {
  // Navigate to Edit Page
  const navigate = useNavigate();
  const handleEdit = (data) => {
    navigate(`/${data.entryid}`, { state: data });
  };

  const { data } = useSelector((state) => state.entries);
  console.log(data);
  const entries = data.entries;

  // const { data, isLoading, isSuccess, error } = useGetEntriesQuery();

  // Pagination
  const [activePage, setActivePage] = useState(1);
  const itemsCountPerPage = 35;
  const totalItemsCount = entries.length;
  const indexOfLastItem = activePage * itemsCountPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsCountPerPage;
  const currentEntries = entries.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="container mx-auto mt-3 p-3">
      <h1 className="text-lg text-center mx-3 mb-5 font-bold">
        Name & Sectors
      </h1>
      {/* {isLoading && <h1>Loading...</h1>}

      {!isLoading && error && <h1> Cannot Get Data </h1>} */}
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-900">
          <thead className="text-xs text-gray-700 uppercase bg-gray-200">
            <tr>
              <th scope="col" className="col-span-4 p-3 w-52">
                No.
              </th>
              <th scope="col" className="col-span-4 p-3">
                Name
              </th>
              <th scope="col" className="col-span-3 p-3">
                Email
              </th>
              <th scope="col" className="col-span-1 p-3">
                Role
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {currentEntries.map((entry, index) => (
              <tr
                className={index % 2 === 0 ? "bg-white" : "bg-slate-100"}
                key={entry.entryid}
              >
                <td className="p-3">{entry.name}</td>
                <td className="p-3">
                  {entry.sectors.map((sector) => sector.name).join(", ")}
                </td>
                <td className="p-3">{entry.agreetoterms ? "Yes" : "No"}</td>
                <td className="p-3">
                  <MdEdit
                    className="hover:text-yellow-500 hover:cursor-pointer"
                    title="Edit"
                    onClick={() => {
                      handleEdit({
                        ...entry,
                        sectors: entry.sectors.map((el) => el.sectorid),
                      });
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {currentEntries.length === 0 && (
        <p className="flex justify-center text-center p-3 m-3">No Data</p>
      )}
      <div className="flex flex-row justify-center my-4">
        <Pagination
          activePage={activePage}
          itemsCountPerPage={itemsCountPerPage}
          totalItemsCount={totalItemsCount}
          pageRangeDisplayed={5}
          onChange={(pageNumber) => setActivePage(pageNumber)}
          itemClass="inline-block m-1 p-1  w-6 md:m-3 md:p-3 md:w-10 text-center leading-none border border-gray-300 rounded hover:border-gray-500"
          linkClass="text-black-500 hover:text-blue-800"
          activeLinkClass="text-black font-bold"
        />
      </div>
    </div>
  );
};

export default EntriesList;
