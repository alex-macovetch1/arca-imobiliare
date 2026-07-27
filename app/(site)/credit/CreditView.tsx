"use client";

import Link from "next/link";
import LeadRequestForm from "@/components/LeadRequestForm";
import MortgageCalculator from "@/components/MortgageCalculator";
import PageIntro from "@/components/PageIntro";
import { AGENCY } from "@/lib/content";
import { useLang } from "@/lib/lang";
import type { T } from "@/lib/types";
import styles from "./credit.module.css";

const C = {
  kicker: { ro: "Credit ipotecar", ru: "Ипотека" },
  title: { ro: "Cât costă, de fapt, creditul", ru: "Сколько на самом деле стоит кредит" },
  lead: {
    ro: "Aproape jumătate din apartamentele pe care le vindem se cumpără cu credit. Mai jos e aceeași aritmetică pe care o face banca, plus ce cere ea de la dumneavoastră înainte să spună da.",
    ru: "Почти половина квартир, которые мы продаём, покупается в кредит. Ниже — та же арифметика, которую делает банк, и то, что он просит у вас, прежде чем сказать да.",
  },
  calcTitle: { ro: "Calculator", ru: "Калькулятор" },
  calcNote: {
    ro: "Mutați avansul și termenul. Rata se calculează anuitar, cum o calculează și băncile din Moldova; dobânda o puteți schimba dacă aveți deja o ofertă în mână.",
    ru: "Двигайте первоначальный взнос и срок. Платёж считается аннуитетом, как и в молдавских банках; ставку можно поменять, если у вас уже есть предложение на руках.",
  },
  needTitle: { ro: "Ce cere banca", ru: "Что просит банк" },
  needLead: {
    ro: "Condițiile diferă de la o bancă la alta, dar patru lucruri se repetă la toate.",
    ru: "Условия отличаются от банка к банку, но четыре вещи повторяются везде.",
  },
  needs: [
    {
      title: { ro: "Avans de la 15%", ru: "Взнос от 15%" },
      text: {
        ro: "Cele mai multe bănci finanțează până la 85% din valoarea de evaluare, nu din prețul cerut. Dacă evaluarea iese mai mică decât prețul, diferența o acoperiți din buzunar.",
        ru: "Большинство банков финансируют до 85% от оценочной стоимости, а не от запрашиваемой цены. Если оценка ниже цены, разницу вы покрываете сами.",
      },
    },
    {
      title: { ro: "Rata sub 40% din venit", ru: "Платёж ниже 40% дохода" },
      text: {
        ro: "Se numără venitul confirmat al familiei, nu doar al dumneavoastră, și se scad ratele existente la alte credite și carduri.",
        ru: "Считается подтверждённый доход семьи, а не только ваш, и вычитаются платежи по другим кредитам и картам.",
      },
    },
    {
      title: { ro: "Venit demonstrabil", ru: "Подтверждаемый доход" },
      text: {
        ro: "Certificat de salariu pe ultimele șase luni sau declarațiile pentru cei care lucrează pe cont propriu. Veniturile din străinătate se acceptă, cu istoric de transferuri.",
        ru: "Справка о зарплате за последние шесть месяцев или декларации для тех, кто работает на себя. Доходы из-за рубежа принимают, с историей переводов.",
      },
    },
    {
      title: { ro: "Apartamentul ca gaj", ru: "Квартира в залог" },
      text: {
        ro: "Locuința cumpărată rămâne ipotecată până la achitare, iar banca cere asigurarea ei. Un apartament în construcție se creditează doar la anumite blocuri, cu contract de investiție acceptat de bancă.",
        ru: "Купленное жильё остаётся в залоге до полного погашения, и банк требует его страховать. Квартиру в стройке кредитуют только по определённым домам, с договором инвестирования, принятым банком.",
      },
    },
  ] as { title: T; text: T }[],
  stepsTitle: { ro: "Cum decurge, pas cu pas", ru: "Как это проходит, шаг за шагом" },
  steps: [
    {
      title: { ro: "Preaprobarea", ru: "Предодобрение" },
      text: {
        ro: "Mergeți la bancă înainte de a alege apartamentul. În două-trei zile știți suma maximă și puteți negocia ca un cumpărător serios, nu ca unul care „se interesează”.",
        ru: "Идите в банк до выбора квартиры. За два-три дня вы узнаете максимальную сумму и сможете торговаться как серьёзный покупатель, а не как тот, кто «интересуется».",
      },
    },
    {
      title: { ro: "Rezervarea", ru: "Бронирование" },
      text: {
        ro: "Se semnează un antecontract și se lasă un avans, de regulă între 500 și 1 000 de euro. Din momentul acesta apartamentul iese de pe piață.",
        ru: "Подписывается предварительный договор и вносится задаток, обычно от 500 до 1 000 евро. С этого момента квартира уходит с рынка.",
      },
    },
    {
      title: { ro: "Evaluarea", ru: "Оценка" },
      text: {
        ro: "Un evaluator din lista băncii vine la fața locului. Raportul ajunge la bancă în trei-cinci zile și el decide, practic, cât împrumutați.",
        ru: "Оценщик из списка банка приезжает на объект. Отчёт попадает в банк за три-пять дней и фактически определяет, сколько вам дадут.",
      },
    },
    {
      title: { ro: "Aprobarea și notarul", ru: "Одобрение и нотариус" },
      text: {
        ro: "Comitetul aprobă dosarul, se semnează contractul de credit și contractul de vânzare-cumpărare la notar, în aceeași zi. Banii se virează vânzătorului după înregistrarea la cadastru.",
        ru: "Комитет одобряет досье, договор кредита и договор купли-продажи подписываются у нотариуса в один день. Деньги уходят продавцу после регистрации в кадастре.",
      },
    },
  ] as { title: T; text: T }[],
  costsKicker: { ro: "Costuri", ru: "Расходы" },
  costsTitle: { ro: "Ce se mai plătește pe lângă avans", ru: "Что платится помимо взноса" },
  costs: [
    {
      label: { ro: "Comision de acordare", ru: "Комиссия за выдачу" },
      value: { ro: "0,5–1% din credit", ru: "0,5–1% от кредита" },
    },
    {
      label: { ro: "Evaluarea imobilului", ru: "Оценка недвижимости" },
      value: { ro: "1 500–2 500 MDL", ru: "1 500–2 500 MDL" },
    },
    {
      label: { ro: "Asigurarea locuinței", ru: "Страхование жилья" },
      value: { ro: "anual, ~0,2% din valoare", ru: "ежегодно, ~0,2% стоимости" },
    },
    {
      label: { ro: "Notar și cadastru", ru: "Нотариус и кадастр" },
      value: { ro: "0,5–1,5% din preț", ru: "0,5–1,5% от цены" },
    },
  ] as { label: T; value: T }[],
  costsNote: {
    ro: "Cifrele sunt intervalele pe care le vedem în tranzacțiile noastre. Le puneți deoparte separat de avans — se plătesc în primele două săptămâni.",
    ru: "Цифры — это диапазоны, которые мы видим в своих сделках. Отложите их отдельно от первоначального взноса: они платятся в первые две недели.",
  },
  helpTitle: { ro: "Vă ajutăm cu partea de bancă", ru: "Поможем с банковской частью" },
  helpText: {
    ro: "Spuneți-ne venitul și suma la care vă gândiți. Vă spunem realist ce buget aveți, ce documente pregătiți și la ce bancă are sens să mergeți întâi — serviciul e inclus, nu se plătește separat.",
    ru: "Скажите доход и сумму, о которой думаете. Мы честно скажем, какой у вас бюджет, какие документы готовить и в какой банк идти первым — услуга входит в работу и отдельно не оплачивается.",
  },
  helpSubmit: { ro: "Vreau o estimare", ru: "Хочу расчёт" },
  helpNote: {
    ro: "Nu suntem bancă și nu vindem credite. Vă spunem doar ce am văzut la ultimele tranzacții.",
    ru: "Мы не банк и не продаём кредиты. Мы говорим только то, что видели в последних сделках.",
  },
  linksTitle: { ro: "Mai departe", ru: "Дальше" },
  toIndex: { ro: "Cât costă metrul pătrat pe sectoare", ru: "Сколько стоит метр по секторам" },
  toGuide: { ro: "Ghidul cumpărătorului", ru: "Гид покупателя" },
  toList: { ro: "Apartamente de vânzare", ru: "Квартиры на продажу" },
} satisfies Record<string, T | { title: T; text: T }[] | { label: T; value: T }[]>;

export default function CreditView({ startPrice }: { startPrice: number }) {
  const { t } = useLang();

  return (
    <>
      <PageIntro kicker={C.kicker} title={C.title} lead={C.lead} />

      <section className="wrap">
        <div className={`${styles.calc} rv`}>
          <div className={styles.calcHead}>
            <p className="kicker">{t(C.calcTitle)}</p>
            <p className={styles.calcNote}>{t(C.calcNote)}</p>
          </div>
          <MortgageCalculator price={startPrice} fullLink={false} />
        </div>
      </section>

      <section className="wrap sec">
        <div className={`${styles.head} rv`}>
          <p className="kicker">{t(C.needTitle)}</p>
          <h2 className={styles.h2}>{t(C.needLead)}</h2>
        </div>
        <div className={styles.needs}>
          {(C.needs as { title: T; text: T }[]).map((item, i) => (
            <article
              key={item.title.ro}
              className={`${styles.need} rv`}
              style={{ "--d": `${i * 70}ms` } as React.CSSProperties}
            >
              <h3 className={styles.needTitle}>{t(item.title)}</h3>
              <p className={styles.needText}>{t(item.text)}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.stepsSection}>
        <div className={`wrap ${styles.stepsInner}`}>
          <div className="rv">
            <p className="kicker kicker-dark">{t(C.kicker)}</p>
            <h2 className={styles.stepsTitle}>{t(C.stepsTitle)}</h2>
          </div>
          <ol className={styles.steps}>
            {(C.steps as { title: T; text: T }[]).map((step, i) => (
              <li
                key={step.title.ro}
                className={`${styles.step} rv`}
                style={{ "--d": `${i * 70}ms` } as React.CSSProperties}
              >
                <span className={`num ${styles.stepNo}`}>{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className={styles.stepTitle}>{t(step.title)}</h3>
                  <p className={styles.stepText}>{t(step.text)}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="wrap sec">
        <div className={styles.costsGrid}>
          <div className="rv">
            <p className="kicker">{t(C.costsKicker)}</p>
            <h2 className={styles.h2}>{t(C.costsTitle)}</h2>
            <p className={`lead ${styles.costsNote}`}>{t(C.costsNote)}</p>
          </div>
          <dl className={`${styles.costs} rv`}>
            {(C.costs as { label: T; value: T }[]).map((row) => (
              <div key={row.label.ro} className={styles.costRow}>
                <dt>{t(row.label)}</dt>
                <dd className="num">{t(row.value)}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="wrap sec">
        <div className={styles.help}>
          <div className="rv">
            <h2 className={styles.h2}>{t(C.helpTitle)}</h2>
            <p className={`lead ${styles.helpText}`}>{t(C.helpText)}</p>
            <p className={`legal ${styles.helpNote}`}>{t(C.helpNote)}</p>
            <a href={AGENCY.mobileHref} className={`num ${styles.helpPhone}`}>
              {AGENCY.mobile}
            </a>
          </div>
          <div className={`${styles.form} rv`}>
            <LeadRequestForm
              source="contact"
              fields={["name", "phone", "message"]}
              submitLabel={C.helpSubmit}
              messagePlaceholder={{
                ro: "Venit lunar, avansul de care dispun, sectorul care mă interesează",
                ru: "Ежемесячный доход, взнос, который есть, интересующий сектор",
              }}
              messagePrefix={{ ro: "Întrebare despre credit.", ru: "Вопрос по кредиту." }}
            />
          </div>
        </div>
      </section>

      <section className="wrap sec">
        <nav className={`${styles.links} rv`} aria-label={t(C.linksTitle)}>
          <Link href="/indice" className={styles.link}>
            {t(C.toIndex)} →
          </Link>
          <Link href="/ghid" className={styles.link}>
            {t(C.toGuide)} →
          </Link>
          <Link href="/proprietati" className={styles.link}>
            {t(C.toList)} →
          </Link>
        </nav>
      </section>
    </>
  );
}
