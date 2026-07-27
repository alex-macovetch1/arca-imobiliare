"use client";

import Image from "next/image";
import Link from "next/link";
import { IconPhone, IconTelegram, IconViber, IconWhatsapp } from "@/components/Icons";
import LeadRequestForm, { type SubjectOption } from "@/components/LeadRequestForm";
import OfficeMap from "@/components/OfficeMap";
import PageIntro from "@/components/PageIntro";
import { AGENTS } from "@/lib/agents";
import { AGENCY, SECTOR_LABEL } from "@/lib/content";
import { useLang } from "@/lib/lang";
import type { T } from "@/lib/types";
import styles from "./contact.module.css";

const SUBJECTS: SubjectOption[] = [
  { value: "cumpar", label: { ro: "Vreau să cumpăr", ru: "Хочу купить" } },
  { value: "vand", label: { ro: "Vreau să vând", ru: "Хочу продать" } },
  { value: "inchiriez", label: { ro: "Vreau să închiriez", ru: "Хочу арендовать" } },
  { value: "altceva", label: { ro: "Altceva", ru: "Другое" } },
];

const FAQ: { q: T; a: T }[] = [
  {
    q: { ro: "Cât costă serviciile agenției?", ru: "Сколько стоят услуги агентства?" },
    a: {
      ro: "Comisionul standard la vânzare este de 2% din prețul final și se achită doar la semnarea contractului la notar. La închiriere, comisionul este de 50% din chiria unei luni. Evaluarea, ședința foto și promovarea sunt incluse — nu se plătesc separat și nu se plătesc în avans.",
      ru: "Стандартная комиссия при продаже — 2% от финальной цены и платится только при подписании договора у нотариуса. При аренде комиссия — 50% месячной платы. Оценка, фотосъёмка и продвижение включены: они не оплачиваются отдельно и не оплачиваются авансом.",
    },
  },
  {
    q: { ro: "Pot vedea un apartament în aceeași zi?", ru: "Можно посмотреть квартиру в тот же день?" },
    a: {
      ro: "De obicei da, dacă sunați până la ora 17:00 și proprietarul e în oraș. Cel mai devreme interval pe care îl putem confirma este la două ore după apel. Vizionările de sâmbătă se programează de vineri.",
      ru: "Обычно да, если вы звоните до 17:00 и собственник в городе. Самое раннее время, которое мы можем подтвердить, — через два часа после звонка. Просмотры в субботу назначаются в пятницу.",
    },
  },
  {
    q: { ro: "Lucrați și în afara Chișinăului?", ru: "Работаете ли вы за пределами Кишинёва?" },
    a: {
      ro: "Da, în tot inelul de suburbii: Durlești, Stăuceni, Codru, Dumbrava și Ialoveni. Mai departe de douăzeci de kilometri de oraș nu mergem, fiindcă nu am putea ține aceeași calitate a vizionărilor.",
      ru: "Да, по всему кольцу пригородов: Дурлешты, Ставчены, Кодру, Думбрава и Яловены. Дальше двадцати километров от города мы не работаем, потому что не смогли бы держать то же качество просмотров.",
    },
  },
  {
    q: { ro: "În ce limbi lucrați?", ru: "На каких языках вы работаете?" },
    a: {
      ro: "Toți agenții lucrează în română și rusă. Andrei și Cristina vorbesc și engleză, pentru clienții relocați. Contractele se redactează în limba pe care o alegeți dumneavoastră.",
      ru: "Все агенты работают на румынском и русском. Андрей и Кристина говорят также по-английски — для релоцированных клиентов. Договоры составляются на выбранном вами языке.",
    },
  },
];

export default function ContactView() {
  const { t } = useLang();

  return (
    <>
      <PageIntro
        kicker={{ ro: "Contact", ru: "Контакты" }}
        title={{ ro: "Vorbiți cu noi", ru: "Свяжитесь с нами" }}
        lead={{
          ro: "Telefonul e cel mai rapid drum: răspundem în medie în 11 minute, în programul de lucru. Formularul e alternativa, nu bariera — nu ascundem numerele în spatele lui.",
          ru: "Телефон — самый быстрый путь: в рабочее время мы отвечаем в среднем за 11 минут. Форма — альтернатива, а не барьер: мы не прячем номера за ней.",
        }}
      />

      <section className={`wrap ${styles.main}`}>
        <div className={`rv ${styles.details}`}>
          <dl className={styles.list}>
            <div className={styles.entry}>
              <dt className={styles.dt}>{t({ ro: "Telefon fix", ru: "Городской телефон" })}</dt>
              <dd className={styles.dd}>
                <a href={AGENCY.phoneHref} className={`num ${styles.big}`}>
                  {AGENCY.phone}
                </a>
              </dd>
            </div>

            <div className={styles.entry}>
              <dt className={styles.dt}>{t({ ro: "Mobil", ru: "Мобильный" })}</dt>
              <dd className={styles.dd}>
                <a href={AGENCY.mobileHref} className={`num ${styles.big}`}>
                  {AGENCY.mobile}
                </a>
              </dd>
            </div>

            <div className={styles.entry}>
              <dt className={styles.dt}>Email</dt>
              <dd className={styles.dd}>
                <a href={`mailto:${AGENCY.email}`} className={styles.value}>
                  {AGENCY.email}
                </a>
              </dd>
            </div>

            <div className={styles.entry}>
              <dt className={styles.dt}>{t({ ro: "Birou", ru: "Офис" })}</dt>
              <dd className={`${styles.dd} ${styles.value}`}>{t(AGENCY.address)}</dd>
            </div>

            <div className={styles.entry}>
              <dt className={styles.dt}>{t({ ro: "Program", ru: "График" })}</dt>
              <dd className={`${styles.dd} ${styles.value}`}>{t(AGENCY.schedule)}</dd>
            </div>
          </dl>

          <div className={styles.channels}>
            <a href={AGENCY.whatsapp} className="btn-line" target="_blank" rel="noreferrer">
              <IconWhatsapp size={17} />
              WhatsApp
            </a>
            <a href={AGENCY.viber} className="btn-line">
              <IconViber size={17} />
              Viber
            </a>
            <a href={AGENCY.telegram} className="btn-line" target="_blank" rel="noreferrer">
              <IconTelegram size={17} />
              Telegram
            </a>
          </div>

          <p className={`legal ${styles.privacy}`}>
            {t({
              ro: "Datele din formular se folosesc doar ca să vă putem răspunde. Nu le transmitem nimănui.",
              ru: "Данные из формы используются только для ответа вам. Мы не передаём их третьим лицам.",
            })}
          </p>
        </div>

        <div className={`rv ${styles.formBox}`} style={{ "--d": "120ms" } as React.CSSProperties}>
          <h2 className={styles.formTitle}>{t({ ro: "Scrieți-ne", ru: "Напишите нам" })}</h2>
          <p className={styles.formLead}>
            {t({
              ro: "Completați două câmpuri și vă sunăm noi. Restul e opțional.",
              ru: "Заполните два поля, и мы перезвоним. Остальное — по желанию.",
            })}
          </p>

          <div className={styles.formInner}>
            <LeadRequestForm
              source="contact"
              fields={["name", "phone", "email", "subject", "message"]}
              subjects={SUBJECTS}
              messagePlaceholder={{
                ro: "Ce căutați, în ce sector și cu ce buget?",
                ru: "Что ищете, в каком секторе и с каким бюджетом?",
              }}
            />
          </div>
        </div>
      </section>

      <section className={`wrap ${styles.mapSection}`}>
        <OfficeMap />
      </section>

      <section className={`wrap ${styles.agentsSection}`}>
        <div className={`rv ${styles.agentsHead}`}>
          <div>
            <p className="kicker">{t({ ro: "Direct la om", ru: "Напрямую к человеку" })}</p>
            <h2 className={styles.agentsTitle}>
              {t({ ro: "Sau scrieți direct unui agent", ru: "Или напишите агенту напрямую" })}
            </h2>
          </div>
          <Link href="/agenti" className={styles.agentsAll}>
            {t({ ro: "Toți agenții →", ru: "Все агенты →" })}
          </Link>
        </div>

        <ul className={styles.agents}>
          {AGENTS.map((agent, i) => (
            <li
              key={agent.slug}
              className={`rv ${styles.agent}`}
              style={{ "--d": `${Math.min(i, 5) * 60}ms` } as React.CSSProperties}
            >
              <Link href={`/agenti/${agent.slug}`} className="ph ph-portrait">
                <Image
                  src={agent.photo.src}
                  alt={t(agent.photo.alt)}
                  fill
                  sizes="(max-width:700px) 50vw, 270px"
                />
              </Link>
              <h3 className={styles.agentName}>
                <Link href={`/agenti/${agent.slug}`}>{agent.name}</Link>
              </h3>
              <p className={styles.agentSectors}>
                {agent.sectors.map((s) => t(SECTOR_LABEL[s])).join(" · ")}
              </p>
              <a href={agent.phoneHref} className={styles.agentPhone}>
                <IconPhone size={16} />
                <span className="num">{agent.phone}</span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className={`wrap ${styles.faqSection}`}>
        <p className="kicker rv">{t({ ro: "Întrebări frecvente", ru: "Частые вопросы" })}</p>
        <ul className={styles.faq}>
          {FAQ.map((item, i) => (
            <li
              key={item.q.ro}
              className={`rv ${styles.faqItem}`}
              style={{ "--d": `${Math.min(i, 5) * 60}ms` } as React.CSSProperties}
            >
              <h3 className={styles.faqQ}>{t(item.q)}</h3>
              <p className={styles.faqA}>{t(item.a)}</p>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
