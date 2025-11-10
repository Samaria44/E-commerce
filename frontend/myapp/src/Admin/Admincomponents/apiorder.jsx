// import React, { useEffect, useState } from "react";

// export default function Apiorder() {
//   const [data, setData] = useState([]);

//   const getdata = async () => {
//     try {
//       const res = await fetch("http://localhost:8000/orders");
//       const result = await res.json();
      
//       setData(result); //  store in state
//     } catch (error) {
//       console.error("Error fetching orders:", error);
//     }
//   };

//   useEffect(() => {
//     getdata(); //  call function when component loads
//   }, []);

//   return (
//     <>
//       <h2>Orders</h2>
      
//     </>
//   );
// }
