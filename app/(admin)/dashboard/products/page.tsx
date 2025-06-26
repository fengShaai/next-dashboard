import { Suspense } from "react";
import Separator from "@/app/ui/separator";
import ProductClient from "./components/client";
import ProductList from "./components/productList";
import prisma from "@/lib/prisma";

const Page = async () => {
  const count = await prisma.product.count();
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 px-8 pt-6">
        <ProductClient count={count}/>
        <Separator />
        <div className="container mx-auto">
          <Suspense fallback={<p>Loading products...</p>}>
            <ProductList />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default Page;
