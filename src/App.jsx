import { Route, BrowserRouter, Routes } from "react-router-dom";
import AddData from "./AddEntry/AddEntry";
import EntriesList from "./EntriesList/EntriesList";
import Navbar from "./Navbar/Navbar";
import NotFound from "./NotFoundPage/NotFound";
import Loading from "./Loading/Loading";

import Accounts from "./Accounts/Accounts";
import { AddAccounts } from "./Accounts/AddAccounts";
import { Login } from "./Login/Login";
import Volunteers from "./Volunteers/Volunteers";
import { AddVolunteer } from "./Volunteers/AddVolunteer";
import Patients from "./Patients/Patients";
import { AddPatient } from "./Patients/AddPatients";

const App = () => {
  const token = localStorage.getItem('token');

  return (
    <BrowserRouter>
      <Navbar />
        <Routes>

          {/* Only if there is token, can access all page, if not redirect to login page */}
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

          <Route path='/vot-patients' element={<Patients vot_table="true" />} />
          <Route path="/move-to-vot/:patientId" element={<AddPatient move_to_vot="true" />} />
          
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
