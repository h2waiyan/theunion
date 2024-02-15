import { Formik, Field, Form, FieldArray, ErrorMessage } from "formik";
import { string, array, boolean, object, number } from "yup";
import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from 'axios';
import Loading from "../Loading/Loading";


let accountSchema = object({
    name: string().required("Name cannot be blank.").max(16, "Only 16 characters allowed."),
    email: string().required("Invalid Email Address.").email("Invalid Email Address."),
    password: string().required("Password cannot be blank."),
    role: number().min(1, "Please select a role.")
});

export const AddAccounts = () => {

    const navigate = useNavigate();

    // handle edit data
    const { state } = useLocation();
    const { accountId } = useParams();

    const generatePassword = () => {
        const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const numbers = '0123456789';
        const symbols = '#!';

        let password = '';
        for (let i = 0; i < 3; i++) {
            password += uppercase[Math.floor(Math.random() * uppercase.length)];
        }
        for (let i = 0; i < 3; i++) {
            password += numbers[Math.floor(Math.random() * numbers.length)];
        }
        for (let i = 0; i < 2; i++) {
            password += symbols[Math.floor(Math.random() * symbols.length)];
        }

        // Shuffle password
        password = password.split('').sort(() => 0.5 - Math.random()).join('');

        return password;
    }

    const [account, setAccount] = useState({
        name: "",
        email: "",
        password: generatePassword(),
        role: 0
    });

    const [addAccountLoading, setAddAccountLoading] = useState(false);
    const [addAcountError, setAddAccountError] = useState(false);
    const [addAccountSuccess, setAddAccountSuccess] = useState(false);

    const [isEditing, setIsEditing] = useState(false);
    const [editAccountLoading, setEditAccountLoading] = useState(false);
    const [editAccountError, setEditAccountError] = useState(false);
    const [editAccountSuccess, setEditAccountSuccess] = useState(false);

    useEffect(() => {
        if (accountId) {
            setIsEditing(true);
            setAccount(state);
        } else {
            setIsEditing(false);
            setAccount({
                name: "",
                email: "",
                password: generatePassword(),
                role: 0
            });
        }
    }, [accountId]);

    useEffect(() => {
        if (addAcountError) {
            toast.error("Error adding account");
        }

        if (addAccountSuccess) {
            toast.success("Account added successfully");
        }
    }, [addAcountError, addAccountSuccess]);

    useEffect(() => {
        if (editAccountError) {
            toast.error("Error editing account");
        }
        if (editAccountSuccess) {
            toast.success("Account edited successfully");
        }
    }, [editAccountError, editAccountSuccess]);

    async function addAccount(values, isEditing) {
        try {

            if (isEditing) {
                setEditAccountLoading(true);
                const response = await axios.put(`http://127.0.0.1:8000/api/accounts/${accountId}/edit`, values);
                setEditAccountSuccess(true);
            } else {
                setAddAccountLoading(true);
                const response = await axios.post('http://127.0.0.1:8000/api/accounts', { ...values });
                setAddAccountSuccess(true);
            }
        } catch (error) {
            isEditing ? setEditAccountError(error) : setAddAccountError(error);
        } finally {
            isEditing ? setEditAccountLoading(false) : setAddAccountLoading(false);
        }

    }

    return (
        <div className="flex justify-center items-center h-45">
            <Formik
                initialValues={account}
                validationSchema={accountSchema}
                enableReinitialize={true}
                onSubmit={async (values) => {
                    setAccount(values);
                    await addAccount(values, isEditing);
                }}
            >
                {({ errors, touched }) => (
                    <div className="w-full">
                        <div className="p-3">
                            <h1 className="text-lg text-center mx-3 font-bold">
                                {isEditing ? "Edit" : "Add"} Account
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
                                    placeholder={account.password}
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
                                    Role
                                </label>
                                <Field
                                    as="select"
                                    id="role"
                                    name="role"
                                    disabled={false}
                                    className={`mt-2 p-2 w-full rounded shadow-inner ${errors.role && touched.role
                                        ? "border-red-500 border-2"
                                        : "border"
                                        }`}
                                >
                                    <option value="0">Select Role</option>
                                    <option value="1">Admin</option>
                                    <option value="2">M&E Manager</option>
                                    <option value="3">Project Manager</option>
                                </Field>
                                <ErrorMessage
                                    component="div"
                                    name="role"
                                    className="text-red-500"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={addAccountLoading || editAccountLoading}
                                className="w-full h-10 p-2 bg-blue-600 text-white font-semibold rounded-lg disabled:opacity-80 flex items-center justify-center"
                            >   {isEditing ? "Update" : "Save"}
                            </button>
                        </Form>
                    </div>
                )}
            </Formik>
        </div>
    )
}
