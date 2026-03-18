import Header from "@/components/header";
import Featured from "@/components/Feature";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import NewProduct from "@/components/NewProduct";
export default async function HomePage() {
  const featuredProductId = "69b84732a4d485e6a740e9be";

  const client = await clientPromise;
  const db = client.db();

  const featureProduct = await db
    .collection("products")
    .findOne({ _id: new ObjectId(featuredProductId) });
    const newProducts = await db
    .collection("products")
    .find({})
    .sort({ _id: -1 }) // mới nhất
    .limit(10)
    .toArray();
  return (
    <div>
      <Header />
      <Featured product={JSON.parse(JSON.stringify(featureProduct))} />
      <NewProduct products={JSON.parse(JSON.stringify(newProducts))}/>
    </div>
  );
}