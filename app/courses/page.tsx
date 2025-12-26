"use client"; // Marks this as a Client Component in Next.js App Router

// Import React hooks for state management and side effects
import { useState, useEffect } from "react";
// Import Next.js router for programmatic navigation
import { useRouter } from "next/navigation";
// Import Appwrite SDK databases service
import { databases } from "@/lib/appwrite";
// Import authentication context to access current user and profile data
import { useAuth } from "@/context/AuthContext";
// Import Lucide React icons for visual UI elements
import { BookOpen, Plus, X, Loader2, Save, CheckCircle } from "lucide-react";

// Main functional component for the course selection page
export default function CoursesPage() {
  // Destructure authentication state from context provider
  const { user, profile, loading, refreshProfile } = useAuth();
  // Initialize Next.js router for navigation between pages
  const router = useRouter();

  // State to store the user's currently selected courses (array of course codes)
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  // State to store the value of the new course input field
  const [newCourse, setNewCourse] = useState<string>("");
  // State to track whether the save operation is in progress
  const [saving, setSaving] = useState<boolean>(false);
  // State to track whether the save was successful (for showing success message)
  const [saved, setSaved] = useState<boolean>(false);
  // State to store any error message that occurs during save
  const [error, setError] = useState<string | null>(null);

  // Effect hook runs when authentication state or profile changes
  useEffect(() => {
    // Exit early if authentication is still loading
    if (loading) return;

    // Redirect to login page if no authenticated user exists
    if (!user) {
      router.push("/login");
      return; // Stop execution after redirect
    }

    // If profile exists and has selected_courses, load them into state
    if (profile && profile.selected_courses) {
      setSelectedCourses(profile.selected_courses); // Initialize state with saved courses
    }
  }, [loading, user, profile, router]); // Re-run effect when these dependencies change

  // Function to add a new course to the selected courses array
  const handleAddCourse = () => {
    // Trim whitespace and convert to uppercase for consistency (e.g., "cse 101" → "CSE 101")
    const trimmedCourse = newCourse.trim().toUpperCase();

    // Validation: Check if input is empty after trimming
    if (!trimmedCourse) {
      setError("Please enter a course code."); // Set error message
      return; // Stop execution
    }

    // Validation: Check if course already exists in the array (prevent duplicates)
    if (selectedCourses.includes(trimmedCourse)) {
      setError("This course is already in your list."); // Set error message
      return; // Stop execution
    }

    // Add the new course to the array using spread operator
    setSelectedCourses([...selectedCourses, trimmedCourse]);
    // Clear the input field
    setNewCourse("");
    // Clear any previous error messages
    setError(null);
  };

  // Function to remove a course from the selected courses array
  const handleRemoveCourse = (courseToRemove: string) => {
    // Filter out the course to remove, keeping all others
    setSelectedCourses(selectedCourses.filter((c) => c !== courseToRemove));
  };

  // Function to save the selected courses to the user's profile in database
  const handleSave = async () => {
    // Validation: Ensure user and profile exist
    if (!user || !profile) {
      setError("User profile not found."); // Set error message
      return; // Stop execution
    }

    setSaving(true); // Set saving flag to show loading state
    setError(null); // Clear any previous errors
    setSaved(false); // Reset saved state

    try {
      // Update the user's profile document in Appwrite database
      await databases.updateRow({
        databaseId: process.env.NEXT_PUBLIC_DB_ID!, // Database ID from environment variables
        tableId: process.env.NEXT_PUBLIC_PROFILES_COLLECTION_ID!, // Profiles collection ID from environment variables
        rowId: profile.user_id, // The document ID of the current user's profile
        data: {
          selected_courses: selectedCourses, // Update the selected_courses field with new array
        },
      });

      // Set saved state to true to show success message
      setSaved(true);

      // Refresh the profile in AuthContext so it has the latest data
      if (refreshProfile) {
        await refreshProfile(); // Call the refresh function from context
      }

      // Auto-hide success message after 2 seconds
      setTimeout(() => {
        setSaved(false);
      }, 2000);
    } catch (err: any) {
      // Catch block handles any errors from the try block
      console.error("Error saving courses:", err); // Log error details to console
      // Set error message from exception or use generic fallback message
      setError(err.message || "Failed to save courses. Please try again.");
    } finally {
      // Finally block always runs regardless of success or failure
      setSaving(false); // Reset saving state
    }
  };

  // Function to handle Enter key press in the input field
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Check if the pressed key is Enter
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent default form submission behavior
      handleAddCourse(); // Call the add course function
    }
  };

  // Show loading spinner while authentication state is being determined
  if (loading) {
    return (
      // Centered container for loading state
      <div className="flex justify-center items-center min-h-screen">
        {/* Animated spinning loader icon */}
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // Return the rendered UI for the course selection page
  return (
    // Main container with max width and padding
    <div className="max-w-3xl mx-auto p-6">
      {/* Header section */}
      <div className="mb-8">
        {/* Page Title with Icon */}
        <h1 className="text-3xl font-bold flex items-center gap-2">
          {/* Book icon representing courses */}
          <BookOpen className="w-8 h-8 text-blue-600" />
          My Courses
        </h1>
        {/* Subtitle description */}
        <p className="text-gray-500 mt-2">
          Select the courses you want to see notes for. Only notes from these
          courses will appear on your dashboard.
        </p>
      </div>

      {/* Main card container */}
      <div className="bg-white rounded-xl shadow-sm border p-6 space-y-6">
        {/* Add Course Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Add a Course
          </label>
          {/* Input group with button */}
          <div className="flex gap-2">
            {/* Course code input field */}
            <input
              type="text" // Text input type
              value={newCourse} // Controlled input - value from state
              onChange={(e) => setNewCourse(e.target.value)} // Update state on every keystroke
              onKeyPress={handleKeyPress} // Handle Enter key press
              placeholder="e.g., CSE 101, MATH 20C" // Placeholder text
              className="flex-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none uppercase" // Uppercase class auto-capitalizes
            />
            {/* Add button */}
            <button
              onClick={handleAddCourse} // Call add function on click
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>
          {/* Helper text */}
          <p className="text-xs text-gray-500 mt-1">
            Press Enter or click Add to include the course
          </p>
        </div>

        {/* Error message display */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Success message display */}
        {saved && (
          <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-lg text-sm flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Courses saved successfully!
          </div>
        )}

        {/* Selected Courses List Section */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            Your Courses ({selectedCourses.length})
          </h2>

          {/* Conditional rendering: Show message if no courses selected */}
          {selectedCourses.length === 0 ? (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No courses selected yet.</p>
              <p className="text-sm text-gray-500 mt-1">
                Add courses above to customize your dashboard.
              </p>
            </div>
          ) : (
            // Grid of course chips when courses exist
            <div className="flex flex-wrap gap-2">
              {/* Map over selected courses to create chips */}
              {selectedCourses.map((course) => (
                // Individual course chip with unique key
                <div
                  key={course}
                  className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-medium"
                >
                  {/* Course code text */}
                  <span>{course}</span>
                  {/* Remove button */}
                  <button
                    onClick={() => handleRemoveCourse(course)} // Call remove function with course code
                    className="hover:bg-blue-200 rounded-full p-1 transition-colors"
                    aria-label={`Remove ${course}`} // Accessibility label
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action buttons section */}
        <div className="flex gap-3 pt-4 border-t">
          {/* Save button */}
          <button
            onClick={handleSave} // Call save function on click
            disabled={saving || selectedCourses.length === 0} // Disable if saving or no courses
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {/* Conditional rendering based on saving state */}
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Courses
              </>
            )}
          </button>

          {/* Go to Dashboard button */}
          <button
            onClick={() => router.push("/dashboard")} // Navigate to dashboard on click
            className="px-6 py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>

      {/* Info box at bottom */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Tip:</strong> You can come back to this page anytime to add
          or remove courses. Your dashboard will automatically update to show
          only notes from your selected courses.
        </p>
      </div>
    </div>
  );
}