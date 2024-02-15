import { Formik, Field, Form, FieldArray, ErrorMessage } from "formik";
import { string, array, boolean, object, number } from "yup";
import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import Loading from "../Loading/Loading";
import toast from "react-hot-toast";
import axios from 'axios';


let volunteerSchema = object({
    name: string().required("Name cannot be blank."),
    email: string().required("Invalid Email Address."),
    password: string().required("Password cannot be blank."),
    township: number().min(1, "Please select a role.")
});

export const AddVolunteer = () => {

    const navigate = useNavigate();

    // handle edit data
    const { state } = useLocation();
    const { volunteerId } = useParams();

    const [volunteer, setVolunteer] = useState({
        name: "",
        email: "",
        password: "",
        township: 0
    });

    const [addVolunteerLoading, setAddVolunteerLoading] = useState(false);
    const [addVolunteerError, setAddVolunteerError] = useState(false);
    const [addVolunteerSuccess, setAddVolunteerSuccess] = useState(false);

    const [isEditing, setIsEditing] = useState(false);
    const [editVolunteerLoading, setEditVolunteerLoading] = useState(false);
    const [editVolunteerError, setEditVolunteerError] = useState(false);
    const [editVolunteerSuccess, setEditVolunteerSuccess] = useState(false);


    useEffect(() => {
        if (volunteerId) {
            setIsEditing(true);
            setVolunteer(state);
        } else {
            setIsEditing(false);
            setVolunteer({
                name: "",
                email: "",
                password: "",
                township: 0
            });
        }
    }, [volunteerId]);

    useEffect(() => {
        if (addVolunteerError) {
            toast.error("Error adding volunteer");
        }

        if (addVolunteerSuccess) {
            toast.success("Volunteer added successfully");
        }
    }, [addVolunteerError, addVolunteerSuccess]);

    useEffect(() => {
        if (editVolunteerError) {
            toast.error("Error editing volunteer");
        }
        if (editVolunteerSuccess) {
            toast.success("Volunteer edited successfully");
        }
    }, [editVolunteerError, editVolunteerSuccess]);

    async function addVolunteer(values, isEditing) {
        try {
            setAddVolunteerLoading(true);
            if (isEditing) {
                const response = await axios.put(`http://127.0.0.1:8000/api/volunteers/${volunteerId}/edit`, values);
                setEditVolunteerSuccess(true);
            } else {
                const response = await axios.post('http://127.0.0.1:8000/api/volunteers', {...values});
                setAddVolunteerSuccess(true);
            }
        } catch (error) {
            isEditing ? setEditVolunteerError(error) : setAddVolunteerError(error);
        } finally {
            isEditing ? setEditVolunteerLoading(false) : setAddVolunteerLoading(false);
        }

    }

    return (
        <div className="flex justify-center items-center h-45">
            <Formik
                initialValues={volunteer}
                validationSchema={volunteerSchema}
                enableReinitialize={true}
                onSubmit={async (values) => {
                    setVolunteer(values);
                    await addVolunteer(values, isEditing);
                }}
            >
                {({ errors, touched }) => (
                    <div className="w-full">
                        <div className="p-3">
                            <h1 className="text-lg text-center mx-3 font-bold">
                                {isEditing ? "Edit" : "Add"} Volunteer
                            </h1>
                        </div>

                        <Form className="w-1/3 mx-auto mt-5 px-4 py-5 bg-white-300 rounded-lg shadow-md">
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
                                <label htmlFor="email" className="block text-gray-800 font-bold">
                                    Email
                                </label>
                                <Field
                                    id="email"
                                    name="email"
                                    placeholder="aungaung@gmail.com"
                                    disabled={false}
                                    className={`mt-2 p-2 w-full rounded shadow-inner ${errors.email && touched.email
                                        ? "border-red-500 border-2"
                                        : "border"
                                        }`}
                                />
                                <ErrorMessage
                                    component="div"
                                    name="email"
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
                                    placeholder="Password123!"
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
                                    value={volunteer.township}
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

                            <button
                                type="submit"
                                disabled={addVolunteerLoading || editVolunteerLoading}
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
