// app/dashboard/page.tsx
"use client"; // Indicates this component runs on the client side

import { useEffect } from "react"; // Import React hook for side effects
import { useAuth } from "@/context/AuthContext"; // Import our custom authentication hook
import { useRouter } from "next/navigation"; // Import Next.js router for navigation
import { Loader2 } from "lucide-react"; // Import a loading spinner icon

export default function Dashboard() { // Define the main Dashboard component
  const { user, profile, loading } = useAuth(); // Get user and profile data from our AuthContext
  const router = useRouter(); // Initialize the router to handle redirects

  // Effect to protect the route: If not logged in, kick them out
  useEffect(() => { // Run this code when loading status or user changes
    if (!loading && !user) { // If auth finished loading AND no user is found
      router.push("/login"); // Redirect the user to the login page
    }
  }, [loading, user, router]); // Dependencies: Re-run if these values change

  // Show a loading spinner while we check auth status
  if (loading || !user) { // If still loading or user isn't set yet
    return ( // Return the loading UI
      <div className="flex h-screen items-center justify-center"> {/* Center the spinner on screen */}
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" /> {/* Render the spinning icon */}
      </div>
    );
  }

  // Main UI: Only shows if user is logged in
  return (
    <div className="min-h-screen bg-gray-50 p-10"> {/* Page container with light gray background */}
      <div className="mx-auto max-w-2xl rounded-xl bg-white p-8 shadow-sm"> {/* White card for content */}
        
        {/* Welcome Header */}
        <h1 className="text-3xl font-bold text-gray-900"> {/* Large bold text */}
          Welcome, {user.name}! {/* Display the user's name from Google Auth */}
        </h1>

        <div className="mt-6 space-y-4"> {/* Spacing container for details */}
          
          {/* User Status Section */}
          <div className="rounded-lg border border-gray-200 p-4"> {/* Box for user info */}
            <h2 className="text-sm font-medium text-gray-500">Your Account Status</h2> {/* Label */}
            <p className="mt-1 text-lg font-semibold capitalize text-blue-600"> {/* Role text */}
              {profile?.role || "Loading..."} {/* Show the role (viewer/scribe) or loading text */}
            </p>
            <p className="text-xs text-gray-400 mt-1"> {/* Tiny helper text */}
              fetched from Appwrite Database {/* Just to confirm where this data comes from */}
            </p>
          </div>

          {/* User Email Section */}
          <div className="rounded-lg border border-gray-200 p-4"> {/* Box for email info */}
            <h2 className="text-sm font-medium text-gray-500">Email Address</h2> {/* Label */}
            <p className="mt-1 text-gray-900"> {/* Email text */}
              {user.email} {/* Show the email from Google Auth */}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}