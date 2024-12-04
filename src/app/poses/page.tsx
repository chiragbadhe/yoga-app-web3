import Link from "next/link";
import Image from "next/image";

export default function Poses() {
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold underline">Poses</h1>
      <p className="mt-4">Individual poses</p>

      <main className="main mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          <Link href="/poses/pose1" className="block">
            <div className="card p-6 bg-white rounded-lg shadow-lg cursor-pointer">
              <h3 className="text-lg font-semibold">Pose 1 &rarr;</h3>
              <p>View and try out Pose 1</p>
              <div className="relative w-full h-64 mt-4">
                <Image
                  src="/pose1.jpg"
                  alt="Demonstration of Pose 1"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover rounded-lg"
                />
              </div>
            </div>
          </Link>
          <Link href="/poses/pose2" className="block">
            <div className="card p-6 bg-white rounded-lg shadow-lg cursor-pointer">
              <h3 className="text-lg font-semibold">Pose 2 &rarr;</h3>
              <p>View and try out Pose 2</p>
              <div className="relative w-full h-64 mt-4">
                <Image
                  src="/pose2.jpg"
                  alt="Demonstration of Pose 2"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover rounded-lg"
                />
              </div>
            </div>
          </Link>
        </div>
      </main>

      <div className="mt-8">
        <Link href="/" className="block">
          <div className="card p-6 bg-white rounded-lg shadow-lg cursor-pointer">
            Back to home
          </div>
        </Link>
      </div>
    </div>
  );
}
