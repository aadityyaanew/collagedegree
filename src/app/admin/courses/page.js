"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit, Loader2, Search, Filter, BookOpen, GraduationCap, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import ImageUpload from "@/components/shared/ImageUpload";

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Basic form state
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    shortName: "",
    level: "UG",
    duration: "",
    category: "",
    avgFees: "",
    image: "",
    topColleges: "",
    eligibilityExams: "",
    subjects: "",
    careers: "",
  });

  const parseArray = (str) => {
    if (!str) return [];
    if (Array.isArray(str)) return str;
    return str.split(",").map((s) => s.trim()).filter((s) => s !== "");
  };

  const formatArray = (arr) => {
    if (!arr || !Array.isArray(arr)) return "";
    return arr.join(", ");
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await fetch("/api/admin/courses", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setCourses(data);
      }
    } catch (error) {
      console.error("Failed to fetch courses");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCourse = async (e) => {
    e.preventDefault();
    try {
      const isEditing = !!editingId;
      const url = "/api/admin/courses";
      const method = isEditing ? "PUT" : "POST";
      
      const payload = {
        ...formData,
        avgFees: Number(formData.avgFees) || undefined,
        topColleges: parseArray(formData.topColleges),
        eligibilityExams: parseArray(formData.eligibilityExams),
        subjects: parseArray(formData.subjects),
        careers: parseArray(formData.careers),
      };

      const body = isEditing ? { ...payload, id: editingId } : payload;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      
      if (res.ok) {
        const savedCourse = await res.json();
        if (isEditing) {
          setCourses(courses.map(c => c._id === editingId ? savedCourse : c));
        } else {
          setCourses([savedCourse, ...courses]);
        }
        closeForm();
      }
    } catch (error) {
      console.error("Failed to save course");
    }
  };

  const openEditForm = (course) => {
    setFormData({
      name: course.name || "",
      slug: course.slug || "",
      shortName: course.shortName || "",
      level: course.level || "UG",
      duration: course.duration || "",
      category: course.category || "",
      avgFees: course.avgFees || "",
      image: course.image || "",
      topColleges: formatArray(course.topColleges),
      eligibilityExams: formatArray(course.eligibilityExams),
      subjects: formatArray(course.subjects),
      careers: formatArray(course.careers),
    });
    setEditingId(course._id);
    setShowAddForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeForm = () => {
    setShowAddForm(false);
    setEditingId(null);
    setFormData({ 
      name: "", slug: "", shortName: "", level: "UG", duration: "", category: "",
      avgFees: "", image: "", topColleges: "", eligibilityExams: "", subjects: "", careers: ""
    });
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this course?")) return;
    
    try {
      const res = await fetch(`/api/admin/courses?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setCourses(courses.filter(c => c._id !== id));
      }
    } catch (error) {
      console.error("Failed to delete course");
    }
  };

  const filteredCourses = courses.filter(course => 
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    course.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy tracking-tight">Courses</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage degree programs and academic courses.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-crimson/20 focus:border-crimson/30 outline-none transition-all"
            />
          </div>
          <Button onClick={() => { closeForm(); setShowAddForm(true); }} className="bg-crimson hover:bg-crimson/90 text-white rounded-xl shadow-lg shadow-crimson/20">
            <Plus className="h-4 w-4 mr-2" />
            Add Course
          </Button>
        </div>
      </div>

      {showAddForm && (
        <div className="bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 mb-8 animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-navy">{editingId ? "Edit Course" : "Add New Course"}</h2>
          </div>
          <form onSubmit={handleSaveCourse} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Course Name</label>
              <input 
                required 
                type="text" 
                className="w-full rounded-xl border border-slate-200 py-2.5 px-4 focus:ring-2 focus:ring-crimson/20 focus:border-crimson outline-none transition-all bg-slate-50 focus:bg-white" 
                placeholder="e.g. B.Tech Computer Science"
                value={formData.name}
                onChange={e => {
                  const newName = e.target.value;
                  const newSlug = newName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                  setFormData({...formData, name: newName, slug: newSlug});
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Slug (Unique ID)</label>
              <input 
                required 
                type="text" 
                className="w-full rounded-xl border border-slate-200 py-2.5 px-4 focus:ring-2 focus:ring-crimson/20 focus:border-crimson outline-none transition-all bg-slate-50 focus:bg-white" 
                placeholder="e.g. btech-cse"
                value={formData.slug}
                onChange={e => setFormData({...formData, slug: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Short Name</label>
              <input 
                type="text" 
                className="w-full rounded-xl border border-slate-200 py-2.5 px-4 focus:ring-2 focus:ring-crimson/20 focus:border-crimson outline-none transition-all bg-slate-50 focus:bg-white" 
                placeholder="e.g. B.Tech CSE"
                value={formData.shortName}
                onChange={e => setFormData({...formData, shortName: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Category</label>
              <input 
                required 
                type="text" 
                className="w-full rounded-xl border border-slate-200 py-2.5 px-4 focus:ring-2 focus:ring-crimson/20 focus:border-crimson outline-none transition-all bg-slate-50 focus:bg-white" 
                placeholder="e.g. Engineering, Management"
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Level</label>
              <select 
                className="w-full rounded-xl border border-slate-200 py-2.5 px-4 focus:ring-2 focus:ring-crimson/20 focus:border-crimson outline-none transition-all bg-slate-50 focus:bg-white cursor-pointer"
                value={formData.level}
                onChange={e => setFormData({...formData, level: e.target.value})}
              >
                <option value="UG">Undergraduate (UG)</option>
                <option value="PG">Postgraduate (PG)</option>
                <option value="Diploma">Diploma</option>
                <option value="PhD">PhD</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Duration</label>
              <input 
                required 
                type="text" 
                className="w-full rounded-xl border border-slate-200 py-2.5 px-4 focus:ring-2 focus:ring-crimson/20 focus:border-crimson outline-none transition-all bg-slate-50 focus:bg-white" 
                placeholder="e.g. 4 Years"
                value={formData.duration}
                onChange={e => setFormData({...formData, duration: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Average Fees (Total)</label>
              <input 
                type="number" 
                className="w-full rounded-xl border border-slate-200 py-2.5 px-4 focus:ring-2 focus:ring-crimson/20 focus:border-crimson outline-none transition-all bg-slate-50 focus:bg-white" 
                placeholder="e.g. 1200000"
                value={formData.avgFees}
                onChange={e => setFormData({...formData, avgFees: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Course Image</label>
              <ImageUpload
                folder="courses"
                placeholder="Upload Course Image"
                value={formData.image}
                onChange={(url) => setFormData({...formData, image: url})}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Top Colleges (Comma separated slugs)</label>
              <input 
                type="text" 
                className="w-full rounded-xl border border-slate-200 py-2.5 px-4 focus:ring-2 focus:ring-crimson/20 focus:border-crimson outline-none transition-all bg-slate-50 focus:bg-white" 
                placeholder="iiit-hyderabad, lpu-jalandhar"
                value={formData.topColleges}
                onChange={e => setFormData({...formData, topColleges: e.target.value})}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Eligibility Exams (Comma separated)</label>
              <input 
                type="text" 
                className="w-full rounded-xl border border-slate-200 py-2.5 px-4 focus:ring-2 focus:ring-crimson/20 focus:border-crimson outline-none transition-all bg-slate-50 focus:bg-white" 
                placeholder="JEE Main, BITSAT"
                value={formData.eligibilityExams}
                onChange={e => setFormData({...formData, eligibilityExams: e.target.value})}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Subjects (Comma separated)</label>
              <input 
                type="text" 
                className="w-full rounded-xl border border-slate-200 py-2.5 px-4 focus:ring-2 focus:ring-crimson/20 focus:border-crimson outline-none transition-all bg-slate-50 focus:bg-white" 
                placeholder="Data Structures, Algorithms"
                value={formData.subjects}
                onChange={e => setFormData({...formData, subjects: e.target.value})}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Careers (Comma separated)</label>
              <input 
                type="text" 
                className="w-full rounded-xl border border-slate-200 py-2.5 px-4 focus:ring-2 focus:ring-crimson/20 focus:border-crimson outline-none transition-all bg-slate-50 focus:bg-white" 
                placeholder="Software Engineer, Product Manager"
                value={formData.careers}
                onChange={e => setFormData({...formData, careers: e.target.value})}
              />
            </div>
            <div className="md:col-span-2 flex justify-end gap-3 mt-4 pt-6 border-t border-slate-100">
              <Button type="button" variant="outline" onClick={closeForm} className="rounded-xl border-slate-200">Cancel</Button>
              <Button type="submit" className="bg-navy hover:bg-navy-light text-white rounded-xl shadow-lg shadow-navy/20">
                {editingId ? "Update Course" : "Save Course"}
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
        ) : filteredCourses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-slate-500">
            <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <GraduationCap className="h-8 w-8 text-slate-400" />
            </div>
            <p className="text-lg font-medium text-navy">No courses found</p>
            <p className="text-sm mt-1">Try adjusting your search or add a new course.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-500 whitespace-nowrap">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50/50 border-b border-slate-100">
                <tr>
                  <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Course Name</th>
                  <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Level</th>
                  <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Duration</th>
                  <th scope="col" className="px-6 py-4 font-semibold text-right tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCourses.map((course) => (
                  <tr key={course._id} className="bg-white hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center border border-purple-100/50 shrink-0">
                          <BookOpen className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-navy text-base">{course.name}</div>
                          <div className="text-xs text-slate-500 flex items-center mt-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300 mr-1.5"></span>
                            {course.category}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${
                        course.level === 'UG' ? 'bg-blue-50 text-blue-700 border border-blue-100/50' :
                        course.level === 'PG' ? 'bg-purple-50 text-purple-700 border border-purple-100/50' :
                        'bg-slate-100 text-slate-700 border border-slate-200/50'
                      }`}>
                        {course.level}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center text-slate-600 font-medium bg-slate-50 px-3 py-1.5 rounded-lg w-fit">
                        <Clock className="h-3.5 w-3.5 mr-2 text-slate-400" />
                        {course.duration}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => openEditForm(course)}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(course._id)}
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
