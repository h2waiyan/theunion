import React from 'react';
import axios from 'axios';
import Pagination from "react-js-pagination";
import { useState, useEffect } from "react";
import { MdEdit, MdDelete } from "react-icons/md";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";

// ○ Name (up to text 16 Characters)
// ○ Registration Year (Drop Down list ➔ (2023,2024,2025,2026)
// ○ DOB (Date Field)
// ○ Age (auto generate with DOB)
// ○ DRTB Code (Unique Key integer )
// ○ Password (autogenerate with 6 digit integer)
// ○ Township (Drop Down List ➔(CAT,CMT,PTG,PGT,AMT,MHA,AMP))
// ○ Referred by Volunteer (Drop Down (relationship with volunteer table for
// related township)
// ○ Patient code (auto generate with DRTB Code/Township /Registration
// Year/) eg. 134/CAT/2024
// ○ Address (text field 30 characters)
// ○ Treatment StartDate (Date Field)
// ○ Treatment Regimen (Drop Down List
// ➔LTR,OSSTT,OLTR,Bpal,BpalM,Individualized-PreXDR,Individualized-
// MDR,XDR,Other))

// township {/* (CAT,CMT,PTG,PGT,AMT,MHA,AMP) */}
const Township =  {
    1: "CAT",
    2: "CMT",
    3: "PTG",
    4: "PGT",
    5: "AMT",
    6: "MHA",
    7: "AMP"
}

const Patients = () => {

    const navigate = useNavigate();


    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getPatients = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:8000/api/patients');
            setPatients(response.data['patients']);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }

    }

    const handleEdit = (data) => {
        navigate(`/add-patient/${data.id}`, { state: data });
    };

    const handleDelete = async (data) => {
        try {
            setLoading(true);
            const response = await axios.delete('http://localhost:8000/api/patients/' + data.id + '/delete');
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    // Pagination
    const [activePage, setActivePage] = useState(1);
    const itemsCountPerPage = 35;
    const totalItemsCount = patients.length;
    const indexOfLastItem = activePage * itemsCountPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsCountPerPage;
    const currentEntries = patients.slice(indexOfFirstItem, indexOfLastItem);

    useEffect(() => {
        getPatients();
    }, [])

    return (
        <div className="container mx-auto mt-3 p-3">
            <div className='flex justify-between items-center align-center'>
                <h1 className="text-lg mx-3 mb-5 font-bold">
                    Patients
                </h1>

                <NavLink to="/add-patient" className="bg-custom-blue text-white px-4 py-2 rounded mr-3">
                    Add Patient
                </NavLink>

            </div>

            {/* {isLoading && <h1>Loading...</h1>}

            {!isLoading && error && <h1> Cannot Get Data </h1>} */}
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left rtl:text-right text-gray-900">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-200">
                        <tr>
                            <th scope="col" className="p-3">
                                No.
                            </th>
                            <th scope="col" className="p-3">
                                Name
                            </th>
                            <th scope="col" className="p-3">
                                Registration Number
                            </th>
                            <th scope="col" className="p-3">
                                DOB
                            </th>
                            <th scope="col" className="p-3">
                                Age
                            </th>
                            <th scope="col" className="p-3">
                                DRTB Code
                            </th>
                            <th scope="col" className="p-3">
                                Township
                            </th>
                            <th scope="col" className="p-3">
                                Referred By
                            </th>
                            <th scope="col" className="p-3">
                                Patient Code
                            </th>
                            <th scope="col" className="p-3">
                                Address
                            </th>
                            <th scope="col" className="p-3">
                                Treatment Start Date
                            </th>
                            <th scope="col" className="p-3">
                                Treatment Regimen
                            </th>
                            <th scope="col" className="p-3">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody className="bg-white divide-y divide-gray-200">
                        {patients.map((patient, index) => (
                            <tr
                                className={index % 2 === 0 ? "bg-white" : "bg-slate-100"}
                                key={patient.id}
                            >
                                <td className="p-3">{index + 1}</td>
                                <td className="p-3">{volpatientunteer.name}</td>
                                <td className="p-3">
                                    {patient.registration_year}
                                </td>
                                <td className="p-3">
                                    {patient.dob}
                                </td>
                                <td className="p-3">
                                    {patient.age}
                                </td>
                                <td className="p-3">
                                    {patient.drtb_code}
                                </td>
                                <td className="p-3">
                                    {Township[patient.township]}
                                </td>
                                <td className="p-3">
                                    {patient.referred_by}
                                </td>
                                <td className="p-3">
                                    {patient.patient_code}
                                </td>
                                <td className="p-3">
                                    {patient.address}
                                </td>
                                <td className="p-3">
                                    {patient.treatment_start_date}
                                </td>
                                <td className="p-3">
                                    {patient.treatment_regimen}
                                </td>

                                <td className="flex flex-row p-3">
                                    <MdEdit
                                        className="hover:text-yellow-500 hover:cursor-pointer"
                                        title="Edit"
                                        onClick={() => {
                                            handleEdit(patient);
                                        }}
                                    />

                                    <MdDelete
                                        className="hover:text-yellow-500 hover:cursor-pointer"
                                        title="Edit"
                                        onClick={() => {
                                            handleDelete(patient);
                                        }}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {patients.length === 0 && (
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

export default Patients