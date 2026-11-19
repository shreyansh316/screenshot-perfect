/**
 * Text-based PDF version of the resume, rendered with @react-pdf/renderer.
 * Loaded only in the browser (dynamic import) when the user downloads.
 * Mirrors the three on-screen templates in ResumeSheet.tsx.
 */
import { Document, Link, Page, StyleSheet, Text, View, pdf } from "@react-pdf/renderer";
import {
  SECTION_LABELS, bulletLines, dateRange, displayUrl, type ResumeData, type SectionKey, type TemplateKey,
} from "@/lib/resume";

// PDF documents cannot read CSS variables, so the brand palette is restated here.
const NAVY = "#142B4A";
const BLUE = "#2563EB";
const TEAL = "#16A085";
const TEXT = "#172033";
const MUTED = "#5B6577";
const RULE = "#C9D1DC";

const base = StyleSheet.create({
  page: { fontFamily: "Helvetica", color: TEXT },
  bold: { fontFamily: "Helvetica-Bold" },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  rowLeft: { flexGrow: 1, flexShrink: 1, paddingRight: 8 },
  date: { color: MUTED, flexShrink: 0 },
  muted: { color: MUTED },
  link: { color: BLUE, textDecoration: "none" },
  bulletRow: { flexDirection: "row", marginTop: 1.5 },
  bulletDot: { width: 10, color: MUTED },
  bulletText: { flex: 1 },
});

interface T {
  fontSize: number;
  padding: [number, number];
  nameSize: number;
  headerAlign: "center" | "left";
  headerRule: { width: number; color: string };
  headlineColor: string;
  h2: { size: number; color: string; upper: boolean; rule: boolean; dash: boolean };
  sectionGap: number;
  itemGap: number;
}

const TEMPLATES: Record<TemplateKey, T> = {
  classic: {
    fontSize: 10, padding: [40, 44], nameSize: 21, headerAlign: "center",
    headerRule: { width: 0.75, color: RULE }, headlineColor: MUTED,
    h2: { size: 9, color: NAVY, upper: true, rule: true, dash: false }, sectionGap: 13, itemGap: 7,
  },
  modern: {
    fontSize: 10, padding: [40, 44], nameSize: 23, headerAlign: "left",
    headerRule: { width: 2.5, color: TEAL }, headlineColor: BLUE,
    h2: { size: 10.5, color: NAVY, upper: false, rule: false, dash: true }, sectionGap: 13, itemGap: 6,
  },
  compact: {
    fontSize: 9, padding: [32, 36], nameSize: 17, headerAlign: "left",
    headerRule: { width: 0.75, color: RULE }, headlineColor: MUTED,
    h2: { size: 8.5, color: BLUE, upper: true, rule: false, dash: false }, sectionGap: 9, itemGap: 4,
  },
};

const href = (u: string) => (/^https?:\/\//i.test(u.trim()) ? u.trim() : `https://${u.trim()}`);

function Bullets({ text }: { text: string }) {
  const lines = bulletLines(text);
  if (!lines.length) return null;
  return (
    <View style={{ marginTop: 2 }}>
      {lines.map((l, i) => (
        <View key={i} style={base.bulletRow} wrap={false}>
          <Text style={base.bulletDot}>•</Text>
          <Text style={base.bulletText}>{l}</Text>
        </View>
      ))}
    </View>
  );
}

function Heading({ k, t }: { k: SectionKey; t: T }) {
  const label = t.h2.upper ? SECTION_LABELS[k].toUpperCase() : SECTION_LABELS[k];
  return (
    <View
      minPresenceAhead={40}
      style={{
        flexDirection: "row", alignItems: "center", marginBottom: 4,
        ...(t.h2.rule ? { borderBottomWidth: 0.75, borderBottomColor: RULE, paddingBottom: 2 } : {}),
      }}
    >
      {t.h2.dash && <View style={{ width: 12, height: 1.5, backgroundColor: TEAL, marginRight: 6 }} />}
      <Text style={{ ...base.bold, fontSize: t.h2.size, color: t.h2.color, letterSpacing: t.h2.upper ? 1 : 0 }}>{label}</Text>
    </View>
  );
}

function Section({ k, d, t }: { k: SectionKey; d: ResumeData; t: T }) {
  const wrapStyle = { marginTop: t.sectionGap };
  const item = { marginTop: t.itemGap };
  switch (k) {
    case "summary":
      if (!d.summary.trim()) return null;
      return <View style={wrapStyle}><Heading k={k} t={t} /><Text>{d.summary.trim()}</Text></View>;
    case "experience":
      if (!d.experience.length) return null;
      return (
        <View style={wrapStyle}>
          <Heading k={k} t={t} />
          {d.experience.map((x, i) => (
            <View key={x.id} style={i ? item : {}}>
              <View style={base.row} wrap={false}>
                <Text style={base.rowLeft}>
                  <Text style={base.bold}>{x.title}</Text>{x.company ? ` · ${x.company}` : ""}
                  {x.kind === "volunteer" ? <Text style={base.muted}> (Volunteer)</Text> : null}
                  {x.kind === "internship" ? <Text style={base.muted}> (Internship)</Text> : null}
                </Text>
                <Text style={base.date}>{dateRange(x.start, x.end, x.current)}</Text>
              </View>
              <Bullets text={x.responsibilities} />
              <Bullets text={x.achievements} />
            </View>
          ))}
        </View>
      );
    case "education":
      if (!d.education.length) return null;
      return (
        <View style={wrapStyle}>
          <Heading k={k} t={t} />
          {d.education.map((x, i) => (
            <View key={x.id} style={i ? item : {}} wrap={false}>
              <View style={base.row}>
                <Text style={base.rowLeft}>
                  <Text style={base.bold}>{[x.degree, x.field].filter(Boolean).join(", ") || x.institution}</Text>
                  {[x.degree, x.field].some(Boolean) && x.institution ? ` · ${x.institution}` : ""}
                </Text>
                <Text style={base.date}>{dateRange(x.start, x.end)}</Text>
              </View>
              {x.description.trim() ? <Text style={{ marginTop: 1.5 }}>{x.description.trim()}</Text> : null}
            </View>
          ))}
        </View>
      );
    case "projects":
      if (!d.projects.length) return null;
      return (
        <View style={wrapStyle}>
          <Heading k={k} t={t} />
          {d.projects.map((x, i) => (
            <View key={x.id} style={i ? item : {}} wrap={false}>
              <View style={base.row}>
                <Text style={base.rowLeft}>
                  <Text style={base.bold}>{x.name}</Text>
                  {x.technologies ? <Text style={base.muted}> · {x.technologies}</Text> : null}
                </Text>
                {x.url ? <Link src={href(x.url)} style={base.link}>{displayUrl(x.url)}</Link> : null}
              </View>
              {x.description.trim() ? <Text style={{ marginTop: 1.5 }}>{x.description.trim()}</Text> : null}
            </View>
          ))}
        </View>
      );
    case "skills": {
      const { technical, professional } = d.skills;
      if (!technical.length && !professional.length) return null;
      return (
        <View style={wrapStyle} wrap={false}>
          <Heading k={k} t={t} />
          {technical.length > 0 && <Text><Text style={base.bold}>Technical: </Text>{technical.join(", ")}</Text>}
          {professional.length > 0 && <Text style={{ marginTop: 1.5 }}><Text style={base.bold}>Professional: </Text>{professional.join(", ")}</Text>}
        </View>
      );
    }
    case "certifications":
      if (!d.certifications.length) return null;
      return (
        <View style={wrapStyle}>
          <Heading k={k} t={t} />
          {d.certifications.map((x, i) => (
            <View key={x.id} style={[base.row, i ? item : {}]} wrap={false}>
              <Text style={base.rowLeft}>
                <Text style={base.bold}>{x.name}</Text>{x.issuer ? ` · ${x.issuer}` : ""}
                {x.link ? <Text> · <Link src={href(x.link)} style={base.link}>{displayUrl(x.link)}</Link></Text> : null}
              </Text>
              <Text style={base.date}>{dateRange(x.date, "")}</Text>
            </View>
          ))}
        </View>
      );
    case "languages":
      if (!d.languages.length) return null;
      return (
        <View style={wrapStyle} wrap={false}>
          <Heading k={k} t={t} />
          <Text>{d.languages.map((l) => [l.name, l.level && `(${l.level})`].filter(Boolean).join(" ")).join(", ")}</Text>
        </View>
      );
    case "additional":
      if (!d.additional.trim()) return null;
      return <View style={wrapStyle}><Heading k={k} t={t} /><Bullets text={d.additional} /></View>;
  }
}

export function ResumeDocument({ data, template }: { data: ResumeData; template: TemplateKey }) {
  const t = TEMPLATES[template];
  const p = data.personal;
  const contact: { text: string; url?: string | undefined }[] = [
    { text: [p.city, p.country].filter(Boolean).join(", ") },
    { text: p.email, url: p.email ? `mailto:${p.email.trim()}` : undefined },
    { text: p.phone },
    ...[p.portfolio, p.linkedin, p.github].filter(Boolean).map((u) => ({ text: displayUrl(u), url: href(u) })),
  ].filter((c) => c.text);
  const align = t.headerAlign === "center" ? "center" : "flex-start";

  return (
    <Document title={`${p.fullName || "Resume"} — Resume`} author={p.fullName || "Growvia user"} creator="Growvia Resume Builder" producer="Growvia">
      <Page size="A4" style={{ ...base.page, fontSize: t.fontSize, lineHeight: 1.4, paddingVertical: t.padding[0], paddingHorizontal: t.padding[1] }}>
        <View style={{ alignItems: align, paddingBottom: 8, borderBottomWidth: t.headerRule.width, borderBottomColor: t.headerRule.color }}>
          <Text style={{ ...base.bold, fontSize: t.nameSize, color: NAVY, lineHeight: 1.15 }}>{p.fullName}</Text>
          {p.headline ? <Text style={{ marginTop: 2, fontSize: t.fontSize + 1, color: t.headlineColor }}>{p.headline}</Text> : null}
          {contact.length > 0 && (
            <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: align, marginTop: 4 }}>
              {contact.map((c, i) => (
                <Text key={i} style={{ fontSize: t.fontSize - 1, color: MUTED }}>
                  {i > 0 ? "  |  " : ""}
                  {c.url ? <Link src={c.url} style={{ color: MUTED, textDecoration: "none" }}>{c.text}</Link> : c.text}
                </Text>
              ))}
            </View>
          )}
        </View>
        {data.sectionOrder.map((k) => <Section key={k} k={k} d={data} t={t} />)}
        <Text
          fixed
          style={{ position: "absolute", bottom: 16, right: t.padding[1], fontSize: 7.5, color: MUTED }}
          render={({ pageNumber, totalPages }) => (totalPages > 1 ? `${pageNumber} / ${totalPages}` : "")}
        />
      </Page>
    </Document>
  );
}

export async function resumePdfBlob(data: ResumeData, template: TemplateKey): Promise<Blob> {
  return pdf(<ResumeDocument data={data} template={template} />).toBlob();
}
