import React from "react";
import axios from "axios";
import Pagination from "react-js-pagination";
import { useState, useEffect } from "react";
import { MdEdit, MdDelete } from "react-icons/md";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { LoadingDialog } from "../Loading/LoadingDialog";
import nodata from "../../public/nodata.webp";


const Accounts = () => {
  const navigate = useNavigate();

  const role = localStorage.getItem("role");

  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [searchEmail, setSearchEmail] = useState("");
  const [searchRole, setSearchRole] = useState(0);

  const [deleteLoading, setDeleteLoading] = useState(false);

  const getAccounts = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://127.0.0.1:8000/api/accounts");
      setAccounts(response.data["accounts"]);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (data) => {
    navigate(`/add-account/${data.id}`, { state: data });
  };

  const handleDelete = async (data) => {
    try {
        setDeleteLoading(true);
      const response = await axios.delete(
        "http://127.0.0.1:8000/api/accounts/" + data.id + "/delete"
      );
      if (response.status === 200) {
        getAccounts();
      }
    } catch (error) {
      setError(error);
    } finally {
      setDeleteLoading(false);
    }
  };

  // Pagination
  const [activePage, setActivePage] = useState(1);
  const itemsCountPerPage = 15;
  const totalItemsCount = accounts.length;
  const indexOfLastItem = activePage * itemsCountPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsCountPerPage;
  const currentAccounts = accounts.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    getAccounts();
  }, []);

  return (
    <div className="container mx-auto mt-3 p-3">
      <div className="flex justify-between items-center align-center">
        <h1 className="text-lg font-bold">Accounts</h1>

        <NavLink
          to="/add-account"
          className="bg-custom-blue text-white px-4 py-2 rounded"
        >
          Add Account
        </NavLink>

        { loading && <LoadingDialog />}
        { deleteLoading && <LoadingDialog />}

      </div>

      {/* { Add a filter function with Email and Role} */}
      <div className="flex flex-row justify-end my-2">
        <input
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
          type="text"
          placeholder="Search by Email"
          className="border-2 border-gray-300 p-2 w-full rounded-lg"
        />
        <select
          className="border-2 border-gray-300 p-2 rounded-lg ms-2"
          onChange={(e) => setSearchRole(e.target.value)}
        >
          <option value="0">All</option>
          <option value="1">Admin</option>
          <option value="2">M&E Manager</option>
          <option value="3">Project Manager</option>
        </select>
      </div>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-900">
          <thead className="text-xs text-gray-700 uppercase bg-gray-200">
            <tr>
              <th scope="col" className="col-span-4 p-3">
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
              {role != 3 && (
                <th scope="col" className="col-span-1 p-3 text-center">
                  Action
                </th>
              )}
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {/* Filter with email and role */}

            {currentAccounts
              .filter(
                (account) =>
                  account.email.includes(searchEmail) &&
                  (searchRole == 0 || account.role == searchRole)
              )
              .map((account, index) => (
                <tr
                  className={index % 2 === 0 ? "bg-white" : "bg-slate-100"}
                  key={account.id}
                >
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3">{account.name}</td>
                  <td className="p-3">{account.email}</td>
                  <td className="p-3">
                    {account.role == 1
                      ? "Admin"
                      : account.role == 2
                      ? "M&E Manager"
                      : "Project Manager"}{" "}
                  </td>
                  {role != 3 && (
                    <td className="flex flex-row p-3 justify-around">
                      <MdEdit
                        className="hover:text-yellow-500 hover:cursor-pointer"
                        title="Edit"
                        onClick={() => {
                          handleEdit(account);
                        }}
                      />

                      <MdDelete
                        className="hover:text-yellow-500 hover:cursor-pointer"
                        title="Edit"
                        onClick={() => {
                          handleDelete(account);
                        }}
                      />
                    </td>
                  )}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {!loading && currentAccounts.length === 0 && 
        <div className="flex flex-col justify-center align-middle content-center" 
        style={{
            height: "50vh"
        }}>
            <div className="flex justify-center">
                <img src={nodata} alt="No Data"  width="10%"/>
            </div>
            <p className="flex justify-center text-center p-3 m-3 text-gray-700">No Data</p>
        </div>}
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

export default Accounts;
