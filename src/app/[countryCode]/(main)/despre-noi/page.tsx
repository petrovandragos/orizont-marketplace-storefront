import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Despre noi",
  description: "Află mai multe despre Orizont — depozit de materiale de construcții din Sighetu Marmației.",
}

export default function DespreNoiPage() {
  return (
    <div className="content-container py-12 md:py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-[#1A1A1A] mb-2">
          Despre noi
        </h1>
        <div className="w-12 h-1 bg-[#F27A1A] rounded mb-8" />

        <div className="flex flex-col gap-y-8 text-[#333333]">
          <section>
            <h2 className="text-lg font-semibold text-[#1A1A1A] mb-3">Cine suntem</h2>
            <p className="text-sm leading-relaxed text-gray-600">
              Orizont este un depozit de materiale de construcții cu sediul în Sighetu Marmației,
              cu o experiență de peste două decenii în furnizarea de produse de calitate pentru
              construcții și amenajări. Servim atât clienți individuali, cât și firme de construcții,
              antreprenori și proiectanți din întreaga regiune.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#1A1A1A] mb-3">Ce oferim</h2>
            <p className="text-sm leading-relaxed text-gray-600 mb-4">
              Gama noastră acoperă toate etapele unui proiect de construcție, de la fundație
              până la finisaje:
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
              {[
                "Materiale de construcții",
                "Acoperișuri și sisteme",
                "Finisaje interioare și exterioare",
                "Instalații sanitare",
                "Instalații electrice",
                "Scule și echipamente",
                "Curte și grădină",
                "Transport și livrare",
              ].map((item) => (
                <li key={item} className="flex items-center gap-x-2 text-sm text-gray-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F27A1A] flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#1A1A1A] mb-3">Valorile noastre</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  title: "Calitate",
                  desc: "Lucrăm exclusiv cu furnizori certificați și produse care respectă standardele europene.",
                },
                {
                  title: "Promptitudine",
                  desc: "Livrare rapidă și onorarea comenzilor în termenele convenite.",
                },
                {
                  title: "Corectitudine",
                  desc: "Prețuri transparente, fără costuri ascunse, și relații pe termen lung cu clienții noștri.",
                },
              ].map(({ title, desc }) => (
                <div
                  key={title}
                  className="bg-white rounded-xl border border-gray-100 shadow-sm p-5"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#FFF3E6] flex items-center justify-center mb-3">
                    <span className="w-2 h-2 rounded-full bg-[#F27A1A]" />
                  </div>
                  <h3 className="text-sm font-semibold text-[#1A1A1A] mb-1">{title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#1A1A1A] mb-3">Certificări</h2>
            <p className="text-sm leading-relaxed text-gray-600">
              Activitatea noastră este certificată conform standardelor internaționale{" "}
              <strong>ISO 9001 : 2008</strong>, <strong>ISO 14001 : 2005</strong> și{" "}
              <strong>ISO 18001 : 2008</strong>, care atestă angajamentul nostru față de
              calitate, protecția mediului și sănătatea ocupațională.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
