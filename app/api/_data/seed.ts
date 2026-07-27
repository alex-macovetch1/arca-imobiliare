import type { Lead } from "@/lib/types";

/* ---------------------------------------------------------------------------
   The panel starts with a week of requests behind it, so the counters, the
   filters and the state column can be judged on something other than an empty
   table. Dates are relative to first run: the dashboard tiles have to mean
   something whenever the agency opens the panel for the first time.
   --------------------------------------------------------------------------- */

const HOUR = 3600_000;

function at(hoursAgo: number, hh: number, mm: number): string {
  const d = new Date(Date.now() - hoursAgo * HOUR);
  d.setHours(hh, mm, 0, 0);
  return d.toISOString();
}

export function SEED_LEADS(): Lead[] {
  return [
    {
      id: "L-SEED01",
      createdAt: at(2, 11, 20),
      source: "anunt",
      name: "Victoria Ceban",
      phone: "+37369334512",
      email: "v.ceban@mail.md",
      message:
        "Sunt interesată de proprietatea de pe str. Matei Basarab 12, cod AR-1042. Pot veni la vizionare joi după ora 17.",
      propertyId: "AR-1042",
      agentSlug: "victor-morari",
      lang: "ro",
      state: "nou",
    },
    {
      id: "L-SEED02",
      createdAt: at(5, 9, 45),
      source: "vinde",
      name: "Igor Rotaru",
      phone: "+37379120844",
      message:
        "Vând apartament cu 2 camere în Botanica, 64 m², euroreparație, etajul 5 din 9. Aș vrea o evaluare.",
      lang: "ro",
      state: "contactat",
      note: "Sunat marți. Cere 118 000 €, i-am spus că banda sectorului e 92-114. Revine cu actele.",
    },
    {
      id: "L-SEED03",
      createdAt: at(26, 16, 10),
      source: "contact",
      name: "Елена Морозова",
      phone: "+37368450219",
      email: "morozova.e@gmail.com",
      message: "Ищем трёхкомнатную квартиру в Рышкановке до 150 000 €. Можно вторичный фонд.",
      lang: "ru",
      state: "programat",
      note: "Vizionare sâmbătă 10:30, două apartamente pe Kiev și Miron Costin.",
    },
    {
      id: "L-SEED04",
      createdAt: at(30, 13, 5),
      source: "agent",
      name: "Dumitru Pascari",
      phone: "+37360778130",
      message: "Aș vrea să discut cu Natalia despre un apartament pentru părinți, buget 80 000 €.",
      agentSlug: "natalia-rusu",
      lang: "ro",
      state: "contactat",
    },
    {
      id: "L-SEED05",
      createdAt: at(52, 18, 40),
      source: "cautare",
      name: "Ana Guțu",
      phone: "+37378201955",
      message:
        "Caut 2 camere în Centru sau Buiucani, bloc nou, până în 130 000 €, cu parcare subterană.",
      lang: "ro",
      state: "nou",
    },
    {
      id: "L-SEED06",
      createdAt: at(78, 10, 15),
      source: "anunt",
      name: "Сергей Балан",
      phone: "+37369812203",
      message: "Интересует объект AR-1188. Свободна ли квартира и возможен ли торг?",
      propertyId: "AR-1188",
      agentSlug: "andrei-cebotari",
      lang: "ru",
      state: "inchis",
      note: "A cumpărat altceva prin altă agenție. Închis.",
    },
    {
      id: "L-SEED07",
      createdAt: at(96, 15, 30),
      source: "contact",
      name: "Mihai Ursu",
      phone: "+37367440118",
      email: "mihai.ursu@outlook.com",
      message: "Vreau să închiriez un birou de 60-90 m² în Centru, pe termen lung.",
      lang: "ro",
      state: "contactat",
      note: "Trimis două oferte pe email. Așteaptă decizia asociatului.",
    },
  ];
}
