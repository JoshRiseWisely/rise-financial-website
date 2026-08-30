import { Lock, Landmark, FileCheck } from 'lucide-react'
import FormEmbed from '@/components/FormEmbed'

export const metadata = {
  title: 'ACH / Bank Information Form',
  description: 'Securely share your bank account details with Rise Financial Partners for insurance applications and ACH connections to your investment accounts.',
  robots: { index: false, follow: false },
}

export default function AchFormPage() {
  return (
    <div className="pt-20">

      <section className="relative overflow-hidden bg-rise-navy">
        <div className="absolute inset-0 bg-gradient-to-br from-rise-navy via-[#1e3557] to-rise-navy"></div>
        <div className="absolute top-10 right-0 w-[600px] h-[600px] bg-rise-blue/10 rounded-full blur-3xl"></div>
        <div className="absolute left-1/2 top-0 w-px h-40 bg-gradient-to-b from-transparent via-rise-gold/20 to-transparent"></div>

        <div className="relative max-w-4xl mx-auto px-6 lg:px-8 py-20 text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/[0.08] backdrop-blur-sm rounded-full mb-8 border border-white/10">
            <Lock className="w-4 h-4 text-rise-gold" />
            <span className="text-sm font-medium text-rise-sky">Secure Submission</span>
          </div>

          <h1 className="font-display text-4xl md:text-5xl font-semibold text-white leading-[1.15] mb-6">
            ACH / Bank <span className="text-rise-gold">Information</span>
          </h1>

          <p className="text-lg text-rise-sky leading-relaxed max-w-2xl mx-auto">
            Use this form to securely share your account details for insurance applications, establishing ACH connections to your investment accounts, and similar requests.
          </p>
        </div>
      </section>

      <section className="py-12 bg-rise-cream">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <div className="grid sm:grid-cols-3 gap-5 mb-12">
            {[
              { icon: Lock, label: 'Encrypted transfer', detail: 'Never sent by email' },
              { icon: Landmark, label: 'Checking or savings', detail: 'Routing + account number' },
              { icon: FileCheck, label: 'Void check optional', detail: 'Photo or PDF upload' },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-xl p-5 border border-rise-navy/5 text-center">
                <item.icon className="w-5 h-5 text-rise-gold mx-auto mb-3" />
                <p className="font-medium text-rise-navy text-sm">{item.label}</p>
                <p className="text-xs text-rise-slate mt-1">{item.detail}</p>
              </div>
            ))}
          </div>

          <div className="mb-10 rounded-xl border border-rise-gold/30 bg-rise-gold/[0.07] px-6 py-5">
            <p className="text-sm text-rise-navy leading-relaxed">
              <strong className="font-semibold">A note on security:</strong> Rise will never ask you for your bank
              details by email or text message. Only submit this information through this form or another channel you
              have confirmed directly with your advisor by phone.
            </p>
          </div>

          <FormEmbed
            formId="6975737"
            title="ACH / Bank Info Request Form"
            minHeight={1200}
          />

          <p className="mt-10 text-xs text-rise-slate/70 text-center leading-relaxed max-w-xl mx-auto">
            Rise Financial Partners LLC is a registered investment adviser. Account information submitted through this form is used solely to establish the transfers or applications you have requested, and is handled in accordance with our privacy policy.
          </p>
        </div>
      </section>

    </div>
  )
}
