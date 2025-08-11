import Link from "next/link";
import { getSEOTags } from "@/libs/seo";
import config from "@/config";

// CHATGPT PROMPT TO GENERATE YOUR TERMS & SERVICES — replace with your own data 👇

// 1. Go to https://chat.openai.com/
// 2. Copy paste bellow
// 3. Replace the data with your own (if needed)
// 4. Paste the answer from ChatGPT directly in the <pre> tag below

// You are an excellent lawyer.

// I need your help to write a simple Terms & Services for my website. Here is some context:
// - Website: https://shipfa.st
// - Name: ShipFast
// - Contact information: marc@shipfa.st
// - Description: A JavaScript code boilerplate to help entrepreneurs launch their startups faster
// - Ownership: when buying a package, users can download code to create apps. They own the code but they do not have the right to resell it. They can ask for a full refund within 7 day after the purchase.
// - User data collected: name, email and payment information
// - Non-personal data collection: web cookies
// - Link to privacy-policy: https://shipfa.st/privacy-policy
// - Governing Law: France
// - Updates to the Terms: users will be updated by email

// Please write a simple Terms & Services for my site. Add the current date. Do not add or explain your reasoning. Answer:

export const metadata = getSEOTags({
  title: `Общи условия | ${config.appName}`,
  canonicalUrlRelative: "/tos",
});

const TOS = () => {
  return (
    <main className="max-w-xl mx-auto">
      <div className="p-5">
        <Link href="/" className="btn btn-ghost">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path
              fillRule="evenodd"
              d="M15 10a.75.75 0 01-.75.75H7.612l2.158 1.96a.75.75 0 11-1.04 1.08l-3.5-3.25a.75.75 0 010-1.08l3.5-3.25a.75.75 0 111.04 1.08L7.612 9.25h6.638A.75.75 0 0115 10z"
              clipRule="evenodd"
            />
          </svg>
          Назад
        </Link>
        <h1 className="text-3xl font-extrabold pb-6">
          Общи условия за {config.appName}
        </h1>

        <pre
          className="leading-relaxed whitespace-pre-wrap"
          style={{ fontFamily: "sans-serif" }}
        >
          {`Последна актуализация: ${new Date().toLocaleDateString('bg-BG')}

Добре дошли в e-menu.bg!

Настоящите Общи условия ("Условия") регулират използването на уебсайта e-menu.bg на адрес https://e-menu.bg ("Уебсайт") и услугите, предоставяни от e-menu. Използвайки нашия уебсайт и услуги, вие се съгласявате с тези Условия.

1. Описание на e-menu

e-menu е платформа за дигитални менюта на ресторанти, която позволява на заведенията за хранене да създават и управляват своите менюта в дигитален формат с QR кодове и многоезична поддръжка.

2. Права за ползване и собственост

При закупуване на абонамент от e-menu, вие получавате правото да използвате платформата на месечна или годишна база, съгласно избрания план. Вие запазвате собствеността върху вашите данни и съдържание, но не притежавате правата върху софтуера на платформата. Предлагаме пълно възстановяване на сумата в рамките на 14 дни от покупката.

3. Потребителски данни и поверителност

Събираме и съхраняваме потребителски данни, включително име, имейл и платежна информация, необходими за предоставянето на нашите услуги. За подробности относно обработката на вашите данни, моля, вижте нашата Политика за поверителност на адрес https://e-menu.bg/privacy-policy.

4. Събиране на неперсонални данни

Използваме уеб бисквитки за събиране на неперсонални данни с цел подобряване на нашите услуги и потребителското изживяване.

5. Абонаментни планове

Плащанията се извършват в български лева (BGN). Автоматичното подновяване може да бъде отменено по всяко време от потребителския панел.

6. Отговорности на потребителя

Потребителят е отговорен за:
- Предоставянето на точна информация за своето заведение
- Спазването на българското законодателство при използването на услугата
- Редовното актуализиране на менютата и цените
- Неразпространяването на незаконно съдържание

7. Приложимо право

Настоящите Условия се регулират от законодателството на Република България.

8. Актуализации на Условията

Можем да актуализираме тези Условия от време на време. Потребителите ще бъдат уведомени за промените чрез имейл.

За въпроси или притеснения относно настоящите Общи условия, моля, свържете се с нас на support@e-menu.bg.

Благодарим ви, че използвате e-menu.bg!`}
        </pre>
      </div>
    </main>
  );
};

export default TOS;
