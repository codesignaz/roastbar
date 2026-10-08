'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useSlogans } from '@/hooks/useSlogans';
import { MapPin, Clock, Phone, Copy, Check, ExternalLink, Navigation } from 'lucide-react';
import { WhatsAppIcon } from '@/components/common/WhatsAppIcon';

export const LocationHours: React.FC = () => {
  const { t } = useLanguage();
  const slogans = useSlogans();
  const contactTitle = slogans.contactTitle || t.contact.title;
  const contactSubtitle = slogans.contactSubtitle || t.contact.subtitle;
  const [copied, setCopied] = useState(false);
  const [copiedPlusCode, setCopiedPlusCode] = useState(false);

  const plusCode = '9RGM+C6 Baku';
  const fullAddress = 'Şihali Qurbanov (Fizuli) 2/15, 9RGM+C6 Baku';
  const googleMapsUrl = 'https://www.google.com/maps/search/?api=1&query=9RGM%2BC6+Baku';

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(fullAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleCopyPlusCode = () => {
    navigator.clipboard.writeText(plusCode);
    setCopiedPlusCode(true);
    setTimeout(() => setCopiedPlusCode(false), 2500);
  };

  return (
    <section className="py-14 sm:py-20 bg-[#fdfbf7] relative overflow-hidden border-t border-[#ebdcd0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#ebdcd0] text-[#8f5222] text-xs font-bold mb-3 shadow-2xs">
            <MapPin className="w-3.5 h-3.5 text-[#b87333]" />
            <span>9RGM+C6 Baku</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#221710]">
            {contactTitle}
          </h2>
          <p className="mt-2 text-xs sm:text-base text-[#5c4a3e] font-normal leading-relaxed">
            {contactSubtitle}
          </p>
        </div>

        {/* Content Grid: Contact Cards + Map */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Contact Details Cards */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {/* Address Card */}
            <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#ebdcd0] shadow-sm">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-[#fbf2ea] border border-[#ebdcd0] text-[#8f5222]">
                  <MapPin className="w-6 h-6 text-[#b87333]" />
                </div>
                <div className="flex-1">
                  <h3 className="font-serif text-lg font-bold text-[#221710]">
                    {t.contact.locationTitle}
                  </h3>
                  <p className="text-base text-[#221710] mt-1 font-bold">
                    Şihali Qurbanov (Fizuli) 2/15
                  </p>
                  
                  {/* Exact Location & Plus Code Badge */}
                  <div className="mt-1 flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-[#fbf2ea] border border-[#ebdcd0] text-xs font-extrabold text-[#8f5222] font-mono">
                      📍 {plusCode}
                    </span>
                    <span className="text-xs text-[#786455]">
                      Bakı, Azərbaycan
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCopyAddress}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#faf4ed] hover:bg-[#f4ebe0] border border-[#ebdcd0] text-xs text-[#6e4320] font-semibold transition-colors cursor-pointer"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-[#b87333]" />}
                      <span>{copied ? t.contact.copied : t.contact.copyAddress}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleCopyPlusCode}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#fbf2ea] hover:bg-[#f5e6d6] border border-[#ebdcd0] text-xs text-[#8f5222] font-semibold transition-colors cursor-pointer"
                      title="Google Plus Code kopyala"
                    >
                      {copiedPlusCode ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-[#b87333]" />}
                      <span className="font-mono text-[11px] font-bold">9RGM+C6</span>
                    </button>

                    <a
                      href={googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#b87333]/10 hover:bg-[#b87333]/20 border border-[#b87333]/30 text-xs text-[#8f5222] font-bold transition-colors"
                    >
                      <Navigation className="w-3.5 h-3.5 text-[#b87333]" />
                      <span>{t.contact.getDirections}</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Operating Hours Card */}
            <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#ebdcd0] shadow-sm">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-[#fbf2ea] border border-[#ebdcd0] text-[#8f5222]">
                  <Clock className="w-6 h-6 text-[#b87333]" />
                </div>
                <div className="flex-1">
                  <h3 className="font-serif text-lg font-bold text-[#221710]">
                    {t.contact.hoursTitle}
                  </h3>
                  <div className="mt-2 space-y-1.5 text-sm">
                    <div className="flex items-center justify-between text-[#473425]">
                      <span className="font-medium">Hər gün (Bazar ertəsi – Bazar)</span>
                      <span className="font-extrabold text-[#8f5222]">08:00 – 00:30</span>
                    </div>
                  </div>
                  <p className="text-xs text-[#786455] mt-2 leading-relaxed">
                    Səhərin erkən saatlarından gecə 00:30-dək fasiləsiz xidmət.
                  </p>
                </div>
              </div>
            </div>

            {/* Phone & Direct Contact Card */}
            <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#ebdcd0] shadow-sm">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-[#fbf2ea] border border-[#ebdcd0] text-[#8f5222]">
                  <Phone className="w-6 h-6 text-[#b87333]" />
                </div>
                <div className="flex-1">
                  <h3 className="font-serif text-lg font-bold text-[#221710]">
                    {t.contact.phoneTitle}
                  </h3>
                  <p className="text-base text-[#8f5222] font-bold mt-1">
                    +994 55 449 00 07
                  </p>

                  <div className="mt-4 grid grid-cols-2 gap-2.5">
                    <a
                      href="tel:+994554490007"
                      className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#b87333] to-[#9c5c28] text-white font-bold text-xs shadow-sm active:scale-95 transition-all text-center"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>{t.contact.callNow}</span>
                    </a>

                    <a
                      href="https://wa.me/994554490007?text=Salam,%20RoastBar-la%20əlaqə%20saxlayıram"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-white hover:bg-[#f0fdf4] border border-[#25D366]/40 text-[#128C7E] font-bold text-xs shadow-2xs hover:shadow-xs active:scale-95 transition-all text-center"
                    >
                      <WhatsAppIcon className="w-4 h-4" />
                      <span>{t.contact.whatsapp}</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Google Map Embed using exact 9RGM+C6 Baku pin */}
          <div className="lg:col-span-7 h-[380px] sm:h-[460px] rounded-3xl overflow-hidden border border-[#ebdcd0] shadow-md relative bg-[#f4e8dc]">
            <iframe
              title="RoastBar Baku Location Map - 9RGM+C6"
              src="https://maps.google.com/maps?q=9RGM%2BC6+Baku&t=&z=17&ie=UTF8&iwloc=B&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              suppressHydrationWarning
            />

            {/* Overlay badge on the map with exact Plus Code */}
            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md border border-[#ebdcd0] p-3 rounded-xl shadow-md flex items-center gap-3 pointer-events-auto">
              <div className="w-9 h-9 rounded-lg bg-[#b87333] flex items-center justify-center text-white font-bold">
                ☕
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <p className="font-bold text-xs text-[#221710]">RoastBar</p>
                  <span className="text-[10px] font-mono font-bold text-[#8f5222] bg-[#fbf2ea] px-1.5 py-0.2 rounded border border-[#ebdcd0]">
                    9RGM+C6
                  </span>
                </div>
                <p className="text-[10px] text-[#786455]">Şihali Qurbanov 2/15, Baku</p>
              </div>
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 p-1.5 rounded-lg bg-[#faf4ed] hover:bg-[#f4ebe0] text-[#8f5222]"
                aria-label="Open 9RGM+C6 Baku in Google Maps"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
