// components/nav-main.tsx
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"

export function NavMain({ items }: { items: { title: string, url: string, icon: any }[] }) {
  const pathname = usePathname()

  return (
    <SidebarMenu>
      {items.map((item) => {
        const isActive = pathname === item.url
        return (
          <SidebarMenuItem key={item.url}>
            <SidebarMenuButton
              asChild
              isActive={isActive}
              className={
                isActive
                  ? "bg-[#E7EEFF] text-[#4880FF] [&>svg]:text-[#4880FF]"
                  : ""
              }
            >
              <Link href={item.url}>
                <item.icon className="size-4" />
                <span className={
                  isActive
                  ? "text-[#4880FF]"
                  : ""
                }>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )
      })}
    </SidebarMenu>
  )
}
