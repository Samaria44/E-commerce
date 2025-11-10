import Product from "../components/products";
import { getProducts } from "../services/Product";


export default function Mostwanted() {
  const  mostwanted= getProducts({mw:"true"});


  return (
    <>
    
     
 <Product products={mostwanted}  title="Most Wanted Collection"/>
    </>
  );
}
