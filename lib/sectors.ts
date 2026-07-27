import type { Sector, T } from "./types";

/* ---------------------------------------------------------------------------
   The six tiles on the homepage plus the descriptions the /ghid chapter and the
   SEO paragraph on /proprietati read from. Coordinates are the sector centres,
   used to frame the static maps.
   --------------------------------------------------------------------------- */

export interface SectorInfo {
  slug: Sector;
  name: T;
  /** Locative form, for "Apartamente de vânzare în Botanica". */
  in: T;
  /** One line under the tile name; also the lead on a filtered result page. */
  blurb: T;
  /** Three or four sentences for the guide and the SEO paragraph. */
  about: T;
  /** 3:2 tile, 800x533. Only the six city sectors have one. */
  image?: string;
  coords: { lat: number; lng: number };
  /** Chisinau proper, or one of the suburbs in the second filter group. */
  suburb: boolean;
}

export const SECTORS: SectorInfo[] = [
  {
    slug: "centru",
    name: { ro: "Centru", ru: "Центр" },
    in: { ro: "în Centru", ru: "в Центре" },
    blurb: {
      ro: "Clădiri interbelice, curți umbrite și tot ce ai nevoie la zece minute pe jos.",
      ru: "Довоенные дома, тенистые дворы и всё необходимое в десяти минутах пешком.",
    },
    about: {
      ro: "Centrul rămâne cel mai scump sector din Chișinău și singurul unde poți trăi fără mașină. Fondul e amestecat: clădiri de cărămidă interbelice cu tavane de trei metri, blocuri staliniste solide pe străzile Pușkin și Bănulescu-Bodoni și, din ce în ce mai des, blocuri noi ridicate în curțile interioare. Prețul se plătește pentru mers pe jos, nu pentru metri: aceleași suprafețe costă cu 20-25% mai mult decât în Botanica.",
      ru: "Центр остаётся самым дорогим сектором Кишинёва и единственным, где можно жить без машины. Фонд смешанный: довоенные кирпичные дома с трёхметровыми потолками, крепкие сталинки на Пушкина и Бэнулеску-Бодони и всё чаще новостройки во внутренних дворах. Здесь платят за пешую доступность, а не за квадратные метры: та же площадь стоит на 20-25% дороже, чем в Ботанике.",
    },
    image: "/img/sector-centru.jpg",
    coords: { lat: 47.0245, lng: 28.8322 },
    suburb: false,
  },
  {
    slug: "botanica",
    name: { ro: "Botanica", ru: "Ботаника" },
    in: { ro: "în Botanica", ru: "в Ботанике" },
    blurb: {
      ro: "Cel mai mare sector al orașului, cu bulevarde late și parcul Valea Trandafirilor.",
      ru: "Самый большой сектор города, с широкими бульварами и парком Долина Роз.",
    },
    about: {
      ro: "Botanica e cel mai mare sector din Chișinău și cel mai echilibrat ca preț. Bulevardul Dacia și strada Grenoble adună aproape tot fondul nou al sectorului, în timp ce zona dinspre Muncești rămâne serie sovietică bine întreținută. Valea Trandafirilor, lacul și rețeaua densă de troleibuze explică de ce familiile cu copii aleg sectorul ăsta mai des decât oricare altul.",
      ru: "Ботаника — самый большой сектор Кишинёва и самый сбалансированный по цене. Бульвар Дачия и улица Гренобль собрали почти весь новый фонд сектора, а зона в сторону Мунчешть остаётся ухоженной советской застройкой. Долина Роз, озеро и плотная троллейбусная сеть объясняют, почему семьи с детьми выбирают этот сектор чаще любого другого.",
    },
    image: "/img/sector-botanica.jpg",
    coords: { lat: 46.9829, lng: 28.8608 },
    suburb: false,
  },
  {
    slug: "buiucani",
    name: { ro: "Buiucani", ru: "Буюканы" },
    in: { ro: "în Buiucani", ru: "в Буюканах" },
    blurb: {
      ro: "Alba Iulia, Calea Ieșilor și cea mai densă concentrare de blocuri noi din oraș.",
      ru: "Алба-Юлия, Каля Ешилор и самая плотная застройка новостройками в городе.",
    },
    about: {
      ro: "Buiucani a crescut cel mai repede în ultimii zece ani: bulevardul Alba Iulia și Calea Ieșilor sunt practic un șir continuu de blocuri date în exploatare după 2018. Prețul pe metru pătrat îl urmărește îndeaproape pe cel din Centru, dar aici primești parcare subterană și tavane de 2,7 m. Partea veche, dinspre strada Ion Creangă, rămâne mai ieftină și mai verde.",
      ru: "Буюканы росли быстрее всех за последние десять лет: бульвар Алба-Юлия и Каля Ешилор — практически сплошная линия домов, сданных после 2018 года. Цена за квадратный метр идёт вплотную за центральной, но здесь вы получаете подземный паркинг и потолки 2,7 м. Старая часть, в сторону улицы Иона Крянгэ, остаётся дешевле и зеленее.",
    },
    image: "/img/sector-buiucani.jpg",
    coords: { lat: 47.0361, lng: 28.7847 },
    suburb: false,
  },
  {
    slug: "riscani",
    name: { ro: "Râșcani", ru: "Рышкановка" },
    in: { ro: "în Râșcani", ru: "в Рышкановке" },
    blurb: {
      ro: "Aproape de Centru, cu parcul Râșcani și cel mai bun raport preț-distanță.",
      ru: "Рядом с Центром, с парком Рышкановка и лучшим соотношением цены и расстояния.",
    },
    about: {
      ro: "Râșcani e sectorul pe care cumpărătorii îl descoperă când Centrul iese din buget: zece minute cu troleibuzul până la Ștefan cel Mare și un preț cu aproape 15% mai mic. Bulevardul Renașterii Naționale și strada Kiev au fondul cel mai solid, iar zona dinspre Miron Costin adună majoritatea blocurilor noi. Parcul Râșcani și lacul din spatele lui rămân argumentul care închide vizionările.",
      ru: "Рышкановка — сектор, который покупатели открывают для себя, когда Центр выходит за рамки бюджета: десять минут на троллейбусе до Штефана чел Маре и цена почти на 15% ниже. Бульвар Ренаштерий Национале и улица Киевская держат самый крепкий фонд, а зона у Мирона Костина собрала большинство новостроек. Парк Рышкановка и озеро за ним — аргумент, который закрывает просмотры.",
    },
    image: "/img/sector-riscani.jpg",
    coords: { lat: 47.0489, lng: 28.8531 },
    suburb: false,
  },
  {
    slug: "ciocana",
    name: { ro: "Ciocana", ru: "Чеканы" },
    in: { ro: "în Ciocana", ru: "в Чеканах" },
    blurb: {
      ro: "Mircea cel Bătrân, curți largi și cele mai spațioase apartamente la banii ăștia.",
      ru: "Мирча чел Бэтрын, просторные дворы и самые большие квартиры за эти деньги.",
    },
    about: {
      ro: "Ciocana s-a construit în anii '80, ceea ce înseamnă apartamente cu bucătării de 9-10 m² și curți în care încap mașini și copii deodată. Bulevardul Mircea cel Bătrân adună comerțul, iar zona dinspre Ginta Latină și Igor Vieru primește acum blocuri noi. E sectorul unde aceiași bani cumpără vizibil mai mulți metri pătrați decât în Buiucani.",
      ru: "Чеканы застраивались в 80-е, а это значит квартиры с кухнями по 9-10 м² и дворы, где помещаются и машины, и дети. Бульвар Мирча чел Бэтрын держит всю торговлю, а зона у Гинта Латинэ и Игоря Виеру сейчас получает новостройки. Это сектор, где за те же деньги покупают заметно больше метров, чем в Буюканах.",
    },
    image: "/img/sector-ciocana.jpg",
    coords: { lat: 47.0392, lng: 28.9089 },
    suburb: false,
  },
  {
    slug: "telecentru",
    name: { ro: "Telecentru", ru: "Телецентр" },
    in: { ro: "în Telecentru", ru: "в Телецентре" },
    blurb: {
      ro: "Străzi în pantă, case vechi și cel mai ieftin metru pătrat din oraș.",
      ru: "Улицы под уклон, старые дома и самый дешёвый квадратный метр в городе.",
    },
    about: {
      ro: "Telecentru e sectorul cu cel mai mic preț pe metru pătrat din Chișinău și, în același timp, cel mai verde. Străzile în pantă dinspre Drumul Viilor și Academiei păstrează case particulare între blocuri, iar șoseaua Hîncești leagă totul de Centru în zece minute. Se cumpără bine aici dacă ai mașină: transportul public e mai rar decât în restul orașului.",
      ru: "Телецентр — сектор с самой низкой ценой за квадратный метр в Кишинёве и при этом самый зелёный. Улицы под уклон у Друмул Виилор и Академией сохранили частные дома между многоэтажками, а шоссе Хынчешть связывает всё с Центром за десять минут. Здесь хорошо покупать, если есть машина: общественный транспорт ходит реже, чем в остальном городе.",
    },
    image: "/img/sector-telecentru.jpg",
    coords: { lat: 47.0067, lng: 28.8019 },
    suburb: false,
  },
  {
    slug: "posta-veche",
    name: { ro: "Poșta Veche", ru: "Старая Почта" },
    in: { ro: "în Poșta Veche", ru: "на Старой Почте" },
    blurb: {
      ro: "Zonă liniștită la nord, cu case particulare și blocuri joase.",
      ru: "Тихий район на севере, с частными домами и малоэтажками.",
    },
    about: {
      ro: "Poșta Veche e o zonă de tranziție între Râșcani și marginea de nord a orașului: blocuri de cinci etaje, case particulare și foarte puțin trafic. Prețurile stau cu 10-12% sub Râșcani, iar cine lucrează în Centru ajunge în douăzeci de minute. E o alegere de familie, nu de investiție.",
      ru: "Старая Почта — переходная зона между Рышкановкой и северной окраиной города: пятиэтажки, частные дома и очень мало трафика. Цены на 10-12% ниже рышкановских, а тот, кто работает в Центре, добирается за двадцать минут. Это выбор для семьи, а не для инвестиции.",
    },
    coords: { lat: 47.0625, lng: 28.8478 },
    suburb: false,
  },
  {
    slug: "durlesti",
    name: { ro: "Durlești", ru: "Дурлешты" },
    in: { ro: "în Durlești", ru: "в Дурлештах" },
    blurb: {
      ro: "Oraș-satelit la vest, cu cel mai mare fond de case noi.",
      ru: "Город-спутник на западе, с самым большим фондом новых домов.",
    },
    about: {
      ro: "Durlești e destinația celor care schimbă apartamentul pe casă fără să iasă din raza orașului: zece minute de la Buiucani, curent și gaz peste tot, străzi asfaltate în cea mai mare parte. Casele noi de 150-200 m² pe 6-8 ari sunt produsul principal al zonei.",
      ru: "Дурлешты — направление для тех, кто меняет квартиру на дом, не выезжая за черту города: десять минут от Буюкан, свет и газ везде, улицы в основном асфальтированы. Новые дома по 150-200 м² на 6-8 сотках — основной продукт зоны.",
    },
    coords: { lat: 47.0281, lng: 28.7522 },
    suburb: true,
  },
  {
    slug: "stauceni",
    name: { ro: "Stăuceni", ru: "Ставчены" },
    in: { ro: "în Stăuceni", ru: "в Ставченах" },
    blurb: {
      ro: "La nord de Râșcani, între vii și case noi.",
      ru: "К северу от Рышкановки, между виноградниками и новыми домами.",
    },
    about: {
      ro: "Stăuceni s-a transformat în ultimii ani dintr-un sat de vii într-o suburbie de case noi, la cincisprezece minute de Râșcani. Terenul e încă cel mai ieftin din jurul Chișinăului, ceea ce ține prețul casei sub cel din Durlești la aceeași suprafață.",
      ru: "Ставчены за последние годы превратились из виноградного села в пригород новых домов, в пятнадцати минутах от Рышкановки. Земля здесь всё ещё самая дешёвая вокруг Кишинёва, что держит цену дома ниже дурлештской при той же площади.",
    },
    coords: { lat: 47.0808, lng: 28.8697 },
    suburb: true,
  },
  {
    slug: "codru",
    name: { ro: "Codru", ru: "Кодру" },
    in: { ro: "în Codru", ru: "в Кодру" },
    blurb: {
      ro: "Pădure la ușă și cel mai bun aer din jurul orașului.",
      ru: "Лес у порога и самый чистый воздух вокруг города.",
    },
    about: {
      ro: "Codru e singura zonă din jurul Chișinăului unde pădurea începe la capătul străzii. Se plătește pentru asta: prețul pe metru pătrat e cel mai mare dintre suburbii, iar casele bune se vând înainte să apuce să stea o lună pe piață.",
      ru: "Кодру — единственная зона вокруг Кишинёва, где лес начинается в конце улицы. За это платят: цена за квадратный метр здесь самая высокая среди пригородов, а хорошие дома уходят, не простояв и месяца.",
    },
    coords: { lat: 46.9861, lng: 28.7975 },
    suburb: true,
  },
  {
    slug: "dumbrava",
    name: { ro: "Dumbrava", ru: "Думбрава" },
    in: { ro: "în Dumbrava", ru: "в Думбраве" },
    blurb: {
      ro: "Cartier de case la marginea pădurii Codrilor.",
      ru: "Коттеджный посёлок на краю Кодринского леса.",
    },
    about: {
      ro: "Dumbrava e un cartier compact de case, lipit de Codru, cu străzi înguste și foarte puțin trafic de tranzit. Fondul e aproape în întregime construit după 2005, ceea ce înseamnă case cu izolație și încălzire autonomă din start.",
      ru: "Думбрава — компактный посёлок домов, примыкающий к Кодру, с узкими улицами и почти без транзитного движения. Фонд почти полностью построен после 2005 года, то есть дома изначально с утеплением и автономным отоплением.",
    },
    coords: { lat: 46.9950, lng: 28.7728 },
    suburb: true,
  },
  {
    slug: "ialoveni",
    name: { ro: "Ialoveni", ru: "Яловены" },
    in: { ro: "în Ialoveni", ru: "в Яловенах" },
    blurb: {
      ro: "Oraș separat la douăzeci de minute de Centru, cu prețuri pe măsură.",
      ru: "Отдельный город в двадцати минутах от Центра, с соответствующими ценами.",
    },
    about: {
      ro: "Ialoveni e oraș de sine stătător, cu primărie, spital și liceu propriu, la douăzeci de minute de Centru pe șoseaua Hîncești. Apartamentele de aici costă cât cele din Telecentru minus 20%, iar terenul e cel mai ieftin din tot inelul din jurul capitalei.",
      ru: "Яловены — самостоятельный город, со своей мэрией, больницей и лицеем, в двадцати минутах от Центра по шоссе Хынчешть. Квартиры здесь стоят как в Телецентре минус 20%, а земля самая дешёвая во всём кольце вокруг столицы.",
    },
    coords: { lat: 46.9394, lng: 28.7789 },
    suburb: true,
  },
];

export const SECTOR_BY_SLUG: Record<Sector, SectorInfo> = Object.fromEntries(
  SECTORS.map((s) => [s.slug, s])
) as Record<Sector, SectorInfo>;

/** The six tiles on the homepage, in the order they are laid out. */
export const CITY_SECTORS = SECTORS.filter((s) => !s.suburb && s.image);
