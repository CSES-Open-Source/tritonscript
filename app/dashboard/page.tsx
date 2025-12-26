"use client"; // Marks this as a Client Component in Next.js App Router

// Import React hooks for state management and side effects
import { useState, useEffect } from "react";
// Import Next.js router for programmatic navigation
import { useRouter } from "next/navigation";
// Import Appwrite SDK services and Query builder
import { databases } from "@/lib/appwrite";
// Import Query utility to build database queries
import { Query } from "appwrite";
// Import authentication context to access current user and profile data
import { useAuth } from "@/context/AuthContext";
// Import the Note interface from centralized types
import { Note } from "../types";
// Import Lucide React icons for visual UI elements
import {
  BookOpen,
  Download,
  Loader2,
  FileText,
  Calendar,
  Settings,
  AlertCircle,
} from "lucide-react";

// Main functional component for the dashboard page
export default function DashboardPage() {
  // Destructure authentication state from context provider
  const { user, profile, loading } = useAuth();
  // Initialize Next.js router for navigation between pages
  const router = useRouter();

  // State to store all fetched notes from the database
  const [notes, setNotes] = useState<Note[]>([]);
  // State to track whether the initial notes fetch is in progress
  const [loadingNotes, setLoadingNotes] = useState<boolean>(true);
  // State to store any error message that occurs during data fetching
  const [error, setError] = useState<string | null>(null);

  // Effect hook runs whenever authentication state changes
  useEffect(() => {
    // Exit early if authentication is still loading
    if (loading) return;

    // Redirect to login page if no authenticated user exists
    if (!user) {
      router.push("/login");
      return; // Stop execution after redirect
    }

    // Redirect to dashboard if profile hasn't loaded yet (shouldn't happen but safety check)
    if (!profile) {
      return; // Wait for profile to load
    }

    // Define an async function to fetch notes filtered by user's courses
    const fetchNotes = async () => {
      try {
        // Check if user has selected any courses
        if (!profile.selected_courses || profile.selected_courses.length === 0) {
          // If no courses selected, set notes to empty array and stop loading
          setNotes([]);
          setLoadingNotes(false);
          return; // Exit early - no need to query database
        }

        // Query the notes collection filtered by user's selected courses
        const response = await databases.listRows({
          databaseId: process.env.NEXT_PUBLIC_DB_ID!, // Database ID from environment variables
          tableId: process.env.NEXT_PUBLIC_NOTES_COLLECTION_ID!, // Notes collection ID from environment variables
          queries: [
            Query.equal("course_code", profile.selected_courses), // Filter: only get notes where course_code matches user's courses
            Query.orderDesc("$createdAt"), // Sort by creation date in descending order (newest first)
            Query.limit(100), // Fetch up to 100 notes (Appwrite max per request)
          ],
        });

        // Cast the response rows to Note array and update state
        setNotes(response.rows as unknown as Note[]);
      } catch (err: any) {
        // Catch block handles any errors from the try block
        console.error("Error fetching notes:", err); // Log error details to console
        // Set error message from exception or use generic fallback message
        setError(err.message || "Failed to load notes. Please try again.");
      } finally {
        // Finally block always runs regardless of success or failure
        setLoadingNotes(false); // Reset loading state
      }
    };

    // Call the fetch function to load notes
    fetchNotes();
  }, [loading, user, profile, router]); // Re-run effect when these dependencies change

  // Function to generate the Appwrite Storage file view URL for downloading PDFs
  const getFileUrl = (fileId: string): string => {
    // Construct the file view URL using Appwrite's REST API endpoint format
    return `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_STORAGE_BUCKET_ID}/files/${fileId}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`;
  };

  // Function to group notes by course code for organized display
  const groupNotesByCourse = (): { [courseCode: string]: Note[] } => {
    // Use reduce to transform flat array into object with course codes as keys
    return notes.reduce((acc, note) => {
      // Get the course code from current note
      const course = note.course_code;

      // If this course code doesn't exist in accumulator yet, initialize it as empty array
      if (!acc[course]) {
        acc[course] = [];
      }

      // Add the current note to the appropriate course array
      acc[course].push(note);

      // Return the accumulator for the next iteration
      return acc;
    }, {} as { [courseCode: string]: Note[] }); // Initial value is empty object
  };

  // Show loading spinner while authentication or notes are being fetched
  if (loading || loadingNotes) {
    return (
      // Centered container for loading state
      <div className="flex justify-center items-center min-h-screen">
        {/* Animated spinning loader icon */}
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // Show error message if data fetching failed
  if (error) {
    return (
      // Centered container for error state
      <div className="max-w-2xl mx-auto p-6 mt-8">
        {/* Error card with red border and background */}
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-lg text-center">
          {/* Error icon */}
          <AlertCircle className="w-12 h-12 mx-auto mb-4" />
          {/* Error message text */}
          <p className="text-lg font-medium">{error}</p>
          {/* Retry button */}
          <button
            onClick={() => window.location.reload()} // Reload page on click
            className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Group notes by course code for organized display
  const groupedNotes = groupNotesByCourse();
  // Get array of course codes (keys) for iteration
  const courses = Object.keys(groupedNotes).sort(); // Sort alphabetically

  // Return the rendered UI for the dashboard page
  return (
    // Main container with max width and padding
    <div className="max-w-6xl mx-auto p-6">
      {/* Header section with title and manage courses button */}
      <div className="mb-8 flex justify-between items-start">
        <div>
          {/* Page Title with Icon */}
          <h1 className="text-3xl font-bold flex items-center gap-2 mb-2">
            {/* Book icon representing notes/library */}
            <BookOpen className="w-8 h-8 text-blue-600" />
            My Notes
          </h1>
          {/* Subtitle with user role */}
          <p className="text-gray-500">
            Welcome back, <span className="font-medium">{profile?.role}</span>!
          </p>
        </div>

        {/* Manage Courses button */}
        <button
          onClick={() => router.push("/courses")} // Navigate to courses page on click
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg transition-colors"
        >
          <Settings className="w-4 h-4" />
          Manage Courses
        </button>
      </div>

      {/* Conditional rendering: Show appropriate state based on data */}
      {!profile?.selected_courses || profile.selected_courses.length === 0 ? (
        // No courses selected state
        <div className="bg-white p-12 rounded-xl shadow-sm border text-center">
          {/* Book icon in gray */}
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          {/* Empty state message */}
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            No Courses Selected
          </h2>
          <p className="text-gray-500 mb-6">
            Select the courses you want to follow to see notes here.
          </p>
          {/* Button to navigate to course selection page */}
          <button
            onClick={() => router.push("/courses")} // Navigate to courses page on click
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors inline-flex items-center gap-2"
          >
            <Settings className="w-5 h-5" />
            Select Courses
          </button>
        </div>
      ) : notes.length === 0 ? (
        // No notes available for selected courses state
        <div className="bg-white p-12 rounded-xl shadow-sm border text-center">
          {/* File icon in gray */}
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          {/* Empty state message */}
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            No Notes Available Yet
          </h2>
          <p className="text-gray-500 mb-2">
            There are no notes for your selected courses yet.
          </p>
          {/* Display list of user's selected courses */}
          <p className="text-sm text-gray-400 mb-6">
            Your courses: {profile.selected_courses.join(", ")}
          </p>
          {/* Button to manage courses */}
          <button
            onClick={() => router.push("/courses")} // Navigate to courses page on click
            className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-md transition-colors"
          >
            Change Courses
          </button>
        </div>
      ) : (
        // Main content: Display notes grouped by course
        <div className="space-y-6">
          {/* Map over each course to create course sections */}
          {courses.map((courseCode) => {
            // Get all notes for this course
            const courseNotes = groupedNotes[courseCode];

            return (
              // Course section container with unique key
              <div key={courseCode} className="bg-white rounded-xl shadow-sm border p-6">
                {/* Course header */}
                <div className="mb-4 pb-3 border-b">
                  {/* Course code and note count */}
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center justify-between">
                    <span>{courseCode}</span>
                    <span className="text-sm font-normal text-gray-500">
                      {courseNotes.length} note{courseNotes.length !== 1 ? "s" : ""}
                    </span>
                  </h2>
                </div>

                {/* Grid of note cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Map over each note to create note cards */}
                  {courseNotes.map((note) => (
                    // Note card container with unique key
                    <div
                      key={note.$id}
                      className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow"
                    >
                      {/* Note title */}
                      <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                        {note.title}
                      </h3>

                      {/* Note metadata container */}
                      <div className="space-y-2 mb-3">
                        {/* Professor info */}
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Prof:</span> {note.professor}
                        </p>
                        {/* Quarter and week info */}
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          {note.quarter} • {note.week}
                        </div>
                        {/* Upload date */}
                        <p className="text-xs text-gray-500">
                          Uploaded: {new Date(note.$createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      {/* Download button */}
                      <a
                        href={getFileUrl(note.file_id)} // Generate file URL
                        target="_blank" // Open in new tab
                        rel="noopener noreferrer" // Security best practice
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors w-full justify-center"
                      >
                        <Download className="w-4 h-4" />
                        View PDF
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}