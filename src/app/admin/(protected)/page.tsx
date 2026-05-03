export const dynamic = "force-dynamic";

import React from "react";
import {
  adminLogout,
  clearAccessForIP,
  createToken,
  deleteTokenById,
  getAdminConfig,
  listActiveAccess,
  listTokens,
  purgeSpentTokensFromForm,
  revokeTokenById,
  topUpToken,
  updateConfigFromForm,
} from "@/app/admin/actions";
import CodeInput from "@/app/admin/components/CodeInput";

const CONFIG_FIELDS = [
  { key: "daily_limit",         label: "Daily Throws",           default: "6"    },
  { key: "access_daily_limit",  label: "Access Pass Daily Cap",  default: "1000" },
  { key: "donate_access_days",  label: "Donate Access (days)",   default: "3"    },
  { key: "shirt_access_days",   label: "Shirt Access (days)",    default: "3"    },
  { key: "video_bonus_throws",  label: "Video Bonus Throws",     default: "6"    },
];

const inputCls = "bg-transparent border border-current/25 px-3 py-2 text-sm focus:outline-none focus:border-current/60";

function daysLeft(expiresAt: string, now: number): number {
  return Math.ceil((new Date(expiresAt).getTime() - now) / 86400000);
}

export default async function AdminPage() {
  const [tokens, config, activeAccess] = await Promise.all([
    listTokens(),
    getAdminConfig(),
    listActiveAccess(),
  ]);

  const now = new Date().getTime();

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col gap-10">

      {/* ── Header ──────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-widest opacity-40">ZenCloudMedia</p>
          <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
        </div>
        <form action={adminLogout}>
          <button
            type="submit"
            className="text-xs uppercase tracking-widest border border-current/30 px-4 py-2 hover:opacity-70 transition-opacity"
          >
            Logout
          </button>
        </form>
      </div>

      {/* ── Configuration ───────────────────────────────────── */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xs uppercase tracking-widest opacity-50">Configuration</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {CONFIG_FIELDS.map(({ key, label, default: def }) => (
            <form key={key} action={updateConfigFromForm} className="border border-current/20 p-4 flex flex-col gap-3">
              <input type="hidden" name="key" value={key} />
              <label className="text-[10px] uppercase tracking-widest opacity-50 leading-tight">{label}</label>
              <input
                name="value"
                type="number"
                min={0}
                defaultValue={config[key] ?? def}
                className={`${inputCls} w-full`}
              />
              <button
                type="submit"
                className="text-[10px] uppercase tracking-widest border border-current/30 px-2 py-1 hover:opacity-70 transition-opacity"
              >
                Save
              </button>
            </form>
          ))}
        </div>
      </section>

      {/* ── Active Access ───────────────────────────────────── */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xs uppercase tracking-widest opacity-50">
          Active Access <span className="opacity-40">({activeAccess.length})</span>
        </h2>
        {activeAccess.length === 0 ? (
          <p className="text-xs opacity-30">No active access grants.</p>
        ) : (
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b border-current/20 text-left">
                {["IP", "Expires", "Tier", ""].map((h) => (
                  <th key={h} className="py-2 pr-4 opacity-50 uppercase tracking-widest font-normal whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {activeAccess.map((a) => (
                <tr key={a.ip} className="border-b border-current/10">
                  <td className="py-2 pr-4 font-mono">{a.ip}</td>
                  <td className="py-2 pr-4 whitespace-nowrap">
                    {new Date(a.expires_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "2-digit" })}
                    {" "}
                    <span className="opacity-40">
                      ({daysLeft(a.expires_at, now)}d left)
                    </span>
                  </td>
                  <td className="py-2 pr-4">{a.tier}</td>
                  <td className="py-2">
                    <form action={clearAccessForIP}>
                      <input type="hidden" name="ip" value={a.ip} />
                      <button type="submit" className="text-rose-400/60 hover:text-rose-400 uppercase tracking-widest text-[10px] transition-colors">
                        Clear
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* ── Create Token ────────────────────────────────────── */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xs uppercase tracking-widest opacity-50">Create Token</h2>
        <form action={createToken} className="border border-current/20 p-6 flex flex-col gap-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Field label="Code"><CodeInput /></Field>
            <Field label="Label">
              <input name="label" placeholder="e.g. Donation May 2026" required className={inputCls} />
            </Field>
            <Field label="Type">
              <select
                name="token_type"
                className={`${inputCls} bg-[var(--background)] text-[var(--foreground)]`}
              >
                <option value="access" style={{ background: "var(--background)", color: "var(--foreground)" }}>access — multi-day</option>
                <option value="throws" style={{ background: "var(--background)", color: "var(--foreground)" }}>throws — bonus today</option>
              </select>
            </Field>
            <Field label="Grant Days">
              <input name="grant_days" type="number" min={1} placeholder="3" className={inputCls} />
            </Field>
            <Field label="Grant Throws">
              <input name="grant_throws" type="number" min={1} placeholder="6" className={inputCls} />
            </Field>
            <Field label="Max Uses">
              <input name="max_uses" type="number" min={1} placeholder="1" className={inputCls} />
            </Field>
            <Field label="Expires At">
              <input name="expires_at" type="date" className={inputCls} />
            </Field>
          </div>
          <button
            type="submit"
            className="self-start border border-current px-6 py-2 text-xs uppercase tracking-widest hover:opacity-70 transition-opacity"
          >
            Create Token
          </button>
        </form>
      </section>

      {/* ── Token Table ─────────────────────────────────────── */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <h2 className="text-xs uppercase tracking-widest opacity-50">
            Tokens <span className="opacity-40">({tokens.length})</span>
          </h2>
          <form action={purgeSpentTokensFromForm} className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-widest opacity-40 whitespace-nowrap">
              Purge spent older than
            </span>
            <input
              name="days"
              type="number"
              min={1}
              defaultValue={7}
              className="w-14 bg-transparent border border-current/25 px-2 py-1 text-xs text-center focus:outline-none focus:border-current/50"
            />
            <span className="text-[10px] uppercase tracking-widest opacity-40">days</span>
            <button
              type="submit"
              className="text-[10px] uppercase tracking-widest border border-rose-400/40 text-rose-400/70 px-3 py-1 hover:border-rose-400/70 hover:text-rose-400 transition-colors whitespace-nowrap"
            >
              Purge
            </button>
          </form>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b border-current/20 text-left">
                {["Code", "Label", "Type", "Grant", "Uses", "Expires", "Status", "Actions"].map((h) => (
                  <th key={h} className="py-2 pr-4 opacity-50 uppercase tracking-widest font-normal whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tokens.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-8 text-center opacity-30">No tokens yet.</td>
                </tr>
              )}
              {tokens.map((t) => {
                const isExpired = !!t.expires_at && new Date(t.expires_at) < new Date();
                const isSpent   = t.max_uses != null && t.use_count >= t.max_uses;
                const isDead    = !t.active || isExpired || isSpent;
                const statusLabel =
                  !t.active             ? { text: "Inactive", cls: "opacity-30"        } :
                  isExpired             ? { text: "Expired",  cls: "text-amber-400/70" } :
                  isSpent && t.activeAccessUntil
                                        ? { text: `Access until ${new Date(t.activeAccessUntil).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`, cls: "text-emerald-400" } :
                  isSpent               ? { text: "Used",     cls: "opacity-40"        } :
                                          { text: "Active",   cls: "text-emerald-400"  };
                return (
                <React.Fragment key={t.id}>
                  {/* Main row */}
                  <tr className={`border-b border-current/10 ${isDead ? "opacity-40" : ""}`}>
                    <td className="py-2 pr-4 font-mono whitespace-nowrap">{t.code}</td>
                    <td className="py-2 pr-4">{t.label}</td>
                    <td className="py-2 pr-4">{t.token_type}</td>
                    <td className="py-2 pr-4 whitespace-nowrap">
                      {t.token_type === "access"
                        ? `${t.grant_days ?? "—"}d`
                        : `+${t.grant_throws ?? "—"} throws`}
                    </td>
                    <td className="py-2 pr-4 whitespace-nowrap">
                      {t.use_count}{t.max_uses != null ? `/${t.max_uses}` : ""}
                    </td>
                    <td className="py-2 pr-4 whitespace-nowrap">
                      {t.expires_at
                        ? new Date(t.expires_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "2-digit" })
                        : "—"}
                    </td>
                    <td className={`py-2 pr-4 whitespace-nowrap font-medium ${statusLabel.cls}`}>
                      {statusLabel.text}
                    </td>
                    <td className="py-2 pr-4">
                      <div className="flex gap-3 items-center">
                        {t.active && (
                          <form action={revokeTokenById}>
                            <input type="hidden" name="id" value={t.id} />
                            <button type="submit" className="opacity-40 hover:opacity-100 uppercase tracking-widest transition-opacity">
                              Revoke
                            </button>
                          </form>
                        )}
                        <form action={deleteTokenById}>
                          <input type="hidden" name="id" value={t.id} />
                          <button type="submit" className="opacity-40 hover:opacity-100 text-rose-400 uppercase tracking-widest transition-opacity">
                            Del
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>

                  {/* Top-up row */}
                  <tr className="border-b border-current/10 bg-current/[0.02]">
                    <td colSpan={8} className="pb-3 pt-1 px-2">
                      <details>
                        <summary className="cursor-pointer text-[10px] uppercase tracking-widest opacity-30 hover:opacity-70 transition-opacity select-none w-fit">
                          Top Up
                        </summary>
                        <form action={topUpToken} className="mt-2 flex flex-wrap items-end gap-3">
                          <input type="hidden" name="id" value={t.id} />
                          {t.token_type === "throws" ? (
                            <Field label="New Grant Throws">
                              <input
                                name="grant_throws"
                                type="number"
                                min={1}
                                defaultValue={t.grant_throws ?? 6}
                                className={`${inputCls} w-28`}
                              />
                            </Field>
                          ) : (
                            <Field label="New Grant Days">
                              <input
                                name="grant_days"
                                type="number"
                                min={1}
                                defaultValue={t.grant_days ?? 3}
                                className={`${inputCls} w-28`}
                              />
                            </Field>
                          )}
                          <label className="flex items-center gap-2 text-[10px] uppercase tracking-widest opacity-60 mb-2 cursor-pointer">
                            <input type="checkbox" name="reactivate" defaultChecked />
                            Reactivate
                          </label>
                          <label className="flex items-center gap-2 text-[10px] uppercase tracking-widest opacity-60 mb-2 cursor-pointer">
                            <input type="checkbox" name="reset_ips" />
                            Reset IPs
                          </label>
                          <button
                            type="submit"
                            className="border border-current/40 px-4 py-2 text-[10px] uppercase tracking-widest hover:opacity-70 transition-opacity mb-0.5"
                          >
                            Update
                          </button>
                        </form>
                      </details>
                    </td>
                  </tr>
                </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[10px] uppercase tracking-widest opacity-50">{label}</label>
      {children}
    </div>
  );
}
