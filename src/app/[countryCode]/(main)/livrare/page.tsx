import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Livrare",
  description: "Informații despre livrarea produselor Orizont.",
}

const STEPS = [
  {
    step: "01",
    title: "Plasați comanda",
    desc: "Adăugați produsele în coș și finalizați comanda online sau telefonic.",
  },
  {
    step: "02",
    title: "Confirmăm disponibilitatea",
    desc: "Vă contactăm în cel mai scurt timp pentru a confirma stocul și data livrării.",
  },
  {
    step: "03",
    title: "Livrăm la dumneavoastră",
    desc: "Transportăm marfa cu vehiculele proprii direct la adresa indicată.",
  },
]

export default function LivrarePage() {
  return (
    <div className="content-container pt-8 pb-4 md:pt-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="display-2 mb-10">
          Livrare
        </h1>

        <div className="flex flex-col gap-y-10">

          {/* Steps */}
          <section>
            <h2 className="text-2xl font-semibold tracking-[-0.02em] text-[#1D1D1F] mb-5">Cum funcționează</h2>
            <div className="flex flex-col gap-y-4">
              {STEPS.map(({ step, title, desc }) => (
                <div key={step} className="flex items-start gap-x-4 bg-[#F5F5F7] rounded-[22px] p-5">
                  <div className="w-10 h-10 rounded-full bg-[#1D1D1F] text-white text-sm font-semibold flex items-center justify-center flex-shrink-0">
                    {step}
                  </div>
                  <div>
                    <h3 className="text-[17px] font-semibold text-[#1D1D1F] mb-0.5">{title}</h3>
                    <p className="text-[15px] text-[#6E6E73] leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Details */}
          <section>
            <h2 className="text-2xl font-semibold tracking-[-0.02em] text-[#1D1D1F] mb-4">Detalii livrare</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  icon: (
                    <svg className="w-5 h-5 text-[#F27A1A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  ),
                  title: "Zonă de livrare",
                  desc: "Livrăm în Sighetu Marmației și localitățile din jur. Contactați-ne pentru detalii privind livrarea la distanță.",
                },
                {
                  icon: (
                    <svg className="w-5 h-5 text-[#F27A1A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ),
                  title: "Termen de livrare",
                  desc: "Depinde de disponibilitatea produselor și de distanță. Vă confirmăm data livrării odată cu oferta.",
                },
                {
                  icon: (
                    <svg className="w-5 h-5 text-[#F27A1A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  ),
                  title: "Cost transport",
                  desc: "Costul transportului se calculează în funcție de volum, greutate și distanță. Vă informăm la confirmare.",
                },
                {
                  icon: (
                    <svg className="w-5 h-5 text-[#F27A1A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                  ),
                  title: "Ridicare din depozit",
                  desc: "Puteți ridica comanda direct din depozitul nostru din Str. Plevnei nr. 3, Sighetu Marmației, în programul de lucru.",
                },
              ].map(({ icon, title, desc }) => (
                <div key={title} className="bg-[#F5F5F7] rounded-[22px] p-5 flex flex-col gap-y-2">
                  <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center">
                    {icon}
                  </div>
                  <h3 className="text-[17px] font-semibold text-[#1D1D1F]">{title}</h3>
                  <p className="text-[15px] text-[#6E6E73] leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <div className="bg-[#FFF3E6] rounded-[22px] p-5 flex items-start gap-x-3">
            <svg className="w-5 h-5 text-[#F27A1A] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-[#1D1D1F]">
              Pentru comenzi mari sau transport special, vă rugăm să ne contactați la{" "}
              <a href="tel:0730076606" className="font-semibold text-[#F27A1A] hover:underline">
                0730 076 606
              </a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
