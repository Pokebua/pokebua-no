import { Roboto } from "next/font/google";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export default function OmOssPage() {
  return (
    <main className="min-h-screen bg-yellow-50 px-4 py-12">
      <section
        className={`${roboto.className} mx-auto max-w-5xl rounded-2xl border-4 border-yellow-400 bg-yellow-100 p-6 shadow-md md:p-10`}
      >
        <h1 className="mb-6 text-4xl font-bold text-black md:text-5xl">
          Om oss
        </h1>

        <div className="space-y-4 text-lg leading-relaxed text-gray-800">
          <p>Midlertidig tekst fra eierne legges inn her.</p>

          <p>
            Innholdet skal senere hentes fra Shopify slik at eierne kan
            oppdatere teksten selv.
          </p>
        </div>
      </section>
    </main>
  );
}