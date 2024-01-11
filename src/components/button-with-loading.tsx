'use client'

import { ButtonProps } from "@/components/ui/button";
import { useState } from "react";

interface ButtonWithLoadingProps extends ButtonProps {
    loadingText: string;
    customOnClick: Function
}

export default function ButtonWithLoading({}: ButtonWithLoadingProps) {

}