"use client"

import * as React from "react"
import { SunMoonIcon, MoonStarIcon } from 'lucide-react'
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ModeTogglerProps {
	className: string
}

export default function ModeToggler({ className }: ModeTogglerProps) {
  const { setTheme, theme } = useTheme()

  return (
    	<Button variant="ghost" className={cn(`px-2`, className)} onClick={() => setTheme(theme === 'light' ? 'dark' : "light")}>
          <SunMoonIcon className=" dark:hidden block rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <MoonStarIcon className=" dark:block hidden rotate-290 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
  )
}