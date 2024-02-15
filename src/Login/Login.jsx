import { Formik, Field, Form, FieldArray, ErrorMessage } from "formik";
import { string, array, boolean, object, number } from "yup";
import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import Loading from "../Loading/Loading";
import toast from "react-hot-toast";
import axios from 'axios';

let loginUserSchema = object({
    username: string().required("Please enter your username."),
    password: string().required("Please enter your password."),
});

export const Login = () => {

    const navigate = useNavigate();

    const [loginUser, setLoginUser] = useState({
        username: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);

    async function login(values) {
        try {
            setLoading(true);
            const response = await axios.post('http://127.0.0.1:8000/api/auth/login', {
                email : values['username'],
                password : values['password']
            });
            toast.success("Login Successful");
            localStorage.setItem('token', response.data.access_token);
            localStorage.setItem('role', response.data.role);
            navigate('/accounts');
        } catch (error) {
            setError(error);
            toast.error("Invalid username or password.");
        } finally {
            setLoading(false);
        }

    }

    return (
        <div className="flex justify-center items-center h-45">
            <Formik
                initialValues={loginUser}
                validationSchema={loginUserSchema}
                enableReinitialize={true}
                onSubmit={async (values) => {
                    setLoginUser(values);
                    await login(values);
                }}
            >
                {({ errors, touched }) => (
                    <div className="w-full">
                        <div className="p-3">
                            <h1 className="text-lg text-center mx-3 font-bold">
                                Login
                            </h1>
                        </div>

                        <Form className="w-1/4 mx-auto mt-5 px-4 py-5 bg-white-300 rounded-lg shadow-md">
                            <div className="mb-4">
                                <label htmlFor="username" className="block text-gray-800 font-bold">
                                    Username
                                </label>
                                <Field
                                    id="username"
                                    name="username"
                                    placeholder="user@gmail.com"
                                    disabled={false}
                                    className={`mt-2 p-2 w-full rounded shadow-inner ${errors.username && touched.username
                                        ? "border-red-500 border-2"
                                        : "border"
                                        }`}
                                />
                                <ErrorMessage
                                    component="div"
                                    name="username"
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
                                    placeholder="password"
                                    disabled={false}
                                    className={`mt-2 p-2 w-full rounded shadow-inner ${errors.email && touched.email
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

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full h-10 p-2 bg-blue-600 text-white font-semibold rounded-lg disabled:opacity-80 flex items-center justify-center"
                            >
                                Login
                            </button>
                        </Form>
                    </div>
                )}
            </Formik>
        </div>
    )
}
