import { Route, BrowserRouter, Routes } from "react-router-dom";
import AddData from "./AddEntry/AddEntry";
import EntriesList from "./EntriesList/EntriesList";
import Navbar from "./Navbar/Navbar";
import NotFound from "./NotFoundPage/NotFound";
import Loading from "./Loading/Loading";

import { useGetSectorsQuery, useGetEntriesQuery } from "./redux/api";
import Accounts from "./Accounts/Accounts";
import { AddAccounts } from "./Accounts/AddAccounts";
import { Login } from "./Login/Login";
import Volunteers from "./Volunteers/Volunteers";
import { AddVolunteer } from "./Volunteers/AddVolunteer";
import Patients from "./Patients/Patients";
import { AddPatient } from "./Patients/AddPatients";

const App = () => {
  // const {
  //   isLoading: sectorIsLoading,
  //   isSuccess: sectorIsSuccess,
  //   error: sectorError,
  // } = useGetSectorsQuery();

  // const {
  //   isLoading: entriesIsLoading,
  //   error: entriesError,
  //   refetch,
  //   isSuccess: entriesIsSuccess,
  // } = useGetEntriesQuery({}, { refetchOnMountOrArgChange: true });

  return (
    <BrowserRouter>
      <Navbar />
      {/* {sectorIsLoading && entriesIsLoading && (
        <div className="my-8">
          <Loading />
        </div>
      )}
      {sectorError && (
        <div className="text-center mt-5">
          <h1 className="text-red-900">
            Something went wrong. Please try again.
          </h1>
        </div>
      )} */}

      {/* {sectorIsSuccess && entriesIsSuccess && ( */}
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/accounts" element={<Accounts />} />
          <Route path="/add-account" element={<AddAccounts />} />
          <Route path="/add-account/:accountId" element={<AddAccounts />} />

          <Route path="/volunteers" element={<Volunteers />} />
          <Route path="/add-volunteer" element={<AddVolunteer />} />
          <Route path="/add-volunteer/:volunteerId" element={<AddVolunteer />} />

          <Route path="/patients" element={<Patients />} />
          <Route path="/add-patient" element={<AddPatient />} />
          <Route path="/add-patient/:patientId" element={<AddPatient />} />
          
          {/* <Route path="">
            <Route index element={<AddData refetch={refetch} />} />
            <Route path="/:entryid" element={<AddData refetch={refetch} />} />
          </Route> */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      {/* )} */}
    </BrowserRouter>
  );
};

export default App;
