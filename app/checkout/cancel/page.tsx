import Link from "next/link";
import Button from "@/components/Button";
import Center from "@/components/Center";

export default function CancelPage() {
  return (
    <Center>
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        
        {/* Icon */}
        <div className="text-red-500 text-6xl mb-4">✖</div>

        <h1 className="text-3xl font-bold mb-2">
          Payment Cancelled
        </h1>

        <p className="text-gray-500 max-w-md mb-6">
          Your payment was not completed. You can try again anytime.
        </p>

        <div className="flex gap-4">
          <Link href="/cart">
            <Button outline>Back to Cart</Button>
          </Link>

          <Link href="/products">
            <Button primary>Browse Products</Button>
          </Link>
        </div>
      </div>
    </Center>
  );
}