"use client";

import { useState, useEffect } from "react";
import {
  Trash2,
  Phone,
  Calendar,
  Loader2,
  Search,
  Filter,
  Users,
  Mail,
  MapPin,
  Eye,
  X,
  CheckCircle2,
  GraduationCap,
  Briefcase,
  DollarSign,
  Target,
  Award,
  Download,
  Copy,
  Check,
  Sparkles,
  Layers,
  BookOpen,
  Compass,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  EDUCATION_MAP,
  STREAM_MAP,
  PERCENTAGE_MAP,
  INTERESTS_MAP,
  CAREER_GOALS_MAP,
  COURSES_MAP,
  WORKING_STATUS_MAP,
  BUDGET_MAP,
} from "@/components/course-finder/CourseFinderWizard";

export default function LeadsPage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [selectedLead, setSelectedLead] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const res = await fetch("/api/admin/leads", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setLeads(data);
      }
    } catch (error) {
      console.error("Failed to fetch leads");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      const res = await fetch("/api/admin/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });

      if (res.ok) {
        setLeads(leads.map((lead) => (lead._id === id ? { ...lead, status } : lead)));
        if (selectedLead && selectedLead._id === id) {
          setSelectedLead({ ...selectedLead, status });
        }
      }
    } catch (error) {
      console.error("Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this lead?")) return;

    try {
      const res = await fetch(`/api/admin/leads?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setLeads(leads.filter((lead) => lead._id !== id));
        if (selectedLead && selectedLead._id === id) {
          setSelectedLead(null);
        }
      }
    } catch (error) {
      console.error("Failed to delete lead");
    }
  };

  // Helper to extract clean questionnaire step data with full backwards compatibility
  const getNormalizedSteps = (lead) => {
    if (!lead) return [];
    const summary = lead.answersSummary || {};

    if (Array.isArray(summary.stepDetails) && summary.stepDetails.length > 0) {
      return summary.stepDetails;
    }

    const raw = summary.allAnswers || summary || {};
    const edu = lead.education || raw.education;
    const stream = lead.stream || raw.stream;
    const percentage = lead.percentage || raw.percentage;
    const workingStatus = lead.workingStatus || raw.workingStatus;
    const budget = lead.budget || raw.budget;
    const interests = raw.interests || summary.interests || [];
    const careerGoals = raw.careerGoals || summary.careerGoals || [];
    const preferredCourseId = raw.preferredCourseId || summary.preferredCourseId;

    const hasAnyStep =
      edu ||
      stream ||
      percentage ||
      workingStatus ||
      budget ||
      (Array.isArray(interests) && interests.length > 0) ||
      (Array.isArray(careerGoals) && careerGoals.length > 0);

    if (!hasAnyStep) return [];

    const normEdu = EDUCATION_MAP[edu] || edu || "Not specified";
    const normStream = STREAM_MAP[stream] || stream || "Not specified";
    const normPct = PERCENTAGE_MAP[percentage] || percentage || "Not specified";
    const normInterests = Array.isArray(interests) ? interests.map((i) => INTERESTS_MAP[i] || i) : [];
    const normGoals = Array.isArray(careerGoals) ? careerGoals.map((g) => CAREER_GOALS_MAP[g] || g) : [];
    const normCourse = COURSES_MAP[preferredCourseId] || lead.preferredCourse || "General Counselling";
    const normStatus = WORKING_STATUS_MAP[workingStatus] || workingStatus || "Not specified";
    const normBudget = BUDGET_MAP[budget] || budget || "Not specified";

    return [
      {
        step: 1,
        title: "Education & Qualification",
        question: "What is your current or highest qualification?",
        answer: normEdu,
      },
      {
        step: 2,
        title: "Stream & Performance",
        question: "Which academic stream did you study and expected score?",
        answer: `${normStream} • Score: ${normPct}`,
        stream: normStream,
        percentage: normPct,
      },
      {
        step: 3,
        title: "Fields of Interest",
        question: "Select your field(s) of interest",
        answer: normInterests.join(", ") || "General",
        interests: normInterests,
      },
      {
        step: 4,
        title: "Career Ambition",
        question: "What is your primary career goal after graduation?",
        answer: normGoals.join(", ") || "Not specified",
        careerGoals: normGoals,
      },
      {
        step: 5,
        title: "Preferred Course",
        question: "Do you have a specific course in mind?",
        answer: normCourse,
      },
      {
        step: 6,
        title: "Working Status & Budget",
        question: "Your current status and financial preferences",
        answer: `Status: ${normStatus} • Budget: ${normBudget}`,
        workingStatus: normStatus,
        budget: normBudget,
      },
      {
        step: 7,
        title: "Lead Contact Information",
        question: "Student Details for Counselling",
        answer: `Name: ${lead.name} • Phone: ${lead.phone} • Email: ${lead.email || "N/A"}`,
      },
    ];
  };

  const handleCopySummary = (lead) => {
    const steps = getNormalizedSteps(lead);
    let text = `STUDENT COUNSELLING LEAD SUMMARY\n`;
    text += `=====================================\n`;
    text += `Name: ${lead.name}\n`;
    text += `Phone: ${lead.phone}\n`;
    text += `Email: ${lead.email || "N/A"}\n`;
    text += `Source: ${lead.source || "Website Lead Form"}\n`;
    text += `Target Course: ${lead.preferredCourse || "General Counselling"}\n`;
    text += `Location: ${lead.city ? `${lead.city}, ${lead.state}` : lead.state || "Not specified"}\n`;
    text += `Submitted Date: ${new Date(lead.createdAt).toLocaleString()}\n`;
    text += `Status: ${lead.status || "New"}\n\n`;

    if (steps.length > 0) {
      text += `QUESTIONNAIRE STEP RESPONSES:\n`;
      text += `-------------------------------------\n`;
      steps.forEach((s) => {
        text += `Step ${s.step}: ${s.title}\n`;
        text += `Response: ${s.answer}\n\n`;
      });
    }

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportCSV = () => {
    if (leads.length === 0) return;
    const headers = [
      "Name",
      "Phone",
      "Email",
      "Preferred Course",
      "Source",
      "Status",
      "Created At",
      "Education",
      "Stream",
      "Percentage",
      "Working Status",
      "Budget",
      "Interests",
      "Career Ambition",
    ];

    const rows = filteredLeads.map((lead) => {
      const summary = lead.answersSummary || {};
      const raw = summary.allAnswers || summary || {};
      const edu = lead.education || raw.education || "";
      const stream = lead.stream || raw.stream || "";
      const pct = lead.percentage || raw.percentage || "";
      const working = lead.workingStatus || raw.workingStatus || "";
      const budget = lead.budget || raw.budget || "";
      const interests = Array.isArray(raw.interests) ? raw.interests.join("; ") : "";
      const goals = Array.isArray(raw.careerGoals) ? raw.careerGoals.join("; ") : "";

      return [
        `"${(lead.name || "").replace(/"/g, '""')}"`,
        `"${(lead.phone || "").replace(/"/g, '""')}"`,
        `"${(lead.email || "").replace(/"/g, '""')}"`,
        `"${(lead.preferredCourse || "").replace(/"/g, '""')}"`,
        `"${(lead.source || "").replace(/"/g, '""')}"`,
        `"${(lead.status || "New").replace(/"/g, '""')}"`,
        `"${new Date(lead.createdAt).toLocaleString()}"`,
        `"${(EDUCATION_MAP[edu] || edu).replace(/"/g, '""')}"`,
        `"${(STREAM_MAP[stream] || stream).replace(/"/g, '""')}"`,
        `"${(PERCENTAGE_MAP[pct] || pct).replace(/"/g, '""')}"`,
        `"${(WORKING_STATUS_MAP[working] || working).replace(/"/g, '""')}"`,
        `"${(BUDGET_MAP[budget] || budget).replace(/"/g, '""')}"`,
        `"${interests.replace(/"/g, '""')}"`,
        `"${goals.replace(/"/g, '""')}"`,
      ].join(",");
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `collegecompare_leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredLeads = leads.filter((lead) => {
    const query = searchTerm.toLowerCase();
    const summary = lead.answersSummary || {};
    const raw = summary.allAnswers || summary || {};

    const matchesSearch =
      (lead.name && lead.name.toLowerCase().includes(query)) ||
      (lead.phone && lead.phone.toLowerCase().includes(query)) ||
      (lead.email && lead.email.toLowerCase().includes(query)) ||
      (lead.preferredCourse && lead.preferredCourse.toLowerCase().includes(query)) ||
      (lead.city && lead.city.toLowerCase().includes(query)) ||
      (lead.state && lead.state.toLowerCase().includes(query)) ||
      (lead.source && lead.source.toLowerCase().includes(query)) ||
      (lead.education && lead.education.toLowerCase().includes(query)) ||
      (raw.education && raw.education.toLowerCase().includes(query)) ||
      (lead.stream && lead.stream.toLowerCase().includes(query)) ||
      (raw.stream && raw.stream.toLowerCase().includes(query)) ||
      (lead.workingStatus && lead.workingStatus.toLowerCase().includes(query));

    const matchesStatus =
      statusFilter === "all" || (lead.status || "New").toLowerCase() === statusFilter.toLowerCase();

    const isCourseFinder =
      (lead.source || "").toLowerCase().includes("course finder") ||
      (lead.source || "").toLowerCase().includes("course advisor") ||
      (summary.stepDetails && summary.stepDetails.length > 0) ||
      Boolean(lead.education || raw.education);

    const matchesSource =
      sourceFilter === "all" ||
      (sourceFilter === "course_finder" && isCourseFinder) ||
      (sourceFilter === "other" && !isCourseFinder);

    return matchesSearch && matchesStatus && matchesSource;
  });

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-navy tracking-tight">Counselling Leads</h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
              {leads.length} Total
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Manage student counselling requests and view full Course Advisor step answers.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          {/* Search bar */}
          <div className="relative flex-1 sm:w-60">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search leads, courses, streams..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-crimson/20 focus:border-crimson/30 outline-none transition-all"
            />
          </div>

          {/* Source filter */}
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="text-xs font-medium bg-white border border-slate-200 text-slate-700 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-crimson/20"
          >
            <option value="all">All Sources</option>
            <option value="course_finder">Course Advisor Only</option>
            <option value="other">Other Lead Forms</option>
          </select>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs font-medium bg-white border border-slate-200 text-slate-700 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-crimson/20"
          >
            <option value="all">All Statuses</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="closed">Closed</option>
          </select>

          {/* Export CSV button */}
          <Button
            variant="outline"
            onClick={handleExportCSV}
            className="bg-white border-slate-200 text-slate-600 rounded-xl px-3 hover:bg-slate-50 text-xs font-semibold h-9"
            title="Export to CSV"
          >
            <Download className="h-3.5 w-3.5 mr-1.5" />
            Export
          </Button>
        </div>
      </div>

      {/* Leads Table Container */}
      <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-32">
            <Loader2 className="h-8 w-8 text-crimson animate-spin" />
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-slate-500">
            <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <Users className="h-8 w-8 text-slate-400" />
            </div>
            <p className="text-lg font-medium text-navy">No leads found</p>
            <p className="text-sm mt-1">Try adjusting your filters or wait for new submissions.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-500 whitespace-nowrap">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50/70 border-b border-slate-100">
                <tr>
                  <th scope="col" className="px-6 py-4 font-semibold tracking-wider">
                    Student Profile
                  </th>
                  <th scope="col" className="px-6 py-4 font-semibold tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-4 font-semibold text-right tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLeads.map((lead) => {
                  const steps = getNormalizedSteps(lead);
                  const isCourseFinder =
                    (lead.source || "").toLowerCase().includes("course finder") ||
                    (lead.source || "").toLowerCase().includes("course advisor") || steps.length > 0;
                  const raw = lead.answersSummary?.allAnswers || lead.answersSummary || {};
                  const eduVal = lead.education || raw.education;
                  const streamVal = lead.stream || raw.stream;
                  const pctVal = lead.percentage || raw.percentage;
                  const workVal = lead.workingStatus || raw.workingStatus;

                  return (
                    <tr
                      key={lead._id}
                      className="bg-white hover:bg-slate-50/60 transition-colors group cursor-pointer"
                      onClick={() => setSelectedLead(lead)}
                    >
                      {/* 1. Student Profile */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-crimson/10 to-crimson/20 text-crimson flex items-center justify-center font-bold text-sm shrink-0 border border-crimson/10">
                            {lead.name ? lead.name.charAt(0).toUpperCase() : "U"}
                          </div>
                          <div>
                            <div className="font-semibold text-navy flex items-center gap-1.5">
                              <span>{lead.name}</span>
                              {isCourseFinder && (
                                <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                  Course Advisor
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-slate-400 flex items-center mt-0.5">
                              <Calendar className="h-3 w-3 mr-1" />
                              {new Date(lead.createdAt).toLocaleDateString(undefined, {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </div>
                          </div>
                        </div>
                      </td>



                      {/* 5. Status Dropdown */}
                      <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={lead.status || "New"}
                          onChange={(e) => handleStatusChange(lead._id, e.target.value)}
                          className={`text-xs rounded-full px-3 py-1.5 font-semibold border-0 cursor-pointer outline-none focus:ring-2 focus:ring-offset-1 transition-all ${
                            lead.status === "Contacted"
                              ? "bg-blue-50 text-blue-700 focus:ring-blue-200"
                              : lead.status === "Closed"
                              ? "bg-slate-100 text-slate-600 focus:ring-slate-200"
                              : "bg-emerald-50 text-emerald-700 focus:ring-emerald-200"
                          }`}
                        >
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Closed">Closed</option>
                        </select>
                      </td>

                      {/* 6. Actions */}
                      <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => setSelectedLead(lead)}
                            className="p-1.5 text-slate-400 hover:text-navy hover:bg-slate-100 rounded-lg transition-colors"
                            title="View Full Lead Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(lead._id)}
                            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Lead"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Interactive Step Details Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
              <div className="flex items-center gap-3.5">
                <div className="h-12 w-12 rounded-2xl bg-crimson text-white flex items-center justify-center font-extrabold text-lg shadow-md shadow-crimson/20">
                  {selectedLead.name ? selectedLead.name.charAt(0).toUpperCase() : "U"}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-navy">{selectedLead.name}</h2>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-crimson-50 text-crimson border border-crimson-100">
                      {selectedLead.source || "Course Advisor Lead"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                    <span>ID: {selectedLead._id}</span>
                    <span>&bull;</span>
                    <span>
                      {new Date(selectedLead.createdAt).toLocaleString(undefined, {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCopySummary(selectedLead)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                  title="Copy Profile to Clipboard"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copied ? "Copied!" : "Copy Summary"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedLead(null)}
                  className="h-8 w-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Modal Body with full step responses */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {/* Quick Contact & Target Course Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  <span className="text-[11px] uppercase font-bold text-slate-400 block mb-1">
                    Mobile Phone
                  </span>
                  <a
                    href={`tel:${selectedLead.phone}`}
                    className="text-sm font-bold text-navy hover:text-crimson flex items-center gap-1.5"
                  >
                    <Phone className="h-3.5 w-3.5 text-crimson" />
                    {selectedLead.phone}
                  </a>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  <span className="text-[11px] uppercase font-bold text-slate-400 block mb-1">
                    Email Address
                  </span>
                  <a
                    href={`mailto:${selectedLead.email}`}
                    className="text-sm font-bold text-navy hover:text-crimson flex items-center gap-1.5 truncate"
                  >
                    <Mail className="h-3.5 w-3.5 text-crimson" />
                    <span className="truncate">{selectedLead.email || "Not provided"}</span>
                  </a>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  <span className="text-[11px] uppercase font-bold text-slate-400 block mb-1">
                    Target Course
                  </span>
                  <div className="text-sm font-bold text-crimson flex items-center gap-1.5 truncate">
                    <GraduationCap className="h-3.5 w-3.5 text-crimson" />
                    <span className="truncate">{selectedLead.preferredCourse || "General Counselling"}</span>
                  </div>
                </div>
              </div>

              {/* Questionnaire Steps Section */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-navy uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-crimson" />
                    Course Advisor Questionnaire Responses
                  </h3>
                  <span className="text-xs font-semibold text-slate-400">
                    All Steps Captured
                  </span>
                </div>

                {getNormalizedSteps(selectedLead).length > 0 ? (
                  <div className="space-y-3">
                    {getNormalizedSteps(selectedLead).map((s) => (
                      <div
                        key={s.step}
                        className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs flex items-start gap-3.5 hover:border-slate-300 transition-colors"
                      >
                        <div className="h-7 w-7 rounded-xl bg-crimson-50 text-crimson font-extrabold text-xs flex items-center justify-center shrink-0 border border-crimson-100">
                          {s.step}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center justify-between gap-1 mb-0.5">
                            <h4 className="text-xs font-bold text-slate-700">{s.title}</h4>
                            <span className="text-[11px] text-slate-400 italic">Step {s.step}</span>
                          </div>
                          <p className="text-xs text-slate-500 mb-1.5">{s.question}</p>
                          <div className="text-sm font-semibold text-navy bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                            {s.answer}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-sm font-medium text-slate-600">
                      This lead was submitted without questionnaire step data.
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Submitted via {selectedLead.source || "Website Form"}.
                    </p>
                  </div>
                )}
              </div>

              {/* Status Update Strip */}
              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50 p-4 rounded-2xl">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500">Lead Status:</span>
                  <select
                    value={selectedLead.status || "New"}
                    onChange={(e) => handleStatusChange(selectedLead._id, e.target.value)}
                    className="text-xs rounded-xl px-3 py-1.5 font-bold border border-slate-200 bg-white text-navy cursor-pointer outline-none focus:ring-2 focus:ring-crimson/20"
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${selectedLead.phone}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    Call Student
                  </a>
                  {selectedLead.email && (
                    <a
                      href={`mailto:${selectedLead.email}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-navy hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs"
                    >
                      <Mail className="h-3.5 w-3.5" />
                      Send Email
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
