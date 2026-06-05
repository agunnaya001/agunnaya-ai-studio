import { Link } from 'wouter'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'

export default function HomePage() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-slate-900/80 backdrop-blur border-b border-slate-800' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-lg" />
            <span className="font-bold text-lg text-white">Agunnaya AI</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-slate-300 hover:text-white transition">
              Features
            </a>
            <a href="#pricing" className="text-sm text-slate-300 hover:text-white transition">
              Pricing
            </a>
            <a href="#faq" className="text-sm text-slate-300 hover:text-white transition">
              FAQ
            </a>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/auth/login">
              <Button variant="outline" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-24">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <div className="inline-block px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full">
              <span className="text-sm font-medium text-blue-300">
                AI-Native Web3 Platform
              </span>
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-200 to-blue-400">
              Build Web3 Apps with AI
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Generate code, deploy smart contracts, and build AI-powered dApps
              in minutes with Agunnaya AI Studio. The future of Web3 development
              is here.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Link href="/auth/sign-up">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-base">
                Start Building Now
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="border-slate-700 hover:bg-slate-800/50"
            >
              Watch Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-16 border-t border-slate-800">
            <div className="space-y-2">
              <p className="text-3xl font-bold text-blue-400">10,000+</p>
              <p className="text-slate-400">Active Developers</p>
            </div>
            <div className="space-y-2">
              <p className="text-3xl font-bold text-blue-400">$50M+</p>
              <p className="text-slate-400">Smart Contracts Deployed</p>
            </div>
            <div className="space-y-2">
              <p className="text-3xl font-bold text-blue-400">99.9%</p>
              <p className="text-slate-400">Uptime Guarantee</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-4xl sm:text-5xl font-bold text-white">
              Powerful Features for Developers
            </h2>
            <p className="text-xl text-slate-400">
              Everything you need to build next-generation Web3 applications
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'AI Code Generation',
                description:
                  'Generate smart contracts, backend logic, and frontend code with AI.',
                icon: '⚡',
              },
              {
                title: 'Wallet Integration',
                description:
                  'Seamless Web3 wallet authentication with RainbowKit.',
                icon: '🔐',
              },
              {
                title: 'Smart Contract Deployment',
                description:
                  'Deploy and interact with smart contracts across multiple chains.',
                icon: '📦',
              },
              {
                title: 'Real-time Collaboration',
                description:
                  'Build with your team in real-time with live code sharing.',
                icon: '👥',
              },
              {
                title: 'API Gateway',
                description:
                  'Access OpenAI, Anthropic, and other AI models from one place.',
                icon: '🔌',
              },
              {
                title: 'Analytics Dashboard',
                description:
                  'Monitor usage, costs, and performance metrics in real-time.',
                icon: '📊',
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="p-6 rounded-lg border border-slate-700 bg-slate-800/30 hover:bg-slate-800/50 transition space-y-4"
              >
                <div className="text-4xl">{feature.icon}</div>
                <h3 className="text-lg font-bold text-white">{feature.title}</h3>
                <p className="text-slate-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-4xl sm:text-5xl font-bold text-white">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-slate-400">
              Choose the perfect plan for your needs. Always free to get started.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Starter',
                price: 'Free',
                description: 'Perfect for learning',
                features: [
                  '100 AI credits/month',
                  '1 project',
                  'Community support',
                  'Basic analytics',
                ],
              },
              {
                name: 'Pro',
                price: '$29',
                period: '/month',
                description: 'For active builders',
                features: [
                  '10,000 AI credits/month',
                  'Unlimited projects',
                  'Priority support',
                  'Advanced analytics',
                  'Custom domains',
                ],
                highlighted: true,
              },
              {
                name: 'Enterprise',
                price: 'Custom',
                description: 'For teams and organizations',
                features: [
                  'Unlimited AI credits',
                  'Unlimited projects',
                  '24/7 dedicated support',
                  'Custom integrations',
                  'SLA guarantee',
                ],
              },
            ].map((plan, idx) => (
              <div
                key={idx}
                className={`rounded-lg border p-8 space-y-6 transition ${
                  plan.highlighted
                    ? 'border-blue-500/30 bg-gradient-to-b from-blue-500/10 to-slate-800/50'
                    : 'border-slate-700 bg-slate-800/30 hover:bg-slate-800/50'
                }`}
              >
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
                  <p className="text-slate-400 text-sm">{plan.description}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-4xl font-bold text-white">
                    {plan.price}
                    {plan.period && <span className="text-lg text-slate-400">{plan.period}</span>}
                  </p>
                </div>
                <ul className="space-y-3">
                  {plan.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-center gap-3 text-slate-300">
                      <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link href="/auth/sign-up">
                  <Button
                    className={`w-full ${
                      plan.highlighted
                        ? 'bg-blue-600 hover:bg-blue-700'
                        : 'border-slate-600 hover:bg-slate-700'
                    }`}
                    variant={plan.highlighted ? 'default' : 'outline'}
                  >
                    Get Started
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold text-white">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: 'What blockchain networks are supported?',
                a: 'We support Ethereum, Polygon, Solana, Base, Arbitrum, and Optimism. More networks are added regularly.',
              },
              {
                q: 'Can I use my own OpenAI API key?',
                a: 'Yes! You can connect your own API keys for OpenAI, Anthropic, and other providers through your account settings.',
              },
              {
                q: 'Is there a free tier?',
                a: 'Yes, our Starter plan is completely free with 100 AI credits per month. Perfect for learning and small projects.',
              },
              {
                q: 'How secure is the platform?',
                a: 'We use enterprise-grade security with Supabase for databases, RLS policies, and wallet integration through RainbowKit.',
              },
            ].map((item, idx) => (
              <details
                key={idx}
                className="group border border-slate-700 rounded-lg overflow-hidden"
              >
                <summary className="flex items-center justify-between p-4 cursor-pointer bg-slate-800/30 hover:bg-slate-800/50 transition">
                  <span className="font-medium text-white">{item.q}</span>
                  <svg className="w-5 h-5 text-slate-400 group-open:rotate-180 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </summary>
                <div className="p-4 bg-slate-900/50 border-t border-slate-700 text-slate-300">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="text-4xl sm:text-5xl font-bold text-white">
            Ready to build the future?
          </h2>
          <p className="text-xl text-slate-400">
            Join thousands of developers building Web3 applications with AI.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/auth/sign-up">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Start Building Free
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-slate-700 hover:bg-slate-800/50">
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-12 px-4 sm:px-6 lg:px-8 bg-slate-950/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <h4 className="font-bold text-white">Product</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#" className="hover:text-white transition">Features</a></li>
                <li><a href="#" className="hover:text-white transition">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition">API Docs</a></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold text-white">Company</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#" className="hover:text-white transition">About</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Careers</a></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold text-white">Legal</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#" className="hover:text-white transition">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms</a></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold text-white">Social</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#" className="hover:text-white transition">Twitter</a></li>
                <li><a href="#" className="hover:text-white transition">Discord</a></li>
                <li><a href="#" className="hover:text-white transition">GitHub</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between text-slate-400 text-sm">
            <p>&copy; 2024 Agunnaya AI. All rights reserved.</p>
            <div className="flex gap-6 mt-4 sm:mt-0">
              <a href="#" className="hover:text-white transition">Privacy Policy</a>
              <a href="#" className="hover:text-white transition">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
