import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Layout & Pages
import AppLayout from "./components/AppLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";

import Mostwanted from "./pages/MostWanted";
import User from "./pages/User";
import Login from "./components/Login";
import About from "./pages/About";
// import Men from "./components/men";
// import Women from "./components/women";
import Contact from "./pages/Contactus";
import ProductDetails from "./components/ProductDetails";
import CartProvider from "./components/context/CartContext";
import Product from "./components/products";
import Cart from "./pages/Cart";
import Allcollection from "./pages/allcollection";
import Checkout from "./pages/Checkout";
import SearchResults from "./components/SearchResults";
// import Office from "./components/office";
// import Summer from "./components/summer";
import Admin from "./Admin/Adminpages/Dashboard";
import AdminLogin from "./Admin/Admincomponents/adminlogin";
import ProductUpload from "./Admin/Admincomponents/ProductUpload";
// import AdminLayout from "./Admin/Admincomponents/Adminlayout";
import Orders from "./Admin/Admincomponents/Order";
import Users from "./Admin/Admincomponents/Users";
import OrderDetail from "./Admin/Admincomponents/Orderdetail";
import AdminLayout from "./Admin/Admincomponents/Adminlayout";
import NewArrivals from "./pages/NewArrivals";
import CategoryPage from "./Admin/Admincomponents/products_Category";
import CategoryProducts from "./components/category";


function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <AppLayout />,
      children: [
        { path: "/", element: <Home /> },
        { path: "/products/new", element: <NewArrivals/> },
        { path: "/MostWanted", element: <Mostwanted /> },

        {
          path: "/User",
          element: (
            <ProtectedRoute>
              <User />
            </ProtectedRoute>
          ),
        },
        { path: "/Login", element: <Login /> },
        { path: "/About", element: <About /> },
        // { path: "category/Men", element: <Men /> },
        // { path: "/category/Women", element: <Women /> },
        { path: "/Contactus", element: <Contact /> },
        { path: "/product", element: <Product /> },
        { path: "/products/:productid", element: <ProductDetails /> },
        { path: "/cart", element: <Cart /> },
        { path: "/Allcollection", element: <Allcollection /> },
        { path: "Checkout", element: <Checkout /> },
        { path: "/search", element: <SearchResults /> },
      {path:"/category/:categoryName" ,element:<CategoryProducts/>},
      {path:"/category/:categoryName/sub/:subName",element:<CategoryProducts/>}
     
      
      ],
    },
    { path: "/dashboard/login", element: <AdminLogin /> },
        { path: "/dashboard/", element: <Admin /> },
    {
      path: "/",
      element: <AdminLayout />,
      children: [
        
        { path: "", element: <Admin /> },
        { path: "/dashboard/products", element: <ProductUpload /> },
        {path:"/dashboard/categories", element:<CategoryPage/>},
        { path: "/dashboard/orders", element: <Orders /> },
        { path: "/dashboard/users", element: <Users /> },
        { path: "/dashboard/orderdetail/:id", element: <OrderDetail /> },
      
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
