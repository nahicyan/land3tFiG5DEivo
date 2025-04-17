"use client";

import * as React from "react";
import {
  Home,
  Megaphone,
  Users,
  User,
  Building,
  Briefcase,
  AlertOctagon,
  Settings2,
  Server,
  Code,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

// Sample data with updated icons
const data = {
  user: {
    name: "Nathan",
    email: "Nathan@landersinvestment.com",
    avatar: "/",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: Building, // Changed to Building icon
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: Briefcase, // Changed to Briefcase icon
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: AlertOctagon, // Changed to AlertOctagon icon
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Properties",
      url: "/admin",
      icon: Home, // Changed to Home icon
      isActive: true,
      items: [
        { title: "Add Property", url: "/add-property" },
        { title: "Financing Applicaitons", url: "/admin/qualifications" },
        { title: "Starred", url: "#" },
        { title: "Settings", url: "#" },
      ],
    },
    {
      title: "Campaigns",
      url: "#",
      icon: Megaphone, // Changed to Megaphone icon
      items: [
        { title: "Manage Campaigns", url: "#" },
        { title: "Email Templates", url: "#" },
      ],
    },
    {
      title: "Users",
      url: "#",
      icon: Users, // Changed to Users icon
      items: [
        {
          title: "Create A New User",
          url: "https://landivo.com/CreateUservbtwP44jbX0FKKYUdHBGGCcYqenvNlYdH1Sj7K1dSD3kRo1Pib5VXQWb59a7CkQZ4DiQuu5r1t9I0uXVUbYjvvj4E1djRIkXRh40Uvbz2jSz6PZKguOjGhi7avF1b",
        },
        { title: "Manage Users", url: "admin/users" },
      ],
    },
    {
      title: "Buyers",
      url: "#",
      icon: User, // Changed to User icon
      items: [
        { title: "VIP Buyer's List", url: "admin/buyer-lists" },
        { title: "Property Alert List", url: "#" },
        { title: "Manage Buyers", url: "admin/buyers" },
      ],
    },
  ],
  projects: [
    { name: "Settings", url: "#", icon: Settings2 },
    { name: "SMTP Settings", url: "#", icon: Server }, // Changed to Server icon
    { name: "API & Connection", url: "#", icon: Code }, // Changed to Code icon
  ],
};

export function AppSidebar({ ...props }) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
