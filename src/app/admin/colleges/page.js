"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit, Loader2, MapPin, Building2, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import ImageUpload from "@/components/shared/ImageUpload";

// Helper to convert comma separated string to array
const parseArray = (str) => {
  if (!str) return [];
  if (Array.isArray(str)) return str;
  return str.split(',').map(s => s.trim()).filter(s => s);
};

// Helper to convert array to comma separated string
const formatArray = (arr) => {
  if (!arr || !Array.isArray(arr)) return "";
  return arr.join(', ');
};

// Helper functions removed as they are no longer needed

const defaultFormData = {
  id: "",
  name: "",
  shortName: "",
  location: { city: "", state: "" },
  type: "Private",
  established: "",
  nirfRanking: "",
  naacGrade: "",
  fees: [{ key: "", value: "" }],
  avgPackage: "",
  highestPackage: "",
  coursesOffered: "",
  logo: "",
  campus: "",
  about: "",
  topRecruiters: "",
  cutoff: [{ key: "", value: "" }],
};

export default function CollegesPage() {
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [formData, setFormData] = useState(defaultFormData);

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const res = await fetch("/api/admin/colleges", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          setColleges(data);
        }
      } catch (error) {
        console.error("Failed to fetch colleges");
      } finally {
        setLoading(false);
      }
    };
    fetchColleges();
  }, []);

  const handleSaveCollege = async (e) => {
    e.preventDefault();
    try {
      const isEditing = !!editingId;
      const url = "/api/admin/colleges";
      const method = isEditing ? "PUT" : "POST";
      
      // Prepare payload
      const payload = {
        ...formData,
        fees: formData.fees.reduce((acc, { key, value }) => {
          if (key && value) acc[key] = Number(value);
          return acc;
        }, {}),
        cutoff: formData.cutoff.reduce((acc, { key, value }) => {
          if (key && value) acc[key] = value;
          return acc;
        }, {}),
        coursesOffered: parseArray(formData.coursesOffered),
        topRecruiters: parseArray(formData.topRecruiters),
        established: Number(formData.established) || undefined,
        nirfRanking: Number(formData.nirfRanking) || undefined,
        avgPackage: Number(formData.avgPackage) || undefined,
        highestPackage: Number(formData.highestPackage) || undefined,
      };

      if (isEditing) {
        payload.documentId = editingId;
        payload.id = formData.id || payload.id || editingId;
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      if (res.ok) {
        const savedCollege = await res.json();
        if (isEditing) {
          setColleges(colleges.map(c => (c._id === editingId || c.id === savedCollege.id) ? savedCollege : c));
        } else {
          setColleges([savedCollege, ...colleges]);
        }
        if (typeof window !== "undefined") {
          try {
            const bc = new BroadcastChannel("cc_college_updates");
            bc.postMessage({ type: "COLLEGE_SAVED", id: savedCollege.id || savedCollege._id });
            bc.close();
          } catch (e) {}
          localStorage.setItem("cc_last_college_update", Date.now().toString());
        }
        closeForm();
      } else {
        const err = await res.json();
        alert("Error saving: " + (err.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Failed to save college", error);
      alert("Failed to save college");
    }
  };

  const openEditForm = (college) => {
    setFormData({
      id: college.id || "",
      name: college.name || "",
      shortName: college.shortName || "",
      location: { city: college.location?.city || "", state: college.location?.state || "" },
      type: college.type || "Private",
      established: college.established || "",
      nirfRanking: college.nirfRanking || "",
      naacGrade: college.naacGrade || "",
      fees: college.fees && Object.keys(college.fees).length > 0 
        ? Object.entries(college.fees).map(([key, value]) => ({ key, value: String(value) })) 
        : [{ key: "", value: "" }],
      avgPackage: college.avgPackage || "",
      highestPackage: college.highestPackage || "",
      coursesOffered: formatArray(college.coursesOffered),
      logo: college.logo || "",
      campus: college.campus || "",
      about: college.about || "",
      topRecruiters: formatArray(college.topRecruiters),
      cutoff: college.cutoff && Object.keys(college.cutoff).length > 0 
        ? Object.entries(college.cutoff).map(([key, value]) => ({ key, value })) 
        : [{ key: "", value: "" }],
    });
    setEditingId(college._id);
    setShowAddForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeForm = () => {
    setShowAddForm(false);
    setEditingId(null);
    setFormData(defaultFormData);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this college?")) return;
    
    try {
      const res = await fetch(`/api/admin/colleges?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setColleges(colleges.filter(c => c._id !== id));
        if (typeof window !== "undefined") {
          try {
            const bc = new BroadcastChannel("cc_college_updates");
            bc.postMessage({ type: "COLLEGE_DELETED", id });
            bc.close();
          } catch (e) {}
          localStorage.setItem("cc_last_college_update", Date.now().toString());
        }
      }
    } catch (error) {
      console.error("Failed to delete college");
    }
  };

  const filteredColleges = colleges.filter(college => 
    college.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    college.location?.city?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy tracking-tight">Colleges</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your database of colleges and universities.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text"
              placeholder="Search colleges..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-crimson/20 focus:border-crimson/30 outline-none transition-all"
            />
          </div>
          <Button onClick={() => { closeForm(); setShowAddForm(true); }} className="bg-crimson hover:bg-crimson/90 text-white rounded-xl shadow-lg shadow-crimson/20">
            <Plus className="h-4 w-4 mr-2" />
            Add College
          </Button>
        </div>
      </div>

      {showAddForm && (
        <div className="bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 mb-8 animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-navy">{editingId ? "Edit College" : "Add New College"}</h2>
          </div>
          <form onSubmit={handleSaveCollege} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Basic Information */}
            <div className="lg:col-span-3 pb-2 border-b border-slate-100 mb-2">
              <h3 className="text-sm font-semibold text-slate-800">Basic Information</h3>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Slug ID (Unique URL)</label>
              <input required type="text" className="form-input w-full rounded-xl border border-slate-200 py-2.5 px-4 focus:ring-2 focus:ring-crimson/20 focus:border-crimson outline-none" 
                placeholder="e.g. shoolini-university-online" value={formData.id} onChange={e => setFormData({...formData, id: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
              <input required type="text" className="form-input w-full rounded-xl border border-slate-200 py-2.5 px-4 focus:ring-2 focus:ring-crimson/20 focus:border-crimson outline-none" 
                value={formData.name} 
                onChange={e => {
                  const newName = e.target.value;
                  const newSlug = newName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                  setFormData({...formData, name: newName, id: newSlug});
                }} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Short Name</label>
              <input required type="text" className="form-input w-full rounded-xl border border-slate-200 py-2.5 px-4 focus:ring-2 focus:ring-crimson/20 focus:border-crimson outline-none" 
                placeholder="e.g. IIT Bombay" value={formData.shortName} onChange={e => setFormData({...formData, shortName: e.target.value})} />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">City</label>
              <input required type="text" className="form-input w-full rounded-xl border border-slate-200 py-2.5 px-4 focus:ring-2 focus:ring-crimson/20 focus:border-crimson outline-none" 
                placeholder="e.g. Mumbai" value={formData.location.city} onChange={e => setFormData({...formData, location: {...formData.location, city: e.target.value}})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">State/Country</label>
              <input required type="text" className="form-input w-full rounded-xl border border-slate-200 py-2.5 px-4 focus:ring-2 focus:ring-crimson/20 focus:border-crimson outline-none" 
                placeholder="e.g. Maharashtra" value={formData.location.state} onChange={e => setFormData({...formData, location: {...formData.location, state: e.target.value}})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Institution Type</label>
              <select className="form-select w-full rounded-xl border border-slate-200 py-2.5 px-4 focus:ring-2 focus:ring-crimson/20 focus:border-crimson outline-none cursor-pointer"
                value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                <option value="Private">Private</option>
                <option value="Public">Public</option>
                <option value="Government">Government</option>
                <option value="IIT">IIT</option>
                <option value="NIT">NIT</option>
                <option value="Deemed">Deemed</option>
                <option value="State">State</option>
              </select>
            </div>

            <div className="lg:col-span-3">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">About</label>
              <textarea rows={3} className="form-textarea w-full rounded-xl border border-slate-200 py-2.5 px-4 focus:ring-2 focus:ring-crimson/20 focus:border-crimson outline-none" 
                placeholder="Description of the college..." value={formData.about} onChange={e => setFormData({...formData, about: e.target.value})} />
            </div>

            {/* Stats & Rankings */}
            <div className="lg:col-span-3 pb-2 border-b border-slate-100 mb-2 mt-4">
              <h3 className="text-sm font-semibold text-slate-800">Stats & Rankings</h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Established Year</label>
              <input type="number" className="form-input w-full rounded-xl border border-slate-200 py-2.5 px-4 focus:ring-2 focus:ring-crimson/20 focus:border-crimson outline-none" 
                placeholder="e.g. 1958" value={formData.established} onChange={e => setFormData({...formData, established: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">NIRF Ranking</label>
              <input type="number" className="form-input w-full rounded-xl border border-slate-200 py-2.5 px-4 focus:ring-2 focus:ring-crimson/20 focus:border-crimson outline-none" 
                placeholder="e.g. 3" value={formData.nirfRanking} onChange={e => setFormData({...formData, nirfRanking: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">NAAC Grade</label>
              <input type="text" className="form-input w-full rounded-xl border border-slate-200 py-2.5 px-4 focus:ring-2 focus:ring-crimson/20 focus:border-crimson outline-none" 
                placeholder="e.g. A++" value={formData.naacGrade} onChange={e => setFormData({...formData, naacGrade: e.target.value})} />
            </div>

            {/* Placements & Fees */}
            <div className="lg:col-span-3 pb-2 border-b border-slate-100 mb-2 mt-4">
              <h3 className="text-sm font-semibold text-slate-800">Placements & Fees</h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Avg Package (LPA)</label>
              <input type="number" step="0.1" className="form-input w-full rounded-xl border border-slate-200 py-2.5 px-4 focus:ring-2 focus:ring-crimson/20 focus:border-crimson outline-none" 
                placeholder="e.g. 12.5" value={formData.avgPackage} onChange={e => setFormData({...formData, avgPackage: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Highest Package (LPA)</label>
              <input type="number" step="0.1" className="form-input w-full rounded-xl border border-slate-200 py-2.5 px-4 focus:ring-2 focus:ring-crimson/20 focus:border-crimson outline-none" 
                placeholder="e.g. 50" value={formData.highestPackage} onChange={e => setFormData({...formData, highestPackage: e.target.value})} />
            </div>
            
            <div className="lg:col-span-3">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Fees per Course</label>
              {formData.fees.map((fee, index) => (
                <div key={index} className="flex gap-3 mb-2">
                  <input type="text" placeholder="Course (e.g. btech)" className="form-input w-1/2 rounded-xl border border-slate-200 py-2.5 px-4 focus:ring-2 focus:ring-crimson/20 focus:border-crimson outline-none" value={fee.key} onChange={e => {
                    const newFees = [...formData.fees];
                    newFees[index].key = e.target.value;
                    setFormData({...formData, fees: newFees});
                  }} />
                  <input type="number" placeholder="Amount (e.g. 1000000)" className="form-input w-1/2 rounded-xl border border-slate-200 py-2.5 px-4 focus:ring-2 focus:ring-crimson/20 focus:border-crimson outline-none" value={fee.value} onChange={e => {
                    const newFees = [...formData.fees];
                    newFees[index].value = e.target.value;
                    setFormData({...formData, fees: newFees});
                  }} />
                  <Button type="button" variant="outline" className="text-red-500 hover:text-red-600 hover:bg-red-50 border-red-100 px-3 rounded-xl" onClick={() => {
                    const newFees = formData.fees.filter((_, i) => i !== index);
                    setFormData({...formData, fees: newFees.length ? newFees : [{key: "", value: ""}]});
                  }}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" className="text-sm mt-1 rounded-xl bg-slate-50 text-slate-700" onClick={() => setFormData({...formData, fees: [...formData.fees, {key: "", value: ""}]})}>
                <Plus className="h-4 w-4 mr-2" /> Add Fee Entry
              </Button>
            </div>

            {/* Arrays (Comma separated) */}
            <div className="lg:col-span-3 pb-2 border-b border-slate-100 mb-2 mt-4">
              <h3 className="text-sm font-semibold text-slate-800">Lists (Comma separated)</h3>
            </div>

            <div className="lg:col-span-3">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Courses Offered</label>
              <input type="text" className="form-input w-full rounded-xl border border-slate-200 py-2.5 px-4 focus:ring-2 focus:ring-crimson/20 focus:border-crimson outline-none" 
                placeholder="B.Tech, MBA, M.Tech, Ph.D" value={formData.coursesOffered} onChange={e => setFormData({...formData, coursesOffered: e.target.value})} />
            </div>
            <div className="lg:col-span-3">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Top Recruiters</label>
              <input type="text" className="form-input w-full rounded-xl border border-slate-200 py-2.5 px-4 focus:ring-2 focus:ring-crimson/20 focus:border-crimson outline-none" 
                placeholder="Google, Microsoft, Amazon" value={formData.topRecruiters} onChange={e => setFormData({...formData, topRecruiters: e.target.value})} />
            </div>

            {/* Media & Other */}
            <div className="lg:col-span-3 pb-2 border-b border-slate-100 mb-2 mt-4">
              <h3 className="text-sm font-semibold text-slate-800">Media & Other</h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Logo Image
              </label>
              <ImageUpload
                folder="colleges"
                placeholder="Upload Logo"
                recommendedSize="400x400px (1:1)"
                value={formData.logo}
                onChange={(url) => setFormData({...formData, logo: url})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Campus Image
              </label>
              <ImageUpload
                folder="colleges"
                placeholder="Upload Campus Image"
                recommendedSize="800x400px (2:1)"
                value={formData.campus}
                onChange={(url) => setFormData({...formData, campus: url})}
              />
            </div>
            <div className="lg:col-span-3">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Cutoffs</label>
              {formData.cutoff.map((c, index) => (
                <div key={index} className="flex gap-3 mb-2">
                  <input type="text" placeholder="Exam/Category (e.g. merit)" className="form-input w-1/2 rounded-xl border border-slate-200 py-2.5 px-4 focus:ring-2 focus:ring-crimson/20 focus:border-crimson outline-none" value={c.key} onChange={e => {
                    const newCutoff = [...formData.cutoff];
                    newCutoff[index].key = e.target.value;
                    setFormData({...formData, cutoff: newCutoff});
                  }} />
                  <input type="text" placeholder="Score (e.g. 50%)" className="form-input w-1/2 rounded-xl border border-slate-200 py-2.5 px-4 focus:ring-2 focus:ring-crimson/20 focus:border-crimson outline-none" value={c.value} onChange={e => {
                    const newCutoff = [...formData.cutoff];
                    newCutoff[index].value = e.target.value;
                    setFormData({...formData, cutoff: newCutoff});
                  }} />
                  <Button type="button" variant="outline" className="text-red-500 hover:text-red-600 hover:bg-red-50 border-red-100 px-3 rounded-xl" onClick={() => {
                    const newCutoff = formData.cutoff.filter((_, i) => i !== index);
                    setFormData({...formData, cutoff: newCutoff.length ? newCutoff : [{key: "", value: ""}]});
                  }}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" className="text-sm mt-1 rounded-xl bg-slate-50 text-slate-700" onClick={() => setFormData({...formData, cutoff: [...formData.cutoff, {key: "", value: ""}]})}>
                <Plus className="h-4 w-4 mr-2" /> Add Cutoff Entry
              </Button>
            </div>

            <div className="lg:col-span-3 flex justify-end gap-3 mt-4 pt-6 border-t border-slate-100">
              <Button type="button" variant="outline" onClick={closeForm} className="rounded-xl border-slate-200">Cancel</Button>
              <Button type="submit" className="bg-navy hover:bg-navy-light text-white rounded-xl shadow-lg shadow-navy/20">
                {editingId ? "Update College" : "Save College"}
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-32">
            <Loader2 className="h-8 w-8 text-crimson animate-spin" />
          </div>
        ) : filteredColleges.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-slate-500">
            <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <Building2 className="h-8 w-8 text-slate-400" />
            </div>
            <p className="text-lg font-medium text-navy">No colleges found</p>
            <p className="text-sm mt-1">Try adjusting your search or add a new college.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-500 whitespace-nowrap">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50/50 border-b border-slate-100">
                <tr>
                  <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Institution</th>
                  <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Type & Rank</th>
                  <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Placements</th>
                  <th scope="col" className="px-6 py-4 font-semibold text-right tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredColleges.map((college) => (
                  <tr key={college._id} className="bg-white hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center border border-blue-100/50 shrink-0 overflow-hidden">
                          {college.logo ? (
                            <img src={college.logo} alt={college.name} className="h-full w-full object-cover" />
                          ) : (
                            <Building2 className="h-5 w-5 text-blue-600" />
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-navy text-base">{college.name}</div>
                          <div className="text-xs text-slate-500 flex items-center mt-1">
                            <MapPin className="h-3 w-3 mr-1 text-slate-400" />
                            {college.location?.city || "Unknown"}, {college.location?.state || "Unknown"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${
                        college.type === 'Private' ? 'bg-purple-50 text-purple-700 border border-purple-100/50' :
                        college.type === 'Public' ? 'bg-blue-50 text-blue-700 border border-blue-100/50' :
                        'bg-emerald-50 text-emerald-700 border border-emerald-100/50'
                      }`}>
                        {college.type}
                      </span>
                      {college.nirfRanking && (
                        <div className="text-xs text-amber-600 font-medium mt-2">
                          NIRF #{college.nirfRanking}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-5">
                      {college.avgPackage ? (
                        <>
                          <div className="font-medium text-slate-700">{college.avgPackage} LPA (Avg)</div>
                          {college.highestPackage && <div className="text-xs text-slate-400">{college.highestPackage} LPA (High)</div>}
                        </>
                      ) : (
                        <span className="text-xs text-slate-400">Not updated</span>
                      )}
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => openEditForm(college)}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(college._id)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

