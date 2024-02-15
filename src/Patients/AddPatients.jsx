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

import { Formik, Field, Form, FieldArray, ErrorMessage } from "formik";
import { string, array, boolean, object, number } from "yup";
import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import Loading from "../Loading/Loading";
import toast from "react-hot-toast";
import axios from 'axios';


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

let patientSchema = object({
    name: string().required("Name is required."),
    registrationYear: string().required("Registration Year is required."),
    dob: string().required("DOB is required."),
    age: number().required("Age is required."),
    drtbCode: number().required("DRTB Code is required."),
    password: string().required("Password is required."),
    township: string().required("Township is required."),
    referredBy: string().required("Referred By is required."),
    patientCode: string().required("Patient Code is required."),
    address: string().required("Address is required."),
    treatmentStartDate: string().required("Treatment Start Date is required."),
    treatmentRegimen: string().required("Treatment Regimen is required.")
});

export const AddPatient = () => {

    const navigate = useNavigate();

    // handle edit data
    const { state } = useLocation();
    const { patientId } = useParams();

    const [patient, setPatient] = useState({
        name: "",
        registrationYear: "",
        dob: "",
        age: 0,
        drtbCode: 0,
        password: "",
        township: "",
        referredBy: "",
        patientCode: "",
        address: "",
        treatmentStartDate: "",
        treatmentRegimen: ""
    });

    const [addPatientLoading, setAddPatientLoading] = useState(false);
    const [adPatientError, setAddPatientError] = useState(false);
    const [addPatientSuccess, setAddPatientSuccess] = useState(false);

    const [isEditing, setIsEditing] = useState(false);
    const [editPatientLoading, setEditPatientLoading] = useState(false);
    const [editPatientError, setEditPatientError] = useState(false);
    const [editPatientSuccess, setEditPatientSuccess] = useState(false);

    useEffect(() => {
        if (patientId) {
            setIsEditing(true);
            setPatient(state);
        } else {
            setIsEditing(false);
            setPatient({
                name: "",
                registrationYear: "",
                dob: "",
                age: 0,
                drtbCode: 0,
                password: "",
                township: "",
                referredBy: "",
                patientCode: "",
                address: "",
                treatmentStartDate: "",
                treatmentRegimen: ""
            });
        }
    }, [patientId]);

    useEffect(() => {
        if (adPatientError) {
            toast.error("Error adding Patient");
        }

        if (addPatientSuccess) {
            toast.success("Patient added successfully");
        }
    }, [adPatientError, addPatientSuccess]);

    useEffect(() => {
        if (editPatientError) {
            toast.error("Error editing Patient");
        }
        if (editPatientSuccess) {
            toast.success("Patient edited successfully");
        }
    }, [editPatientError, editPatientSuccess]);

    async function addPatient(values, isEditing) {
        console.log(values);
        try {
            setAddPatientLoading(true);
            if (isEditing) {
                const response = await axios.put(`http://localhost:8000/api/patients/${patientId}/edit`,
                    {
                        ...values,
                        'is_vot_patient': false,
                        'volunteer_id': 1,
                        'vot_start_date': 'TEST',
                    });
                setEditPatientSuccess(true);
            } else {
                console.log(values);
                const response = await axios.post('http://localhost:8000/api/patients', {
                    ...values, 'is_vot_patient': false,
                    'volunteer_id': 1,
                    'vot_start_date': 'TEST',
                });
                setAddPatientSuccess(true);
            }
        } catch (error) {
            isEditing ? setEditPatientError(error) : setAddPatientError(error);
        } finally {
            isEditing ? setEditPatientLoading(false) : setAddPatientLoading(false);
        }

    }

    return (
        <div className="flex justify-center items-center h-45">
            <Formik
                initialValues={patient}
                validationSchema={patientSchema}
                enableReinitialize={true}
                onSubmit={async (values) => {
                    setPatient(values);
                    await addPatient(values, isEditing);
                }}
            >
                {({ errors, touched }) => (
                    <div className="w-full">
                        <div className="p-3">
                            <h1 className="text-lg text-center mx-3 font-bold">
                                {isEditing ? "Edit" : "Add"} Patient
                            </h1>
                        </div>

                        <Form className="w-1/4 mx-auto mt-5 px-4 py-5 bg-white-300 rounded-lg shadow-md">
                            <div className="mb-4">
                                <label htmlFor="name" className="block text-gray-800 font-bold">
                                    Name
                                </label>
                                <Field
                                    id="name"
                                    name="name"
                                    placeholder="U Aung Aung"
                                    disabled={false}
                                    className={`mt-2 p-2 w-full rounded shadow-inner ${errors.name && touched.name
                                        ? "border-red-500 border-2"
                                        : "border"
                                        }`}
                                />
                                <ErrorMessage
                                    component="div"
                                    name="name"
                                    className="text-red-500"
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="registrationYear" className="block text-gray-800 font-bold">
                                    Registration Year
                                </label>
                                {/* Dropdrop List  (2023,2024,2025,2026) */}
                                <Field
                                    as="select"
                                    id="registrationYear"
                                    name="registrationYear"
                                    disabled={false}
                                    className={`mt-2 p-2 w-full rounded shadow-inner ${errors.registrationYear && touched.registrationYear
                                        ? "border-red-500 border-2"
                                        : "border"
                                        }`}
                                >
                                    <option value="">Select Registration Year</option>
                                    <option value="2023">2023</option>
                                    <option value="2024">2024</option>
                                    <option value="2025">2025</option>
                                    <option value="2026">2026</option>
                                </Field>

                                <ErrorMessage
                                    component="div"
                                    name="registrationYear"
                                    className="text-red-500"
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="dob" className="block text-gray-800 font-bold">
                                    DOB
                                </label>
                                {/* DatePicker */}
                                <Field
                                    as="input"
                                    type="date"
                                    id="dob"
                                    name="dob"
                                    placeholder="2023-12-31"
                                    disabled={false}
                                    className={`mt-2 p-2 w-full rounded shadow-inner ${errors.dob && touched.dob
                                        ? "border-red-500 border-2"
                                        : "border"
                                        }`}
                                />

                                <ErrorMessage
                                    component="div"
                                    name="dob"
                                    className="text-red-500"
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="age" className="block text-gray-800 font-bold">
                                    Age
                                </label>
                                <Field
                                    id="age"
                                    name="age"
                                    value={patient.dob ? new Date().getFullYear() - new Date(patient.dob).getFullYear() : 0}
                                    disabled={true}
                                    className={`mt-2 p-2 w-full rounded shadow-inner ${errors.age && touched.age
                                        ? "border-red-500 border-2"
                                        : "border"
                                        }`}
                                />
                                <ErrorMessage
                                    component="div"
                                    name="age"
                                    className="text-red-500"
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="drtbCode" className="block text-gray-800 font-bold">
                                    DRTB Code
                                </label>
                                <Field
                                    id="drtbCode"
                                    name="drtbCode"
                                    placeholder="123"
                                    disabled={false}
                                    className={`mt-2 p-2 w-full rounded shadow-inner ${errors.drtbCode && touched.drtbCode
                                        ? "border-red-500 border-2"
                                        : "border"
                                        }`}
                                />
                                <ErrorMessage
                                    component="div"
                                    name="drtbCode"
                                    className="text-red-500"
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="password" className="block text-gray-800 font-bold">
                                    Password
                                </label>
                                <Field
                                    id="password"
                                    name="password"
                                    placeholder="123456"
                                    disabled={false}
                                    className={`mt-2 p-2 w-full rounded shadow-inner ${errors.password && touched.password
                                        ? "border-red-500 border-2"
                                        : "border"
                                        }`}
                                />
                                <ErrorMessage
                                    component="div"
                                    name="password"
                                    className="text-red-500"
                                />
                            </div>

                            <div className="mb-4">
                                {/* Role Dropdown */}
                                <label htmlFor="role" className="block text-gray-800 font-bold">
                                    Township
                                </label>
                                <Field
                                    as="select"
                                    id="township"
                                    name="township"
                                    disabled={false}
                                    value={patient.township}
                                    className={`mt-2 p-2 w-full rounded shadow-inner ${errors.township && touched.township
                                        ? "border-red-500 border-2"
                                        : "border"
                                        }`}
                                >
                                    {/* (CAT,CMT,PTG,PGT,AMT,MHA,AMP) */}
                                    <option value="0">Select Township</option>
                                    <option value="1">CAT</option>
                                    <option value="2">CMT</option>
                                    <option value="3">PTG</option>
                                    <option value="4">PGT</option>
                                    <option value="5">AMT</option>
                                    <option value="6">MHA</option>
                                    <option value="7">AMP</option>

                                </Field>
                                <ErrorMessage
                                    component="div"
                                    name="township"
                                    className="text-red-500"
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="referredBy" className="block text-gray-800 font-bold">
                                    Referred By
                                </label>
                                <Field
                                    id="referredBy"
                                    name="referredBy"
                                    placeholder="U Aung Aung"
                                    disabled={false}
                                    className={`mt-2 p-2 w-full rounded shadow-inner ${errors.referredBy && touched.referredBy
                                        ? "border-red-500 border-2"
                                        : "border"
                                        }`}
                                />
                                <ErrorMessage
                                    component="div"
                                    name="referredBy"
                                    className="text-red-500"
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="patientCode" className="block text-gray-800 font-bold">
                                    Patient Code
                                </label>
                                <Field
                                    id="patientCode"
                                    name="patientCode"
                                    placeholder="123/CAT/2023"
                                    disabled={false}
                                    className={`mt-2 p-2 w-full rounded shadow-inner ${errors.patientCode && touched.patientCode
                                        ? "border-red-500 border-2"
                                        : "border"
                                        }`}
                                />
                                <ErrorMessage
                                    component="div"
                                    name="patientCode"
                                    className="text-red-500"
                                />

                            </div>

                            <div className="mb-4">
                                <label htmlFor="address" className="block text-gray-800 font-bold">
                                    Address
                                </label>
                                <Field
                                    id="address"
                                    name="address"
                                    placeholder="Yangon"
                                    disabled={false}
                                    className={`mt-2 p-2 w-full rounded shadow-inner ${errors.address && touched.address
                                        ? "border-red-500 border-2"
                                        : "border"
                                        }`}
                                />
                                <ErrorMessage
                                    component="div"
                                    name="address"
                                    className="text-red-500"
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="treatmentStartDate" className="block text-gray-800 font-bold">
                                    Treatment Start Date
                                </label>
                                <Field
                                    as="input"
                                    type="date"
                                    id="treatmentStartDate"
                                    name="treatmentStartDate"
                                    placeholder="2023-12-31"
                                    disabled={false}
                                    className={`mt-2 p-2 w-full rounded shadow-inner ${errors.treatmentStartDate && touched.treatmentStartDate
                                        ? "border-red-500 border-2"
                                        : "border"
                                        }`}
                                />
                                <ErrorMessage
                                    component="div"
                                    name="treatmentStartDate"
                                    className="text-red-500"
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="treatmentRegimen" className="block text-gray-800 font-bold">
                                    Treatment Regimen
                                </label>
                                {/* Dropdown - LTR,OSSTT,OLTR,Bpal,BpalM,Individualized-PreXDR,Individualized-MDR,XDR,Other */}
                                <Field
                                    as="select"
                                    id="treatmentRegimen"
                                    name="treatmentRegimen"
                                    disabled={false}
                                    className={`mt-2 p-2 w-full rounded shadow-inner ${errors.treatmentRegimen && touched.treatmentRegimen
                                        ? "border-red-500 border-2"
                                        : "border"
                                        }`}
                                >
                                    <option value="">Select Treatment Regimen</option>
                                    <option value="LTR">LTR</option>
                                    <option value="OSSTT">OSSTT</option>
                                    <option value="OLTR">OLTR</option>
                                    <option value="Bpal">Bpal</option>
                                    <option value="BpalM">BpalM</option>
                                    <option value="Individualized-PreXDR">Individualized-PreXDR</option>
                                    <option value="Individualized-MDR">Individualized-MDR</option>
                                    <option value="XDR">XDR</option>
                                    <option value="Other">Other</option>
                                </Field>
                                <ErrorMessage
                                    component="div"
                                    name="treatmentRegimen"
                                    className="text-red-500"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={addPatientLoading || editPatientLoading}
                                className="w-full h-10 p-2 bg-blue-600 text-white font-semibold rounded-lg disabled:opacity-80 flex items-center justify-center"
                            >
                                {isEditing ? "Update" : "Save"}
                            </button>
                        </Form>
                    </div>
                )}
            </Formik>
        </div>
    )
}
