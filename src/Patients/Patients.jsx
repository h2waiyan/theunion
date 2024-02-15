import React from "react";
import axios from "axios";
import Pagination from "react-js-pagination";
import { useState, useEffect } from "react";
import { MdEdit, MdDelete } from "react-icons/md";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { LoadingDialog } from "../Loading/LoadingDialog";
import nodata from "../assets/nodata.webp";

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

const Township = {
  1: "CAT",
  2: "CMT",
  3: "PTG",
  4: "PGT",
  5: "AMT",
  6: "MHA",
  7: "AMP",
};

const Patients = ({ vot_table }) => {
  const navigate = useNavigate();

  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [filterVotType, setFilterVotType] = useState();
  const [volunteers, setVolunteers] =  useState([]);

  const [deleteLoading, setDeleteLoading] = useState(false);

  const getPatients = async () => {
    try {
      setLoading(true);
      if (vot_table) {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/vot_patients"
        );
        setPatients(response.data["patients"]);
      } else {
        const response = await axios.get("http://127.0.0.1:8000/api/patients");
        setPatients(response.data["patients"]);
      }
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (data) => {
    navigate(`/add-patient/${data.id}`, { state: data });
  };

  const handleDelete = async (data) => {
    try {
      setDeleteLoading(true);
      const response = await axios.delete(
        "http://127.0.0.1:8000/api/patients/" + data.id + "/delete"
      );
    } catch (error) {
      setError(error);
    } finally {
      setDeleteLoading(false);
    }
  };

  // Pagination
  const [activePage, setActivePage] = useState(1);
  const itemsCountPerPage = 35;
  const totalItemsCount = patients.length;
  const indexOfLastItem = activePage * itemsCountPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsCountPerPage;
  const currentPatients = patients.slice(indexOfFirstItem, indexOfLastItem);

  const getVolunteers = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/volunteers");
      setVolunteers(response.data["volunteers"]);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getPatients();
    getVolunteers();
  }, []);

  return (
    <div className="container mx-auto mt-3 p-3">
      <div className="flex justify-between items-center align-center">
        <h1 className="text-lg font-bold">Patients</h1>

        {vot_table && (
          <div className="flex flex-row justify-end my-2">
            <select
              className="border-2 border-gray-300 p-2 rounded-lg ms-2"
              onChange={(e) => setFilterVotType(e.target.value)}
            >
              <option value="all">Select VOT Type</option>
              <option value="Pure">Pure</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>
        )}

        {!vot_table && (
          <NavLink
            to="/add-patient"
            className="bg-custom-blue text-white px-4 py-2 rounded"
          >
            Add Patient
          </NavLink>
        )}

        {loading && <LoadingDialog />}
        {deleteLoading && <LoadingDialog />}
      </div>

      {/* { Add a filter function with Email and Role} */}

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg my-2">
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
                Registration Year
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
              {!vot_table && (
                <th scope="col">
                  <span>Move to VOT</span>
                </th>
              )}
              {vot_table && (
                <th scope="col" className="p-3">
                  VOT Type
                </th>
              )}
              {vot_table && (
                <th scope="col" className="p-3">
                  VOT Start Date
                </th>
              )}
              {vot_table && (
                <th scope="col" className="p-3">
                  Volunteer
                </th>
              )}
              <th scope="col" className="p-3">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {
              currentPatients
              // .filter(patient => {
              //   if (filterVotType != 'all') {
              //     return patient.vot_type === filterVotType;
              //   }
              // })
              .map((patient, index) => (
                <tr
                  className={index % 2 === 0 ? "bg-white" : "bg-slate-100"}
                  key={patient.id}
                >
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3">{patient.name}</td>
                  <td className="p-3">{patient.reg_year}</td>
                  <td className="p-3">{patient.dob}</td>
                  <td className="p-3">{patient.age}</td>
                  <td className="p-3">{patient.drtb_code}</td>
                  <td className="p-3">{Township[patient.township]}</td>
                  <td className="p-3">{
                    volunteers.filter(volunteer => volunteer.id === patient.volunteer_id).map(volunteer => volunteer.name)
                  }</td>
                  <td className="p-3">{patient.patient_code}</td>
                  <td className="p-3">{patient.address}</td>
                  <td className="p-3">{patient.treatment_start_date}</td>
                  <td className="p-3">{patient.treatment_regimen}</td>

                  {!vot_table && (
                    <td className="p-3">
                      <button
                        onClick={() => {
                          navigate(`/move-to-vot/${patient.id}`, {
                            state: patient,
                          });
                        }}
                        className="bg-custom-blue text-white px-4 py-2 rounded"
                      >
                        Move to VOT
                      </button>
                    </td>
                  )}

                  {vot_table && <td className="p-3">{patient.vot_type}</td>}

                  {vot_table && (
                    <td className="p-3">{patient.vot_start_date}</td>
                  )}

                  {vot_table && <td className="p-3">{
                    volunteers.filter(volunteer => volunteer.id === patient.volunteer_id).map(volunteer => volunteer.name)
                  }</td>}

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
      {!loading && currentPatients.length === 0 && 
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

export default Patients;
