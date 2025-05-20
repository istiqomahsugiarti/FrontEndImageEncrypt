"use client"
import * as React from "react"
import {
  LayoutDashboardIcon,
  HistoryIcon,
  User2Icon,
  MessageCircleQuestionIcon
} from "lucide-react"
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

import { useUser } from "@/context/UserContext"
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, loading } = useUser();

  if (loading) return null; // atau loading spinner

  // Menu untuk user
  const userNav = [
    { title: "Encrypt", url: "/dashboard/encryptdecrypt", icon: LayoutDashboardIcon },
    { title: "History", url: "/dashboard/history", icon: HistoryIcon},
    { title: "FAQ", url: "/dashboard/faq", icon:  MessageCircleQuestionIcon },
  ];

  // Menu untuk admin
  const adminNav = [
    { title: "Dashboard", url: "/dashboard/admin", icon: LayoutDashboardIcon },
    { title: "User Management", url: "/dashboard/users", icon: User2Icon },
    { title: "FAQ Management", url: "/dashboard/faqManagement", icon: MessageCircleQuestionIcon },
  ];

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
        <NavMain items={user?.role === "admin" ? adminNav : userNav} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
