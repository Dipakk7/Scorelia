import React from 'react'
import { CreditCard, Sparkles, Receipt, ArrowUpRight, CheckCircle2 } from 'lucide-react'
import { SettingsCategoryLayout } from './SettingsCategoryLayout'
import { SettingsCategorySection } from './SettingsCategorySection'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table'
import { settingsCategoriesMockData } from './settingsCategoriesMockData'

export const BillingSettings: React.FC = () => {
  const billing = settingsCategoriesMockData.billing

  return (
    <SettingsCategoryLayout
      icon={<CreditCard className="w-5 h-5 text-[var(--primary)]" />}
      title="Billing & Subscription"
      subtitle="Manage your current plan, payment methods, invoice receipts, and subscription renewal."
      badge="Active Pro Plan"
      badgeVariant="success"
      actions={
        <Button size="sm" className="gap-1.5 h-8 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          Upgrade Workspace Plan
        </Button>
      }
    >
      {/* 1. Current Subscription Plan */}
      <SettingsCategorySection
        title="Current Plan Details"
        description={`Renews on ${billing.nextBillingDate} via ${billing.billingCycle}.`}
        icon={<Sparkles className="w-4 h-4 text-indigo-400" />}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg bg-[var(--primary)]/10 border border-[var(--primary)]/30">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-[var(--heading)]">
                {billing.planName}
              </h3>
              <Badge variant="success" className="text-[10px] bg-emerald-500/15 text-emerald-400">
                <CheckCircle2 className="w-3 h-3 mr-1 inline" />
                Active Subscription
              </Badge>
            </div>
            <p className="text-xs text-[var(--muted)]">
              Includes unlimited AI Agent workflows, 5,000 monthly credits, 50 GB storage, and priority support.
            </p>
          </div>
          <div className="text-left sm:text-right shrink-0">
            <span className="text-2xl font-bold text-[var(--heading)] font-mono">
              {billing.planPrice}
            </span>
            <span className="text-[11px] text-[var(--muted)] block font-sans">
              Billed yearly
            </span>
          </div>
        </div>
      </SettingsCategorySection>

      {/* 2. Payment Method */}
      <SettingsCategorySection
        title="Payment Method"
        description="Primary credit card used for recurring renewal charges."
        icon={<CreditCard className="w-4 h-4" />}
        action={
          <Button size="sm" variant="outline" className="text-xs h-8">
            Update Payment Card
          </Button>
        }
      >
        <div className="flex items-center justify-between p-3.5 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-indigo-500/10 text-indigo-400 font-bold font-mono">
              {billing.paymentMethod.cardBrand}
            </div>
            <div>
              <p className="font-semibold text-[var(--heading)]">
                •••• •••• •••• {billing.paymentMethod.last4}
              </p>
              <p className="text-[11px] text-[var(--muted)]">
                Expires {billing.paymentMethod.expiry}
              </p>
            </div>
          </div>
          <Badge variant="info" className="text-[10px]">
            Default Payment Method
          </Badge>
        </div>
      </SettingsCategorySection>

      {/* 3. Invoice History */}
      <SettingsCategorySection
        title="Invoice History"
        description="Download previous billing receipts and tax invoices."
        icon={<Receipt className="w-4 h-4" />}
      >
        <div className="overflow-x-auto border rounded-lg border-[var(--border)] bg-[var(--surface)]">
          <Table>
            <TableHeader>
              <TableRow className="border-[var(--border)]/40 text-xs">
                <TableHead>Invoice ID</TableHead>
                <TableHead>Billing Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Receipt</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {billing.invoices.map((inv) => (
                <TableRow key={inv.id} className="border-[var(--border)]/30 text-xs font-sans">
                  <TableCell className="font-mono font-semibold text-[var(--heading)]">
                    {inv.id}
                  </TableCell>
                  <TableCell className="text-[var(--muted)]">{inv.date}</TableCell>
                  <TableCell className="font-mono font-bold text-[var(--heading)]">
                    {inv.amount}
                  </TableCell>
                  <TableCell>
                    <Badge variant="success" className="text-[10px] bg-emerald-500/15 text-emerald-400">
                      {inv.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="ghost" className="text-[11px] h-7 gap-1">
                      PDF <ArrowUpRight className="w-3 h-3" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SettingsCategorySection>
    </SettingsCategoryLayout>
  )
}

export default BillingSettings
