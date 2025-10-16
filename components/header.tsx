"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Search, Menu, LogOut } from "lucide-react"
import { useSession, signOut } from "next-auth/react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Logo } from "./logo"
import { useEffect } from "react"

export function Header() {
    const { data: session, status } = useSession()
    const user = session?.user

    const handleSignOut = () => {
        signOut({ callbackUrl: "/" })
    }

    return (
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-10">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center gap-6">
                        <Link href="/" className="flex items-center gap-3">
                            <Logo />
                        </Link>

                        <nav className="hidden md:flex items-center gap-6">
                            <Link href="/politics" className="text-sm font-medium hover:text-primary transition-colors">
                                Politics
                            </Link>
                            <Link href="/technology" className="text-sm font-medium hover:text-primary transition-colors">
                                Technology
                            </Link>
                            <Link href="/business" className="text-sm font-medium hover:text-primary transition-colors">
                                Business
                            </Link>
                            <Link href="/sports" className="text-sm font-medium hover:text-primary transition-colors">
                                Sports
                            </Link>
                            <Link href="/health" className="text-sm font-medium hover:text-primary transition-colors">
                                Health
                            </Link>
                        </nav>
                    </div>

                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" className="hidden sm:flex">
                            <Search className="h-4 w-4" />
                        </Button>

                        {status === "loading" ? (
                            <div className="flex items-center gap-2" />
                        ) : user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="flex items-center gap-2">
                                        <img
                                            src={user.image || "/placeholder.svg"}
                                            alt={user.name || "User"}
                                            className="w-6 h-6 rounded-full"
                                        />
                                        <span className="hidden sm:inline">{user.name}</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem asChild>
                                        <Link href="/dashboard">Dashboard</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/profile">Profile</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={handleSignOut}>
                                        <LogOut className="mr-2 h-4 w-4" />
                                        Sign out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm" asChild>
                                    <Link href="/login">Sign in</Link>
                                </Button>
                            </div>
                        )}

                        <Button variant="ghost" size="sm" className="md:hidden">
                            <Menu className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    )
}
