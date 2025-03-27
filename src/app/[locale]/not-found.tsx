'use client';

import { useTranslations } from 'next-intl';

export default function NotFound() {
  const t = useTranslations('NotFound');

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h2 className="text-2xl font-bold mb-4">{t('title')}</h2>
      <p className="text-gray-600">{t('description')}</p>
    </div>
  );
}