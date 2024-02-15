import { Formik, Field, Form, FieldArray, ErrorMessage } from "formik";
import { string, array, boolean, object, number } from "yup";
import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import Loading from "../Loading/Loading";
import toast from "react-hot-toast";
import axios from "axios";

const Township = {
  1: "CAT",
  2: "CMT",
  3: "PTG",
  4: "PGT",
  5: "AMT",
  6: "MHA",
  7: "AMP",
};

let patientSchema = object({
  name: string().required("Name is required."),
  reg_year: string().required("Registration Year is required."),
  dob: string().required("DOB is required."),
  age: number().required("Age is required."),
  drtb_code: number().required("DRTB Code is required."),
  password: string().required("Password is required."),
  township: string().required("Township is required."),
  referredBy: string().required("Referred By is required."),
  patient_code: string().required("Patient Code is required."),
  address: string().required("Address is required."),
  treatment_start_date: string().required("Treatment Start Date is required."),
  treatment_regimen: string().required("Treatment Regimen is required."),
});

let votPatientSchema = object({
  name: string().required("Name is required."),
  reg_year: string().required("Registration Year is required."),
  dob: string().required("DOB is required."),
  age: number().required("Age is required."),
  drtb_code: number().required("DRTB Code is required."),
  password: string().required("Password is required."),
  township: string().required("Township is required."),
  referredBy: string().required("Referred By is required."),
  patient_code: string().required("Patient Code is required."),
  address: string().required("Address is required."),
  treatment_start_date: string().required("Treatment Start Date is required."),
  treatment_regimen: string().required("Treatment Regimen is required."),
  vot_type: string().required("VOT Type is required."),
  vot_start_date: string().required("VOT Start Date is required."),
});

// Function to calculate age based on date of birth
const calculateAge = (dateOfBirth) => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
};

const generatePassword = () => {
  // Generate a random integer between 100000 and 999999 (inclusive)
  const password = Math.floor(Math.random() * 900000) + 100000;
  return password.toString(); // Convert the integer to a string
};

export const AddPatient = ({ move_to_vot }) => {
  const navigate = useNavigate();

  // handle edit data
  const { state } = useLocation();
  const { patientId } = useParams();

  const [patient, setPatient] = useState({
    name: "",
    reg_year: "",
    dob: "",
    age: 0,
    drtb_code: 0,
    password: generatePassword(),
    township: "",
    referredBy: "",
    patient_code: "-",
    address: "",
    treatment_start_date: "",
    treatment_regimen: "",
    vot_type: "",
    is_vot_patient: false,
    vot_start_date: "",
  });

  const [addPatientLoading, setAddPatientLoading] = useState(false);
  const [adPatientError, setAddPatientError] = useState(false);
  const [addPatientSuccess, setAddPatientSuccess] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [editPatientLoading, setEditPatientLoading] = useState(false);
  const [editPatientError, setEditPatientError] = useState(false);
  const [editPatientSuccess, setEditPatientSuccess] = useState(false);

  // Township Volunteers
  const [volunteers, setVolunteers] = useState([]);

  const getVolunteers = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/volunteers");
      setVolunteers(response.data["volunteers"]);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (patientId) {
      setIsEditing(true);
      setPatient(state);
    } else {
      setIsEditing(false);
      setPatient({
        name: "",
        reg_year: "",
        dob: "",
        age: 0,
        drtb_code: 0,
        password: generatePassword(),
        township: "",
        referredBy: "",
        patient_code: "-",
        address: "",
        treatment_start_date: "",
        treatment_regimen: "",
        vot_type: "",
        is_vot_patient: false,
        vot_start_date: "",
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

  useEffect(() => {
    // get vol by townships
    getVolunteers();
  },[])

  async function addPatient(values, isEditing) {
    try {
      setAddPatientLoading(true);
      if (isEditing) {
        console.log(values);
        const response = await axios.put(
          `http://127.0.0.1:8000/api/patients/${patientId}/edit`,
          {
            ...values,
            "is_vot_patient" : move_to_vot ? true : false,
            "volunteer_id" : values.referredBy,
            "referred_by_volunteer": values.referredBy
          }
        );
        setEditPatientSuccess(true);
      } else {
        const response = await axios.post(
          "http://127.0.0.1:8000/api/patients",
          {
            ...values,
            "volunteer_id" : values.referredBy,
            "referred_by_volunteer": values.referredBy
          }
        );
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
        // validationSchema={move_to_vot ? votPatientSchema : patientSchema}
        enableReinitialize={true}
        onSubmit={async (values) => {
          setPatient(values);
          await addPatient(values, isEditing);
        }}
      >
        {({ values, handleChange, errors, touched, setFieldValue }) => (
          <div className="w-full">
            <div className="p-3">
              <h1 className="text-lg text-center mx-3 font-bold">
                {isEditing ? "Edit" : "Add"} Patient
              </h1>
            </div>

            <Form className="w-1/3 mx-auto mt-5 px-4 py-5 bg-white-300 rounded-lg shadow-md">
              {!move_to_vot && (
                <div>
                  <div className="mb-4">
                    <label
                      htmlFor="name"
                      className="block text-gray-800 font-bold"
                    >
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
                    <label
                      htmlFor="reg_year"
                      className="block text-gray-800 font-bold"
                    >
                      Registration Year
                    </label>
                    {/* Dropdrop List  (2023,2024,2025,2026) */}
                    <Field
                      as="select"
                      id="reg_year"
                      name="reg_year"
                      disabled={false}
                      onChange={() => {
                        setFieldValue("patient_code", `${values.drtb_code}/${Township[values.township]}/${values.reg_year}`);
                        setFieldValue("reg_year", event.target.value);
                      }}
                      className={`mt-2 p-2 w-full rounded shadow-inner ${errors.reg_year && touched.reg_year
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
                      name="reg_year"
                      className="text-red-500"
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="dob"
                      className="block text-gray-800 font-bold"
                    >
                      Date Of Birth
                    </label>
                    {/* DatePicker */}
                    <Field
                      as="input"
                      type="date"
                      id="dob"
                      name="dob"
                      placeholder="2023-12-31"
                      onChange={(event) => {
                        setFieldValue("age", calculateAge(event.target.value));
                        setFieldValue("dob", event.target.value);
                      }}
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
                    <label
                      htmlFor="age"
                      className="block text-gray-800 font-bold"
                    >
                      Age
                    </label>
                    <Field
                      id="age"
                      name="age"
                      value={NaN ? 0 : calculateAge(values.dob)}
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
                    <label
                      htmlFor="drtb_code"
                      className="block text-gray-800 font-bold"
                    >
                      DRTB Code
                    </label>
                    <Field
                      id="drtb_code"
                      name="drtb_code"
                      placeholder="123"
                      disabled={false}
                      onChange={() => {
                        setFieldValue("patient_code", `${values.drtb_code}/${Township[values.township]}/${values.reg_year}`);
                        setFieldValue("drtb_code", event.target.value);
                      }}
                      className={`mt-2 p-2 w-full rounded shadow-inner ${errors.drtb_code && touched.drtb_code
                          ? "border-red-500 border-2"
                          : "border"
                        }`}
                    />
                    <ErrorMessage
                      component="div"
                      name="drtb_code"
                      className="text-red-500"
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="password"
                      className="block text-gray-800 font-bold"
                    >
                      Password
                    </label>
                    <Field
                      id="password"
                      name="password"
                      placeholder={patient.password}
                      disabled={true}
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
                    <label
                      htmlFor="role"
                      className="block text-gray-800 font-bold"
                    >
                      Township
                    </label>
                    <Field
                      as="select"
                      id="township"
                      name="township"
                      disabled={false}
                      onChange={() => {
                        setFieldValue("patient_code", `${values.drtb_code}/${Township[values.township]}/${values.reg_year}`);
                        setFieldValue("township", event.target.value);
                      }}
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
                    <label
                      htmlFor="referredBy"
                      className="block text-gray-800 font-bold"
                    >
                      Referred By
                    </label>
                    {/* // dropdown of the volunteers */}
                    <Field
                      as="select"
                      id="referredBy"
                      name="referredBy"
                      disabled={false}
                      className={`mt-2 p-2 w-full rounded shadow-inner ${errors.referredBy &&
                          touched.referredBy
                          ? "border-red-500 border-2"
                          : "border"
                        }`}
                    >
                      <option value="">Select Referred By</option>

                      {/* // Filter the volunteers list with values.township */}
                      {
                        volunteers.filter((volunteer) => volunteer.township == values.township).map((volunteer) => (  
                          <option key={volunteer.id} value={volunteer.id}>
                            {volunteer.name}
                          </option>
                        ))
                      }
                    </Field>
                    <ErrorMessage
                      component="div"
                      name="referredBy"
                      className="text-red-500"
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="patient_code"
                      className="block text-gray-800 font-bold"
                    >
                      Patient Code
                    </label>
                    <Field
                      id="patient_code"
                      name="patient_code"
                      value={`${values.drtb_code}/${Township[values.township]}/${values.reg_year}`}
                      disabled={true}
                      className={`mt-2 p-2 w-full rounded shadow-inner ${errors.patient_code && touched.patient_code
                          ? "border-red-500 border-2"
                          : "border"
                        }`}
                    />
                    <ErrorMessage
                      component="div"
                      name="patient_code"
                      className="text-red-500"
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="address"
                      className="block text-gray-800 font-bold"
                    >
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
                    <label
                      htmlFor="treatment_start_date"
                      className="block text-gray-800 font-bold"
                    >
                      Treatment Start Date
                    </label>
                    <Field
                      as="input"
                      type="date"
                      id="treatment_start_date"
                      name="treatment_start_date"
                      placeholder="2023-12-31"
                      disabled={false}
                      className={`mt-2 p-2 w-full rounded shadow-inner ${errors.treatment_start_date &&
                          touched.treatment_start_date
                          ? "border-red-500 border-2"
                          : "border"
                        }`}
                    />
                    <ErrorMessage
                      component="div"
                      name="treatment_start_date"
                      className="text-red-500"
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="treatment_regimen"
                      className="block text-gray-800 font-bold"
                    >
                      Treatment Regimen
                    </label>
                    {/* Dropdown - LTR,OSSTT,OLTR,Bpal,BpalM,Individualized-PreXDR,Individualized-MDR,XDR,Other */}
                    <Field
                      as="select"
                      id="treatment_regimen"
                      name="treatment_regimen"
                      disabled={false}
                      className={`mt-2 p-2 w-full rounded shadow-inner ${errors.treatment_regimen && touched.treatment_regimen
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
                      <option value="Individualized-PreXDR">
                        Individualized-PreXDR
                      </option>
                      <option value="Individualized-MDR">
                        Individualized-MDR
                      </option>
                      <option value="XDR">XDR</option>
                      <option value="Other">Other</option>
                    </Field>
                    <ErrorMessage
                      component="div"
                      name="treatment_regimen"
                      className="text-red-500"
                    />
                  </div>
                </div>
              )}
              {move_to_vot && (
                <div>
                  <div className="mb-4">
                    {/* Dropdown - pure, hybird */}
                    <label
                      htmlFor="vot_type"
                      className="block text-gray-800 font-bold"
                    >
                      VOT Type
                    </label>
                    <Field
                      as="select"
                      id="vot_type"
                      name="vot_type"
                      disabled={false}
                      className={`mt-2 p-2 w-full rounded shadow-inner ${errors.vot_type && touched.vot_type
                          ? "border-red-500 border-2"
                          : "border"
                        }`}
                    >
                      <option value="vot_type">Select VOT Type</option>
                      <option value="Pure">Pure</option>
                      <option value="Hybrid">Hybrid</option>
                    </Field>
                    <ErrorMessage
                      component="div"
                      name="vot_type"
                      className="text-red-500"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="referredBy"
                      className="block text-gray-800 font-bold"
                    >
                      Referred By
                    </label>
                    {/* // dropdown of the volunteers */}
                    <Field
                      as="select"
                      id="referredBy"
                      name="referredBy"
                      disabled={false}
                      className={`mt-2 p-2 w-full rounded shadow-inner ${errors.referredBy &&
                          touched.referredBy
                          ? "border-red-500 border-2"
                          : "border"
                        }`}
                    >
                      <option value="">Select Referred By</option>

                      {/* // Filter the volunteers list with values.township */}
                      {
                        volunteers.filter((volunteer) => volunteer.township == values.township).map((volunteer) => (  
                          <option key={volunteer.id} value={volunteer.id}>
                            {volunteer.name}
                          </option>
                        ))
                      }
                    </Field>
                    <ErrorMessage
                      component="div"
                      name="referredBy"
                      className="text-red-500"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="vot_start_date"
                      className="block text-gray-800 font-bold"
                    >
                      VOT Start Date
                    </label>
                    <Field
                      as="input"
                      type="date"
                      id="vot_start_date"
                      name="vot_start_date"
                      placeholder="2023-12-31"
                      disabled={false}
                      className={`mt-2 p-2 w-full rounded shadow-inner ${errors.vot_start_date && touched.vot_start_date
                          ? "border-red-500 border-2"
                          : "border"
                        }`}
                    />
                    <ErrorMessage
                      component="div"
                      name="vot_start_date"
                      className="text-red-500"
                    />
                  </div>
                </div>
              )}
              <button
                type="submit"
                className="w-full h-10 p-2 bg-blue-600 text-white font-semibold rounded-lg disabled:opacity-80 flex items-center justify-center"
              >
                {move_to_vot ? "Save" : isEditing ? "Update" : "Save"}
              </button>
            </Form>
          </div>
        )}
      </Formik>
    </div>
  );
};
