"use client";
import { useMemo, useState } from "react";
export interface CurrencyConverterProps { rates: Record<string, number>; base?: string; }
export default function CurrencyConverter({ rates, base = "USD" }: CurrencyConverterProps) {
  const [amount, setAmount] = useState("100"); const [currency, setCurrency] = useState(Object.keys(rates)[0] ?? "EUR");
  const result = useMemo(() => Number(amount || 0) * (rates[currency] ?? 1), [amount, currency, rates]);
  return <section aria-label="Currency converter"><label>Amount <input value={amount} inputMode="decimal" onChange={(event) => setAmount(event.target.value)} /></label><select value={currency} onChange={(event) => setCurrency(event.target.value)}>{Object.keys(rates).map((code) => <option key={code}>{code}</option>)}</select><output>{result.toFixed(2)} {currency}</output><small>1 {base} = {rates[currency] ?? 1} {currency}</small></section>;
}
