import React from 'react';
import axios from 'axios';
import Pagination from "react-js-pagination";
import { useState, useEffect } from "react";
import { MdEdit, MdDelete } from "react-icons/md";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Accounts = () => {

    const navigate = useNavigate();

    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);


    const getAccounts= async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:8000/api/accounts');
            setAccounts(response.data['accounts']);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }

    }

    const handleEdit = (data) => {
        navigate(`/add-account/${data.id}`, { state: data });
    };

    const handleDelete = async (data) => {
        try {
            setLoading(true);
            const response = await axios.delete('http://localhost:8000/api/accounts/' + data.id + '/delete');
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    // Pagination
    const [activePage, setActivePage] = useState(1);
    const itemsCountPerPage = 35;
    const totalItemsCount = accounts.length;
    const indexOfLastItem = activePage * itemsCountPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsCountPerPage;
    const currentEntries = accounts.slice(indexOfFirstItem, indexOfLastItem);

    useEffect(() => {
        getAccounts();
    }, [])

    return (
        <div className="container mx-auto mt-3 p-3">
            <div className='flex justify-between items-center align-center'>
                <h1 className="text-lg mx-3 mb-5 font-bold">
                    Accounts
                </h1>

                <NavLink to="/add-account" className="bg-custom-blue text-white px-4 py-2 rounded mr-3">
                    Add Account
                </NavLink>

            </div>

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
                            <th scope="col" className="col-span-1 p-3">
                                Action
                            </th>
                        </tr>
                    </thead>

                    <tbody className="bg-white divide-y divide-gray-200">
                        {accounts.map((account, index) => (
                            <tr
                                className={index % 2 === 0 ? "bg-white" : "bg-slate-100"}
                                key={account.id}
                            >
                                <td className="p-3">{index + 1}</td>
                                <td className="p-3">{account.name}</td>
                                <td className="p-3">
                                    {account.email}
                                </td>
                                <td className="p-3">{
                                    account.role == 1 ? "Admin" :
                                        account.role == 2 ? "M&E Manager" :
                                            "Project Manager"
                                }  </td>
                                <td className="flex flex-row p-3">
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
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {accounts.length === 0 && (
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
    )
}

export default Accounts