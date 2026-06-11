import { Link } from 'wouter'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'

export default function HomePage() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-bold">A</span>
            </div>
            <span className="font-bold text-lg text-white tracking-tight">Agunnaya AI</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-slate-300 hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="text-sm text-slate-300 hover:text-white transition-colors">Pricing</a>
            <a href="#faq" className="text-sm text-slate-300 hover:text-white transition-colors">FAQ</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/login">
              <Button variant="outline" size="sm" className="text-slate-200 border-slate-600 hover:bg-slate-800">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button size="sm" className="bg-blue-600 hover:bg-blue-500 text-white">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-24">
        <div className="max-w-4xl mx-auto text-center space-y-10">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              <span className="text-sm font-medium text-blue-300 tracking-wide">AI-Native Web3 Platform</span>
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight">
              <span className="text-white">Build Web3 Apps</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-300">
                powered by AI
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Generate smart contracts, deploy to multiple chains, and build AI-powered dApps
              in minutes. The future of Web3 development is here.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/auth/sign-up">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-500 text-white text-base px-8 h-12 rounded-xl shadow-lg shadow-blue-600/20">
                Start Building Free
              </Button>
            </Link>
            <a href="#features">
              <Button size="lg" variant="outline" className="text-slate-200 border-slate-600 hover:bg-slate-800/80 text-base h-12 rounded-xl">
                See Features →
              </Button>
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12 border-t border-slate-800/60">
            {[
              { value: '10,000+', label: 'Active Developers' },
              { value: '$50M+', label: 'Smart Contracts Deployed' },
              { value: '99.9%', label: 'Uptime Guarantee' },
            ].map((stat) => (
              <div key={stat.label} className="space-y-1">
                <p className="text-3xl font-bold text-blue-400">{stat.value}</p>
                <p className="text-sm text-slate-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-900/40">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <p className="text-sm font-semibold text-blue-400 uppercase tracking-widest">Platform Features</p>
            <h2 className="text-4xl sm:text-5xl font-bold text-white">
              Everything you need to ship
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              A complete AI-native development environment built specifically for Web3
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'AI Code Generation', description: 'Generate Solidity smart contracts, backend logic, and frontend code with 8 specialized AI agents.', icon: '⚡', accent: 'border-blue-500/20 hover:border-blue-500/40' },
              { title: 'Wallet Integration', description: 'Seamless Web3 wallet authentication with RainbowKit, MetaMask, and Coinbase Wallet.', icon: '🔐', accent: 'border-purple-500/20 hover:border-purple-500/40' },
              { title: 'Multi-Chain Deploy', description: 'Deploy and verify smart contracts on Base, Ethereum, Polygon, and more with one click.', icon: '📦', accent: 'border-cyan-500/20 hover:border-cyan-500/40' },
              { title: 'Dev Playground', description: 'Monaco editor (VS Code engine) in the browser with Solidity templates and AI inline suggestions.', icon: '🖥️', accent: 'border-green-500/20 hover:border-green-500/40' },
              { title: 'API Gateway', description: 'Access OpenAI, Anthropic, and Web3 infrastructure APIs from one unified platform.', icon: '🔌', accent: 'border-orange-500/20 hover:border-orange-500/40' },
              { title: 'GameFi & Analytics', description: 'Earn XP, complete quests, and track performance metrics as you build.', icon: '🎮', accent: 'border-pink-500/20 hover:border-pink-500/40' },
            ].map((feature) => (
              <div
                key={feature.title}
                className={`p-6 rounded-2xl border bg-slate-800/20 hover:bg-slate-800/40 transition-all duration-200 space-y-4 ${feature.accent}`}
              >
                <div className="text-3xl">{feature.icon}</div>
                <h3 className="text-base font-semibold text-white">{feature.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <p className="text-sm font-semibold text-blue-400 uppercase tracking-widest">Pricing</p>
            <h2 className="text-4xl sm:text-5xl font-bold text-white">Simple, transparent pricing</h2>
            <p className="text-lg text-slate-400">Always free to get started. Scale as you grow.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Starter', price: 'Free', period: '', description: 'Perfect for learning and side projects',
                features: ['100 AI credits / month', '1 active project', 'Community support', 'Basic analytics', 'Core AI agents'],
                highlighted: false, cta: 'Get Started Free',
              },
              {
                name: 'Pro', price: '$29', period: '/month', description: 'For active builders shipping products',
                features: ['10,000 AI credits / month', 'Unlimited projects', 'Priority support', 'Advanced analytics', 'All 8 AI agents', 'Custom domains'],
                highlighted: true, cta: 'Start Pro Trial',
              },
              {
                name: 'Enterprise', price: 'Custom', period: '', description: 'For teams and organizations',
                features: ['Unlimited AI credits', 'Unlimited projects', '24/7 dedicated support', 'Custom integrations', 'SLA guarantee', 'SSO & SAML'],
                highlighted: false, cta: 'Contact Sales',
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl border p-8 space-y-6 relative ${
                  plan.highlighted
                    ? 'border-blue-500/50 bg-gradient-to-b from-blue-600/10 to-slate-800/50 shadow-xl shadow-blue-900/20'
                    : 'border-slate-700/60 bg-slate-800/20 hover:bg-slate-800/40 transition-colors'
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">MOST POPULAR</span>
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                  <p className="text-sm text-slate-400 mt-1">{plan.description}</p>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-white">{plan.price}</span>
                  {plan.period && <span className="text-slate-400 text-sm">{plan.period}</span>}
                </div>
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm text-slate-300">
                      <svg className="w-4 h-4 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link href="/auth/sign-up">
                  <Button
                    className={`w-full rounded-xl ${
                      plan.highlighted
                        ? 'bg-blue-600 hover:bg-blue-500 text-white'
                        : 'text-slate-200 border-slate-600 hover:bg-slate-700'
                    }`}
                    variant={plan.highlighted ? 'default' : 'outline'}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-900/40">
        <div className="max-w-3xl mx-auto space-y-10">
          <div className="text-center space-y-4">
            <p className="text-sm font-semibold text-blue-400 uppercase tracking-widest">FAQ</p>
            <h2 className="text-4xl font-bold text-white">Frequently asked questions</h2>
          </div>

          <div className="space-y-3">
            {[
              { q: 'What blockchain networks are supported?', a: 'We support Ethereum, Polygon, Base Sepolia, Base Mainnet, Arbitrum, and Optimism. More networks are added regularly.' },
              { q: 'Can I use my own OpenAI API key?', a: 'Yes! Connect your own API keys for OpenAI, Anthropic, and other providers through the API Keys section in your dashboard.' },
              { q: 'Is there a free tier?', a: 'Yes — our Starter plan is completely free with 100 AI credits per month. Perfect for learning and small projects. No credit card required.' },
              { q: 'How secure is the platform?', a: 'Enterprise-grade security with Supabase Auth, Row Level Security policies, JWT-verified API endpoints, and wallet-based authentication.' },
              { q: 'Do I need Web3 experience to use this?', a: 'No! Agunnaya AI Studio is designed for developers at all levels. The AI agents guide you through smart contract development step by step.' },
            ].map((item, idx) => (
              <details key={idx} className="group border border-slate-700/60 rounded-xl overflow-hidden">
                <summary className="flex items-center justify-between p-5 cursor-pointer bg-slate-800/20 hover:bg-slate-800/40 transition-colors list-none">
                  <span className="font-medium text-white text-sm">{item.q}</span>
                  <svg className="w-4 h-4 text-slate-400 group-open:rotate-180 transition-transform flex-shrink-0 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-5 pb-5 pt-3 bg-slate-900/40 border-t border-slate-700/40 text-sm text-slate-400 leading-relaxed">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl sm:text-5xl font-bold text-white">Ready to build the future?</h2>
            <p className="text-lg text-slate-400">
              Join thousands of developers building the next generation of Web3 applications with AI.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/auth/sign-up">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-500 text-white px-10 h-12 rounded-xl shadow-lg shadow-blue-600/20">
                Start Building Free
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button size="lg" variant="outline" className="text-slate-200 border-slate-600 hover:bg-slate-800 h-12 rounded-xl">
                Sign In
              </Button>
            </Link>
          </div>
          <p className="text-xs text-slate-600">No credit card required · Free forever on Starter plan</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/60 py-16 px-4 sm:px-6 lg:px-8 bg-slate-950">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs font-bold">A</span>
                </div>
                <span className="font-bold text-white">Agunnaya AI</span>
              </div>
              <p className="text-sm text-slate-500 max-w-xs leading-relaxed">
                The AI-native Web3 development platform. Build smarter, ship faster.
              </p>
              <div className="flex gap-3">
                {['Twitter', 'Discord', 'GitHub'].map((social) => (
                  <a key={social} href={`https://github.com/Agunnaya-Labs`} className="text-xs text-slate-600 hover:text-slate-400 transition-colors">{social}</a>
                ))}
              </div>
            </div>
            {[
              { title: 'Product', links: ['Features', 'Pricing', 'API Docs', 'Changelog'] },
              { title: 'Company', links: ['About', 'Blog', 'Careers', 'Press'] },
              { title: 'Legal', links: ['Privacy', 'Terms', 'Security', 'Cookies'] },
            ].map((col) => (
              <div key={col.title} className="space-y-4">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">{col.title}</h4>
                <ul className="space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link}><a href="#" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">{link}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-800/60 pt-8 flex flex-col sm:flex-row items-center justify-between text-slate-600 text-xs gap-4">
            <p>© 2025 Agunnaya Labs. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-slate-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-slate-400 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-slate-400 transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
