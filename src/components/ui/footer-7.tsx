import React from "react";

interface Footer7Props {
    logo?: {
        url: string;
        title: string;
    };
    description?: string;
    copyright?: string;
    legalLinks?: Array<{
        name: string;
        href: string;
    }>;
}

const defaultLegalLinks = [
    { name: "Terms of Service", href: "#" },
    { name: "Privacy Policy", href: "#" },
    { name: "DU Guidelines", href: "#" },
];

const departments = [
    "Leather Engineering",
    "Leather Products Engineering",
    "Footwear Engineering"
];

export const Footer7 = ({
    logo = {
        url: "/",
        title: "ILET Archive",
    },
    description = "Official decentralized Question Bank for the Institute of Leather Engineering and Technology, University of Dhaka.",
    copyright = "© 2026 ILET Question Bank. Affiliated with University of Dhaka.",
    legalLinks = defaultLegalLinks,
}: Footer7Props) => {
    return (
        <section className="py-12 md:py-20 border-t bg-muted/10">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 items-start">
                    <div className="space-y-6">
                        <div className="flex items-center gap-2">
                            <div className="h-9 w-9 rounded-xl bg-primary text-white flex items-center justify-center font-bold shadow-lg shadow-primary/20">DU</div>
                            <h2 className="text-xl font-bold tracking-tight">{logo.title}</h2>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
                            {description}
                        </p>
                    </div>

                    <div className="space-y-6">
                        <h3 className="font-bold text-sm uppercase tracking-widest text-primary/80">Departments</h3>
                        <ul className="space-y-3 text-sm text-muted-foreground font-medium">
                            {departments.map((dept, idx) => (
                                <li key={idx} className="transition-colors hover:text-foreground italic">
                                    {dept}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="space-y-6">
                        <h3 className="font-bold text-sm uppercase tracking-widest text-primary/80">Support</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Questions? Contact your department administration or report issues via the portal.
                        </p>
                        <ul className="flex flex-wrap gap-4 text-xs font-semibold uppercase tracking-tighter">
                            {legalLinks.map((link, idx) => (
                                <li key={idx}>
                                    <a href={link.href} className="hover:text-primary transition-colors">
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                            <li>
                                <a href="/admin" className="text-primary hover:underline transition-colors border-l pl-4 border-primary/20">
                                    Admin Portal
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                    <p>{copyright}</p>
                    <p>Designed for ILET Students</p>
                </div>
            </div>
        </section>
    );
};
