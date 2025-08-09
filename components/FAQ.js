"use client";

import { useRef, useState } from "react";

// <FAQ> component is a lsit of <Item> component
// Just import the FAQ & add your FAQ content to the const faqList

const faqList = [
  {
    question: "Как да започна с E-Menu Bulgaria?",
    answer: (
      <div className="space-y-2 leading-relaxed">
        <p>Много просто! Регистрирайте се с имейл адрес, създайте профил на ресторанта си и започнете да добавяте категории и продукти. Вашето дигитално меню ще бъде достъпно веднага на уникален URL адрес.</p>
        <p>Ще получите и QR кодове за всяка маса, които можете да отпечатате и поставите в ресторанта си.</p>
      </div>
    ),
  },
  {
    question: "Поддържате ли други езици освен български?",
    answer: (
      <p>
        Да! E-Menu Bulgaria поддържа български, английски, немски и руски език. Клиентите могат автоматично да виждат менюто на езика на браузъра си или ръчно да превключват между езиците. Това е идеално за туристически райони в България.
      </p>
    ),
  },
  {
    question: "Как работи AI асистентът?",
    answer: (
      <div className="space-y-2 leading-relaxed">
        <p>AI асистентът е интелигентен помощник, който отговаря на въпросите на клиентите за менюто ви на всички поддържани езици. Той може да:</p>
        <ul className="list-disc list-inside ml-4 space-y-1">
          <li>Препоръча ястия въз основа на предпочитания</li>
          <li>Отговори на въпроси за алергени и диетични ограничения</li>
          <li>Обясни съставки и начини на приготвяне</li>
          <li>Предложи подходящи комбинации от ястия</li>
        </ul>
      </div>
    ),
  },
  {
    question: "Мога ли да променям цените и менюто в реално време?",
    answer: (
      <p>
        Абсолютно! Промените в менюто, цените и наличността на продуктите се актуализират мигновено. Не е нужно да печатате нови менюта - просто влезте в dashboard-а и направете промените. Клиентите ще видят новата информация веднага.
      </p>
    ),
  },
  {
    question: "Включени ли са QR кодовете в цената?",
    answer: (
      <div className="space-y-2 leading-relaxed">
        <p>Да! QR кодовете са напълно включени в цената на абонамента. Можете да генерирате QR кодове за всяка маса в ресторанта си и да ги персонализирате с лого и цветове.</p>
        <p>QR кодовете водят директно до менюто ви и работят на всички смартфони без да е нужно специално приложение.</p>
      </div>
    ),
  },
  {
    question: "Как работи SEO оптимизацията?",
    answer: (
      <div className="space-y-2 leading-relaxed">
        <p>SEO оптимизацията гарантира, че менюто ви ще бъде видимо в Google търсенията:</p>
        <ul className="list-disc list-inside ml-4 space-y-1">
          <li>Автоматично генериране на SEO-friendly URL адреси</li>
          <li>Структурирани данни за ресторанти</li>
          <li>Оптимизирани мета тагове на всички езици</li>
          <li>Бързо зареждане за подобро класиране</li>
        </ul>
        <p>Това означава, че клиентите ще намират ресторанта ви по-лесно онлайн.</p>
      </div>
    ),
  },
  {
    question: "Имам друг въпрос",
    answer: (
      <div className="space-y-2 leading-relaxed">
        <p>Отлично! Нашият екип е винаги готов да помогне. Свържете се с нас:</p>
        <ul className="list-disc list-inside ml-4 space-y-1">
          <li>Имейл: support@e-menu.bg (отговаряме до 4 часа)</li>
          <li>Телефон: +359 888 123 456</li>
          <li>Или използвайте контактната форма на сайта</li>
        </ul>
      </div>
    ),
  },
];

const Item = ({ item }) => {
  const accordion = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <li>
      <button
        className="relative flex gap-2 items-center w-full py-5 text-base font-semibold text-left border-t md:text-lg border-base-content/10"
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(!isOpen);
        }}
        aria-expanded={isOpen}
      >
        <span
          className={`flex-1 text-base-content ${isOpen ? "text-primary" : ""}`}
        >
          {item?.question}
        </span>
        <svg
          className={`flex-shrink-0 w-4 h-4 ml-auto fill-current`}
          viewBox="0 0 16 16"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            y="7"
            width="16"
            height="2"
            rx="1"
            className={`transform origin-center transition duration-200 ease-out ${
              isOpen && "rotate-180"
            }`}
          />
          <rect
            y="7"
            width="16"
            height="2"
            rx="1"
            className={`transform origin-center rotate-90 transition duration-200 ease-out ${
              isOpen && "rotate-180 hidden"
            }`}
          />
        </svg>
      </button>

      <div
        ref={accordion}
        className={`transition-all duration-300 ease-in-out opacity-80 overflow-hidden`}
        style={
          isOpen
            ? { maxHeight: accordion?.current?.scrollHeight, opacity: 1 }
            : { maxHeight: 0, opacity: 0 }
        }
      >
        <div className="pb-5 leading-relaxed">{item?.answer}</div>
      </div>
    </li>
  );
};

const FAQ = () => {
  return (
    <section className="bg-base-200" id="faq">
      <div className="py-24 px-8 max-w-7xl mx-auto flex flex-col md:flex-row gap-12">
        <div className="flex flex-col text-left basis-1/2">
          <p className="inline-block font-semibold text-primary mb-4">ЧЗВ</p>
          <p className="sm:text-4xl text-3xl font-extrabold text-base-content">
            Често задавани въпроси
          </p>
        </div>

        <ul className="basis-1/2">
          {faqList.map((item, i) => (
            <Item key={i} item={item} />
          ))}
        </ul>
      </div>
    </section>
  );
};

export default FAQ;
