import { useState, useEffect } from "react";
import { format, parse } from "date-fns";
import { RNCard } from "@/components/RNCard";
import { RNButton } from "@/components/RNButton";
import { RNSelect } from "@/components/RNSelect";
import { RNTextarea } from "@/components/RNTextarea";
import { RNAlert } from "@/components/RNAlert";
import { RNTable } from "@/components/RNTable";
import { RNBadge } from "@/components/RNBadge";
import { RNTabs } from "@/components/RNTabs";
import api from "@/services/api";
import { authService } from "@/services/auth";
import { RNDatePicker } from "@/components/RNDatePicker";
import { Eye } from "lucide-react";

function LeaveManagementPage() {
  const [leaves, setLeaves] = useState([]);
  const [balances, setBalances] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const user = authService.getCurrentUser();

  // Form States
  const [type, setType] = useState("Sick");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [reason, setReason] = useState("");
  const [msg, setMsg] = useState({ type: "", text: "" });

  // Modal State
  const [selectedLeave, setSelectedLeave] = useState<any>(null);

  useEffect(() => {
    fetchLeaves();
    fetchBalances();
  }, []);

  const fetchLeaves = async () => {
    try {
      const res = await api.get(`/leave/my-leaves?userId=${user.id}`);
      setLeaves(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchBalances = async () => {
    try {
      const res = await api.get(`/leave/balances?userId=${user.id}`);
      setBalances(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleApply = async (e: any) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      setMsg({ type: "error", text: "Please select start and end dates" });
      return;
    }

    if (startDate > endDate) {
      setMsg({
        type: "error",
        text: "Start date should not be greater than end date",
      });
      return;
    }

    setLoading(true);
    setMsg({ type: "", text: "" });

    try {
      await api.post("/leave/apply", {
        userId: user.id,
        type,
        startDate: format(startDate, "yyyy-MM-dd"),
        endDate: format(endDate, "yyyy-MM-dd"),
        reason,
      });
      setMsg({ type: "success", text: "Leave applied successfully" });
      fetchLeaves();
      // Reset form
      setReason("");
      setStartDate(undefined);
      setEndDate(undefined);
    } catch (err: any) {
      setMsg({
        type: "error",
        text: err.response?.data?.message || "Failed to apply",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      if (!dateString) return "-";
      // Parse the 'yyyy-MM-dd' string as a local date (midnight)
      const date = parse(dateString, "yyyy-MM-dd", new Date());
      return format(date, "dd MMM yyyy");
    } catch (e) {
      return dateString;
    }
  };

  const columns = [
    { header: "Type", accessorKey: "type" },
    {
      header: "From",
      accessorKey: "startDate",
      cell: (row: any) => formatDate(row.startDate),
    },
    {
      header: "To",
      accessorKey: "endDate",
      cell: (row: any) => formatDate(row.endDate),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (row: any) => (
        <RNBadge
          variant={
            row.status === "Approved"
              ? "success"
              : row.status === "Rejected"
                ? "destructive"
                : "warning"
          }
        >
          {row.status}
        </RNBadge>
      ),
    },
    {
      header: "View",
      accessorKey: "view",
      cell: (row: any) => (
        <RNButton
          variant="ghost"
          size="icon"
          onClick={() => setSelectedLeave(row)}
        >
          <Eye size={18} className="text-[var(--color-primary-600)]" />
        </RNButton>
      ),
    },
  ];

  // Simple Detail Modal
  const LeaveDetailModal = ({ leave, onClose }: any) => {
    if (!leave) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="bg-[var(--bg-card)] rounded-lg shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
          <div className="p-4 border-b flex justify-between items-center bg-[var(--color-surface-50)]">
            <h3 className="font-bold text-lg text-[var(--text-primary)]">
              Leave Details
            </h3>
            <button
              onClick={onClose}
              className="text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            >
              &times;
            </button>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-y-6 gap-x-4">
              <div>
                <label className="text-xs text-[var(--text-muted)] uppercase font-bold block mb-1">
                  Type
                </label>
                <p className="font-medium text-[var(--text-primary)]">
                  {leave.type}
                </p>
              </div>
              <div>
                <label className="text-xs text-[var(--text-muted)] uppercase font-bold block mb-1">
                  Status
                </label>
                <div className="flex">
                  <RNBadge
                    variant={
                      leave.status === "Approved"
                        ? "success"
                        : leave.status === "Rejected"
                          ? "destructive"
                          : "warning"
                    }
                  >
                    {leave.status}
                  </RNBadge>
                </div>
              </div>
              <div>
                <label className="text-xs text-[var(--text-muted)] uppercase font-bold block mb-1">
                  From
                </label>
                <p className="font-medium text-[var(--text-primary)]">
                  {formatDate(leave.startDate)}
                </p>
              </div>
              <div>
                <label className="text-xs text-[var(--text-muted)] uppercase font-bold block mb-1">
                  To
                </label>
                <p className="font-medium text-[var(--text-primary)]">
                  {formatDate(leave.endDate)}
                </p>
              </div>
            </div>
            <div>
              <label className="text-xs text-[var(--text-muted)] uppercase font-bold block mb-2">
                Reason
              </label>
              <p className="p-3 bg-[var(--color-surface-50)] rounded-md text-sm text-[var(--text-secondary)] leading-relaxed border border-[var(--border-default)]">
                {leave.reason}
              </p>
            </div>
            <div>
              <label className="text-xs text-[var(--text-muted)] uppercase font-bold block mb-2">
                Admin Remarks
              </label>
              <p className="p-3 bg-yellow-50/50 border border-yellow-100 rounded-md text-sm text-[var(--text-secondary)] min-h-[60px] leading-relaxed">
                {leave.adminRemarks || (
                  <span className="text-[var(--text-muted)] italic">
                    No remarks provided
                  </span>
                )}
              </p>
            </div>
          </div>
          <div className="p-4 border-t flex justify-end">
            <RNButton onClick={onClose}>Close</RNButton>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center gap-4">
        <RNButton variant="ghost" onClick={() => window.history.back()}>
          ← Back
        </RNButton>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[var(--color-primary-600)] to-[var(--color-primary-400)] bg-clip-text text-transparent">
          Leave Management
        </h1>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {Object.entries(balances).map(([key, val]) => (
          <RNCard key={key} className="text-center p-4">
            <h3 className="text-lg font-semibold text-[var(--text-secondary)]">
              {key}
            </h3>
            <p className="text-3xl font-bold text-[var(--color-primary-600)]">
              {val as number}
            </p>
          </RNCard>
        ))}
      </div>

      <RNCard>
        <RNTabs
          tabs={[
            {
              id: "apply",
              label: "Apply Leave",
              content: (
                <div className="pt-4">
                  <form onSubmit={handleApply} className="space-y-4 max-w-lg">
                    <RNSelect
                      label="Leave Type"
                      options={[
                        { label: "Sick Leave", value: "Sick" },
                        { label: "Casual Leave", value: "Casual" },
                        { label: "Earned Leave", value: "Earned" },
                      ]}
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-1 block">
                          Start Date
                        </label>
                        <RNDatePicker
                          selected={startDate}
                          onSelect={setStartDate}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">
                          End Date
                        </label>
                        <RNDatePicker
                          selected={endDate}
                          onSelect={setEndDate}
                        />
                      </div>
                    </div>
                    <RNTextarea
                      label="Reason"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      required
                    />

                    {msg.text && (
                      <RNAlert variant={msg.type as any}>{msg.text}</RNAlert>
                    )}

                    <RNButton type="submit" disabled={loading}>
                      {loading ? "Applying..." : "Apply Leave"}
                    </RNButton>
                  </form>
                </div>
              ),
            },
            {
              id: "history",
              label: "My Leave History",
              content: (
                <div className="pt-4">
                  <RNTable data={leaves} columns={columns} />
                </div>
              ),
            },
          ]}
        />
      </RNCard>

      {/* Detail Modal */}
      {selectedLeave && (
        <LeaveDetailModal
          leave={selectedLeave}
          onClose={() => setSelectedLeave(null)}
        />
      )}
    </div>
  );
}

export default LeaveManagementPage;
