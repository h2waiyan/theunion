import React from 'react';
import axios from 'axios';
import Pagination from "react-js-pagination";
import { useState, useEffect } from "react";
import { MdEdit, MdDelete } from "react-icons/md";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";

// write an enum for township {/* (CAT,CMT,PTG,PGT,AMT,MHA,AMP) */}
const Township =  {
    1: "CAT",
    2: "CMT",
    3: "PTG",
    4: "PGT",
    5: "AMT",
    6: "MHA",
    7: "AMP"
}

const Volunteers = () => {

    const navigate = useNavigate();

    const [volunteers, setVolunteers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);


    const getVolunteers = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:8000/api/volunteers');
            setVolunteers(response.data['volunteers']);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }

    }

    const handleEdit = (data) => {
        navigate(`/add-volunteer/${data.id}`, { state: data });
    };

    const handleDelete = async (data) => {
        try {
            setLoading(true);
            const response = await axios.delete('http://localhost:8000/api/volunteers/' + data.id + '/delete');
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    // Pagination
    const [activePage, setActivePage] = useState(1);
    const itemsCountPerPage = 35;
    const totalItemsCount = volunteers.length;
    const indexOfLastItem = activePage * itemsCountPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsCountPerPage;
    const currentVolunteers = volunteers.slice(indexOfFirstItem, indexOfLastItem);

    useEffect(() => {
        getVolunteers();
    }, [])

    return (
        <div className="container mx-auto mt-3 p-3">
            <div className='flex justify-between items-center align-center'>
                <h1 className="text-lg mx-3 mb-5 font-bold">
                    Volunteers
                </h1>

                <NavLink to="/add-volunteer" className="bg-custom-blue text-white px-4 py-2 rounded mr-3">
                    Add Volunteer
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
                                Township
                            </th>
                            <th scope="col" className="col-span-1 p-3">
                                Action
                            </th>
                        </tr>
                    </thead>

                    <tbody className="bg-white divide-y divide-gray-200">
                        {currentVolunteers.map((volunteer, index) => (
                            <tr
                                className={index % 2 === 0 ? "bg-white" : "bg-slate-100"}
                                key={volunteer.id}
                            >
                                <td className="p-3">{index + 1}</td>
                                <td className="p-3">{volunteer.name}</td>
                                <td className="p-3">
                                    {volunteer.email}
                                </td>
                                <td className="p-3">{
                                    Township[volunteer.township]
                                }  </td>
                                <td className="flex flex-row p-3">
                                    <MdEdit
                                        className="hover:text-yellow-500 hover:cursor-pointer"
                                        title="Edit"
                                        onClick={() => {
                                            handleEdit(volunteer);
                                        }}
                                    />

                                    <MdDelete
                                        className="hover:text-yellow-500 hover:cursor-pointer"
                                        title="Edit"
                                        onClick={() => {
                                            handleDelete(volunteer);
                                        }}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {currentVolunteers.length === 0 && (
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

export default Volunteers