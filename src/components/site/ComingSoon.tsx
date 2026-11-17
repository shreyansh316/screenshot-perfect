import { Link } from "@tanstack/react-router";
import { Hammer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState, PageHeader } from "./common";

export function ComingSoon({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <>
      <PageHeader eyebrow={eyebrow} title={title} description={description} />
      <div className="container-page py-12">
        <EmptyState
          icon={Hammer}
          title="This page is coming soon"
          description="We're still building this part of Growvia. In the meantime you can explore internships, jobs and freelance projects."
          action={<Button asChild><Link to="/explore">Explore opportunities</Link></Button>}
        />
      </div>
    </>
  );
}
