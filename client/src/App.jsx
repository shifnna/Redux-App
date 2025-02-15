import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import Header from './components/Header';
import { useSelector } from 'react-redux';
import AdminDashboard from './pages/adminPage/dashboard';

export default function App() {

  const AdminRoute = ({ children }) => {
    const { currentUser } = useSelector((state) => state.user);
      if (!currentUser || currentUser.role !== 'admin') {
      return <Navigate to="/sign-in" />;
    }
    return children;
  };
  
  const { currentUser } = useSelector(state => state.user);

  return (
    <BrowserRouter>
      {/* header */}
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/sign-up' element={<SignUp />} />
        <Route path='/profile' element={currentUser ? <Profile /> : <Navigate to='/sign-in' />} />
        <Route path='/admin' element={<AdminRoute> <AdminDashboard /> </AdminRoute>}/>
      </Routes>
    </BrowserRouter>
  );
}
