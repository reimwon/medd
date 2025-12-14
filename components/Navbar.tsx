'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAccount, useDisconnect, useConnect } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { Button } from '@/components/ui/Button'
import { Menu, X, Hexagon, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useRole } from '@/hooks/useRole'

export function Navbar() {
    const { address, isConnected } = useAccount()
    const { disconnect } = useDisconnect()
    const { connectors, connect } = useConnect()
    const { isGuest, logout } = useRole()
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [scrolled, setScrolled] = React.useState(false)

    React.useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Handlers
    const handleConnect = () => {
        const metaMaskConnector = connectors.find((c) => c.id === 'metaMask')
        if (metaMaskConnector) {
            connect({ connector: metaMaskConnector })
        } else {
            // Fallback to the first available connector (usually injected)
            const firstConnector = connectors[0]
            if (firstConnector) {
                connect({ connector: firstConnector })
            }
        }
    }

    const formatAddress = (addr: string) => {
        return `${addr.slice(0, 6)}...${addr.slice(-4)}`
    }

    const pathname = usePathname()
    const isHome = pathname === '/'
    // Always show solid navbar on non-home pages
    const showSolid = scrolled || !isHome

    return (
        <nav className={cn(
            "fixed top-0 w-full z-50 transition-all duration-300 border-b",
            showSolid
                ? "bg-white/95 backdrop-blur-md border-slate-200 py-0 shadow-sm"
                : "bg-transparent border-transparent py-4"
        )}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className={showSolid ? "text-blue-700" : "text-white"}>
                            <Hexagon className={cn("w-8 h-8", showSolid ? "fill-blue-100 stroke-blue-600" : "fill-blue-500/20 stroke-white")} strokeWidth={1.5} />
                        </div>
                        <span className={cn("text-xl font-bold tracking-tight", showSolid ? "text-slate-900" : "text-white")}>MediChain</span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-8">
                        {[
                            { name: 'Home', href: '/' },
                            { name: 'Medicines', href: '/medicines' },
                            { name: 'Factory', href: '/dashboard/manufacturer' },
                            { name: 'Doctor', href: '/dashboard/doctor' },
                            { name: 'Patient', href: '/dashboard/patient' },
                        ].map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "text-sm font-medium transition-colors hover:text-blue-500",
                                    showSolid ? "text-slate-600" : "text-blue-100 hover:text-white"
                                )}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>

                    {/* Wallet Button (Desktop) */}
                    <div className="hidden md:flex items-center gap-4">
                        {isGuest && (
                            <Link
                                href="/dashboard"
                                className={cn("text-sm font-medium transition-colors hover:text-blue-500", showSolid ? "text-slate-900" : "text-white")}
                            >
                                Login
                            </Link>
                        )}
                        {isConnected && address ? (
                            <div className={cn("flex items-center gap-2 pl-3 pr-1 py-1 rounded-full border transition-all", showSolid ? "bg-slate-100 border-slate-200" : "bg-blue-900/50 border-blue-700")}>
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                <span className={cn("text-sm font-mono font-semibold", showSolid ? "text-slate-700" : "text-blue-100")}>{formatAddress(address)}</span>
                                <Button variant="ghost" size="sm" className={cn("ml-1 hover:bg-red-50 hover:text-red-500 gap-2", showSolid ? "text-slate-500" : "text-blue-300 hover:bg-red-900/30")} onClick={() => {
                                    disconnect()
                                    logout()
                                }}>
                                    <LogOut className="w-4 h-4" />
                                    <span className="hidden sm:inline">Logout</span>
                                </Button>
                            </div>
                        ) : (
                            !isGuest && (
                                <Button variant="ghost" className={cn("text-red-500 hover:bg-red-50 hover:text-red-600", showSolid ? "text-red-600" : "text-red-300")} onClick={logout}>
                                    Logout
                                </Button>
                            )
                        )}
                        {isGuest && !isConnected && (
                            <Button onClick={handleConnect} className={cn("shadow-lg border-0 font-semibold", showSolid ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-white text-blue-900 hover:bg-blue-50")}>
                                Connect Wallet
                            </Button>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className={cn("transition-colors", showSolid ? "text-slate-900 hover:text-blue-600" : "text-blue-100 hover:text-white")}>
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-[#1E3A5F] border-b border-blue-800 p-4 space-y-4 shadow-xl animate-in slide-in-from-top-5 text-white">
                    <Link href="/" className="block text-base font-medium text-blue-100 hover:text-white" onClick={() => setIsMenuOpen(false)}>Home</Link>
                    <Link href="/medicines" className="block text-base font-medium text-blue-100 hover:text-white" onClick={() => setIsMenuOpen(false)}>Medicines</Link>
                    <Link href="/dashboard/manufacturer" className="block text-base font-medium text-blue-100 hover:text-white" onClick={() => setIsMenuOpen(false)}>Factory</Link>
                    <Link href="/dashboard/doctor" className="block text-base font-medium text-blue-100 hover:text-white" onClick={() => setIsMenuOpen(false)}>Doctor</Link>
                    <Link href="/dashboard/patient" className="block text-base font-medium text-blue-100 hover:text-white" onClick={() => setIsMenuOpen(false)}>Patient</Link>
                    {isGuest && (
                        <Link href="/dashboard" className="block text-base font-medium text-blue-100 hover:text-white" onClick={() => setIsMenuOpen(false)}>Login</Link>
                    )}
                    <div className="pt-2">
                        {isConnected && address ? (
                            <div className="flex items-center justify-between bg-blue-900/50 p-3 rounded-lg border border-blue-700">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-green-500" />
                                    <span className="font-mono text-blue-100 font-medium">{formatAddress(address)}</span>
                                </div>
                                <Button variant="ghost" size="sm" onClick={() => {
                                    disconnect()
                                    logout()
                                }} className="text-blue-200">Disconnect</Button>
                            </div>
                        ) : (
                            <Button onClick={handleConnect} className="w-full bg-accent hover:bg-blue-600">Connect Wallet</Button>
                        )}
                    </div>
                </div>
            )}
        </nav>
    )
}
