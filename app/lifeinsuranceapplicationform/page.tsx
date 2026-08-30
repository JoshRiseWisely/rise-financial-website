import { ShieldCheck, ClipboardList, Stethoscope } from 'lucide-react'
import FormEmbed from '@/components/FormEmbed'

export const metadata = {
  title: 'Life Insurance Application Data',
  description: 'Secure data collection form for your life insurance application with Rise Financial Partners.',
  robots: { index: false, follow: false },
}

export default function LifeInsuranceApplicationPage() {
  return (
    <div className="pt-20">

      <section className="relative overflow-hidden bg-rise-navy">
        <div className="absolute inset-0 bg-gradient-to-br from-rise-navy via-[#1e3557] to-rise-navy"></div>
        <div className="absolute top-10 right-0 w-[600px] h-[600px] bg-rise-blue/10 rounded-full blur-3xl"></div>
        <div className="absolute left-1/2 top-0 w-px h-40 bg-gradient-to-b from-transparent via-rise-gold/20 to-transparent"></div>

        <div className="relative max-w-4xl mx-auto px-6 lg:px-8 py-20 text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/[0.08] backdrop-blur-sm rounded-full mb-8 border border-white/10">
            <ShieldCheck className="w-4 h-4 text-rise-gold" />
            <span className="text-sm font-medium text-rise-sky">Secure Application Form</span>
          </div>

          <h1 className="font-display text-4xl md:text-5xl font-semibold text-white leading-[1.15] mb-6">
            Life Insurance <span className="text-rise-gold">Application Data</span>
          </h1>

          <p className="text-lg text-rise-sky leading-relaxed max-w-2xl mx-auto">
            The information you provide here will be used to complete your life insurance application. Please answer as accurately and completely as you can.
          </p>
        </div>
      </section>

      <section className="py-12 bg-rise-cream">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <div className="grid sm:grid-cols-3 gap-5 mb-12">
            {[
              { icon: ClipboardList, label: 'Set aside 20–30 min', detail: 'It is a long form' },
              { icon: Stethoscope, label: 'Health history needed', detail: 'Personal and family' },
              { icon: ShieldCheck, label: 'Encrypted submission', detail: '256-bit, never by email' },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-xl p-5 border border-rise-navy/5 text-center">
                <item.icon className="w-5 h-5 text-rise-gold mx-auto mb-3" />
                <p className="font-medium text-rise-navy text-sm">{item.label}</p>
                <p className="text-xs text-rise-slate mt-1">{item.detail}</p>
              </div>
            ))}
          </div>

          <div className="mb-10 rounded-xl border border-rise-navy/10 bg-white px-6 py-5">
            <p className="font-display text-lg font-semibold text-rise-navy mb-3">Before you begin</p>
            <p className="text-sm text-rise-slate leading-relaxed mb-3">
              It helps to have these on hand: your driver&apos;s license, your primary physician&apos;s name and
              practice details, a list of current medications, and — if you&apos;re setting up automatic premium
              payments — your bank routing and account numbers.
            </p>
            <p className="text-sm text-rise-slate leading-relaxed">
              Rise will never ask for this information by email or text message. Only submit it through this form or
              another channel you have confirmed directly with your advisor by phone.
            </p>
          </div>

          <FormEmbed
            formId="6628316"
            title="Rise — Life Insurance Application Data"
            minHeight={2000}
          />

          <p className="mt-10 text-xs text-rise-slate/70 text-center leading-relaxed max-w-xl mx-auto">
            Rise Financial Partners LLC is a registered investment adviser. Information submitted through this form is used solely to prepare and submit your insurance application to the selected carrier, and is handled in accordance with our privacy policy.
          </p>
        </div>
      </section>

    </div>
  )
}
