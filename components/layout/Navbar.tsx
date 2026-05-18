"use client"

import Link from 'next/link';
import { Terminal } from 'lucide-react';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar"
import { TOOLS } from "@/lib/constants/tools"

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 font-bold">
            <Terminal className="h-5 w-5 text-primary" />
            <span>playground</span>
          </Link>
          <span className="hidden text-xs text-muted-foreground sm:inline-block">
            all data stays in your browser
          </span>
        </div>
        <nav className="flex items-center gap-6 text-sm">
          <Link href="/scratchpad" className="text-muted-foreground hover:text-foreground transition-colors">
            Scratchpad
          </Link>
          
          <Menubar className="border-none bg-transparent p-0 shadow-none h-auto">
            <MenubarMenu>
              <MenubarTrigger className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer p-0 bg-transparent font-normal text-sm data-[state=open]:bg-transparent data-[state=open]:text-foreground">
                Tools
              </MenubarTrigger>
              <MenubarContent className="min-w-[200px]">
                <div className="font-semibold px-2 py-1.5 text-xs text-muted-foreground">Security</div>
                {TOOLS.filter(t => t.category === 'security').map(tool => (
                  <MenubarItem key={tool.id} asChild>
                    <Link href={tool.href} className="w-full cursor-pointer">
                      {tool.name}
                    </Link>
                  </MenubarItem>
                ))}
                <MenubarSeparator />
                <div className="font-semibold px-2 py-1.5 text-xs text-muted-foreground">Crypto</div>
                {TOOLS.filter(t => t.category === 'crypto').map(tool => (
                  <MenubarItem key={tool.id} asChild>
                    <Link href={tool.href} className="w-full cursor-pointer">
                      {tool.name}
                    </Link>
                  </MenubarItem>
                ))}
                <MenubarSeparator />
                <div className="font-semibold px-2 py-1.5 text-xs text-muted-foreground">Utility</div>
                {TOOLS.filter(t => t.category === 'utility').map(tool => (
                  <MenubarItem key={tool.id} asChild>
                    <Link href={tool.href} className="w-full cursor-pointer">
                      {tool.name}
                    </Link>
                  </MenubarItem>
                ))}
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        </nav>
      </div>
    </header>
  );
}
