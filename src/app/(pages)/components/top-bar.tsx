// components/top-bar.tsx
"use client";

import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FiBell, FiRotateCcw, FiSearch } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useTranslations } from 'next-intl';

export default function TopBar() {
  const t = useTranslations();
  
  return (
    <div className="flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <div className="flex w-full items-center justify-between">
        <div className="relative w-full max-w-md">
          <FiSearch className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t('common.search')}
            className="w-full ps-8 bg-muted md:w-[200px] lg:w-[300px]"
          />
        </div>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <FiRotateCcw className="h-4 w-4" />
            <span className="sr-only">Refresh</span>
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <FiBell className="h-4 w-4" />
            <span className="sr-only">Notifications</span>
          </Button>
          <Avatar className="h-10 w-10">
            <AvatarImage src="./nothing.svg" />
            <AvatarFallback>JO</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  );
}
