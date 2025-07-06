"use client";

import { useTransition } from 'react';
import { useLocale } from 'next-intl';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FiGlobe } from "react-icons/fi";

export function LanguageSwitcher() {
  const [isPending, startTransition] = useTransition();
  const locale = useLocale();

  const onSelectChange = (nextLocale: string) => {
    startTransition(() => {
      document.cookie = `locale=${nextLocale}; path=/; max-age=31536000; SameSite=Lax`;
      window.location.reload();
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" disabled={isPending}>
          <FiGlobe className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          onClick={() => onSelectChange('ar')}
          className={locale === 'ar' ? 'bg-accent' : ''}
        >
          العربية
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onSelectChange('en')}
          className={locale === 'en' ? 'bg-accent' : ''}
        >
          English
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}