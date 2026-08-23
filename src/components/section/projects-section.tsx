import { CoverflowCarousel, type CoverflowSlide } from "@/components/ui/coverflow-carousel";
import { DATA } from "@/data/resume";

function hostOf(url: string) {
    try {
        return new URL(url).hostname.replace(/^www\./, "");
    } catch {
        return "";
    }
}

export default function ProjectsSection() {
    const slides: CoverflowSlide[] = DATA.projects.map((project) => {
        const host = hostOf(project.href);
        return {
            src: project.image,
            alt: project.title,
            title: project.title,
            // The live domain earns its place over the dates; fall back to the
            // dates for the work that has no public URL.
            subtitle: host ? `${host} · ${project.dates}` : project.dates,
            href: project.href || undefined,
            // The subtitle already carries the dates, so meta stays on the stack.
            meta: [
                { label: "Stack", value: project.technologies.slice(0, 3).join(", ") },
            ],
        };
    });

    return (
        <section id="projects">
            <div className="flex min-h-0 flex-col gap-y-8">
                <div className="flex flex-col gap-y-4 items-center justify-center">
                    <div className="flex items-center w-full">
                        <div className="flex-1 h-px bg-linear-to-r from-transparent from-5% via-border via-95% to-transparent" />
                        <div className="border bg-primary z-10 rounded-xl px-4 py-1">
                            <span className="text-background text-sm font-medium">My Projects</span>
                        </div>
                        <div className="flex-1 h-px bg-linear-to-l from-transparent from-5% via-border via-95% to-transparent" />
                    </div>
                    <div className="flex flex-col gap-y-3 items-center justify-center">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Check out my latest work</h2>
                        <p className="text-muted-foreground md:text-lg/relaxed lg:text-base/relaxed xl:text-lg/relaxed text-balance text-center">
                            Platforms I&apos;ve shipped end-to-end and the real-time systems
                            behind them. Drag, or use the arrows — the centre card opens the
                            live site.
                        </p>
                    </div>
                </div>
                <CoverflowCarousel
                    slides={slides}
                    label="Projects"
                    showCaption
                    showPagination
                    showNavigation
                    cardWidth="clamp(190px, 25vw, 340px)"
                    fade={0.07}
                    depth={0.55}
                />
            </div>
        </section>
    );
}
