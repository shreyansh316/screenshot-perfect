import { describe, expect, it } from "vitest";
import {
  DEFAULT_ORDER,
  SECTION_LABELS,
  TEMPLATES,
  bulletLines,
  dateRange,
  displayUrl,
  emptyEducation,
  emptyExperience,
  emptyProject,
  emptyResume,
  errorsForStep,
  formatMonth,
  isValidEmail,
  isValidPhone,
  isValidRange,
  isValidUrl,
  moveSection,
  normalizeResume,
  resumeCompletion,
  stepForError,
  validatePersonal,
  validateResume,
  type ResumeData,
  type SectionKey,
} from "@/lib/resume";

describe("Resume Builder - Core Logic & Capabilities", () => {
  it("initializes an empty resume with 8 default ordered sections and correct defaults", () => {
    const resume = emptyResume();
    expect(resume.sectionOrder).toHaveLength(8);
    expect(resume.sectionOrder).toEqual(DEFAULT_ORDER);
    expect(resume.education).toEqual([]);
    expect(resume.experience).toEqual([]);
    expect(resume.projects).toEqual([]);
    expect(resume.skills.technical).toEqual([]);
  });

  it("supports all 3 templates (classic, modern, compact)", () => {
    expect(TEMPLATES).toHaveLength(3);
    const keys = TEMPLATES.map((t) => t.key);
    expect(keys).toContain("classic");
    expect(keys).toContain("modern");
    expect(keys).toContain("compact");
  });

  describe("Validation & 8-step form error mapping", () => {
    it("validates required personal fields and maps errors correctly", () => {
      const emptyP = emptyResume().personal;
      const errors = validatePersonal(emptyP);
      expect(errors["fullName"]).toBeDefined();
      expect(errors["email"]).toBeDefined();

      expect(stepForError("fullName")).toBe("personal");
      expect(stepForError("email")).toBe("personal");
      expect(stepForError("education.0.institution")).toBe("education");
      expect(stepForError("experience.0.title")).toBe("experience");
      expect(stepForError("projects.0.name")).toBe("projects");
      expect(stepForError("certifications.0.name")).toBe("certifications");
      expect(stepForError("languages.0.name")).toBe("additional");
      expect(stepForError("linkedin")).toBe("additional");
    });

    it("correctly filters errors by step", () => {
      const allErrors = {
        fullName: "Name required",
        email: "Email required",
        "education.0.institution": "Add institution",
        "projects.0.name": "Add project name",
      };

      const personalErrors = errorsForStep(allErrors, "personal");
      expect(Object.keys(personalErrors)).toEqual(["fullName", "email"]);

      const eduErrors = errorsForStep(allErrors, "education");
      expect(Object.keys(eduErrors)).toEqual(["education.0.institution"]);

      const projErrors = errorsForStep(allErrors, "projects");
      expect(Object.keys(projErrors)).toEqual(["projects.0.name"]);
    });

    it("validates date ranges, emails, and URLs", () => {
      expect(isValidEmail("candidate@growvia.com")).toBe(true);
      expect(isValidEmail("invalid-email")).toBe(false);

      expect(isValidPhone("+91 98765 43210")).toBe(true);
      expect(isValidPhone("123")).toBe(false);

      expect(isValidUrl("https://github.com/growvia")).toBe(true);
      expect(isValidUrl("not-a-valid-domain")).toBe(false);

      expect(isValidRange("2023-01", "2024-05")).toBe(true);
      expect(isValidRange("2025-06", "2024-01")).toBe(false);
    });
  });

  describe("Section reordering & Item operations (Add/Edit/Delete/Reorder)", () => {
    it("reorders sections up and down safely within bounds", () => {
      const order: SectionKey[] = [...DEFAULT_ORDER];
      expect(order[0]).toBe("summary");
      expect(order[1]).toBe("education");

      // Move education up (index 1 to 0)
      const movedUp = moveSection(order, "education", -1);
      expect(movedUp[0]).toBe("education");
      expect(movedUp[1]).toBe("summary");

      // Moving first item up does nothing
      const noOpUp = moveSection(movedUp, "education", -1);
      expect(noOpUp).toEqual(movedUp);

      // Moving last item down does nothing
      const last = order[order.length - 1]!;
      const noOpDown = moveSection(order, last, 1);
      expect(noOpDown).toEqual(order);
    });

    it("supports adding, editing, and deleting section items", () => {
      const resume = emptyResume();

      // Add
      const edu = emptyEducation();
      edu.institution = "IIT Bombay";
      edu.degree = "B.Tech";
      resume.education.push(edu);
      expect(resume.education).toHaveLength(1);

      // Edit
      resume.education[0]!.degree = "M.Tech";
      expect(resume.education[0]!.degree).toBe("M.Tech");

      // Delete
      resume.education.splice(0, 1);
      expect(resume.education).toHaveLength(0);
    });
  });

  describe("Normalization & Autosave Schema Integrity", () => {
    it("normalizes incomplete, legacy or corrupt database drafts safely", () => {
      const partial = {
        personal: { fullName: "Aanya Rao" },
        summary: "Software developer",
        // missing education, experience, sectionOrder
      };

      const normalized = normalizeResume(partial);
      expect(normalized.personal.fullName).toBe("Aanya Rao");
      expect(normalized.personal.email).toBe("");
      expect(normalized.education).toEqual([]);
      expect(normalized.sectionOrder).toHaveLength(8);
      expect(normalized.sectionOrder).toEqual(DEFAULT_ORDER);
    });
  });

  describe("Resume Completion Percentage", () => {
    it("calculates progress percentage accurately", () => {
      const resume = emptyResume();
      expect(resumeCompletion(resume)).toBe(0);

      resume.personal.fullName = "Test User";
      resume.personal.email = "test@example.com";
      resume.personal.headline = "Frontend Engineer";
      resume.personal.city = "Pune";
      resume.summary =
        "A passionate software engineer dedicated to building scalable web applications with clean code.";
      resume.education.push(emptyEducation());
      resume.projects.push(emptyProject());
      resume.skills.technical = ["React", "TypeScript", "Node.js"];

      const score = resumeCompletion(resume);
      expect(score).toBe(100);
    });
  });

  describe("Text & Formatting Helpers", () => {
    it("formats month strings and ranges", () => {
      expect(formatMonth("2024-03")).toBe("Mar 2024");
      expect(dateRange("2023-01", "2024-06")).toBe("Jan 2023 – Jun 2024");
      expect(dateRange("2024-01", "", true)).toBe("Jan 2024 – Present");
    });

    it("parses bullet lines cleanly from multiline text", () => {
      const text = `
        • Built scalable API endpoints with TypeScript
        - Improved database query latency by 40%
        * Collaborated across product and engineering teams
      `;
      const lines = bulletLines(text);
      expect(lines).toHaveLength(3);
      expect(lines[0]).toBe("Built scalable API endpoints with TypeScript");
      expect(lines[1]).toBe("Improved database query latency by 40%");
      expect(lines[2]).toBe("Collaborated across product and engineering teams");
    });

    it("cleans URLs for concise resume display", () => {
      expect(displayUrl("https://github.com/growvia/")).toBe("github.com/growvia");
      expect(displayUrl("http://myportfolio.dev")).toBe("myportfolio.dev");
    });
  });
});
