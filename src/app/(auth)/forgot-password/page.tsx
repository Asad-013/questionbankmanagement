import { redirect } from "next/navigation";

// Clerk's <SignIn /> component handles "Forgot password?" natively.
// This route redirects there so no old bookmarks break.
export default function ForgotPasswordPage() {
    redirect("/login");
}
