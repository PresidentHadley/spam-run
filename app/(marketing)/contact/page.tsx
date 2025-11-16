import { ContactForm } from '@/components/marketing/ContactForm'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Contact Us - SpamRun',
  description: 'Get in touch with the SpamRun team. We\'re here to help with any questions about email deliverability.',
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Back Button */}
      <div className="container mx-auto px-4 pt-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>

      {/* Contact Form */}
      <div className="container mx-auto px-4 py-16">
        <ContactForm />
      </div>

      {/* Additional Info */}
      <div className="container mx-auto px-4 pb-16">
        <div className="max-w-2xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6 mt-12">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">Support</h3>
              <p className="text-sm text-gray-600">
                Need help with your account? Our support team is ready to assist.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">Enterprise</h3>
              <p className="text-sm text-gray-600">
                Looking for enterprise solutions? Let's discuss custom plans.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">Partnerships</h3>
              <p className="text-sm text-gray-600">
                Interested in partnering with SpamRun? We'd love to collaborate.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">Feedback</h3>
              <p className="text-sm text-gray-600">
                Have suggestions? Your feedback helps us improve SpamRun.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

