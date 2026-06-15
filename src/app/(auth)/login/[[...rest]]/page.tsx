import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
    return (
        <div className="flex items-center justify-center">
            <SignIn
                path="/login"
                appearance={{
                    elements: {
                        rootBox: "w-full",
                        card: "shadow-none border-0 bg-transparent p-0 w-full",
                        headerTitle: "hidden",
                        headerSubtitle: "hidden",
                        socialButtonsBlockButton:
                            "border border-border bg-background hover:bg-muted text-foreground rounded-xl h-11 font-medium transition-all",
                        dividerLine: "bg-border",
                        dividerText: "text-muted-foreground text-xs",
                        formFieldLabel: "text-sm font-medium text-foreground",
                        formFieldInput:
                            "h-11 rounded-xl border-border bg-background text-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary",
                        formButtonPrimary:
                            "h-11 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98]",
                        footerAction: "text-sm",
                        footerActionLink:
                            "text-primary hover:underline font-semibold",
                        identityPreviewText: "text-foreground",
                        identityPreviewEditButton: "text-primary",
                        formFieldSuccessText: "text-emerald-600",
                        formFieldErrorText: "text-destructive text-xs",
                        alertText: "text-destructive text-sm",
                        alert: "bg-destructive/10 border-destructive/20 rounded-xl",
                        otpCodeFieldInput:
                            "border-border rounded-lg text-foreground bg-background",
                    },
                    layout: {
                        socialButtonsPlacement: "bottom",
                    },
                }}
            />
        </div>
    );
}
