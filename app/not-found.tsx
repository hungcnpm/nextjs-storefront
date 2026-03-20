import Link from "next/link";
import  Button  from "@/components/Button";
import Center from "@/components/Center";

export default function NotFound() {
  return (
    <Center>
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        
        {/* Big 404 */}
        <h1 className="text-7xl font-extrabold tracking-widest text-black">
          404
        </h1>

        {/* Divider line */}
        <div className="w-16 h-1 bg-black my-4 rounded"></div>

        {/* Message */}
        <h2 className="text-2xl font-semibold mb-2">
          Oops! Page not found
        </h2>

        <p className="text-gray-500 max-w-md mb-8">
          The page you’re looking for doesn’t exist, was removed,
          or is temporarily unavailable.
        </p>

        {/* Actions */}
        <div className="flex gap-4 flex-wrap justify-center">
          <Link href="/">
            <Button outline >
              Back to Home
            </Button>
          </Link>

          <Link href="/products">
            <Button primary>
              Shop Now
            </Button>
          </Link>
        </div>

        {/* Suggestion */}
        <p className="text-sm text-gray-400 mt-10">
          Need help? Try searching or explore our products.
        </p>
      </div>
    </Center>
  );
}