import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Layouts
import AppLayout from "./components/AppLayout";
import AdminLayout from "./Admin/Admincomponents/Adminlayout";
import CartProvider from "./components/context/CartContext";

// Auth
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./components/Login";
import AdminLogin from "./Admin/Admincomponents/adminlogin";

// Frontend pages
import Home from "./pages/Home";
import NewArrivals from "./pages/NewArrivals";
import Mostwanted from "./pages/MostWanted";
import User from "./pages/User";
import About from "./pages/About";
import Contact from "./pages/Contactus";
import Product from "./components/products";
import ProductDetails from "./components/ProductDetails";
import Cart from "./pages/Cart";
import Allcollection from "./pages/allcollection";
import Checkout from "./pages/Checkout";
import SearchResults from "./components/SearchResults";
import CategoryProducts from "./components/category";

// Admin pages
import AdminDashboard from "./Admin/Adminpages/Dashboard";
import ProductUpload from "./Admin/Admincomponents/ProductUpload";
import CategoryPage from "./Admin/Admincomponents/products_Category";
import Orders from "./Admin/Admincomponents/Order";
import Users from "./Admin/Admincomponents/Users";
import OrderDetail from "./Admin/Admincomponents/Orderdetail";


function App() {
  const router = createBrowserRouter([
    // ── Frontend routes (with Header + Footer) ──
    {
      path: "/",
      element: <AppLayout />,
      children: [
        { index: true, element: <Home /> },
        { path: "products/new", element: <NewArrivals /> },
        { path: "MostWanted", element: <Mostwanted /> },
        { path: "Login", element: <Login /> },
        { path: "About", element: <About /> },
        { path: "Contactus", element: <Contact /> },
        { path: "product", element: <Product /> },
        { path: "products/:productid", element: <ProductDetails /> },
        { path: "cart", element: <Cart /> },
        { path: "Allcollection", element: <Allcollection /> },
        { path: "Checkout", element: <Checkout /> },
        { path: "search", element: <SearchResults /> },
        { path: "category/:categoryName", element: <CategoryProducts /> },
        { path: "category/:categoryName/sub/:subName", element: <CategoryProducts /> },
        {
          path: "User",
          element: (
            <ProtectedRoute>
              <User />
            </ProtectedRoute>
          ),
        },
      ],
    },

    // ── Admin login (standalone, no sidebar) ──
    { path: "/dashboard/login", element: <AdminLogin /> },

    // ── Admin routes (with sidebar layout) ──
    {
      path: "/dashboard",
      element: <AdminLayout />,
      children: [
        { index: true, element: <AdminDashboard /> },
        { path: "products", element: <ProductUpload /> },
        { path: "categories", element: <CategoryPage /> },
        { path: "orders", element: <Orders /> },
        { path: "users", element: <Users /> },
        { path: "orderdetail/:id", element: <OrderDetail /> },
      ],
    },
  ]);

  return (
    <CartProvider>
      <RouterProvider router={router} />
   
    </CartProvider>
  );
}

export default App;
