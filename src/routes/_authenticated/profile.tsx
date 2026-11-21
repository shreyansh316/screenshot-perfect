import { useEffect, useState, type FormEvent, type KeyboardEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  User,
  GraduationCap,
  Sparkles,
  Link as LinkIcon,
  Briefcase,
  Save,
  Loader2,
  Check,
  Plus,
  X,
  Github,
  Linkedin,
  Globe,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/site/common";
import {
  useProfile,
  useUpdateProfile,
  profileCompletion,
  type ProfileRow,
} from "@/hooks/use-account";
import { useAuth, displayName } from "@/lib/auth";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({
    meta: pageMeta(
      "Your Profile — Growvia",
      "Manage your candidate profile, skills, education, and portfolio links.",
    ),
  }),
  component: ProfilePage,
});

const AVAILABILITY_OPTIONS = [
  "Available immediately",
  "Available in 2-4 weeks",
  "Available for Summer 2027",
  "Part-time / Flexible hours",
  "Not actively looking",
];

function ProfilePage() {
  const { user } = useAuth();
  const profileQuery = useProfile();
  const updateMutation = useUpdateProfile();

  const [fullName, setFullName] = useState("");
  const [headline, setHeadline] = useState("");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");
  const [education, setEducation] = useState("");
  const [experienceSummary, setExperienceSummary] = useState("");
  const [availability, setAvailability] = useState("Available immediately");
  const [freelancerIntro, setFreelancerIntro] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");

  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [interestInput, setInterestInput] = useState("");

  const [isDirty, setIsDirty] = useState(false);

  // Sync state once data loads
  useEffect(() => {
    if (profileQuery.data) {
      const d = profileQuery.data;
      setFullName(d.full_name ?? displayName(user));
      setHeadline(d.headline ?? "");
      setLocation(d.location ?? "");
      setBio(d.bio ?? "");
      setEducation(d.education ?? "");
      setExperienceSummary(d.experience_summary ?? "");
      setAvailability(d.availability || "Available immediately");
      setFreelancerIntro(d.freelancer_intro ?? "");
      setPortfolioUrl(d.portfolio_url ?? "");
      setGithubUrl(d.github_url ?? "");
      setLinkedinUrl(d.linkedin_url ?? "");
      setSkills(Array.isArray(d.skills) ? d.skills : []);
      setInterests(Array.isArray(d.interests) ? d.interests : []);
      setIsDirty(false);
    } else if (user) {
      setFullName(displayName(user));
    }
  }, [profileQuery.data, user]);

  const handleFieldChange = (setter: (v: string) => void) => (val: string) => {
    setter(val);
    setIsDirty(true);
  };

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setSkillInput("");
      setIsDirty(true);
    }
  };

  const removeSkill = (s: string) => {
    setSkills(skills.filter((item) => item !== s));
    setIsDirty(true);
  };

  const handleSkillKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSkill();
    }
  };

  const addInterest = () => {
    const trimmed = interestInput.trim();
    if (trimmed && !interests.includes(trimmed)) {
      setInterests([...interests, trimmed]);
      setInterestInput("");
      setIsDirty(true);
    }
  };

  const removeInterest = (i: string) => {
    setInterests(interests.filter((item) => item !== i));
    setIsDirty(true);
  };

  const handleInterestKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addInterest();
    }
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    await updateMutation.mutateAsync({
      full_name: fullName.trim() || null,
      headline: headline.trim() || null,
      location: location.trim() || null,
      bio: bio.trim() || null,
      education: education.trim() || null,
      experience_summary: experienceSummary.trim() || null,
      availability,
      freelancer_intro: freelancerIntro.trim() || null,
      portfolio_url: portfolioUrl.trim() || null,
      github_url: githubUrl.trim() || null,
      linkedin_url: linkedinUrl.trim() || null,
      skills,
      interests,
    });
    setIsDirty(false);
  };

  // Preview synthetic row for completion calculation
  const syntheticProfile: ProfileRow = {
    id: user?.id ?? "",
    full_name: fullName,
    headline,
    location,
    bio,
    education,
    experience_summary: experienceSummary,
    availability,
    freelancer_intro: freelancerIntro,
    portfolio_url: portfolioUrl,
    github_url: githubUrl,
    linkedin_url: linkedinUrl,
    skills,
    interests,
    avatar_path: profileQuery.data?.avatar_path ?? null,
    email_updates: profileQuery.data?.email_updates ?? true,
    portfolio_projects: profileQuery.data?.portfolio_projects ?? [],
    created_at: profileQuery.data?.created_at ?? "",
    updated_at: new Date().toISOString(),
  };

  const score = profileCompletion(syntheticProfile);

  return (
    <>
      <PageHeader
        eyebrow="Candidate Profile"
        title="Your Public & Application Profile"
        description="Keep your background, skills, and portfolio up to date so opportunities and applications reflect your strengths."
      />

      <div className="container-page py-10">
        <form onSubmit={handleSave} className="space-y-8 max-w-4xl">
          {/* Header Action Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-xl border bg-surface">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-navy">Profile Readiness: {score}%</span>
                {score === 100 && (
                  <Badge variant="teal" className="text-xs">
                    All Key Details Filled
                  </Badge>
                )}
              </div>
              <Progress value={score} className="h-1.5 w-48 sm:w-64" />
            </div>

            <Button type="submit" size="lg" disabled={updateMutation.isPending || !isDirty}>
              {updateMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" /> Saving…
                </>
              ) : (
                <>
                  <Save className="mr-2 size-4" /> Save Profile
                </>
              )}
            </Button>
          </div>

          {/* Section 1: Basic Information */}
          <div className="surface-card p-6 md:p-8 rounded-xl border bg-surface space-y-6">
            <div className="flex items-center gap-3 border-b pb-4">
              <span className="grid size-9 place-items-center rounded-md bg-blue-soft text-primary">
                <User className="size-4" />
              </span>
              <div>
                <h2 className="text-base font-semibold text-navy">Personal Details</h2>
                <p className="text-xs text-muted-foreground">Your name, headline, and bio.</p>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="grid gap-1.5">
                <Label htmlFor="prof-name">Full Name</Label>
                <Input
                  id="prof-name"
                  value={fullName}
                  onChange={(e) => handleFieldChange(setFullName)(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  className="bg-surface"
                />
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="prof-location">Location</Label>
                <Input
                  id="prof-location"
                  value={location}
                  onChange={(e) => handleFieldChange(setLocation)(e.target.value)}
                  placeholder="e.g. Pune, India or Remote"
                  className="bg-surface"
                />
              </div>
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="prof-headline">Professional Headline</Label>
              <Input
                id="prof-headline"
                value={headline}
                onChange={(e) => handleFieldChange(setHeadline)(e.target.value)}
                placeholder="e.g. Frontend Developer & CS Student · React, TypeScript"
                className="bg-surface"
              />
              <p className="text-xs text-muted-foreground">
                Appears at the top of your applications.
              </p>
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="prof-bio">Short Bio</Label>
              <Textarea
                id="prof-bio"
                rows={3}
                value={bio}
                onChange={(e) => handleFieldChange(setBio)(e.target.value)}
                placeholder="Brief summary of your learning journey, technical focus, and what kind of roles you are seeking."
                className="bg-surface resize-y"
              />
            </div>
          </div>

          {/* Section 2: Education & Experience */}
          <div className="surface-card p-6 md:p-8 rounded-xl border bg-surface space-y-6">
            <div className="flex items-center gap-3 border-b pb-4">
              <span className="grid size-9 place-items-center rounded-md bg-teal-soft text-teal">
                <GraduationCap className="size-4" />
              </span>
              <div>
                <h2 className="text-base font-semibold text-navy">Education & Background</h2>
                <p className="text-xs text-muted-foreground">
                  Degree, university, projects, and availability.
                </p>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="grid gap-1.5">
                <Label htmlFor="prof-edu">Education</Label>
                <Input
                  id="prof-edu"
                  value={education}
                  onChange={(e) => handleFieldChange(setEducation)(e.target.value)}
                  placeholder="e.g. B.Tech Computer Science, 2023-2027"
                  className="bg-surface"
                />
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="prof-avail">Current Availability</Label>
                <Select
                  value={availability}
                  onValueChange={(val) => {
                    setAvailability(val);
                    setIsDirty(true);
                  }}
                >
                  <SelectTrigger id="prof-avail" className="bg-surface">
                    <SelectValue placeholder="Select availability" />
                  </SelectTrigger>
                  <SelectContent>
                    {AVAILABILITY_OPTIONS.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="prof-exp">Experience &amp; Projects Summary</Label>
              <Textarea
                id="prof-exp"
                rows={3}
                value={experienceSummary}
                onChange={(e) => handleFieldChange(setExperienceSummary)(e.target.value)}
                placeholder="Highlight your key side projects, hackathons, academic work, or previous internships."
                className="bg-surface resize-y"
              />
            </div>
          </div>

          {/* Section 3: Skills & Interests */}
          <div className="surface-card p-6 md:p-8 rounded-xl border bg-surface space-y-6">
            <div className="flex items-center gap-3 border-b pb-4">
              <span className="grid size-9 place-items-center rounded-md bg-navy text-navy-foreground">
                <Sparkles className="size-4" />
              </span>
              <div>
                <h2 className="text-base font-semibold text-navy">Skills &amp; Interests</h2>
                <p className="text-xs text-muted-foreground">
                  Add tags to match with opportunities.
                </p>
              </div>
            </div>

            {/* Skills */}
            <div className="space-y-3">
              <Label htmlFor="skill-input">Skills (Technical &amp; Functional)</Label>
              <div className="flex gap-2">
                <Input
                  id="skill-input"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleSkillKeyDown}
                  placeholder="Type a skill and press Enter (e.g. React, SQL, Figma)"
                  className="bg-surface"
                />
                <Button type="button" variant="outline" onClick={addSkill}>
                  <Plus className="size-4 mr-1" /> Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {skills.map((s) => (
                  <Badge key={s} variant="blue" className="gap-1 py-1 px-2.5 text-xs">
                    {s}
                    <button
                      type="button"
                      onClick={() => removeSkill(s)}
                      className="hover:text-destructive focus:outline-none"
                      aria-label={`Remove skill ${s}`}
                    >
                      <X className="size-3" />
                    </button>
                  </Badge>
                ))}
                {skills.length === 0 && (
                  <p className="text-xs text-muted-foreground italic">No skills added yet.</p>
                )}
              </div>
            </div>

            {/* Interests */}
            <div className="space-y-3 pt-2">
              <Label htmlFor="interest-input">Career Fields &amp; Interests</Label>
              <div className="flex gap-2">
                <Input
                  id="interest-input"
                  value={interestInput}
                  onChange={(e) => setInterestInput(e.target.value)}
                  onKeyDown={handleInterestKeyDown}
                  placeholder="Type an interest and press Enter (e.g. Open Source, Machine Learning)"
                  className="bg-surface"
                />
                <Button type="button" variant="outline" onClick={addInterest}>
                  <Plus className="size-4 mr-1" /> Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {interests.map((item) => (
                  <Badge key={item} variant="teal" className="gap-1 py-1 px-2.5 text-xs">
                    {item}
                    <button
                      type="button"
                      onClick={() => removeInterest(item)}
                      className="hover:text-destructive focus:outline-none"
                      aria-label={`Remove interest ${item}`}
                    >
                      <X className="size-3" />
                    </button>
                  </Badge>
                ))}
                {interests.length === 0 && (
                  <p className="text-xs text-muted-foreground italic">No interests added yet.</p>
                )}
              </div>
            </div>
          </div>

          {/* Section 4: External Links & Portfolio */}
          <div className="surface-card p-6 md:p-8 rounded-xl border bg-surface space-y-6">
            <div className="flex items-center gap-3 border-b pb-4">
              <span className="grid size-9 place-items-center rounded-md bg-muted text-foreground">
                <LinkIcon className="size-4" />
              </span>
              <div>
                <h2 className="text-base font-semibold text-navy">Online Presence</h2>
                <p className="text-xs text-muted-foreground">
                  Portfolio, GitHub, and professional links.
                </p>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-3">
              <div className="grid gap-1.5">
                <Label htmlFor="prof-portfolio" className="flex items-center gap-1.5">
                  <Globe className="size-3.5 text-muted-foreground" /> Portfolio / Website
                </Label>
                <Input
                  id="prof-portfolio"
                  type="url"
                  value={portfolioUrl}
                  onChange={(e) => handleFieldChange(setPortfolioUrl)(e.target.value)}
                  placeholder="https://yourname.dev"
                  className="bg-surface"
                />
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="prof-github" className="flex items-center gap-1.5">
                  <Github className="size-3.5 text-muted-foreground" /> GitHub
                </Label>
                <Input
                  id="prof-github"
                  type="url"
                  value={githubUrl}
                  onChange={(e) => handleFieldChange(setGithubUrl)(e.target.value)}
                  placeholder="https://github.com/..."
                  className="bg-surface"
                />
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="prof-linkedin" className="flex items-center gap-1.5">
                  <Linkedin className="size-3.5 text-muted-foreground" /> LinkedIn
                </Label>
                <Input
                  id="prof-linkedin"
                  type="url"
                  value={linkedinUrl}
                  onChange={(e) => handleFieldChange(setLinkedinUrl)(e.target.value)}
                  placeholder="https://linkedin.com/in/..."
                  className="bg-surface"
                />
              </div>
            </div>
          </div>

          {/* Section 5: Freelancer Pitch */}
          <div className="surface-card p-6 md:p-8 rounded-xl border bg-surface space-y-6">
            <div className="flex items-center gap-3 border-b pb-4">
              <span className="grid size-9 place-items-center rounded-md bg-teal-soft text-teal">
                <Briefcase className="size-4" />
              </span>
              <div>
                <h2 className="text-base font-semibold text-navy">Freelance Client Intro</h2>
                <p className="text-xs text-muted-foreground">
                  Optional intro note used when pitching for freelance contracts.
                </p>
              </div>
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="prof-freelance">Freelance Intro Note</Label>
              <Textarea
                id="prof-freelance"
                rows={3}
                value={freelancerIntro}
                onChange={(e) => handleFieldChange(setFreelancerIntro)(e.target.value)}
                placeholder="Explain what deliverables you offer (e.g. landing pages, brand identity, API development), your turn-around time, and past results."
                className="bg-surface resize-y"
              />
            </div>
          </div>

          {/* Footer Save Button */}
          <div className="flex justify-end pt-4">
            <Button type="submit" size="lg" disabled={updateMutation.isPending || !isDirty}>
              {updateMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" /> Saving changes…
                </>
              ) : (
                <>
                  <Save className="mr-2 size-4" /> Save Profile Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
