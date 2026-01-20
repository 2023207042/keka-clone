import { useState, useEffect } from "react";
import { RNCard } from "@/components/RNCard";
import { RNButton } from "@/components/RNButton";
import { RNTable } from "@/components/RNTable";
import { RNAlert } from "@/components/RNAlert";
import { RNBadge } from "@/components/RNBadge";
import { RNTabs } from "@/components/RNTabs";
import { RNTextarea } from "@/components/RNTextarea";
import api from "@/services/api";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

function PermissionApprovals() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [activeTab, setActiveTab] = useState("Pending");
  const [msg, setMsg] = useState({ type: "", text: "" });

  // Modal State
  const [actionModal, setActionModal] = useState<{
    isOpen: boolean;
    request: any;
    action: "Approved" | "Rejected" | null;
  }>({
    isOpen: false,
    request: null,
    action: null,
  });
  const [remarks, setRemarks] = useState("");

  useEffect(() => {
    fetchRequests(activeTab);
  }, [activeTab]);

  const fetchRequests = async (status: string) => {
    try {
      const res = await api.get(
        `/permissions/all?status=${status === "All History" ? "All" : status}`,
      );
      setRequests(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const openActionModal = (request: any, action: "Approved" | "Rejected") => {
    setRemarks("");
    setActionModal({ isOpen: true, request, action });
  };

  const handleConfirmAction = async () => {
    if (actionModal.action === "Rejected" && !remarks.trim()) {
      alert("Remarks are required for rejection explanation.");
      return;
    }

    try {
      await api.post(`/permissions/${actionModal.request.id}/status`, {
        status: actionModal.action,
        remarks: remarks,
      });
      setMsg({
        type: "success",
        text: `Request ${actionModal.action} successfully`,
      });
      setActionModal({ isOpen: false, request: null, action: null });
      fetchRequests(activeTab);
    } catch (err: any) {
      setMsg({ type: "error", text: "Action failed" });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const columns = [
    { header: "Employee", accessorKey: "userName" },
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
      header: "Actions",
      accessorKey: "actions",
      cell: (row: any) =>
        row.status === "Pending" ? (
          <div className="flex gap-2">
            <RNButton
              size="xs"
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={() => openActionModal(row, "Approved")}
            >
              Approve
            </RNButton>
            <RNButton
              size="xs"
              variant="destructive"
              onClick={() => openActionModal(row, "Rejected")}
            >
              Reject
            </RNButton>
          </div>
        ) : (
          <span className="text-gray-400 text-xs">-</span>
        ),
    },
  ];

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center gap-4">
        <RNButton variant="ghost" onClick={() => navigate("/admin/dashboard")}>
          <ArrowLeft className="w-5 h-5 mr-2" /> Back
        </RNButton>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[var(--color-primary-600)] to-[var(--color-primary-400)] bg-clip-text text-transparent">
          Permission Approvals
        </h1>
      </div>

      {msg.text && <RNAlert variant={msg.type as any}>{msg.text}</RNAlert>}

      <RNCard>
        <RNTabs
          defaultActive="Pending"
          onValueChange={(id) => setActiveTab(id)}
          tabs={[
            {
              id: "Pending",
              label: "Pending Requests",
              content: (
                <div className="pt-4">
                  <RNTable data={requests} columns={columns} />
                </div>
              ),
            },
            {
              id: "Approved",
              label: "Approved",
              content: (
                <div className="pt-4">
                  <RNTable data={requests} columns={columns} />
                </div>
              ),
            },
            {
              id: "Rejected",
              label: "Rejected",
              content: (
                <div className="pt-4">
                  <RNTable data={requests} columns={columns} />
                </div>
              ),
            },
            {
              id: "All History",
              label: "All History",
              content: (
                <div className="pt-4">
                  <RNTable data={requests} columns={columns} />
                </div>
              ),
            },
          ]}
        />
      </RNCard>

      {actionModal.isOpen && actionModal.request && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div
            className={`bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200 border-t-4 ${actionModal.action === "Rejected" ? "border-red-500" : "border-green-500"}`}
          >
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">
                {actionModal.action === "Rejected"
                  ? "Reject Request"
                  : "Approve Request"}
              </h3>
              <p className="text-gray-500 mb-6">
                You are about to{" "}
                {actionModal.action === "Rejected" ? "reject" : "approve"} the
                request for{" "}
                <span className="font-semibold text-gray-800">
                  {actionModal.request.userName}
                </span>
                .
              </p>

              <RNTextarea
                label={
                  actionModal.action === "Rejected"
                    ? "Reason for Rejection (Required)"
                    : "Remarks (Optional)"
                }
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Add remarks..."
                className="mb-6"
              />

              <div className="flex justify-end gap-3">
                <RNButton
                  variant="outline"
                  onClick={() =>
                    setActionModal({ ...actionModal, isOpen: false })
                  }
                >
                  Cancel
                </RNButton>
                <RNButton
                  variant={
                    actionModal.action === "Rejected" ? "destructive" : "solid"
                  }
                  className={
                    !(actionModal.action === "Rejected")
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : ""
                  }
                  onClick={handleConfirmAction}
                >
                  Confirm {actionModal.action}
                </RNButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PermissionApprovals;
