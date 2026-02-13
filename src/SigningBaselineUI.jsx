import React, { useMemo, useState } from "react";
import {
  CheckCircle2,
  Circle,
  FileText,
  ShieldCheck,
  PenTool,
  Type,
  Calendar,
  MousePointer2,
  ChevronRight,
  ChevronLeft,
  Download,
  Share2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";

function cx(...args) {
  return args.filter(Boolean).join(" ");
}

const TOOL = {
  SELECT: "select",
  SIGN_APPEARANCE: "signatureAppearance",
  INITIALS: "initials",
  DATE: "date",
  TEXT: "text",
};

const STATUS = {
  PENDING: "Pending",
  READY: "Ready to Sign",
  COMPLETED: "Completed",
};

const identityStates = {
  VERIFIED: { label: "Identity: Verified", icon: ShieldCheck, tone: "success" },
  REQUIRED: { label: "Identity: Required", icon: ShieldCheck, tone: "warning" },
};

export default function SigningBaselineUI() {
  const [activeTool, setActiveTool] = useState(TOOL.SELECT);
  const [activeDocId, setActiveDocId] = useState("loan");
  const [reviewOpen, setReviewOpen] = useState(false);
  const [consentChecked, setConsentChecked] = useState(false);

  const [docs, setDocs] = useState([
    {
      id: "loan",
      title: "Loan Agreement",
      pages: 3,
      status: STATUS.PENDING,
      required: [
        {
          id: "sig1",
          type: "Signature appearance",
          page: 3,
          label: "Signature",
          done: false,
        },
        {
          id: "ini1",
          type: "Initials field",
          page: 3,
          label: "Initials",
          done: false,
        },
        {
          id: "dat1",
          type: "Date field",
          page: 3,
          label: "Date",
          done: false,
        },
      ],
    },
    {
      id: "evidence",
      title: "Confirmation of Evidence Provided",
      pages: 2,
      status: STATUS.READY,
      required: [],
      readOnly: true,
      kind: "Evidence",
    },
    {
      id: "terms",
      title: "General Terms & Conditions",
      pages: 1,
      status: STATUS.PENDING,
      required: [
        {
          id: "ini2",
          type: "Initials field",
          page: 1,
          label: "Initials",
          done: false,
        },
      ],
    },
  ]);

  const identity = identityStates.VERIFIED;

  const activeDoc = useMemo(
    () => docs.find((d) => d.id === activeDocId) || docs[0],
    [docs, activeDocId]
  );

  const totals = useMemo(() => {
    const totalDocs = docs.length;
    const completedDocs = docs.filter((d) => d.status === STATUS.COMPLETED).length;

    const allReq = docs.flatMap((d) => d.required || []);
    const totalReq = allReq.length;
    const doneReq = allReq.filter((r) => r.done).length;

    return {
      totalDocs,
      completedDocs,
      totalReq,
      doneReq,
      progressPct:
        totalReq > 0
          ? Math.round((doneReq / totalReq) * 100)
          : Math.round((completedDocs / totalDocs) * 100),
    };
  }, [docs]);

  const requiredOpen = useMemo(() => {
    return (activeDoc.required || []).filter((r) => !r.done);
  }, [activeDoc]);

  const canContinue = useMemo(() => {
    const allReq = docs.flatMap((d) => d.required || []);
    return allReq.length === 0 ? true : allReq.every((r) => r.done);
  }, [docs]);

  function markNextRequiredDone() {
    const next = requiredOpen[0];
    if (!next) return;
    setDocs((prev) =>
      prev.map((d) => {
        if (d.id !== activeDocId) return d;
        return {
          ...d,
          required: d.required.map((r) =>
            r.id === next.id ? { ...r, done: true } : r
          ),
          status: d.required.every((r) => (r.id === next.id ? true : r.done))
            ? STATUS.COMPLETED
            : d.status,
        };
      })
    );
  }

  function openReview() {
    setConsentChecked(false);
    setReviewOpen(true);
  }

  function finalizeSigning() {
    setReviewOpen(false);
  }

  const ToolButton = ({ id, icon: Icon, label }) => (
    <Button
      variant={activeTool === id ? "default" : "outline"}
      size="sm"
      onClick={() => setActiveTool(id)}
      className="gap-2"
    >
      <Icon className="h-4 w-4" />
      {label}
    </Button>
  );

  return (
    <div className="min-h-screen bg-muted/40">
      <div className="sticky top-0 z-20 bg-background border-b">
        <div className="mx-auto max-w-[1400px] px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <FileText className="h-5 w-5" />
            </div>
            <div className="leading-tight">
              <div className="text-sm text-muted-foreground">YourCompany</div>
              <div className="font-semibold">Loan Agreement</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge
              variant="secondary"
              className={cx(
                "gap-2",
                identity.tone === "success" &&
                  "border border-emerald-500/30 bg-emerald-500/10",
                identity.tone === "warning" &&
                  "border border-amber-500/30 bg-amber-500/10"
              )}
            >
              <identity.icon className="h-4 w-4" />
              {identity.label}
            </Badge>

            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" /> Download
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Share2 className="h-4 w-4" /> Share
            </Button>

            <Button size="sm" disabled={!canContinue} onClick={openReview}>
              {canContinue ? "Continue signing" : "Complete required fields"}
            </Button>
          </div>
        </div>

        <div className="mx-auto max-w-[1400px] px-4 pb-3">
          <div className="flex items-center justify-between gap-3">
            <div className="text-xs text-muted-foreground">
              Progress: {totals.doneReq}/{totals.totalReq} required fields completed
            </div>
            <div className="w-72">
              <Progress value={totals.progressPct} />
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-4 py-5 grid grid-cols-12 gap-4">
        <div className="col-span-12 md:col-span-3">
          <Card className="rounded-2xl">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-semibold">Documents to Sign</div>
                  <div className="text-sm text-muted-foreground">
                    {docs.length} documents
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">
                  {totals.progressPct}%
                </Badge>
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                {docs.map((d) => {
                  const remaining = (d.required || []).filter((r) => !r.done).length;
                  const isActive = d.id === activeDocId;
                  const statusTone =
                    d.status === STATUS.COMPLETED
                      ? "bg-emerald-500/10 border-emerald-500/30"
                      : d.status === STATUS.READY
                        ? "bg-sky-500/10 border-sky-500/30"
                        : "bg-violet-500/10 border-violet-500/30";

                  return (
                    <button
                      key={d.id}
                      onClick={() => setActiveDocId(d.id)}
                      className={cx(
                        "w-full text-left rounded-xl border p-3 transition",
                        isActive
                          ? "border-primary shadow-sm bg-background"
                          : "bg-background/60 hover:bg-background"
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="font-medium">{d.title}</div>
                          <div className="text-xs text-muted-foreground">
                            {d.pages} page{d.pages === 1 ? "" : "s"}
                            {d.readOnly ? " • Read-only" : ""}
                            {d.kind ? ` • ${d.kind}` : ""}
                          </div>
                        </div>

                        {d.status === STATUS.COMPLETED ? (
                          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                        ) : (
                          <Circle className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>

                      <div className="mt-2 flex items-center justify-between gap-2">
                        <span className={cx("text-xs px-2 py-1 rounded-full border", statusTone)}>
                          {d.status}
                        </span>
                        {!d.readOnly && (
                          <span className="text-xs text-muted-foreground">
                            {remaining > 0 ? `${remaining} required` : "No fields"}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              <Separator className="my-4" />

              <Button variant="outline" className="w-full">
                Add Document(s)
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="col-span-12 md:col-span-9">
          <Card className="rounded-2xl">
            <CardContent className="p-4">
              <div className="flex flex-wrap items-center gap-2">
                <ToolButton id={TOOL.SELECT} icon={MousePointer2} label="Select" />
                <ToolButton
                  id={TOOL.SIGN_APPEARANCE}
                  icon={PenTool}
                  label="Signature appearance"
                />
                <ToolButton id={TOOL.INITIALS} icon={Type} label="Initials field" />
                <ToolButton id={TOOL.DATE} icon={Calendar} label="Date field" />

                <div className="ml-auto flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="gap-2"
                    disabled={requiredOpen.length === 0 || activeDoc.readOnly}
                    onClick={markNextRequiredDone}
                    title={requiredOpen.length ? `Next: ${requiredOpen[0].label}` : "No required fields"}
                  >
                    Next required <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {!activeDoc.readOnly && (
                <div className="mt-3 rounded-xl border bg-muted/30 p-3 flex items-center justify-between gap-3">
                  <div className="text-sm">
                    <span className="font-medium">Required fields:</span>{" "}
                    <span className="text-muted-foreground">
                      {requiredOpen.length > 0
                        ? requiredOpen.map((r) => `${r.label} (p.${r.page})`).join(" • ")
                        : "All fields completed for this document"}
                    </span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {requiredOpen.length} remaining
                  </Badge>
                </div>
              )}

              <div className="mt-4 rounded-2xl border bg-background overflow-hidden">
                <div className="p-6 md:p-10 bg-muted/20">
                  <div className="mx-auto max-w-[760px] bg-white rounded-xl shadow-sm border p-8 md:p-10 relative">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-sm text-muted-foreground">LOAN AGREEMENT</div>
                        <div className="mt-3 space-y-2 text-sm text-slate-800">
                          <p>
                            This Loan Agreement ("Agreement") is entered into as of{" "}
                            <span className="font-medium">5 February 2026</span>, between:
                          </p>
                          <p>
                            <span className="font-medium">Lender:</span> YourCompany Financial Services A/S
                            <br />
                            <span className="font-medium">Address:</span> Øster Allé 56, 2100 København Ø,
                            Denmark
                          </p>
                          <p>
                            <span className="font-medium">Borrower:</span> Lars Mikkelsen
                            <br />
                            <span className="font-medium">Address:</span> Nørrebrogade 142, 2200 København N,
                            Denmark
                          </p>
                        </div>
                      </div>
                      <div className="h-14 w-14 rounded-full bg-violet-100 flex items-center justify-center font-semibold text-violet-700">
                        YC
                      </div>
                    </div>

                    <Separator className="my-6" />

                    <div className="space-y-3 text-sm text-slate-800">
                      <p>
                        <span className="font-medium">1. Loan Amount and Purpose</span>
                        <br />
                        The Lender agrees to provide the Borrower with a loan in the principal amount of
                        €20,000.00.
                      </p>
                      <p>
                        <span className="font-medium">2. Interest Rate</span>
                        <br />
                        The loan shall bear interest at a fixed rate of 4.5% per annum.
                      </p>
                      <p>
                        <span className="font-medium">6. Governing Law</span>
                        <br />
                        This Agreement shall be governed by and construed in accordance with the laws of
                        Denmark.
                      </p>
                    </div>

                    {!activeDoc.readOnly && (
                      <div className="mt-8 space-y-3">
                        {activeDoc.required.map((r) => (
                          <div
                            key={r.id}
                            className={cx(
                              "rounded-xl border-2 border-dashed p-4 flex items-center justify-between",
                              r.done
                                ? "border-emerald-500/50 bg-emerald-500/10"
                                : "border-violet-500/40 bg-violet-500/10"
                            )}
                          >
                            <div className="flex items-center gap-2">
                              {r.done ? (
                                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                              ) : (
                                <Circle className="h-5 w-5 text-violet-700" />
                              )}
                              <div>
                                <div className="text-sm font-medium">{r.label}</div>
                                <div className="text-xs text-muted-foreground">{r.type}</div>
                              </div>
                            </div>

                            <Button
                              size="sm"
                              variant={r.done ? "outline" : "default"}
                              onClick={() => {
                                setDocs((prev) =>
                                  prev.map((d) => {
                                    if (d.id !== activeDocId) return d;
                                    const updated = d.required.map((x) =>
                                      x.id === r.id ? { ...x, done: !x.done } : x
                                    );
                                    const allDone = updated.length
                                      ? updated.every((x) => x.done)
                                      : d.status === STATUS.COMPLETED;
                                    return {
                                      ...d,
                                      required: updated,
                                      status: allDone ? STATUS.COMPLETED : STATUS.PENDING,
                                    };
                                  })
                                );
                              }}
                            >
                              {r.done ? "Undo" : "Mark placed"}
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="px-4 py-3 border-t bg-background flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">
                    {activeDoc.title} • Page 1 of {activeDoc.pages}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline">
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={reviewOpen} onOpenChange={setReviewOpen}>
        <DialogContent className="sm:max-w-[680px] rounded-2xl">
          <DialogHeader>
            <DialogTitle>Review & confirm</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <div className="text-sm text-muted-foreground">
              You’re about to finalize the signing operation for the following documents:
            </div>

            <div className="space-y-2">
              {docs.map((d) => (
                <div key={d.id} className="rounded-xl border p-3 flex items-start justify-between">
                  <div>
                    <div className="font-medium">{d.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {d.pages} page{d.pages === 1 ? "" : "s"} • {d.readOnly ? "Read-only" : "Will be signed"}
                    </div>
                  </div>
                  <Badge variant="secondary">{d.readOnly ? "Excluded" : "Included"}</Badge>
                </div>
              ))}
            </div>

            <div className="flex items-start gap-3 pt-2">
              <Checkbox
                checked={consentChecked}
                onCheckedChange={(v) => setConsentChecked(Boolean(v))}
              />
              <div className="text-sm">
                I confirm I intend to proceed with the signing operation for the included documents.
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setReviewOpen(false)}>
              Cancel
            </Button>
            <Button onClick={finalizeSigning} disabled={!consentChecked}>
              Finalize signing
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
