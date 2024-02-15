import { Formik, Field, Form, FieldArray, ErrorMessage } from "formik";
import { string, array, boolean, object } from "yup";
import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useAddEntryMutation, useEditEntryMutation } from "../redux/api";
import Loading from "../Loading/Loading";
import Sectors from "../Sectors/Sectors";
import toast from "react-hot-toast";

let userSchema = object({
  name: string().required("Name cannot be blank."),
  sectors: array().min(1, "At least one sector is required."),
  agreetoterms: boolean().oneOf(
    [true],
    "Please agree to the terms to continue."
  ),
});

const AddData = ({ refetch }) => {
  const navigate = useNavigate();
  // handle edit data
  const { state } = useLocation();
  const { entryid } = useParams();
  const [isEditing, setIsEditing] = useState(false);

  const [selectedSectors, setSelectedSectors] = useState([]);
  const [entry, setEntry] = useState({
    id: "",
    name: "",
    sectors: [],
    agreetoterms: false,
  });

  // const { data } = useSelector((state) => state.entries);
  // console.log("------>>>>");
  // console.log(data);
  // const entries = data.entries;

  const [
    addEntry,
    {
      data: newData,
      isLoading: addEntryLoading,
      isSuccess: addEntrySuccess,
      error: addEntryError,
    },
  ] = useAddEntryMutation();

  const [
    editEntry,
    {
      data: updatedData,
      isLoading: editEntryLoading,
      isSuccess: editEntrySuccess,
      error: editEntryError,
    },
  ] = useEditEntryMutation();

  useEffect(() => {
    if (entryid) {
      setIsEditing(true);
      setEntry(state);
      console.log("STATE");
      console.log(state);
      setSelectedSectors(state.sectors);
    } else {
      setIsEditing(false);
      setSelectedSectors([]);
      setEntry({
        id: "",
        name: "",
        sectors: [],
        agreetoterms: false,
      });
    }
  }, [entryid]);

  useEffect(() => {
    if (addEntryError) {
      toast.error("Error adding entry");
    }

    if (addEntrySuccess) {
      toast.success("Entry added successfully");
      refetch();
      navigate(`/${newData.data[0].entryid}`, {
        state: {
          ...entry,
          entryid: newData.data[0].entryid,
        },
      });
    }
  }, [addEntryError, addEntrySuccess]);

  useEffect(() => {
    if (editEntryError) {
      toast.error("Error editing entry");
    }
    if (editEntrySuccess) {
      toast.success("Entry edited successfully");
      refetch();
    }
  }, [editEntryError, editEntrySuccess]);

  return (
    <div className="flex justify-center items-center h-45">
      <Formik
        initialValues={entry}
        validationSchema={userSchema}
        enableReinitialize={true}
        onSubmit={async (values) => {
          setEntry(values);
          if (isEditing) await editEntry(values);
          if (!isEditing) await addEntry(values);
        }}
      >
        {({ errors, touched }) => (
          <div>
            <div className="p-5">
              <h1 className="text-lg text-center mx-3 mb-5 font-bold">
                {isEditing ? "Edit" : "Add"} Entry
              </h1>
              <h3>
                Please enter your name and pick the Sectors you are currently
                involved in.
              </h3>
            </div>

            <Form className="w-full max-w-lg mx-auto mt-5 px-4 py-5 bg-white-300 rounded-lg shadow-md">
              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-800 font-bold">
                  Name
                </label>
                <Field
                  id="name"
                  name="name"
                  placeholder="Jane"
                  disabled={false}
                  className={`mt-2 p-2 w-full rounded shadow-inner ${
                    errors.name && touched.name
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
                  htmlFor="sectors"
                  className="block text-gray-800 font-bold"
                >
                  Sectors
                </label>
                <FieldArray
                  name="sectors"
                  render={(arrayHelpers) => (
                    <Sectors
                      errors={errors}
                      touched={touched}
                      isEditing={isEditing}
                      arrayHelpers={arrayHelpers}
                      selectedSectors={selectedSectors}
                      setSelectedSectors={setSelectedSectors}
                    />
                  )}
                />
                <ErrorMessage
                  component="div"
                  name="sectors"
                  className="text-red-500"
                />
              </div>

              <div className="mb-4">
                <Field
                  type="checkbox"
                  id="agreetoterms"
                  name="agreetoterms"
                  className={`mt-2 me-2 inline-block ${
                    errors.agree && touched.agree
                      ? "border-red-500 border-2"
                      : "border"
                  }`}
                />
                <label
                  htmlFor="agreetoterms"
                  className="inline me-5 mt-5 text-gray-800 font-bold"
                >
                  Agree to terms
                </label>
                <br></br>
                <ErrorMessage
                  component="div"
                  name="agreetoterms"
                  className="text-red-500"
                />
              </div>

              <button
                type="submit"
                disabled={addEntryLoading || editEntryLoading}
                className="w-full h-10 p-2 bg-blue-600 text-white font-semibold rounded-lg disabled:opacity-80 flex items-center justify-center"
              >
                {addEntryLoading || editEntryLoading ? <Loading /> : "Save"}
              </button>
            </Form>
          </div>
        )}
      </Formik>
    </div>
  );
};

export default AddData;
