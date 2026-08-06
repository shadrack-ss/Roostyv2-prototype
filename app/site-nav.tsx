'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function SiteNav() {
  const pathname = usePathname();

  return (
    <ul className="site-menu js-clone-nav d-none d-lg-block">
      <li className={pathname === '/' ? 'active' : undefined}>
        <Link href="/">Home</Link>
      </li>
      {/* No dropdown: every item it held (Standard/Family/Single Room, plus a
          nested America/Europe/Asia/Africa list) was theme placeholder content
          pointing at /rooms, so the menu just linked to itself four times over.
          Dropping .has-children also removes the chevron the theme draws. */}
      <li className={pathname === '/rooms' ? 'active' : undefined}>
        <Link href="/rooms">Rooms</Link>
      </li>
      <li className={pathname === '/services' ? 'active' : undefined}>
        <Link href="/services">Services</Link>
      </li>
      <li className={pathname === '/events' ? 'active' : undefined}>
        <Link href="/events">Events</Link>
      </li>
      <li className={pathname === '/about' ? 'active' : undefined}>
        <Link href="/about">About</Link>
      </li>
      <li className={pathname === '/contact' ? 'active' : undefined}>
        <Link href="/contact">Contact</Link>
      </li>
    </ul>
  );
}
