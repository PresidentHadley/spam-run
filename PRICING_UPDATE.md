## 💰 New Pricing Structure

You'll need to create a new **Starter** product in Stripe:

### In Your Stripe Dashboard:

1. **Go to Products** → Click "Add Product"

2. **Product Name**: `Starter Plan`
   - **Price**: $9.99/month
   - **Billing**: Recurring monthly
   - **Description**: "Unlimited email checks for individual users (no API access)"

3. **Copy the Price ID** (starts with `price_...`)

4. **Add it to your env vars**:
```bash
STRIPE_STARTER_PRICE_ID=price_xxxxx
```

### Updated Pricing Tiers:

| Plan | Price | Checks/Month | API Access | Best For |
|------|-------|-------------|------------|----------|
| **Free** | $0 | 3 | ❌ | Trying out the tool |
| **Starter** | $9.99 | Unlimited | ❌ | Individual sales reps |
| **Pro** | $29 | Unlimited | ✅ 10k/mo | Developers & automation |
| **Enterprise** | $99 | Unlimited | ✅ 50k/mo | Teams & high volume |

### Why This Works:

✅ **$9.99 is impulse-buy territory** - "less than lunch"
✅ **Sales people will gladly pay** - you're living proof!
✅ **Clear upgrade path** - Free → Starter → Pro → Enterprise
✅ **Separates use cases** - Individual users vs. API integrations
✅ **3 free checks creates urgency** - They'll feel the pain & upgrade

### Next Steps:

1. Create the Starter product in Stripe
2. Add the price ID to your environment variables
3. I'll update the signup flow to handle the new plan
4. Test the upgrade flow

Want me to do step 3 now?

