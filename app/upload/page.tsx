"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { databases, storage, client, ID } from "@/lib/appwrite";
import { useAuth } from "@/context/AuthContext";
import { Upload, FileText, AlertCircle, CheckCircle } from "lucide-react";

export default function UploadPage() {
    const {user,profile, loading} = useAuth();
    const router = useRouter();

    const [file, setFile] = useState<File | null>(null);

    const [formData, setFormData] = useState({
        title: "",
        course_code: "",
        professor: "",
        quarter: "",
        week: "",
    });

    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if(loading) return; // still loading user state

        // if no user is logged in then go to /login
       
        // if user is logged in but profile is not scribe or admin, go to /dashboard
        
    }, [user, loading, profile, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const name = e.target.name;
        const value = e.target.value;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    // MAIN submission handler for form
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);
        setUploading(true);

        //TODO: ensure file is selected

        //TODO: ensure user is still logged in

        // now upload file to Appwrite Storage
        try {
            const fileResponse = await storage.createFile({
                bucketId: process.env.NEXT_PUBLIC_STORAGE_BUCKET_ID!,
                fileId: ID.unique(),
                file: file!,
            });

            const searchIndex = `${formData.title} ${formData.course_code} ${formData.professor} ${formData.quarter} ${formData.week}`.toLowerCase();

            // now create document in notes metadata collection
            const noteMetadata = await databases.createRow({
                databaseId: process.env.NEXT_PUBLIC_DB_ID!,
                tableId: process.env.NEXT_PUBLIC_NOTES_COLLECTION_ID!,
                rowId: ID.unique(),
                data: {
                    title: formData.title,
          course_code: formData.course_code,
          professor: formData.professor,
          quarter: formData.quarter,
          week: formData.week, 
          file_id: fileResponse.$id, 
          uploader_id: user.$id, 
          search_index: searchIndex, 
                }
            });


            // TODO: set success tate to true to show success message
            console.log("Upload successful:", noteMetadata);

            // TODO: reset form fields

            // clear file state
            setFile(null);

            (document.getElementById("file-upload") as HTMLInputElement).value = "";
        }
        catch(err: any){
            console.error("Upload failed:", err);
            setError(err.message ||"Upload failed. Please try again.");
        }
        finally{
            setUploading(false);
        }
    }

    // TODO: if auth context is initializing/loading, show loader

    // return the rendered ui
    return (
        // Main container with max width and padding
    <div className="max-w-2xl mx-auto p-6">
    {/* Header section */}
    <div className="mb-8">
      {/* Page Title with Icon */}
      <h1 className="text-3xl font-bold flex items-center gap-2">
        <Upload className="w-8 h-8 text-blue-600" />
        Upload Notes
      </h1>
      {/* Subtitle description */}
      <p className="text-gray-500 mt-2">Share your notes with the community.</p>
    </div>

    {/* Conditional Rendering: Success Alert */}
    {success && (
      <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg mb-6 flex items-center gap-2">
        <CheckCircle className="w-5 h-5" />
        Notes uploaded successfully!
      </div>
    )}

    {/* Conditional Rendering: Error Alert */}
    {error && (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6 flex items-center gap-2">
        <AlertCircle className="w-5 h-5" />
        {error}
      </div>
    )}

    {/* Main Form */}
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl shadow-sm border">
      
      {/* Grid layout for the text inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Note Title Input */}
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Note Title</label>
          <input
            type="text"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Intro to Graph Theory"
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Course Code Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Course Code</label>
          <input
            type="text"
            name="course_code"
            required
            value={formData.course_code}
            onChange={handleChange}
            placeholder="e.g. CSE 101"
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Professor Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Professor</label>
          <input
            type="text"
            name="professor"
            required
            value={formData.professor}
            onChange={handleChange}
            placeholder="e.g. Jones"
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Quarter Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Quarter</label>
          <input
            type="text"
            name="quarter"
            required
            value={formData.quarter}
            onChange={handleChange}
            placeholder="e.g. FA25"
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Week Input (Dropdown) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Week</label>
          <select
            name="week"
            required
            value={formData.week}
            onChange={handleChange}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-white"
          >
            <option value="">Select Week</option>
            {/* Map an array to create options for Week 1 through Week 10 */}
            {[...Array(10)].map((_, i) => (
              <option key={i} value={`Week ${i + 1}`}>Week {i + 1}</option>
            ))}
          </select>
        </div>
      </div>

      {/* File Upload Section */}
      <div className="border-t pt-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">PDF Document</label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:bg-gray-50 transition-colors text-center">
          {/* Hidden file input element */}
          <input
            type="file"
            id="file-upload"
            accept=".pdf"
            onChange={handleFileChange}
            className="hidden"
          />
          {/* Custom label acting as the upload button */}
          <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-10 h-10 text-gray-400 mb-2" />
            <span className="text-blue-600 font-medium">Click to upload PDF</span>
            <span className="text-sm text-gray-500 mt-1">
              {/* Show filename if selected, otherwise show limit hint */}
              {file ? file.name : "Maximum file size 10MB"}
            </span>
          </label>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={uploading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {/* Conditional rendering based on upload state */}
        {uploading ? (
          <>Uploading...</>
        ) : (
          <>
            <Upload className="w-4 h-4" />
            Publish Note
          </>
        )}
      </button>
    </form>
  </div>
    );

}