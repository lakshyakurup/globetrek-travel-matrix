"use client";
import Image from "next/image";
export interface Traveler { id: string; name: string; online: boolean; avatarUrl?: string; }
export default function ActiveTravelers({ travelers }: { travelers: Traveler[] }) { return <section aria-label="Active travelers"><h2>Travelers ({travelers.filter((traveler) => traveler.online).length})</h2><ul>{travelers.map((traveler) => <li key={traveler.id}><span aria-hidden className={traveler.online ? "bg-green-500" : "bg-gray-400"} />{traveler.avatarUrl && <Image src={traveler.avatarUrl} alt="" width={24} height={24} />}{traveler.name}</li>)}</ul></section>; }
