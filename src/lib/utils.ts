import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getEmpresaParam(){
  const params = new URLSearchParams(window.location.search)
  return params.get("empresa")
}