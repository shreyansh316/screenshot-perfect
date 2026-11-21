import { describe, expect, it } from "vitest";
import { profileCompletion, type ProfileRow } from "@/hooks/use-account";

describe("Account & Profile Completeness", () => {
  it("calculates 0% for empty profile", () => {
    expect(profileCompletion(null)).toBe(0);
    expect(profileCompletion(undefined)).toBe(0);
  });

  it("calculates partial and full completion correctly", () => {
    const profile: ProfileRow = {
      id: "user-123",
      full_name: "Sarah Chen",
      headline: "Full Stack Engineer",
      location: "San Francisco, CA",
      bio: "Passionate about open-source and scalable cloud services.",
      education: "BS Computer Science",
      experience_summary: "Former intern at tech startup",
      availability: "Immediate",
      freelancer_intro: "Available for React & Node projects",
      portfolio_url: "https://sarahchen.dev",
      github_url: "https://github.com/sarahchen",
      linkedin_url: "https://linkedin.com/in/sarahchen",
      skills: ["React", "TypeScript", "PostgreSQL"],
      interests: ["Cloud Infrastructure", "UI Engineering"],
      avatar_path: null,
      email_updates: true,
      portfolio_projects: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    expect(profileCompletion(profile)).toBe(100);

    // If skills are less than 3
    const incompleteSkills = { ...profile, skills: ["React"] };
    expect(profileCompletion(incompleteSkills)).toBeLessThan(100);
  });
});
