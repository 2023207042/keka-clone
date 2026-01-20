import { useState, useEffect } from "react";
import { format, parse, startOfToday, isBefore } from "date-fns";
import { RNCard } from "@/components/RNCard";
import { RNButton } from "@/components/RNButton";
import { RNSelect } from "@/components/RNSelect";
import { RNTextarea } from "@/components/RNTextarea";
import { RNAlert } from "@/components/RNAlert";
import { RNTable } from "@/components/RNTable";
import { RNBadge } from "@/components/RNBadge";
import api from "@/services/api";
import { authService } from "@/services/auth";
import { RNDatePicker } from "@/components/RNDatePicker";

function PermissionRequestPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const user = authService.getCurrentUser();

  // Form States
  const [type, setType] = useState("Late Clock In");
  const [date, setDate] = useState<Date>();
  const [reason, setReason] = useState("");
  const [msg, setMsg] = useState({ type: "", text: "" });

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await api.get(`/permissions/my-requests?userId=${user.id}`);
      setRequests(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleApply = async (e: any) => {
    e.preventDefault();
    if (!date) {
      setMsg({ type: "error", text: "Please select a date" });
      return;
    }

    if (isBefore(date, startOfToday())) {
      setMsg({ type: "error", text: "Cannot apply for past dates" });
      return;
    }

    setLoading(true);
    setMsg({ type: "", text: "" });

    try {
      await api.post("/permissions/apply", {
        userId: user.id,
        type,
        date: format(date, "yyyy-MM-dd"),
        reason,
      });
      setMsg({ type: "success", text: "Permission requested successfully" });
      fetchRequests();
      // Reset form
      setReason("");
      setDate(undefined);
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
      const date = parse(dateString, "yyyy-MM-dd", new Date());
      return format(date, "dd MMM yyyy");
    } catch (e) {
      return dateString;
    }
  };

  const columns = [
    { header: "Type", accessorKey: "type" },
    {
      header: "Date",
      accessorKey: "date",
      cell: (row: any) => formatDate(row.date),
    },
    { header: "Reason", accessorKey: "reason" },
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
      header: "Admin Remarks",
      accessorKey: "adminRemarks",
      cell: (row: any) => row.adminRemarks || "-",
    },
  ];

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center gap-4">
        <RNButton variant="ghost" onClick={() => window.history.back()}>
          ← Back
        </RNButton>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[var(--color-primary-600)] to-[var(--color-primary-400)] bg-clip-text text-transparent">
          Permission Requests
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <RNCard title="New Request">
            <form onSubmit={handleApply} className="space-y-4">
              <RNSelect
                label="Request Type"
                options={[
                  { label: "Late Clock In", value: "Late Clock In" },
                  { label: "Early Check out", value: "Early Check out" },
                ]}
                value={type}
                onChange={(e) => setType(e.target.value)}
              />
              <div>
                <label className="text-sm font-medium mb-1 block">Date</label>
                <RNDatePicker selected={date} onSelect={setDate} />
              </div>
              <RNTextarea
                label="Reason & Time"
                placeholder="e.g. Traffic delay, 10:30 AM arrival"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
              />

              {msg.text && (
                <RNAlert variant={msg.type as any}>{msg.text}</RNAlert>
              )}

              <RNButton type="submit" disabled={loading} className="w-full">
                {loading ? "Submitting..." : "Submit Request"}
              </RNButton>
            </form>
          </RNCard>
        </div>

        <div className="lg:col-span-2">
          <RNCard title="My Request History">
            <RNTable data={requests} columns={columns} />
          </RNCard>
        </div>
      </div>
    </div>
  );
}

export default PermissionRequestPage;
