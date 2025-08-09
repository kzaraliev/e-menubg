'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    restaurant: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [emailJSReady, setEmailJSReady] = useState(false);

  // Check for EmailJS availability
  useEffect(() => {
    const checkEmailJS = () => {
      if (typeof window !== 'undefined' && window.emailjs) {
        window.emailjs.init("winnx47WIGJzZR862");
        setEmailJSReady(true);
        console.log('EmailJS initialized successfully');
      } else {
        // Retry after a short delay
        setTimeout(checkEmailJS, 100);
      }
    };

    // Start checking after component mounts
    const timer = setTimeout(checkEmailJS, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };

  const validateForm = () => {
    const { name, email, message, phone } = formData;
    
    // Check required fields
    if (!name.trim() || !email.trim() || !message.trim()) {
      return 'Моля, попълнете всички задължителни полета (*)';
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Моля, въведете валиден имейл адрес';
    }
    
    // Validate phone if present
    if (phone.trim()) {
      const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
      if (!phoneRegex.test(phone)) {
        return 'Моля, въведете валиден телефонен номер';
      }
    }
    
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Check if EmailJS is ready
    if (!emailJSReady) {
      setError('Моля, изчакайте да се зареди системата за изпращане на имейли...');
      return;
    }
    
    // Validate form
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Double check if EmailJS is available
      if (!window.emailjs) {
        throw new Error('EmailJS все още се зарежда');
      }
      
      // Prepare template parameters
      const templateParams = {
        name: formData.name,
        email: formData.email,
        restaurant: formData.restaurant || 'Не е предоставено',
        phone: formData.phone || 'Не е предоставен',
        subject: formData.subject || 'Общо запитване',
        message: formData.message
      };
      
      console.log('Sending email with params:', templateParams);
      
      // Send email using EmailJS
      const result = await window.emailjs.send("service_5zeefxe", "template_6ev84qg", templateParams);
      
      console.log('Email sent successfully:', result);
      
      // Success
      setIsSubmitted(true);
      
      // Track successful form submission (if analytics is available)
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'form_submission', {
          'event_category': 'Contact',
          'event_label': 'E-Menu Contact Form'
        });
      }
      
    } catch (error) {
      console.error('EmailJS Error:', error);
      setError('Възникна грешка при изпращането. Моля, опитайте отново по-късно или се свържете с нас на support@e-menu.bg');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNewMessage = () => {
    setIsSubmitted(false);
    setError('');
    setFormData({
      name: '',
      email: '',
      restaurant: '',
      phone: '',
      subject: '',
      message: ''
    });
  };

  if (isSubmitted) {
    return (
      <div className="text-center py-8">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
          <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-slate-900 mb-4">
          Благодарим за съобщението!
        </h3>
        <p className="text-slate-600 mb-8 text-lg">
          Получихме вашето запитване и ще се свържем с вас до 2 часа в работно време.
        </p>
        <button
          type="button"
          onClick={handleNewMessage}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors duration-300 transform hover:scale-105"
        >
          Изпратете друго съобщение
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-xl bg-red-50 p-4 border border-red-200">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* EmailJS loading indicator */}
      {!emailJSReady && (
        <div className="rounded-xl bg-blue-50 p-4 border border-blue-200">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="animate-spin h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700 font-medium">Зарежда се системата за изпращане на имейли...</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-slate-900 mb-2">
            Име и фамилия *
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300 bg-white placeholder-gray-600 text-gray-900"
            placeholder="Въведете вашето име"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-slate-900 mb-2">
            Имейл адрес *
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300 bg-white placeholder-gray-600 text-gray-900"
            placeholder="your@email.com"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* restaurant */}
        <div>
          <label htmlFor="restaurant" className="block text-sm font-semibold text-slate-900 mb-2">
            Име на ресторант/заведение
          </label>
          <input
            type="text"
            name="restaurant"
            id="restaurant"
            value={formData.restaurant}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300 bg-white placeholder-gray-600 text-gray-900"
            placeholder="Ресторант ABC"
          />
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-semibold text-slate-900 mb-2">
            Телефонен номер
          </label>
          <input
            type="tel"
            name="phone"
            id="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300 bg-white placeholder-gray-600 text-gray-900"
            placeholder="+359 888 123 456"
          />
        </div>
      </div>

      {/* Subject */}
      <div>
        <label htmlFor="subject" className="block text-sm font-semibold text-slate-900 mb-2">
          Тема на запитването
        </label>
        <select
          name="subject"
          id="subject"
          value={formData.subject}
          onChange={handleInputChange}
          className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300 bg-white text-gray-900"
        >
          <option value="" className="text-gray-600">Изберете тема</option>
          <option value="general">Общи въпроси</option>
          <option value="technical">Техническа поддръжка</option>
          <option value="billing">Въпроси за таксуване</option>
          <option value="partnership">Партньорство</option>
          <option value="demo">Искам демонстрация</option>
          <option value="other">Друго</option>
        </select>
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="block text-sm font-semibold text-slate-900 mb-2">
          Съобщение *
        </label>
        <textarea
          name="message"
          id="message"
          rows={6}
          value={formData.message}
          onChange={handleInputChange}
          className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300 bg-white resize-none placeholder-gray-600 text-gray-900"
          placeholder="Опишете вашето запитване подробно..."
          required
        />
        <p className="mt-2 text-sm text-slate-500">
          Минимум 10 символа. Колкото повече детайли споделите, толкова по-добре ще можем да ви помогнем.
        </p>
      </div>

      {/* Privacy Notice */}
      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-slate-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-slate-600">
              Вашите данни се обработват съгласно нашата{' '}
              <Link href="/privacy-policy" className="text-blue-600 hover:text-blue-700 underline">
                политика за поверителност
              </Link>
              . Използваме ги единствено за отговор на вашето запитване.
            </p>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div>
        <button
          type="submit"
          disabled={isSubmitting || !emailJSReady}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Изпращане...
            </span>
          ) : (
            'Изпратете съобщението'
          )}
        </button>
      </div>

      {/* Success State */}
      {isSubmitted && (
        <div className="rounded-xl bg-green-50 p-6 border border-green-200">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-green-800">
                Съобщението е изпратено успешно!
              </h3>
              <p className="mt-2 text-sm text-green-700">
                Благодарим ви за запитването. Ще се свържем с вас възможно най-скоро на посочения имейл адрес.
              </p>
            </div>
          </div>
        </div>
      )}
    </form>
  )
} 