'use client';

import { ButtonProps } from '@/components/ui/button';

interface ButtonWithLoadingProps extends ButtonProps {
  loadingText: string;
  customOnClick: Function;
}

export default function ButtonWithLoading({}: ButtonWithLoadingProps) {}
