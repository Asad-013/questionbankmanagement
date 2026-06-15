import { redirect } from "next/navigation";

// Clerk handles password reset via its own hosted flow.
// Redirect to /login so old links land gracefully.
export default function ResetPasswordPage() {
    redirect("/login");
}
