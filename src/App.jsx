import { Routes, Route, useParams, Navigate } from 'react-router-dom'

import HomePage from './pages/HomePage'
import ProviderDashboard from './pages/PetProvider/ProviderDashboard'
import ProviderLogIn from './pages/PetProvider/LogIn'
import ProviderRegister from './pages/PetProvider/Register'
import GuardianLogIn from './pages/PetGuardian/LogIn'
import GuardianRegister from './pages/PetGuardian/Register'
import GuardianDashboard from './pages/PetGuardian/GuardianDashboard'
import ProfileModal from './pages/PetGuardian/ProfileModal'
import AddPetModal from './pages/PetProvider/AddPetModal'
import PetModal from './pages/PetProvider/PetModal'
import ApplicationModal from './pages/PetProvider/ApplicationModal'
import MessageModal from './pages/PetProvider/MessageModal'

export default function App() {
  const ProviderWithPet = () => {
    const { petName } = useParams();
    return <ProviderDashboard openPetNameOnMount={petName} />;
  };

  const ProviderWithApplication = () => {
    const { appName } = useParams();
    return <ProviderDashboard openApplicationNameOnMount={appName} />;
  };

  const ProviderWithMessage = () => {
    const { msgName } = useParams();
    return <ProviderDashboard openMessageNameOnMount={msgName} />;
  };

  const GuardianWithMessage = () => {
    const { msgName } = useParams();
    return <GuardianDashboard openMessageNameOnMount={msgName} />;
  };

  const ProviderWithAddPet = () => <ProviderDashboard openAddPetOnMount />;

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Navigate to="/guardian/login" replace />} />
      <Route path="/register" element={<Navigate to="/provider/register" replace />} />
      <Route path="/provider" element={<Navigate to="/provider/login" replace />} />
      <Route path="/guardian" element={<Navigate to="/guardian/login" replace />} />
      <Route path="/provider/login" element={<ProviderLogIn />} />
      <Route path="/provider/register" element={<ProviderRegister />} />
      <Route path="/guardian/login" element={<GuardianLogIn />} />
      <Route path="/guardian/register" element={<GuardianRegister />} />
      <Route path="/guardian/dashboard" element={<GuardianDashboard />} />
      <Route path="/guardian-dashboard" element={<Navigate to="/guardian/dashboard" replace />} />
      <Route path="/provider/dashboard" element={<ProviderDashboard />} />
      <Route path="/provider-dashboard" element={<Navigate to="/provider/dashboard" replace />} />
      <Route path="/provider/profile" element={<ProviderDashboard openProfileOnMount />} />
      <Route path="/provider/add-pet" element={<ProviderWithAddPet />} />
      <Route path="/provider/pet/:petName" element={<ProviderWithPet />} />
      <Route path="/provider/application/:appName" element={<ProviderWithApplication />} />
      <Route path="/provider/message/:msgName" element={<ProviderWithMessage />} />
      <Route path="/guardian/profile" element={<GuardianDashboard openProfileOnMount />} />
      <Route path="/guardian/message/:msgName" element={<GuardianWithMessage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
