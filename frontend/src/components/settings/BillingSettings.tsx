import React from 'react'
import { CreditCard, Sparkles, Receipt, ArrowUpRight, CheckCircle2, HardDrive, Cpu, FileText, Zap } from 'lucide-react'
import { SettingsCategoryLayout } from './SettingsCategoryLayout'
import { SettingsCategorySection } from './SettingsCategorySection'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table'
import { settingsCategoriesMockData } from './settingsCategoriesMockData'
import { accountOverviewMockData } from './accountOverviewMockData'

export const BillingSettings: React.FC = () => {
  const billing = settingsCategoriesMockData.billing
  const usage = accountOverviewMockData.usage

  return (
    <SettingsCategoryLayout
      icon={<CreditCard className="w-5 h-5 text-purple-400" />}
      title="Billing & Subscription"
      subtitle="Manage your current plan, payment methods, invoice receipts, and subscription renewal."
      badge="Active Premium Pro"
      badgeVariant="success"
      actions={
        <Button size="sm" className="gap-1.5 h-8.5 text-xs font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-md shadow-purple-950/40">
          <Sparkles className="w-3.5 h-3.5" />
          Upgrade Workspace Plan
        </Button>
      }
    >
      {/* 1. Current Subscription Plan */}
      <SettingsCategorySection
        title="Current Plan Details"
        description={`Renews on ${billing.nextBillingDate} via ${billing.billingCycle}.`}
        icon={<Sparkles className="w-4 h-4 text-purple-400" />}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-purple-950/30 via-[#14162a] to-indigo-950/30 border border-purple-500/30 shadow-xl font-sans">
          <div className="space-y-1.5 min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h3 className="text-lg font-bold text-white tracking-tight font-sans">
                {billing.planName}
              </h3>
              <Badge variant="success" className="text-[10px] bg-emerald-500/15 text-emerald-400 border-emerald-500/30 font-semibold px-2 py-0.5">
                <CheckCircle2 className="w-3 h-3 mr-1 inline" />
                Active Subscription
              </Badge>
            </div>
            <p className="text-xs text-slate-300 font-medium font-sans leading-relaxed">
              Includes unlimited AI Agent workflows, 5,000 monthly credits, 50 GB storage, and priority support.
            </p>
          </div>
          <div className="text-left sm:text-right shrink-0">
            <span className="text-2xl sm:text-3xl font-bold text-white font-mono">
              {billing.planPrice}
            </span>
            <span className="text-[11px] text-slate-400 block font-sans font-medium">
              Billed yearly
            </span>
          </div>
        </div>
      </SettingsCategorySection>

      {/* 2. Workspace Resource Usage & Limits */}
      <SettingsCategorySection
        title="Monthly Resource Usage & Limits"
        description={`Current credit utilization for your workspace. ${usage.resetDaysText}.`}
        icon={<Zap className="w-4 h-4 text-purple-400" />}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-sans">
          {usage.metrics.map((m) => (
            <div key={m.id} className="p-4 rounded-xl bg-[#0d0f1e]/80 border border-white/10 space-y-2 text-left">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300 font-sans">{m.label}</span>
                <span className="font-mono font-bold text-purple-400 text-[11px]">{m.percentage}%</span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-white/5">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${m.colorClass}`}
                  style={{ width: `${m.percentage}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
                <span>{m.used} used</span>
                <span>{m.total} total</span>
              </div>
            </div>
          ))}
        </div>
      </SettingsCategorySection>

      {/* 3. Payment Method */}
      <SettingsCategorySection
        title="Payment Method"
        description="Primary credit card used for recurring renewal charges."
        icon={<CreditCard className="w-4 h-4 text-purple-400" />}
        action={
          <Button size="sm" variant="outline" className="text-xs h-8 font-medium">
            Update Payment Card
          </Button>
        }
      >
        <div className="flex items-center justify-between p-4 rounded-xl bg-[#0d0f1e]/80 border border-white/10 text-xs font-sans">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 font-bold font-mono border border-purple-500/20 text-sm">
              {billing.paymentMethod.cardBrand}
            </div>
            <div>
              <p className="font-bold text-white font-sans">
                •••• •••• •••• {billing.paymentMethod.last4}
              </p>
              <p className="text-[11px] text-slate-400 font-medium font-sans">
                Expires {billing.paymentMethod.expiry}
              </p>
            </div>
          </div>
          <Badge variant="info" className="text-[10px] font-semibold px-2 py-0.5">
            Default Payment Method
          </Badge>
        </div>
      </SettingsCategorySection>

      {/* 4. Invoice History */}
      <SettingsCategorySection
        title="Invoice History"
        description="Download previous billing receipts and tax invoices."
        icon={<Receipt className="w-4 h-4 text-purple-400" />}
      >
        <div className="overflow-x-auto border rounded-xl border-white/10 bg-[#0d0f1e]/80">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 text-xs">
                <TableHead className="text-slate-400 font-bold">Invoice ID</TableHead>
                <TableHead className="text-slate-400 font-bold">Billing Date</TableHead>
                <TableHead className="text-slate-400 font-bold">Amount</TableHead>
                <TableHead className="text-slate-400 font-bold">Status</TableHead>
                <TableHead className="text-right text-slate-400 font-bold">Receipt</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {billing.invoices.map((inv) => (
                <TableRow key={inv.id} className="border-white/10 text-xs font-sans hover:bg-white/5">
                  <TableCell className="font-mono font-bold text-white">
                    {inv.id}
                  </TableCell>
                  <TableCell className="text-slate-400">{inv.date}</TableCell>
                  <TableCell className="font-mono font-bold text-white">
                    {inv.amount}
                  </TableCell>
                  <TableCell>
                    <Badge variant="success" className="text-[10px] bg-emerald-500/15 text-emerald-400 border-emerald-500/30 font-semibold">
                      {inv.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="ghost" className="text-[11px] h-7 gap-1 text-purple-300 hover:text-white font-medium">
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
