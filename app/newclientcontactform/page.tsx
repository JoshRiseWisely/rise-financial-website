import { ShieldCheck, Clock, UserCheck } from 'lucide-react'
import FormEmbed from '@/components/FormEmbed'

export const metadata = {
  title: 'New Client Data Form',
  description: 'Secure new client intake form for Rise Financial Partners. Required under Know Your Client (KYC) regulations.',
  robots: { index: false, follow: false },
}

export default function NewClientFormPage() {
  return (
    <div className="pt-20">

      <section className="relative overflow-hidden bg-rise-navy">
        <div className="absolute inset-0 bg-gradient-to-br from-rise-navy via-[#1e3557] to-rise-navy"></div>
        <div className="absolute top-10 right-0 w-[600px] h-[600px] bg-rise-blue/10 rounded-full blur-3xl"></div>
        <div className="absolute left-1/2 top-0 w-px h-40 bg-gradient-to-b from-transparent via-rise-gold/20 to-transparent"></div>

        <div className="relative max-w-4xl mx-auto px-6 lg:px-8 py-20 text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/[0.08] backdrop-blur-sm rounded-full mb-8 border border-white/10">
            <ShieldCheck className="w-4 h-4 text-rise-gold" />
            <span className="text-sm font-medium text-rise-sky">Secure Intake Form</span>
          </div>

          <h1 className="font-display text-4xl md:text-5xl font-semibold text-white leading-[1.15] mb-6">
            New Client <span className="text-rise-gold">Data Form</span>
          </h1>

          <p className="text-lg text-rise-sky leading-relaxed max-w-2xl mx-auto">
            Please take a moment to complete our new client intake form. This information is required under Know Your Client (KYC) regulations and is stored securely in our client management system.
          </p>
        </div>
      </section>

      <section className="py-12 bg-rise-cream">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <div className="grid sm:grid-cols-3 gap-5 mb-12">
            {[
              { icon: Clock, label: 'About 10 minutes', detail: 'Two short pages' },
              { icon: UserCheck, label: 'Individual or joint', detail: 'Covers both spouses' },
              { icon: ShieldCheck, label: 'Encrypted submission', detail: 'Sent directly to our system' },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-xl p-5 border border-rise-navy/5 text-center">
                <item.icon className="w-5 h-5 text-rise-gold mx-auto mb-3" />
                <p className="font-medium text-rise-navy text-sm">{item.label}</p>
                <p className="text-xs text-rise-slate mt-1">{item.detail}</p>
              </div>
            ))}
          </div>

          <FormEmbed
            formId="6625454"
            title="New Client KYC Data Form"
            minHeight={1600}
          />

          <p className="mt-10 text-xs text-rise-slate/70 text-center leading-relaxed max-w-xl mx-auto">
            Rise Financial Partners LLC is a registered investment adviser. Information submitted through this form is collected to satisfy regulatory Know Your Client requirements and is handled in accordance with our privacy policy.
          </p>
        </div>
      </section>

    </div>
  )
}
