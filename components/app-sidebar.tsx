"use client"
import * as React from "react"
import {
  IconDashboard,
  IconMassage,
  IconHistory
} from "@tabler/icons-react"

import { NavMain } from "@/components/nav-main"

import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Encrypt",
      url: "/dashboard/encryptdecrypt",
      icon: IconDashboard,
    },
    {
      title: "History",
      url: "/dashboard/history",
      icon: IconHistory,
    },
    {
      title: "FAQ",
      url: "/dashboard/faq",
      icon: IconMassage,
    }
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <img src="/picrypt_icon.png" className="w-5 h-6" alt="PiCrypt Icon" />
                <span className="text-base font-semibold">Picrypt</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
