"use client";

import PageIntro from "@/components/PageIntro";
import { AGENCY } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { useLang } from "@/lib/lang";
import type { T } from "@/lib/types";
import styles from "./privacy.module.css";

/** The last time the text below changed. Written by hand, not from the clock. */
const UPDATED = "2026-07-20";

const P = {
  kicker: { ro: "Documente", ru: "Документы" },
  title: { ro: "Politica de confidențialitate", ru: "Политика конфиденциальности" },
  lead: {
    ro: "Colectăm strictul necesar ca să vă putem suna înapoi. Pagina aceasta spune exact ce, de ce și pentru cât timp.",
    ru: "Мы собираем только то, что нужно, чтобы вам перезвонить. Эта страница говорит, что именно, зачем и на какой срок.",
  },
  updated: { ro: "Ultima actualizare", ru: "Последнее обновление" },
  sections: [
    {
      title: { ro: "Cine prelucrează datele", ru: "Кто обрабатывает данные" },
      body: [
        {
          ro: `Agenția imobiliară ${AGENCY.name}, cu biroul la adresa ${AGENCY.address.ro}. Pentru orice întrebare legată de datele dumneavoastră scrieți la ${AGENCY.email} sau sunați la ${AGENCY.mobile}.`,
          ru: `Агентство недвижимости ${AGENCY.name}, офис по адресу ${AGENCY.address.ru}. По любым вопросам о ваших данных пишите на ${AGENCY.email} или звоните ${AGENCY.mobile}.`,
        },
      ],
    },
    {
      title: { ro: "Ce date colectăm", ru: "Какие данные мы собираем" },
      body: [
        {
          ro: "Prin formularele de pe site colectăm numele, numărul de telefon și, dacă îl completați, emailul și mesajul. La o cerere de vizionare se adaugă codul proprietății și data preferată. Nu cerem buletinul, adresa de domiciliu sau date bancare prin site.",
          ru: "Через формы на сайте мы собираем имя, номер телефона и, если вы их заполните, email и сообщение. При заявке на просмотр добавляются код объекта и желаемая дата. Мы не запрашиваем через сайт удостоверение личности, домашний адрес или банковские данные.",
        },
        {
          ro: "Site-ul nu folosește cookie-uri de publicitate și nu are pixeli de urmărire. În browserul dumneavoastră păstrăm doar limba aleasă și lista de proprietăți salvate — ambele rămân pe dispozitiv și nu ajung la noi.",
          ru: "Сайт не использует рекламные cookie и не содержит трекинговых пикселей. В вашем браузере хранятся только выбранный язык и список сохранённых объектов — и то, и другое остаётся на устройстве и к нам не попадает.",
        },
      ],
    },
    {
      title: { ro: "De ce le colectăm", ru: "Зачем мы их собираем" },
      body: [
        {
          ro: "Ca să vă răspundem la cerere: să vă sunăm înapoi, să stabilim o vizionare, să vă trimitem oferte care corespund criteriilor pe care ni le-ați spus. Nu vindem și nu închiriem datele nimănui și nu le folosim pentru campanii de marketing la care nu v-ați înscris.",
          ru: "Чтобы ответить на вашу заявку: перезвонить, назначить просмотр, прислать предложения по названным вами критериям. Мы не продаём и не сдаём данные никому и не используем их для рассылок, на которые вы не подписывались.",
        },
      ],
    },
    {
      title: { ro: "Cine le mai vede", ru: "Кто ещё их видит" },
      body: [
        {
          ro: "Agentul care preia cererea și colegii din agenție care lucrează la aceeași tranzacție. Dacă tranzacția ajunge la notar sau la bancă, datele necesare se transmit acolo, cu acordul dumneavoastră, în măsura cerută de lege.",
          ru: "Агент, принявший заявку, и коллеги по агентству, работающие над той же сделкой. Если сделка доходит до нотариуса или банка, необходимые данные передаются туда с вашего согласия, в объёме, требуемом законом.",
        },
      ],
    },
    {
      title: { ro: "Cât le păstrăm", ru: "Сколько мы их храним" },
      body: [
        {
          ro: "Cererile care nu s-au transformat într-o tranzacție se șterg după doi ani. Dosarele tranzacțiilor încheiate se păstrează atât cât ne obligă legislația privind evidența contabilă și antispălare a banilor.",
          ru: "Заявки, не превратившиеся в сделку, удаляются через два года. Досье закрытых сделок хранятся столько, сколько требует законодательство о бухгалтерском учёте и противодействии отмыванию денег.",
        },
      ],
    },
    {
      title: { ro: "Drepturile dumneavoastră", ru: "Ваши права" },
      body: [
        {
          ro: "Puteți cere oricând să vedeți ce date avem despre dumneavoastră, să le corectăm sau să le ștergem, și puteți retrage acordul de a fi contactat. Un mesaj la adresa de email a agenției e suficient; răspundem în cel mult cinci zile lucrătoare.",
          ru: "Вы можете в любой момент попросить показать, какие данные у нас есть, исправить их или удалить, а также отозвать согласие на связь. Достаточно письма на почту агентства; отвечаем не позднее пяти рабочих дней.",
        },
      ],
    },
  ] as { title: T; body: T[] }[],
} satisfies Record<string, T | { title: T; body: T[] }[]>;

export default function PrivacyView() {
  const { t, lang } = useLang();

  return (
    <>
      <PageIntro
        kicker={P.kicker}
        title={P.title}
        lead={P.lead}
        meta={{
          ro: `${P.updated.ro}: ${formatDate(UPDATED, "ro")}`,
          ru: `${P.updated.ru}: ${formatDate(UPDATED, "ru")}`,
        }}
      />

      <div className="wrap">
        <div className={styles.doc}>
          {(P.sections as { title: T; body: T[] }[]).map((section, i) => (
            <section key={section.title.ro} className={`${styles.section} rv`}>
              <h2 className={styles.title}>
                <span className={`num ${styles.no}`}>{String(i + 1).padStart(2, "0")}</span>
                {t(section.title)}
              </h2>
              {section.body.map((para) => (
                <p key={para.ro} className={styles.para}>
                  {t(para)}
                </p>
              ))}
            </section>
          ))}

          <p className={`legal ${styles.foot} rv`}>
            {lang === "ru"
              ? `Вопросы по этой странице: ${AGENCY.email}`
              : `Întrebări despre pagina aceasta: ${AGENCY.email}`}
          </p>
        </div>
      </div>
    </>
  );
}
