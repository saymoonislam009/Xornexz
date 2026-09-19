"use client";

import { useEffect, useState } from "react";
import { X, Building, Mail, Phone, Clock, FileText, ChevronRight } from "lucide-react";

interface LeadDetailProps {
  leadId: string | null;
  onClose: () => void;
  onUpdate: () => void;
}

export default function LeadDetail({ leadId, onClose, onUpdate }: LeadDetailProps) {
  const [lead, setLead] = useState<any /* eslint-disable-line @typescript-eslint/no-explicit-any */>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (leadId) {
      setLoading(true);
      fetch(`/api/admin/leads/${leadId}`)
        .then((res) => res.json())
        .then((data) => {
          setLead(data);
          setLoading(false);
        });
    }
  }, [leadId]);

  const updateStatus = async (status: string) => {
    if (!lead) return;
    await fetch(`/api/admin/leads/${lead.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setLead({ ...lead, status });
    onUpdate();
  };

  if (!leadId) return null;

  const statuses = ["NEW", "CONTACTED", "QUALIFIED", "PROPOSAL", "WON", "LOST"];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">Lead Details</h2>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : lead ? (
          <div className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-8">
              {/* Header Info */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{lead.name}</h3>
                <div className="mt-4 space-y-3">
                  <div className="flex items-center text-gray-600 text-sm">
                    <Mail className="w-4 h-4 mr-3 text-gray-400" />
                    <a href={`mailto:${lead.email}`} className="hover:text-blue-600">{lead.email}</a>
                  </div>
                  {lead.phone && (
                    <div className="flex items-center text-gray-600 text-sm">
                      <Phone className="w-4 h-4 mr-3 text-gray-400" />
                      <a href={`tel:${lead.phone}`} className="hover:text-blue-600">{lead.phone}</a>
                    </div>
                  )}
                  {lead.company && (
                    <div className="flex items-center text-gray-600 text-sm">
                      <Building className="w-4 h-4 mr-3 text-gray-400" />
                      {lead.company}
                    </div>
                  )}
                  <div className="flex items-center text-gray-600 text-sm">
                    <Clock className="w-4 h-4 mr-3 text-gray-400" />
                    {new Date(lead.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Pipeline Status */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Pipeline Status</h4>
                <div className="flex flex-wrap gap-2">
                  {statuses.map((s) => (
                    <button
                      key={s}
                      onClick={() => updateStatus(s)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors
                        ${lead.status === s 
                          ? 'bg-blue-50 border-blue-200 text-blue-700' 
                          : 'bg-white border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600'
                        }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                  <FileText className="w-4 h-4 mr-2" /> Message
                </h4>
                <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 whitespace-pre-wrap border border-gray-100">
                  {lead.message || "No message provided."}
                </div>
              </div>

              {/* Notes Timeline (Mock) */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Notes & Activity</h4>
                <div className="space-y-4">
                  {lead.notes?.length ? lead.notes.map((note: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) => (
                    <div key={note.id} className="text-sm text-gray-600 pl-4 border-l-2 border-gray-200">
                      <p>{note.content}</p>
                      <p className="text-xs text-gray-400 mt-1">{new Date(note.createdAt).toLocaleString()}</p>
                    </div>
                  )) : (
                    <p className="text-sm text-gray-500 italic">No notes available.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 text-red-500">Failed to load lead details.</div>
        )}
      </div>
    </div>
  );
}
