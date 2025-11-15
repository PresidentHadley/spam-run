import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getBlogPost, blogPosts } from '@/lib/blog-posts'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, ArrowLeft, ArrowRight } from 'lucide-react'
import { Card } from '@/components/ui/card'

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = getBlogPost(params.slug)
  
  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  return {
    title: `${post.title} | SPAMRUN Blog`,
    description: post.excerpt,
    keywords: post.tags.join(', '),
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
    },
  }
}

// Full blog post content
const blogContent: Record<string, JSX.Element> = {
  'why-emails-go-to-spam': (
    <>
      <p className="lead text-xl text-muted-foreground mb-6">
        Your carefully crafted email campaigns are ready. You've spent hours perfecting the copy, designing the layout, and building your list. You hit send... and silence. Why? Because your emails are going to spam instead of inbox.
      </p>

      <p>
        According to recent data, nearly <strong>20% of legitimate marketing emails never reach the inbox</strong>. They're automatically filtered to spam folders where they'll likely never be seen. For businesses, this is devastating—it means lost sales, missed opportunities, and wasted marketing budget.
      </p>

      <p>
        But here's the good news: email deliverability isn't magic. There are specific, identifiable reasons why emails go to spam, and once you understand them, you can fix them. Let's dive into the 12 most common reasons emails end up in spam folders.
      </p>

      <h2>The 12 Main Reasons Emails Go to Spam (And How to Fix Them)</h2>

      <h3>1. You're Using Spam Trigger Words</h3>
      <p>
        Spam filters scan your email content for words and phrases commonly used in spam. While no single word will automatically doom your email, using multiple spam triggers significantly increases your spam score.
      </p>
      
      <p><strong>Common spam trigger words include:</strong></p>
      <ul>
        <li>"FREE" in all caps or repeated multiple times</li>
        <li>"ACT NOW" or other urgency phrases</li>
        <li>"CLICK HERE" or "CLICK BELOW"</li>
        <li>"Make money fast" or income promises</li>
        <li>"Limited time offer" when overused</li>
        <li>"Congratulations, you've won"</li>
        <li>"No credit card required"</li>
        <li>Excessive use of dollar signs ($$$)</li>
      </ul>

      <p><strong>How to fix it:</strong> Use natural, conversational language. Instead of "FREE TRIAL - ACT NOW!", try "Start your trial today". Tools like SPAMRUN can analyze your content and flag spam trigger words before you send.</p>

      <h3>2. Missing or Broken Unsubscribe Link</h3>
      <p>
        This is non-negotiable. The CAN-SPAM Act (in the US) and GDPR (in Europe) require that commercial emails include a clear, working unsubscribe link. Missing this isn't just bad practice—it's illegal.
      </p>

      <p><strong>Why it matters:</strong> When recipients can't unsubscribe, they mark your email as spam instead. This devastates your sender reputation. Every spam complaint tells email providers that you're sending unwanted mail.</p>

      <p><strong>How to fix it:</strong></p>
      <ul>
        <li>Always include an unsubscribe link in the footer</li>
        <li>Make it easy to find (don't hide it in tiny gray text)</li>
        <li>Test your unsubscribe link before every campaign</li>
        <li>Process unsubscribe requests within 10 days (legal requirement)</li>
        <li>Don't require login to unsubscribe</li>
      </ul>

      <h3>3. Poor Sender Reputation</h3>
      <p>
        Your sender reputation is like a credit score for email. Internet Service Providers (ISPs) like Gmail, Outlook, and Yahoo track your sending history. If you've sent spam before, if recipients frequently mark your emails as spam, or if you have high bounce rates, your reputation suffers.
      </p>

      <p><strong>What damages sender reputation:</strong></p>
      <ul>
        <li>High spam complaint rates (even 0.1% is too high)</li>
        <li>High bounce rates (sending to invalid addresses)</li>
        <li>Sudden spikes in sending volume</li>
        <li>Low engagement (nobody opens or clicks)</li>
        <li>Being listed on spam blacklists</li>
      </ul>

      <p><strong>How to fix it:</strong></p>
      <ul>
        <li>Clean your email list regularly (remove inactive subscribers)</li>
        <li>Use double opt-in to verify subscribers</li>
        <li>Never buy or rent email lists</li>
        <li>Warm up new domains gradually</li>
        <li>Monitor your sender reputation using tools like Google Postmaster</li>
        <li>Respond quickly to feedback loops</li>
      </ul>

      <h3>4. Missing Email Authentication (SPF, DKIM, DMARC)</h3>
      <p>
        Email authentication protocols prove that you're actually who you say you are. Without them, you look like a scammer trying to impersonate a legitimate business.
      </p>

      <p><strong>The three critical authentication protocols:</strong></p>
      <ul>
        <li><strong>SPF (Sender Policy Framework):</strong> Lists which mail servers are allowed to send email from your domain</li>
        <li><strong>DKIM (DomainKeys Identified Mail):</strong> Adds a digital signature to your emails</li>
        <li><strong>DMARC (Domain-based Message Authentication):</strong> Tells receiving servers what to do if SPF or DKIM fails</li>
      </ul>

      <p><strong>How to fix it:</strong> Set up all three authentication protocols in your DNS records. If you're using an email service provider (ESP) like Mailchimp, SendGrid, or Postmark, they'll provide instructions. This is technical but absolutely critical.</p>

      <h3>5. You're Sending from a Purchased Email List</h3>
      <p>
        Buying email lists is tempting—instant access to thousands of contacts! But it's a fast track to spam folders and damaged reputation.
      </p>

      <p><strong>Why purchased lists fail:</strong></p>
      <ul>
        <li>Recipients never opted in to receive your emails</li>
        <li>They'll mark you as spam immediately</li>
        <li>Many addresses are outdated or fake (high bounce rates)</li>
        <li>It violates CAN-SPAM and GDPR regulations</li>
        <li>ESPs will ban your account if they discover purchased lists</li>
      </ul>

      <p><strong>How to fix it:</strong> Build your list organically. Yes, it takes longer, but engaged subscribers who actually want to hear from you are worth 100x more than purchased contacts who'll never convert.</p>

      <h3>6. Poor HTML-to-Text Ratio</h3>
      <p>
        Spam filters analyze the balance between images and text in your email. Emails that are all image with little text look suspicious—spammers often use this technique to hide their message from filters.
      </p>

      <p><strong>Red flags:</strong></p>
      <ul>
        <li>A single large image with no text</li>
        <li>Using images instead of text for your message</li>
        <li>Embedded text in images that can't be read by filters</li>
      </ul>

      <p><strong>How to fix it:</strong> Aim for a healthy balance—at least 60% text to 40% images. Always include alt text for images. Consider: if images don't load, can recipients still understand your message?</p>

      <h3>7. Misleading or Clickbait Subject Lines</h3>
      <p>
        If your subject line promises one thing but your email delivers something else, spam filters notice. More importantly, recipients notice and mark you as spam.
      </p>

      <p><strong>Examples of misleading subject lines:</strong></p>
      <ul>
        <li>"Re: Your order" when there is no order</li>
        <li>"Your account has been suspended" (scare tactics)</li>
        <li>"Payment failed" when it's actually a sales pitch</li>
        <li>Claiming something is urgent when it isn't</li>
      </ul>

      <p><strong>How to fix it:</strong> Be honest. Your subject line should accurately reflect your email content. Build trust, not tricks.</p>

      <h3>8. Too Many Links</h3>
      <p>
        Spam emails often include dozens of links. Spam filters count links, and too many can trigger filtering.
      </p>

      <p><strong>Best practices for links:</strong></p>
      <ul>
        <li>Limit to 3-5 links per email</li>
        <li>Make sure all links go to the same domain (inconsistent domains look suspicious)</li>
        <li>Use HTTPS, not HTTP</li>
        <li>Avoid URL shorteners (they hide the destination)</li>
        <li>Test all links before sending</li>
      </ul>

      <h3>9. Sending Too Fast (No Email Warm-up)</h3>
      <p>
        Imagine a brand new email address suddenly blasting 10,000 emails in an hour. That screams "spammer!" to ISPs.
      </p>

      <p><strong>Why warm-up matters:</strong></p>
      <ul>
        <li>New domains have no reputation</li>
        <li>Sudden volume spikes look suspicious</li>
        <li>ISPs throttle or block bulk sends from new senders</li>
      </ul>

      <p><strong>How to fix it:</strong> Warm up new domains gradually:</p>
      <ul>
        <li>Day 1-7: Send to 50-100 of your most engaged subscribers</li>
        <li>Week 2: Double your volume</li>
        <li>Week 3-4: Continue doubling until you reach full volume</li>
        <li>Monitor bounce and spam complaint rates closely</li>
      </ul>

      <h3>10. No Physical Mailing Address</h3>
      <p>
        The CAN-SPAM Act requires that commercial emails include a valid physical mailing address. This can be your business address or a PO Box.
      </p>

      <p><strong>How to fix it:</strong> Add your business address to your email footer. Most email templates include a footer section specifically for this.</p>

      <h3>11. Low Engagement Rates</h3>
      <p>
        Gmail and other providers track engagement. If nobody opens or clicks your emails, they assume recipients don't want them and start filtering them to spam.
      </p>

      <p><strong>Engagement signals that matter:</strong></p>
      <ul>
        <li>Open rates</li>
        <li>Click rates</li>
        <li>Time spent reading</li>
        <li>Replies</li>
        <li>Moving emails out of spam</li>
        <li>Adding sender to contacts</li>
      </ul>

      <p><strong>How to fix it:</strong></p>
      <ul>
        <li>Send to engaged subscribers only</li>
        <li>Remove subscribers who haven't opened in 90+ days</li>
        <li>Send relevant, valuable content</li>
        <li>Optimize send times for your audience</li>
        <li>Write compelling subject lines</li>
        <li>Encourage replies (Gmail loves this)</li>
      </ul>

      <h3>12. Inconsistent or Sporadic Sending</h3>
      <p>
        Sending sporadically—radio silence for months, then suddenly blasting emails—looks suspicious to ISPs and confuses subscribers.
      </p>

      <p><strong>Why consistency matters:</strong></p>
      <ul>
        <li>Subscribers forget they signed up</li>
        <li>ISPs see sudden spikes as spam behavior</li>
        <li>Inactive addresses bounce or mark as spam</li>
      </ul>

      <p><strong>How to fix it:</strong> Maintain a consistent sending schedule. Whether it's weekly, bi-weekly, or monthly, stick to it. If you haven't sent in a while, re-engage carefully with a "we miss you" campaign.</p>

      <h2>How to Test Your Emails Before Sending</h2>

      <p>
        The best way to avoid spam folders is to test your emails before you send them to your entire list. This is exactly what SPAMRUN does.
      </p>

      <p><strong>What to test for:</strong></p>
      <ul>
        <li>Spam trigger words in subject and body</li>
        <li>Missing unsubscribe links</li>
        <li>Poor HTML structure</li>
        <li>Too many links or images</li>
        <li>Authentication issues</li>
        <li>Broken links</li>
        <li>Overall spam score</li>
      </ul>

      <h2>Gmail-Specific Tips</h2>

      <p>
        Since Gmail handles over 1.5 billion email accounts, it's worth understanding Gmail's specific spam filtering:
      </p>

      <ul>
        <li><strong>Gmail heavily weights engagement:</strong> If users frequently ignore or delete your emails, Gmail learns and starts filtering to spam</li>
        <li><strong>Gmail watches for "mass" emails:</strong> Identical emails sent to many recipients get scrutinized more</li>
        <li><strong>Gmail loves conversations:</strong> Emails that generate replies are favored. Try asking questions!</li>
        <li><strong>Promotions tab isn't spam:</strong> Landing in Promotions is okay—it's still the inbox</li>
      </ul>

      <h2>Outlook and Yahoo-Specific Tips</h2>

      <p><strong>Outlook/Microsoft 365:</strong></p>
      <ul>
        <li>Very strict about authentication (SPF, DKIM, DMARC required)</li>
        <li>Monitors sender reputation through Microsoft SNDS</li>
        <li>Heavily weights user complaints</li>
      </ul>

      <p><strong>Yahoo:</strong></p>
      <ul>
        <li>Requires DMARC to avoid bulk folder</li>
        <li>Watches for engagement (opens, clicks)</li>
        <li>Strict about sending from @yahoo.com addresses through third-party services</li>
      </ul>

      <h2>The Bottom Line: Test Every Email</h2>

      <p>
        Email deliverability isn't mysterious—it follows predictable patterns. The companies that consistently reach the inbox all do one thing: <strong>they test their emails before sending</strong>.
      </p>

      <p>
        Don't let your hard work end up in spam folders. Check your emails for spam triggers, authentication issues, and deliverability problems before you hit send.
      </p>

      <div className="my-8 p-6 bg-muted rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Quick Checklist: Before You Send Any Email</h3>
        <ul className="space-y-2">
          <li>✅ Unsubscribe link present and working</li>
          <li>✅ Physical address in footer</li>
          <li>✅ SPF, DKIM, DMARC configured</li>
          <li>✅ Subject line is honest and clear</li>
          <li>✅ Content has good text-to-image ratio</li>
          <li>✅ No excessive spam trigger words</li>
          <li>✅ 5 or fewer links</li>
          <li>✅ All links tested and working</li>
          <li>✅ Sending from a warmed-up domain</li>
          <li>✅ List is clean (no purchased contacts)</li>
        </ul>
      </div>
    </>
  ),

  'email-spam-trigger-words': (
    <>
      <p className="lead text-xl text-muted-foreground mb-6">
        One word can be the difference between inbox and spam folder. While spam filters have become more sophisticated, they still scan for specific words and phrases that commonly appear in spam emails.
      </p>

      <p>
        But here's what most people get wrong: <strong>spam trigger words don't automatically doom your email</strong>. It's the combination, context, and frequency that matters. Using "free" once isn't a problem. Using "FREE!!!" three times with "ACT NOW" and "CLICK HERE" absolutely is.
      </p>

      <h2>How Spam Filters Actually Work</h2>

      <p>
        Modern spam filters use a scoring system. Every element of your email—subject line, content, images, links, authentication—gets scored. Spam trigger words add points to your spam score. Reach a certain threshold, and you're filtered to spam.
      </p>

      <p>
        This means you can use some trigger words if everything else is clean. Perfect authentication, good sender reputation, and high engagement can offset a few risky words.
      </p>

      <h2>200+ Spam Trigger Words to Avoid in 2025</h2>

      <h3>Money & Financial Spam Words</h3>
      <p>These words trigger filters because they're commonly used in financial scams:</p>
      <ul>
        <li>Free money, Cash bonus, Extra income</li>
        <li>Make money fast, Get paid, Earn extra cash</li>
        <li>$$$, $$$$, Multiple dollar signs</li>
        <li>Credit card offers, Refinance, Consolidate debt</li>
        <li>Nigerian prince (obvious, but yes, still used!)</li>
        <li>Casino, Lottery, Prize, Winner</li>
        <li>Investment opportunity, Double your income</li>
        <li>Pennies a day, Affordable deal</li>
        <li>Hidden charges, No fees, No hidden costs</li>
        <li>Check or money order, Wire transfer</li>
      </ul>

      <h3>Urgency & Pressure Words</h3>
      <p>Spammers create false urgency. These phrases raise red flags:</p>
      <ul>
        <li>Act now, Limited time, Urgent</li>
        <li>Don't delete, Don't miss out</li>
        <li>Expire, Expires today, Ending soon</li>
        <li>Offer expires, Once in lifetime</li>
        <li>Only X left, Running out</li>
        <li>Time sensitive, Urgent response needed</li>
        <li>What are you waiting for, Apply now</li>
        <li>Do it today, This won't last</li>
      </ul>

      <h3>"Free" & Gift Words</h3>
      <p>Nothing triggers spam filters quite like "free" (especially in all caps):</p>
      <ul>
        <li>Free (especially "FREE" or "FREE!!!")</li>
        <li>Free access, Free consultation, Free gift</li>
        <li>Free trial, Free preview, Free quote</li>
        <li>Absolutely free, Totally free</li>
        <li>Gift certificate, Free bonus</li>
        <li>Prize, Winner, Congratulations</li>
        <li>Get it free, Free investment, Free leads</li>
      </ul>

      <h3>Action & Command Words</h3>
      <p>Overly aggressive calls-to-action look spammy:</p>
      <ul>
        <li>Click here, Click below, Click now</li>
        <li>Call now, Order now, Buy now</li>
        <li>Subscribe here, Sign up free</li>
        <li>Visit our website, Check it out</li>
        <li>Get started now, Apply online</li>
        <li>Requires initial investment, Join millions</li>
      </ul>

      <h3>Exaggeration & Hype Words</h3>
      <p>Over-the-top claims are classic spam indicators:</p>
      <ul>
        <li>Amazing, Incredible, Unbelievable</li>
        <li>Groundbreaking, Revolutionary, Miracle</li>
        <li>Once in a lifetime, Never before</li>
        <li>Guaranteed, 100% guaranteed, No risk</li>
        <li>Best price, Lowest price, Best rates</li>
        <li>Outstanding values, Exclusive deal</li>
        <li>You won't believe, Can't live without</li>
      </ul>

      <h3>Spam Phrases (Combinations That Kill)</h3>
      <p>These multi-word phrases are especially problematic:</p>
      <ul>
        <li>"Dear friend" (generic greetings)</li>
        <li>"This is not spam"</li>
        <li>"Congratulations, you've been selected"</li>
        <li>"You have been chosen"</li>
        <li>"No credit card required"</li>
        <li>"Cancel at any time"</li>
        <li>"Risk-free"</li>
        <li>"Satisfaction guaranteed"</li>
        <li>"As seen on"</li>
        <li>"Click to remove" or "Click to opt-out"</li>
      </ul>

      <h2>Formatting Red Flags</h2>

      <p>It's not just words—how you format them matters:</p>

      <ul>
        <li><strong>ALL CAPS:</strong> Writing in all caps looks aggressive and spammy</li>
        <li><strong>Multiple exclamation marks!!!</strong> One is enthusiasm. Three is spam.</li>
        <li><strong>Excessive punctuation?!?!</strong> Don't do this.</li>
        <li><strong>Red text or unusual colors</strong> in bulk</li>
        <li><strong>Giant font sizes</strong> for emphasis</li>
        <li><strong>Strings of symbols:</strong> $$$ !!! *** ###</li>
      </ul>

      <h2>Industry-Specific Trigger Words</h2>

      <h3>For B2B/Sales Emails:</h3>
      <ul>
        <li>Exclusive deal, Limited offer</li>
        <li>Compare rates, Lowest price</li>
        <li>Apply online, Order status</li>
      </ul>

      <h3>For E-commerce:</h3>
      <ul>
        <li>Clearance, Liquidation</li>
        <li>Shop now, Buy direct</li>
        <li>Online pharmacy, Valium, Xanax (medication names)</li>
      </ul>

      <h3>For Marketing:</h3>
      <ul>
        <li>Dear [friend/someone]</li>
        <li>This isn't spam</li>
        <li>Your income, Extra income</li>
      </ul>

      <h2>What to Use Instead: Spam-Safe Alternatives</h2>

      <p>Here's how to communicate the same ideas without triggering filters:</p>

      <table className="w-full my-6">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2">❌ Spam Trigger</th>
            <th className="text-left py-2">✅ Better Alternative</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b">
            <td className="py-2">FREE TRIAL - ACT NOW!</td>
            <td className="py-2">Start your trial today</td>
          </tr>
          <tr className="border-b">
            <td className="py-2">Click here to claim prize</td>
            <td className="py-2">See what you've earned</td>
          </tr>
          <tr className="border-b">
            <td className="py-2">100% guaranteed lowest price</td>
            <td className="py-2">Competitive pricing available</td>
          </tr>
          <tr className="border-b">
            <td className="py-2">URGENT: Limited time offer!!!</td>
            <td className="py-2">This week's featured offer</td>
          </tr>
          <tr className="border-b">
            <td className="py-2">Make money fast</td>
            <td className="py-2">Increase your revenue</td>
          </tr>
          <tr className="border-b">
            <td className="py-2">No credit card required</td>
            <td className="py-2">Easy signup process</td>
          </tr>
        </tbody>
      </table>

      <h2>Context Matters More Than Individual Words</h2>

      <p>
        Here's the truth: you CAN use words like "free" successfully. Companies like Apple, Amazon, and Netflix do it all the time. The difference? Context and reputation.
      </p>

      <p><strong>Safe ways to use trigger words:</strong></p>
      <ul>
        <li>Use sentence case, not ALL CAPS</li>
        <li>Use them sparingly (once per email max)</li>
        <li>Pair them with professional, well-written content</li>
        <li>Have strong email authentication</li>
        <li>Maintain good sender reputation</li>
        <li>Send to engaged subscribers who want to hear from you</li>
      </ul>

      <h2>Test Your Content Before Sending</h2>

      <p>
        The smartest approach? Test every email before sending it to your full list. SPAMRUN analyzes your content and flags spam trigger words, giving you a chance to rewrite before you damage your sender reputation.
      </p>

      <div className="my-8 p-6 bg-muted rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Quick Spam Word Checklist</h3>
        <ul className="space-y-2">
          <li>✅ No ALL CAPS words in subject line</li>
          <li>✅ Maximum one exclamation mark</li>
          <li>✅ No "free" in all caps</li>
          <li>✅ Avoid urgency phrases (act now, limited time)</li>
          <li>✅ No excessive money claims</li>
          <li>✅ Professional, conversational tone</li>
          <li>✅ Honest subject line that matches content</li>
        </ul>
      </div>
    </>
  ),

  'improve-email-deliverability': (
    <>
      <p className="lead text-xl text-muted-foreground mb-6">
        Email deliverability determines whether your emails reach the inbox or vanish into spam folders. It's the single most important metric for email success—because it doesn't matter how great your email is if nobody sees it.
      </p>

      <p>
        The good news? Email deliverability follows clear, predictable rules. Master these 15 strategies, and you'll consistently reach the inbox.
      </p>

      <h2>1. Authenticate Your Email Domain (SPF, DKIM, DMARC)</h2>

      <p>
        Email authentication is non-negotiable. These three protocols prove you're a legitimate sender:
      </p>

      <ul>
        <li><strong>SPF (Sender Policy Framework):</strong> Lists which mail servers can send on behalf of your domain</li>
        <li><strong>DKIM (DomainKeys Identified Mail):</strong> Adds a digital signature to your emails</li>
        <li><strong>DMARC (Domain-based Message Authentication):</strong> Tells receiving servers what to do if authentication fails</li>
      </ul>

      <p><strong>Implementation:</strong> Add DNS records provided by your email service provider. This is technical but critical—Gmail and other providers heavily penalize unauthenticated emails.</p>

      <h2>2. Build Your List Organically (Never Buy Lists)</h2>

      <p>
        Purchased email lists destroy deliverability. Recipients didn't opt in, so they mark you as spam. This damages your sender reputation permanently.
      </p>

      <p><strong>Instead, build your list through:</strong></p>
      <ul>
        <li>Website signup forms with clear value propositions</li>
        <li>Lead magnets (ebooks, templates, tools)</li>
        <li>Double opt-in to confirm subscriber interest</li>
        <li>Social media conversions</li>
        <li>Event registrations</li>
      </ul>

      <h2>3. Use Double Opt-In</h2>

      <p>
        Double opt-in requires subscribers to confirm their email address by clicking a link. This:
      </p>

      <ul>
        <li>Verifies email addresses are real and active</li>
        <li>Confirms genuine interest (they took two actions to subscribe)</li>
        <li>Reduces bounces and spam complaints</li>
        <li>Protects against fake signups</li>
      </ul>

      <p>Yes, it reduces list size slightly. But engaged subscribers are worth 100x more than fake ones.</p>

      <h2>4. Warm Up New Domains and IP Addresses</h2>

      <p>
        Sending thousands of emails from a brand new domain screams "spammer!" to ISPs. You need to establish reputation gradually.
      </p>

      <p><strong>Warm-up schedule:</strong></p>
      <ul>
        <li><strong>Week 1:</strong> Send to 50-100 of your most engaged subscribers</li>
        <li><strong>Week 2:</strong> Double your volume (100-200)</li>
        <li><strong>Week 3:</strong> Double again (200-400)</li>
        <li><strong>Week 4:</strong> Continue doubling weekly</li>
        <li><strong>Weeks 5-8:</strong> Gradually increase to full volume</li>
      </ul>

      <p>Monitor bounce rates and spam complaints closely during warm-up.</p>

      <h2>5. Maintain a Consistent Sending Schedule</h2>

      <p>
        Sporadic sending confuses subscribers and ISPs. Radio silence for three months, then suddenly blasting emails? That looks suspicious.
      </p>

      <p><strong>Best practices:</strong></p>
      <ul>
        <li>Send on a predictable schedule (weekly, bi-weekly, monthly)</li>
        <li>Avoid sudden volume spikes</li>
        <li>If you haven't sent in a while, re-engage gradually</li>
        <li>Maintain volume even during off-seasons</li>
      </ul>

      <h2>6. Clean Your Email List Regularly</h2>

      <p>
        Dead weight on your list kills deliverability. Inactive subscribers drag down your engagement rates, signaling to ISPs that your emails aren't wanted.
      </p>

      <p><strong>Cleaning process:</strong></p>
      <ul>
        <li>Remove hard bounces immediately</li>
        <li>Remove subscribers who haven't opened in 6+ months</li>
        <li>Run re-engagement campaigns first ("Do you still want to hear from us?")</li>
        <li>Remove persistent non-openers</li>
        <li>Validate email addresses before importing</li>
      </ul>

      <h2>7. Segment Your Audience for Relevance</h2>

      <p>
        Sending the same email to everyone results in low engagement. ISPs notice when recipients consistently ignore or delete your emails.
      </p>

      <p><strong>Segment by:</strong></p>
      <ul>
        <li>Engagement level (highly engaged vs. inactive)</li>
        <li>Purchase history</li>
        <li>Interests and preferences</li>
        <li>Geographic location</li>
        <li>Customer lifecycle stage</li>
      </ul>

      <p>Relevant emails get opened. High open rates improve deliverability.</p>

      <h2>8. Write Compelling Subject Lines (Without Spam Triggers)</h2>

      <p>
        Your subject line determines whether subscribers open or ignore your email. Low open rates signal to ISPs that your emails aren't valuable.
      </p>

      <p><strong>Subject line best practices:</strong></p>
      <ul>
        <li>Keep it under 50 characters</li>
        <li>Personalize when possible</li>
        <li>Be specific and clear</li>
        <li>Avoid ALL CAPS and excessive punctuation!!!</li>
        <li>Don't use misleading clickbait</li>
        <li>A/B test to find what resonates</li>
      </ul>

      <h2>9. Optimize Content for Engagement</h2>

      <p>
        Gmail, Outlook, and Yahoo track how subscribers interact with your emails. Strong engagement signals improve deliverability.
      </p>

      <p><strong>Engagement signals that matter:</strong></p>
      <ul>
        <li>Opens and clicks</li>
        <li>Time spent reading</li>
        <li>Replies (Gmail especially loves this)</li>
        <li>Forwarding to others</li>
        <li>Adding sender to contacts</li>
        <li>Moving from Promotions to Primary inbox</li>
      </ul>

      <p><strong>To boost engagement:</strong></p>
      <ul>
        <li>Write valuable, relevant content</li>
        <li>Include clear calls-to-action</li>
        <li>Encourage replies ("Hit reply and let me know...")</li>
        <li>Make emails scannable with headers and bullet points</li>
        <li>Optimize for mobile (60%+ of emails are opened on phones)</li>
      </ul>

      <h2>10. Monitor and Improve Sender Reputation</h2>

      <p>
        Your sender reputation is like a credit score for email. ISPs track it, and it determines whether you reach the inbox.
      </p>

      <p><strong>Tools to monitor sender reputation:</strong></p>
      <ul>
        <li>Google Postmaster Tools (for Gmail deliverability)</li>
        <li>Microsoft SNDS (for Outlook)</li>
        <li>Sender Score (free tool from Validity)</li>
        <li>Check blacklists regularly</li>
      </ul>

      <p><strong>What damages sender reputation:</strong></p>
      <ul>
        <li>Spam complaints (even 0.1% is too high)</li>
        <li>High bounce rates</li>
        <li>Low engagement</li>
        <li>Sudden sending volume spikes</li>
        <li>Sending to spam traps (fake addresses set by ISPs)</li>
      </ul>

      <h2>11. Provide Easy, Obvious Unsubscribe Options</h2>

      <p>
        Making it hard to unsubscribe backfires. Frustrated subscribers mark you as spam instead, which is far worse than an unsubscribe.
      </p>

      <p><strong>Best practices:</strong></p>
      <ul>
        <li>Include unsubscribe link in every email footer</li>
        <li>Make it one-click (no login required)</li>
        <li>Don't hide it in tiny gray text</li>
        <li>Process unsubscribes within 10 days (legal requirement)</li>
        <li>Consider a preference center instead of all-or-nothing</li>
      </ul>

      <h2>12. Balance Text and Images</h2>

      <p>
        Image-only emails raise red flags. Spammers use them to hide content from filters.
      </p>

      <p><strong>Best ratio:</strong> 60% text, 40% images</p>

      <p><strong>Additional tips:</strong></p>
      <ul>
        <li>Always include alt text for images</li>
        <li>Test how your email looks with images disabled</li>
        <li>Don't embed critical text in images</li>
        <li>Optimize image file sizes for fast loading</li>
      </ul>

      <h2>13. Limit Links and Check for Broken URLs</h2>

      <p>
        Spam emails often include dozens of links. Limit yours to 3-5 high-quality links.
      </p>

      <p><strong>Link best practices:</strong></p>
      <ul>
        <li>All links should go to the same domain</li>
        <li>Use HTTPS (not HTTP)</li>
        <li>Avoid URL shorteners (they hide destinations)</li>
        <li>Test every link before sending</li>
        <li>Check that your domain isn't on spam blacklists</li>
      </ul>

      <h2>14. Test Before You Send</h2>

      <p>
        Professional email marketers test every campaign before sending to their full list. This catches issues before they damage your reputation.
      </p>

      <p><strong>What to test:</strong></p>
      <ul>
        <li>Spam score and trigger words</li>
        <li>How email renders across devices and email clients</li>
        <li>All links working correctly</li>
        <li>Images loading properly</li>
        <li>Unsubscribe link functioning</li>
        <li>Personalization tokens populating correctly</li>
      </ul>

      <p>SPAMRUN lets you test emails instantly, identifying issues before you hit send.</p>

      <h2>15. Monitor Deliverability Metrics</h2>

      <p>
        You can't improve what you don't measure. Track these metrics religiously:
      </p>

      <ul>
        <li><strong>Bounce rate:</strong> Should be under 2%</li>
        <li><strong>Spam complaint rate:</strong> Should be under 0.1%</li>
        <li><strong>Open rate:</strong> Varies by industry; 20-30% is typical</li>
        <li><strong>Click rate:</strong> 2-5% is standard</li>
        <li><strong>Unsubscribe rate:</strong> Under 0.5% is healthy</li>
        <li><strong>Inbox placement rate:</strong> Track with seed lists</li>
      </ul>

      <h2>The Bottom Line</h2>

      <p>
        Email deliverability isn't luck—it's a system. Companies that consistently reach the inbox follow these practices religiously. They authenticate properly, maintain list hygiene, send relevant content, and test before sending.
      </p>

      <p>
        Start implementing these strategies today, and you'll see your inbox placement rates climb.
      </p>
    </>
  ),
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getBlogPost(params.slug)
  
  if (!post) {
    notFound()
  }

  const currentIndex = blogPosts.findIndex(p => p.slug === params.slug)
  const previousPost = currentIndex > 0 ? blogPosts[currentIndex - 1] : null
  const nextPost = currentIndex < blogPosts.length - 1 ? blogPosts[currentIndex + 1] : null

  return (
    <div className="container py-12">
      <article className="mx-auto max-w-3xl">
        {/* Back to blog */}
        <Link href="/blog" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to blog
        </Link>

        {/* Post header */}
        <header className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Badge>{post.category}</Badge>
            {post.featured && <Badge variant="secondary">Featured</Badge>}
          </div>
          
          <h1 className="text-4xl font-bold tracking-tight mb-4">{post.title}</h1>
          
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {new Date(post.date).toLocaleDateString('en-US', { 
                month: 'long', 
                day: 'numeric', 
                year: 'numeric' 
              })}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {post.readTime}
            </div>
            <div>By {post.author}</div>
          </div>
        </header>

        {/* Post content */}
        <div className="prose prose-lg max-w-none prose-headings:font-bold prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-4 prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-3 prose-p:mb-4 prose-ul:my-4 prose-li:my-2">
          {blogContent[params.slug] || (
            <div>
              <p>{post.excerpt}</p>
              <p className="text-muted-foreground italic">Full article content coming soon...</p>
            </div>
          )}
        </div>

        {/* Tags */}
        <div className="mt-8 pt-8 border-t">
          <div className="flex flex-wrap gap-2">
            {post.tags.map(tag => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* CTA */}
        <Card className="mt-12 p-8 bg-gradient-to-r from-purple-50 to-blue-50 border-2">
          <h3 className="text-2xl font-bold mb-2">Ready to Improve Your Email Deliverability?</h3>
          <p className="text-muted-foreground mb-6">
            Check your emails for spam triggers before sending. Get instant analysis and actionable recommendations. Start with 3 free checks—no credit card required.
          </p>
          <Link href="/signup">
            <Button size="lg">Try SPAMRUN Free</Button>
          </Link>
        </Card>

        {/* Previous/Next navigation */}
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {previousPost && (
            <Link href={`/blog/${previousPost.slug}`}>
              <Card className="p-6 hover:border-primary transition-colors h-full">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <ArrowLeft className="h-4 w-4" />
                  Previous Article
                </div>
                <h4 className="font-semibold">{previousPost.title}</h4>
              </Card>
            </Link>
          )}
          {nextPost && (
            <Link href={`/blog/${nextPost.slug}`} className={previousPost ? '' : 'md:col-start-2'}>
              <Card className="p-6 hover:border-primary transition-colors h-full">
                <div className="flex items-center justify-end gap-2 text-sm text-muted-foreground mb-2">
                  Next Article
                  <ArrowRight className="h-4 w-4" />
                </div>
                <h4 className="font-semibold text-right">{nextPost.title}</h4>
              </Card>
            </Link>
          )}
        </div>
      </article>
    </div>
  )
}
