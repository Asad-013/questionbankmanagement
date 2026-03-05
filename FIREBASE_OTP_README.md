# Integrating Firebase Phone Auth with Supabase in Next.js

This guide explains how to use **Firebase Phone Authentication** (which gives you 10,000 free SMS verifications/month) and sync it with your **Supabase** database in a Next.js application.

## How it works (The Flow)
1. User enters their BD phone number (`+880...`) in your Next.js frontend.
2. Firebase sends an OTP via SMS.
3. User enters the OTP.
4. Firebase verifies the OTP and logs the user in on the client side, providing a **Firebase ID Token**.
5. Your Next.js app sends this Firebase ID Token to a secure Next.js Route Handler (`/api/auth/firebase-sync`).
6. The Route Handler uses `firebase-admin` to verify the token.
7. If valid, the Route Handler generates a **custom Supabase JWT** mapped to that phone number using your Supabase JWT Secret.
8. The Next.js client receives the Supabase custom JWT and sets it in the Supabase client, successfully authenticating the user in Supabase securely!

---

## Step 1: Firebase Console Setup
1. Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
2. Navigate to **Authentication** > **Sign-in method**.
3. Enable the **Phone** provider. 
4. In **Project Settings**, scroll down to your apps and register a new **Web App**. Copy the `firebaseConfig`.
5. Under authorized domains in Authentication, make sure `localhost` is listed for testing.
6. Go to **Project Settings** > **Service Accounts** and click **Generate new private key**. Save this JSON file securely; you will need it for the backend API route.

## Step 2: Supabase Console Setup
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard).
2. Go to **Project Settings** > **API**.
3. Under **JWT Settings**, reveal and copy your **JWT Secret**. You will need this to explicitly sign tokens that Supabase will trust.

## Step 3: Install Required Packages
In your Next.js project, install the necessary dependencies for Firebase and JWT signing:

```bash
npm install firebase firebase-admin jsonwebtoken
npm install -D @types/jsonwebtoken
```

## Step 4: Environment Variables (`.env.local`)
Add the following to your environment variables:

```ini
# Firebase Client
NEXT_PUBLIC_FIREBASE_API_KEY="your-api-key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project-id.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"

# Firebase Admin (from the Service Account JSON)
# Note: Format the private key with literal \n instead of actual line breaks
FIREBASE_CLIENT_EMAIL="firebase-adminsdk-xxx@your-project-id.iam.gserviceaccount.com"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour\nPrivate\nKey\n-----END PRIVATE KEY-----\n"

# Supabase JWT
SUPABASE_JWT_SECRET="your-supabase-jwt-secret-here"
```

## Step 5: Firebase Client Setup (`src/lib/firebase/client.ts`)
Create a file to initialize Firebase on the client side:

```typescript
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

// Prevent re-initialization in Next.js dev mode
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const firebaseAuth = getAuth(app);
```

## Step 6: Next.js API Route (`src/app/api/auth/firebase-sync/route.ts`)
This is the heart of the integration. It accepts a Firebase token, verifies it, and outputs a Supabase token.

```typescript
import { NextResponse } from "next/server";
import admin from "firebase-admin";
import jwt from "jsonwebtoken";

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

export async function POST(req: Request) {
  try {
    const { firebaseToken } = await req.json();

    // 1. Verify the Firebase token
    const decodedToken = await admin.auth().verifyIdToken(firebaseToken);
    const phoneNumber = decodedToken.phone_number;
    const uid = decodedToken.uid; // Firebase UID

    if (!phoneNumber) {
      return NextResponse.json({ error: "No phone number attached to this token" }, { status: 400 });
    }

    // 2. Generate Supabase Custom JWT
    const supabaseJwtSecret = process.env.SUPABASE_JWT_SECRET!;
    const payload = {
      aud: "authenticated",
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // 1 week
      sub: uid, // We map the Firebase UID to the Supabase User ID
      email: `${uid}@firebase-phone.local`, // Dummy email (Supabase often needs an email format)
      phone: phoneNumber,
      role: "authenticated",
      app_metadata: {
        provider: "firebase_phone",
      },
    };

    const supabaseToken = jwt.sign(payload, supabaseJwtSecret);

    return NextResponse.json({ token: supabaseToken, user: payload });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}
```

## Step 7: The Frontend Component (`src/components/PhoneAuth.tsx`)
Create a UI component for the user to enter their phone number and OTP.

```tsx
"use client";

import { useState, useEffect } from "react";
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from "firebase/auth";
import { firebaseAuth } from "@/lib/firebase/client";
import { createClient } from "@/lib/supabase/client";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export default function PhoneAuth() {
  const [phone, setPhone] = useState("+880");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const supabase = createClient();

  useEffect(() => {
    // Initialize reCAPTCHA (required for Firebase phone auth to prevent spam)
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(firebaseAuth, "recaptcha-container", {
        size: "invisible",
      });
    }
  }, []);

  const requestOTP = async () => {
    try {
      const appVerifier = window.recaptchaVerifier;
      const confirmation = await signInWithPhoneNumber(firebaseAuth, phone, appVerifier);
      setConfirmationResult(confirmation);
      alert("OTP sent!");
    } catch (error) {
      console.error(error);
      alert("Failed to send OTP.");
    }
  };

  const verifyOTP = async () => {
    if (!confirmationResult) return;
    try {
      // 1. Verify OTP with Firebase
      const result = await confirmationResult.confirm(otp);
      const firebaseToken = await result.user.getIdToken();

      // 2. Exchange Firebase token for Supabase token
      const response = await fetch("/api/auth/firebase-sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firebaseToken }),
      });

      const { token, user } = await response.json();

      if (token) {
        // 3. Set the custom session in Supabase
        await supabase.auth.setSession({
          access_token: token,
          refresh_token: token, // Important: Real implementations might need a refresh strategy
        });
        
        alert("Successfully logged into Supabase!");
        // e.g. router.push("/dashboard")
      }
    } catch (error) {
      console.error(error);
      alert("Invalid OTP");
    }
  };

  return (
    <div className="p-4 flex flex-col gap-4 max-w-sm">
      <div id="recaptcha-container"></div>
      
      {!confirmationResult ? (
        <>
          <Input 
            type="tel" 
            value={phone} 
            onChange={(e) => setPhone(e.target.value)} 
            placeholder="+8801XXXXXXXXX" 
          />
          <Button onClick={requestOTP}>Send OTP</Button>
        </>
      ) : (
        <>
          <Input 
            type="text" 
            value={otp} 
            onChange={(e) => setOtp(e.target.value)} 
            placeholder="Enter 6-digit OTP" 
          />
          <Button onClick={verifyOTP}>Verify & Login</Button>
        </>
      )}
    </div>
  );
}
```

## Considerations & Next Steps
- **Row Level Security (RLS)**: The users signed in via this Custom JWT will have a UUID equal to their `uid` from Firebase. You must ensure your tables are prepared to handle user IDs that originate from Firebase.
- **Auto-signups in public.users**: You might want to automatically create a row in your `public.users` table inside the `/api/auth/firebase-sync` block using the admin bypass if the user doesn't already exist.
- **Refresh Tokens**: A simple JWT doesn't rotate automatically. In production, consider generating true Supabase sessions or setting a long expiry, or using proper custom third-party auth patterns.

That's it! You've combined the power of Firebase's generous 10k/month free SMS tier with Supabase's powerful database.
