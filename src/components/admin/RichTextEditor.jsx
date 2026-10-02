"use client";

import { useState, useRef, useEffect } from "react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading2,
  Heading3,
  Heading4,
  List,
  ListOrdered,
  Quote,
  Code,
  Link as LinkIcon,
  Image as ImageIcon,
  Table,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Info,
  Sparkles,
  Undo,
  Redo,
  Eye,
  Code2,
  Loader2,
  AlertCircle,
} from "lucide-react";

export default function RichTextEditor({ value, onChange, placeholder = "Write your blog post content here..." }) {
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);
  const [mode, setMode] = useState("visual"); // 'visual' | 'html'
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [readTime, setReadTime] = useState("1 min read");

  // Sync initial content
  useEffect(() => {
    if (editorRef.current && mode === "visual") {
      if (editorRef.current.innerHTML !== (value || "")) {
        editorRef.current.innerHTML = value || "";
      }
    }
    updateStats(value || "");
  }, [value, mode]);

  const updateStats = (html) => {
    const text = html.replace(/<[^>]+>/g, " ").trim();
    const words = text ? text.split(/\s+/).filter(Boolean).length : 0;
    setWordCount(words);
    const minutes = Math.max(1, Math.ceil(words / 200));
    setReadTime(`${minutes} min read`);
  };

  const handleVisualInput = () => {
    if (!editorRef.current) return;
    const html = editorRef.current.innerHTML;
    onChange(html);
    updateStats(html);
  };

  const exec = (command, val = null) => {
    if (mode !== "visual" || !editorRef.current) return;
    editorRef.current.focus();
    document.execCommand(command, false, val);
    handleVisualInput();
  };

  const insertHeading = (level) => {
    if (mode !== "visual") return;
    exec("formatBlock", `<h${level}>`);
  };

  const insertParagraph = () => {
    if (mode !== "visual") return;
    exec("formatBlock", "<p>");
  };

  const insertLink = () => {
    if (mode !== "visual") return;
    const url = prompt("Enter hyperlink URL (e.g. https://comparedegree.com/colleges):");
    if (url) {
      exec("createLink", url);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file.");
      return;
    }

    setIsUploadingImage(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "blog_content");

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        if (mode === "visual") {
          exec("insertHTML", `<figure class="my-6"><img src="${data.url}" alt="${file.name.replace(/\.[^/.]+$/, "")}" class="rounded-2xl max-w-full h-auto shadow-sm mx-auto" /><figcaption class="text-xs text-center text-slate-400 mt-2">Illustration: ${file.name.replace(/\.[^/.]+$/, "")}</figcaption></figure><p><br></p>`);
        } else {
          onChange((value || "") + `\n<figure class="my-6"><img src="${data.url}" alt="Illustration" class="rounded-2xl max-w-full h-auto shadow-sm" /></figure>\n`);
        }
      }
    } catch (err) {
      console.error("Image upload failed", err);
      alert("Image upload failed. Please try again.");
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const insertCallout = (type = "info") => {
    if (mode !== "visual") return;
    const calloutHtml = `
      <div class="my-6 p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-amber-900 flex items-start gap-3">
        <span class="text-xl">💡</span>
        <div>
          <strong class="block font-bold text-amber-950 text-sm mb-1">Key Takeaway / Pro Tip</strong>
          <span class="text-sm leading-relaxed">Write an insightful tip, eligibility requirement, or comparison summary here.</span>
        </div>
      </div>
      <p><br></p>
    `;
    exec("insertHTML", calloutHtml);
  };

  const insertComparisonTable = () => {
    if (mode !== "visual") return;
    const tableHtml = `
      <div class="overflow-x-auto my-6">
        <table class="w-full text-sm border-collapse rounded-xl overflow-hidden shadow-xs border border-slate-200">
          <thead>
            <tr class="bg-slate-100 text-slate-800 text-left font-bold">
              <th class="p-3 border-b border-slate-200">Parameter</th>
              <th class="p-3 border-b border-slate-200">Option A (e.g. B.Tech CSE)</th>
              <th class="p-3 border-b border-slate-200">Option B (e.g. B.Tech IT)</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-slate-100">
              <td class="p-3 font-medium text-slate-700 bg-slate-50/50">Average Fee</td>
              <td class="p-3">₹1,50,000 / year</td>
              <td class="p-3">₹1,20,000 / year</td>
            </tr>
            <tr class="border-b border-slate-100">
              <td class="p-3 font-medium text-slate-700 bg-slate-50/50">Average Salary</td>
              <td class="p-3">₹8 - 12 LPA</td>
              <td class="p-3">₹7 - 10 LPA</td>
            </tr>
            <tr>
              <td class="p-3 font-medium text-slate-700 bg-slate-50/50">Top Roles</td>
              <td class="p-3">Software Dev, AI Engineer</td>
              <td class="p-3">Systems Analyst, Cloud Eng</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p><br></p>
    `;
    exec("insertHTML", tableHtml);
  };

  return (
    <div className="w-full border border-slate-200 rounded-2xl bg-white overflow-hidden shadow-xs focus-within:ring-2 focus-within:ring-crimson/20 focus-within:border-crimson/30 transition-all">
      {/* Editor Toolbar */}
      <div className="p-2 border-b border-slate-200 bg-slate-50/80 flex flex-wrap items-center justify-between gap-1.5 sticky top-0 z-10 backdrop-blur-sm">
        <div className="flex flex-wrap items-center gap-1">
          {/* Headings */}
          <div className="flex items-center bg-white border border-slate-200 rounded-xl p-0.5 shadow-2xs">
            <button
              type="button"
              onClick={insertParagraph}
              className="px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              title="Paragraph"
            >
              P
            </button>
            <button
              type="button"
              onClick={() => insertHeading(2)}
              className="p-1.5 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              title="Heading 2 (H2)"
            >
              <Heading2 className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => insertHeading(3)}
              className="p-1.5 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              title="Heading 3 (H3)"
            >
              <Heading3 className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => insertHeading(4)}
              className="p-1.5 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              title="Heading 4 (H4)"
            >
              <Heading4 className="h-4 w-4" />
            </button>
          </div>

          {/* Formatting */}
          <div className="flex items-center bg-white border border-slate-200 rounded-xl p-0.5 shadow-2xs">
            <button
              type="button"
              onClick={() => exec("bold")}
              className="p-1.5 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              title="Bold (Ctrl+B)"
            >
              <Bold className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => exec("italic")}
              className="p-1.5 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              title="Italic (Ctrl+I)"
            >
              <Italic className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => exec("underline")}
              className="p-1.5 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              title="Underline (Ctrl+U)"
            >
              <Underline className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => exec("strikeThrough")}
              className="p-1.5 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              title="Strikethrough"
            >
              <Strikethrough className="h-4 w-4" />
            </button>
          </div>

          {/* Lists */}
          <div className="flex items-center bg-white border border-slate-200 rounded-xl p-0.5 shadow-2xs">
            <button
              type="button"
              onClick={() => exec("insertUnorderedList")}
              className="p-1.5 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              title="Bullet List"
            >
              <List className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => exec("insertOrderedList")}
              className="p-1.5 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              title="Numbered List"
            >
              <ListOrdered className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => exec("formatBlock", "<blockquote>")}
              className="p-1.5 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              title="Quote"
            >
              <Quote className="h-4 w-4" />
            </button>
          </div>

          {/* Rich Widgets */}
          <div className="flex items-center bg-white border border-slate-200 rounded-xl p-0.5 shadow-2xs">
            <button
              type="button"
              onClick={insertLink}
              className="p-1.5 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              title="Insert Link"
            >
              <LinkIcon className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploadingImage}
              className="p-1.5 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors relative"
              title="Upload & Insert Image"
            >
              {isUploadingImage ? (
                <Loader2 className="h-4 w-4 animate-spin text-crimson" />
              ) : (
                <ImageIcon className="h-4 w-4" />
              )}
            </button>
            <button
              type="button"
              onClick={() => insertCallout("info")}
              className="p-1.5 text-amber-700 hover:bg-amber-50 rounded-lg transition-colors"
              title="Insert Pro Tip / Key Takeaway Callout Box"
            >
              <Sparkles className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={insertComparisonTable}
              className="p-1.5 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              title="Insert Comparison Table"
            >
              <Table className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Right side tools: Mode switcher and stats */}
        <div className="flex items-center gap-2">
          <div className="text-[11px] font-medium text-slate-500 hidden sm:flex items-center gap-2 px-2 py-1 bg-white rounded-lg border border-slate-200 shadow-2xs">
            <span>{wordCount} words</span>
            <span>&bull;</span>
            <span className="text-crimson font-semibold">{readTime}</span>
          </div>

          <div className="flex items-center bg-white border border-slate-200 rounded-xl p-0.5 shadow-2xs">
            <button
              type="button"
              onClick={() => setMode("visual")}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
                mode === "visual"
                  ? "bg-crimson text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Eye className="h-3.5 w-3.5" />
              <span>Visual</span>
            </button>
            <button
              type="button"
              onClick={() => setMode("html")}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
                mode === "html"
                  ? "bg-crimson text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Code2 className="h-3.5 w-3.5" />
              <span>HTML</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hidden file input for content image uploads */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
      />

      {/* Editor Content Area */}
      {mode === "visual" ? (
        <div
          ref={editorRef}
          contentEditable
          onInput={handleVisualInput}
          onBlur={handleVisualInput}
          className="p-5 min-h-[360px] max-h-[560px] overflow-y-auto outline-none text-slate-800 text-sm leading-relaxed prose prose-slate max-w-none focus:outline-none"
          data-placeholder={placeholder}
          style={{ wordBreak: "break-word" }}
        />
      ) : (
        <textarea
          value={value || ""}
          onChange={(e) => {
            onChange(e.target.value);
            updateStats(e.target.value);
          }}
          placeholder="Type or paste HTML code here..."
          rows={16}
          className="w-full p-4 font-mono text-xs text-slate-800 bg-slate-900 text-slate-100 outline-none resize-y min-h-[360px]"
        />
      )}

      {/* Footer Helper */}
      <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        <div className="flex items-center gap-2">
          <span>Pro tip: Press <b>Enter</b> for new paragraphs and use <b>H2 / H3</b> for Google SEO headers.</span>
        </div>
        <div className="sm:hidden font-semibold text-crimson">{readTime}</div>
      </div>
    </div>
  );
}
