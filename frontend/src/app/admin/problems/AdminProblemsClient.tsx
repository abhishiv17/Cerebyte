"use client";

import { useState } from "react";

interface Problem {
  id: string;
  title: string;
  difficulty: string;
  topic: string;
  created_at: string;
}

interface TestCase {
  input: string;
  expected_output: string;
}

export default function AdminProblemsClient({
  initialProblems,
  accessToken,
}: {
  initialProblems: Problem[];
  accessToken: string;
}) {
  const [problems, setProblems] = useState<Problem[]>(initialProblems);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");
  const [topic, setTopic] = useState("");
  const [timeLimitMs, setTimeLimitMs] = useState(2000);
  const [memoryLimitMb, setMemoryLimitMb] = useState(256);
  const [tags, setTags] = useState("");
  const [testCases, setTestCases] = useState<TestCase[]>([
    { input: "", expected_output: "" },
  ]);

  function resetForm() {
    setTitle("");
    setDescription("");
    setDifficulty("Easy");
    setTopic("");
    setTimeLimitMs(2000);
    setMemoryLimitMb(256);
    setTags("");
    setTestCases([{ input: "", expected_output: "" }]);
    setError(null);
  }

  function addTestCase() {
    setTestCases([...testCases, { input: "", expected_output: "" }]);
  }

  function removeTestCase(idx: number) {
    setTestCases(testCases.filter((_, i) => i !== idx));
  }

  function updateTestCase(idx: number, field: keyof TestCase, value: string) {
    const updated = [...testCases];
    updated[idx][field] = value;
    setTestCases(updated);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    const payload = {
      title,
      description,
      difficulty,
      topic,
      time_limit_ms: timeLimitMs,
      memory_limit_mb: memoryLimitMb,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      test_cases: testCases
        .filter((tc) => tc.input || tc.expected_output)
        .map((tc) => ({ input: tc.input, output: tc.expected_output })),
    };

    try {
      const res = await fetch("http://localhost:8000/api/v1/problems", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail || `Failed to create problem (${res.status})`);
      }

      const newProblem = await res.json();
      setProblems([newProblem, ...problems]);
      setSuccess(`Problem "${newProblem.title}" created successfully!`);
      resetForm();
      setShowForm(false);
    } catch (err: any) {
      setError(err.message || "Failed to create problem");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(problemId: string, problemTitle: string) {
    if (!confirm(`Are you sure you want to delete "${problemTitle}"? This cannot be undone.`)) {
      return;
    }

    setDeletingId(problemId);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch(`http://localhost:8000/api/v1/problems/${problemId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail || `Failed to delete problem (${res.status})`);
      }

      setProblems(problems.filter((p) => p.id !== problemId));
      setSuccess(`Problem "${problemTitle}" deleted.`);
    } catch (err: any) {
      setError(err.message || "Failed to delete problem");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div>
      {/* Status Messages */}
      {error && (
        <div className="mb-6 px-4 py-3 border-2 border-brand-black bg-[#ffcccb] font-mono-accent text-sm font-bold shadow-brutal-sm">
          ERROR: {error}
        </div>
      )}
      {success && (
        <div className="mb-6 px-4 py-3 border-2 border-brand-black bg-[#06d6a0]/20 font-mono-accent text-sm font-bold shadow-brutal-sm">
          ✓ {success}
        </div>
      )}

      {/* Toggle Form Button */}
      <button
        onClick={() => { setShowForm(!showForm); if (!showForm) setSuccess(null); }}
        className={`brutal-button mb-8 ${showForm ? "!bg-red-400 !text-brand-black" : ""}`}
      >
        {showForm ? "✕ Cancel" : "+ New Problem"}
      </button>

      {/* Create Problem Form */}
      {showForm && (
        <form onSubmit={handleCreate} className="brutal-box p-6 md:p-8 mb-10">
          <h3 className="font-display text-xl uppercase mb-6 border-b-2 border-brand-black pb-2">
            Create New Problem
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Title */}
            <div className="md:col-span-2">
              <label className="block font-mono-accent text-xs font-bold text-brand-black uppercase mb-2">
                Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Two Sum"
                required
                className="brutal-input"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block font-mono-accent text-xs font-bold text-brand-black uppercase mb-2">
                Description * <span className="text-brand-black/40">(Markdown supported)</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Given an array of integers `nums` and an integer `target`..."
                required
                rows={4}
                className="brutal-input resize-none"
              />
            </div>

            {/* Difficulty */}
            <div>
              <label className="block font-mono-accent text-xs font-bold text-brand-black uppercase mb-2">
                Difficulty *
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="brutal-input cursor-pointer"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            {/* Topic */}
            <div>
              <label className="block font-mono-accent text-xs font-bold text-brand-black uppercase mb-2">
                Topic *
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Arrays, Dynamic Programming"
                required
                className="brutal-input"
              />
            </div>

            {/* Time Limit */}
            <div>
              <label className="block font-mono-accent text-xs font-bold text-brand-black uppercase mb-2">
                Time Limit (ms)
              </label>
              <input
                type="number"
                value={timeLimitMs}
                onChange={(e) => setTimeLimitMs(Number(e.target.value))}
                className="brutal-input"
              />
            </div>

            {/* Memory Limit */}
            <div>
              <label className="block font-mono-accent text-xs font-bold text-brand-black uppercase mb-2">
                Memory Limit (MB)
              </label>
              <input
                type="number"
                value={memoryLimitMb}
                onChange={(e) => setMemoryLimitMb(Number(e.target.value))}
                className="brutal-input"
              />
            </div>

            {/* Tags */}
            <div className="md:col-span-2">
              <label className="block font-mono-accent text-xs font-bold text-brand-black uppercase mb-2">
                Tags <span className="text-brand-black/40">(comma-separated)</span>
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g. array, hash-table, two-pointer"
                className="brutal-input"
              />
            </div>
          </div>

          {/* Test Cases */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <label className="block font-mono-accent text-xs font-bold text-brand-black uppercase">
                Test Cases
              </label>
              <button
                type="button"
                onClick={addTestCase}
                className="brutal-button-alt !py-1 !px-3 !text-xs"
              >
                + Add Case
              </button>
            </div>
            <div className="space-y-3">
              {testCases.map((tc, idx) => (
                <div
                  key={idx}
                  className="border-2 border-brand-black p-3 bg-brand-cream flex flex-col md:flex-row gap-3 relative"
                >
                  <div className="absolute -top-2 -left-1 bg-brand-black text-white font-mono-accent text-[10px] font-bold px-2 py-0.5">
                    #{idx + 1}
                  </div>
                  <div className="flex-1">
                    <label className="block font-mono-accent text-[10px] font-bold uppercase mb-1 text-brand-black/50">
                      Input
                    </label>
                    <input
                      type="text"
                      value={tc.input}
                      onChange={(e) => updateTestCase(idx, "input", e.target.value)}
                      placeholder='e.g. [2,7,11,15], 9'
                      className="brutal-input !py-2 !text-xs"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block font-mono-accent text-[10px] font-bold uppercase mb-1 text-brand-black/50">
                      Expected Output
                    </label>
                    <input
                      type="text"
                      value={tc.expected_output}
                      onChange={(e) => updateTestCase(idx, "expected_output", e.target.value)}
                      placeholder='e.g. [0,1]'
                      className="brutal-input !py-2 !text-xs"
                    />
                  </div>
                  {testCases.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTestCase(idx)}
                      className="self-end w-8 h-8 border-2 border-brand-black bg-red-400 text-white font-display text-sm flex items-center justify-center shadow-brutal-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all shrink-0"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="brutal-button w-full md:w-auto"
          >
            {isSubmitting ? "Creating..." : "Create Problem →"}
          </button>
        </form>
      )}

      {/* Problems List */}
      <div className="border-b-2 border-brand-black pb-2 mb-4 flex justify-between items-center">
        <h3 className="font-display text-xl uppercase">
          All Problems <span className="font-mono-accent text-sm text-brand-black/50 ml-2">({problems.length})</span>
        </h3>
      </div>

      {problems.length === 0 ? (
        <div className="brutal-box p-8 text-center">
          <p className="font-mono-accent text-sm text-brand-black/60 uppercase font-bold">
            No problems in the database yet. Create your first one above.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {problems.map((p) => (
            <div
              key={p.id}
              className="border-2 border-brand-black bg-white p-4 shadow-brutal-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-3 hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-brutal-hover transition-all"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-display text-lg uppercase truncate">{p.title}</h4>
                  <span
                    className={`font-mono-accent text-[10px] font-bold uppercase px-2 py-0.5 border-2 border-brand-black ${
                      p.difficulty === "Easy"
                        ? "bg-[#06d6a0]"
                        : p.difficulty === "Medium"
                        ? "bg-[#ffd166]"
                        : "bg-[#ef476f] text-white"
                    }`}
                  >
                    {p.difficulty}
                  </span>
                  <span className="font-mono-accent text-[10px] font-bold uppercase text-brand-black/40">
                    {p.topic}
                  </span>
                </div>
                <p className="font-mono-accent text-[10px] text-brand-black/40 mt-1">
                  ID: {p.id.slice(0, 8)}... · Created: {new Date(p.created_at).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => handleDelete(p.id, p.title)}
                disabled={deletingId === p.id}
                className="border-2 border-brand-black bg-red-400 hover:bg-red-500 text-brand-black font-display text-sm uppercase px-4 py-2 shadow-brutal-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all shrink-0 disabled:opacity-50"
              >
                {deletingId === p.id ? "Deleting..." : "Delete"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
