import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Layout } from './components';
import { 
  Dashboard, 
  Products, 
  Categories, 
  Brands, 
  Stock, 
  Orders, 
  Users, 
  Login 
} from './pages';

// Route Guard Component
const ProtectedRoute = () => {
  const token = localStorage.getItem('token');
  
  // ถ้าไม่มี Token เตะกลับไปหน้า Login
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return <Outlet />;
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      {/* ทุกหน้าที่อยู่ข้างในนี้ ต้อง Login ก่อนถึงจะเข้าได้ */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="categories" element={<Categories />} />
          <Route path="brands" element={<Brands />} />
          <Route path="stock" element={<Stock />} />
          <Route path="orders" element={<Orders />} />
          <Route path="users" element={<Users />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
