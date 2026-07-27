import type { Agent } from "./types";

/* ---------------------------------------------------------------------------
   Four agents. In Moldova the relationship is with the person, not the agency,
   so every property points at one of these and the phone number is always
   printed in full — we are not a portal hiding the contact behind a form.
   --------------------------------------------------------------------------- */

export const AGENTS: Agent[] = [
  {
    slug: "andrei-cebotari",
    name: "Andrei Cebotari",
    role: { ro: "Agent imobiliar senior", ru: "Старший агент по недвижимости" },
    photo: {
      src: "/img/agent-01.jpg",
      width: 640,
      height: 800,
      alt: {
        ro: "Andrei Cebotari, agent imobiliar senior ARCA",
        ru: "Андрей Чеботарь, старший агент по недвижимости ARCA",
      },
    },
    phone: "+373 69 12 44 07",
    phoneHref: "tel:+37369124407",
    whatsapp: "https://wa.me/37369124407",
    viber: "viber://chat?number=%2B37369124407",
    email: "andrei@arca.md",
    sectors: ["centru", "buiucani", "codru"],
    languages: ["ro", "ru", "en"],
    since: 2013,
    deals: 246,
    bio: {
      ro: "Andrei lucrează în imobiliare din 2009 și în ARCA din primul an al agenției. S-a specializat pe Centru și Buiucani, adică pe cele două sectoare unde o diferență de o stradă schimbă prețul cu douăzeci de mii de euro. A vândut peste două sute de apartamente și a învățat, spune el, că cea mai scumpă greșeală a unui cumpărător nu e prețul, ci graba la verificarea actelor.\n\nÎnainte de ARCA a lucrat patru ani ca evaluator autorizat, ceea ce înseamnă că știe să citească un extras din registrul bunurilor imobile mai repede decât majoritatea notarilor. Clienții îl sună de obicei pentru apartamente între 100 și 250 de mii de euro.\n\nVorbește română, rusă și engleză. Răspunde la telefon și sâmbăta.",
      ru: "Андрей в недвижимости с 2009 года, а в ARCA — с первого года работы агентства. Специализируется на Центре и Буюканах, то есть на двух секторах, где разница в одну улицу меняет цену на двадцать тысяч евро. Продал больше двухсот квартир и, по его словам, усвоил: самая дорогая ошибка покупателя — не цена, а спешка при проверке документов.\n\nДо ARCA четыре года работал лицензированным оценщиком, поэтому читает выписку из реестра недвижимости быстрее большинства нотариусов. Клиенты обычно звонят ему по квартирам от 100 до 250 тысяч евро.\n\nГоворит по-румынски, по-русски и по-английски. Отвечает на звонки и в субботу.",
    },
    quote: {
      ro: "Nu vând apartamente. Ajut oamenii să nu cumpere apartamentul greșit.",
      ru: "Я не продаю квартиры. Я помогаю людям не купить не ту квартиру.",
    },
  },
  {
    slug: "natalia-rusu",
    name: "Natalia Rusu",
    role: { ro: "Agent imobiliar", ru: "Агент по недвижимости" },
    photo: {
      src: "/img/agent-02.jpg",
      width: 640,
      height: 800,
      alt: {
        ro: "Natalia Rusu, agent imobiliar ARCA",
        ru: "Наталья Русу, агент по недвижимости ARCA",
      },
    },
    phone: "+373 68 30 12 55",
    phoneHref: "tel:+37368301255",
    whatsapp: "https://wa.me/37368301255",
    viber: "viber://chat?number=%2B37368301255",
    email: "natalia@arca.md",
    sectors: ["botanica", "telecentru", "ialoveni", "stauceni"],
    languages: ["ro", "ru"],
    since: 2017,
    deals: 163,
    bio: {
      ro: "Natalia acoperă Botanica și Telecentru, sectoarele în care se cumpără prima locuință. Vine din vânzări bancare, unde a lucrat șase ani pe credite ipotecare, așa că discuția despre rată, avans și venit necesar începe la prima vizionare, nu la bancă.\n\nJumătate din tranzacțiile ei sunt cu familii tinere care cumpără primul apartament, iar cealaltă jumătate cu proprietari care vând ca să se mute într-o casă la marginea orașului. Cunoaște fiecare bloc de pe Grenoble și de pe bulevardul Dacia, inclusiv cele cu probleme de acoperiș.\n\nLucrează în română și rusă.",
      ru: "Наталья ведёт Ботанику и Телецентр — секторы, где покупают первое жильё. Пришла из банковских продаж, где шесть лет занималась ипотекой, поэтому разговор о платеже, первоначальном взносе и необходимом доходе начинается на первом просмотре, а не в банке.\n\nПоловина её сделок — молодые семьи, покупающие первую квартиру, вторая половина — собственники, которые продают, чтобы переехать в дом на окраине. Знает каждый дом на Гренобль и на бульваре Дачия, включая те, где течёт крыша.\n\nРаботает на румынском и русском.",
    },
    quote: {
      ro: "Prima întrebare nu e cât costă. E cât rămâne din salariu după rată.",
      ru: "Первый вопрос — не сколько стоит. А сколько остаётся от зарплаты после платежа.",
    },
  },
  {
    slug: "victor-morari",
    name: "Victor Morari",
    role: { ro: "Agent imobiliar senior · blocuri noi", ru: "Старший агент · новостройки" },
    photo: {
      src: "/img/agent-03.jpg",
      width: 640,
      height: 800,
      alt: {
        ro: "Victor Morari, agent imobiliar senior ARCA",
        ru: "Виктор Морарь, старший агент по недвижимости ARCA",
      },
    },
    phone: "+373 79 55 18 92",
    phoneHref: "tel:+37379551892",
    whatsapp: "https://wa.me/37379551892",
    viber: "viber://chat?number=%2B37379551892",
    email: "victor@arca.md",
    sectors: ["riscani", "ciocana", "posta-veche", "durlesti"],
    languages: ["ro", "ru"],
    since: 2015,
    deals: 208,
    bio: {
      ro: "Victor se ocupă de Râșcani și Ciocana și de aproape toate ansamblurile noi din portofoliul ARCA. A fost inginer de șantier șapte ani înainte să treacă în vânzări, ceea ce se vede la vizionări: e singurul din echipă care se uită la rosturile de dilatare și la tabloul electric înainte să se uite la bucătărie.\n\nLucrează direct cu patru dezvoltatori din Chișinău, așa că știe care termen de finalizare e realist și care e scris ca să se vândă etapa. Clienții care cumpără la roșu ajung de obicei la el.\n\nRăspunde în română și rusă, inclusiv seara târziu.",
      ru: "Виктор ведёт Рышкановку и Чеканы и почти все новые комплексы в портфеле ARCA. Семь лет был инженером на стройке, прежде чем перейти в продажи, и это видно на просмотрах: он единственный в команде, кто смотрит на деформационные швы и электрощит раньше, чем на кухню.\n\nРаботает напрямую с четырьмя застройщиками Кишинёва, поэтому знает, какой срок сдачи реальный, а какой написан, чтобы продать очередь. Клиенты, покупающие на этапе строительства, обычно приходят к нему.\n\nОтвечает на румынском и русском, в том числе поздно вечером.",
    },
    quote: {
      ro: "Un bloc frumos nu înseamnă un bloc bine construit. Le pot deosebi de pe trotuar.",
      ru: "Красивый дом — не значит хорошо построенный. Я вижу разницу ещё с тротуара.",
    },
  },
  {
    slug: "cristina-lungu",
    name: "Cristina Lungu",
    role: { ro: "Consultant închirieri", ru: "Консультант по аренде" },
    photo: {
      src: "/img/agent-04.jpg",
      width: 640,
      height: 800,
      alt: {
        ro: "Cristina Lungu, consultant închirieri ARCA",
        ru: "Кристина Лунгу, консультант по аренде ARCA",
      },
    },
    phone: "+373 60 74 26 31",
    phoneHref: "tel:+37360742631",
    whatsapp: "https://wa.me/37360742631",
    viber: "viber://chat?number=%2B37360742631",
    email: "cristina@arca.md",
    sectors: ["centru", "botanica", "buiucani", "riscani"],
    languages: ["ro", "ru", "en"],
    since: 2019,
    deals: 119,
    bio: {
      ro: "Cristina ține toată partea de închirieri a agenției: apartamente pentru angajați relocați, contracte pe termen lung și administrarea proprietăților proprietarilor care stau în altă țară. Face în medie zece contracte pe lună, ceea ce înseamnă că știe pe de rost cine acceptă animale și cine nu.\n\nA lucrat trei ani într-o companie de IT pe partea de relocare, de unde i-au rămas clienții corporativi și obiceiul de a trimite fotografii și contract în aceeași zi în care sună cineva.\n\nVorbește română, rusă și engleză.",
      ru: "Кристина ведёт всю аренду агентства: квартиры для релоцированных сотрудников, долгосрочные договоры и управление объектами собственников, которые живут за границей. Заключает в среднем десять договоров в месяц, поэтому наизусть знает, кто пускает с животными, а кто нет.\n\nТри года работала в IT-компании на релокации, откуда у неё остались корпоративные клиенты и привычка отправлять фотографии и договор в тот же день, когда позвонили.\n\nГоворит по-румынски, по-русски и по-английски.",
    },
    quote: {
      ro: "O chirie bună se vede în luna a treia, nu la semnare.",
      ru: "Хорошая аренда видна на третий месяц, а не при подписании.",
    },
  },
];

export const AGENT_BY_SLUG: Record<string, Agent> = Object.fromEntries(
  AGENTS.map((a) => [a.slug, a])
);

export function getAgent(slug: string): Agent | undefined {
  return AGENT_BY_SLUG[slug];
}
