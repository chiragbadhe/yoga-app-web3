import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <main className="text-center">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          <Link href="/exercises" legacyBehavior>
            <a className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition duration-300 ease-in-out">
              <h3 className="text-2xl font-bold mb-2">Exercises &rarr;</h3>
              <p className="text-lg font-light">
                View all the exercises available with a how to attached
              </p>
            </a>
          </Link>

          <Link href="/poses" legacyBehavior>
            <a className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition duration-300 ease-in-out">
              <h3 className="text-2xl font-bold mb-2">Poses &rarr;</h3>
              <p className="text-lg font-light">
                Has all the poses listed out and can be accessed
              </p>
            </a>
          </Link>
        </div>
      </main>
    </div>
  );
}
