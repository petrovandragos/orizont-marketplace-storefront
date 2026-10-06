import { Metadata } from "next"
import Image from "next/image"

export const metadata: Metadata = {
  title: "Certificări",
  description: "Certificările de calitate ale companiei Orizont.",
}

const CERTIFICATES = [
  {
    title: "ISO 9001 : 2008",
    images: [
      "/certificari/SCAN-CERTIFICAT-ISO.jpg",
      "/certificari/SCAN-CERTIFICAT-ISO-2.jpg",
    ],
  },
  {
    title: "ISO 14001 : 2005",
    images: [
      "/certificari/SCAN-CERTIFICAT-ISO-2004.jpg",
      "/certificari/SCAN-CERTIFICAT-ISO-2004-2.jpg",
    ],
  },
  {
    title: "ISO 18001 : 2008",
    images: [
      "/certificari/SCAN-CERTIFICAT-ISO-2007.jpg",
      "/certificari/SCAN-CERTIFICAT-ISO-2007-2.jpg",
    ],
  },
  {
    title: "Licență transport",
    images: [
      "/certificari/SCAN-LICENTA-TRANSPORT.jpg",
      "/certificari/SCAN-LICENTA-TRANSPORT-2.jpg",
    ],
  },
]

export default function CertificariPage() {
  return (
    <div className="content-container py-12 md:py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-[#1A1A1A] mb-2">
          Certificări
        </h1>
        <p className="text-gray-500 mb-10">
          Orizont este certificat conform standardelor internaționale de calitate, mediu și sănătate ocupațională.
        </p>

        <div className="flex flex-col gap-y-14">
          {CERTIFICATES.map((cert) => (
            <div key={cert.title}>
              <h2 className="text-base font-semibold text-[#F27A1A] uppercase tracking-wider mb-4">
                {cert.title}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {cert.images.map((src) => (
                  <div
                    key={src}
                    className="relative w-full rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-gray-50"
                    style={{ aspectRatio: "1 / 1.414" }}
                  >
                    <Image
                      src={src}
                      alt={cert.title}
                      fill
                      className="object-contain p-3"
                      sizes="(max-width: 640px) 100vw, 50vw"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
