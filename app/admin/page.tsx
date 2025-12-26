"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { databases } from "@/lib/appwrite";
import { Query }from "appwrite";

import { useAuth } from "@/context/AuthContext";
import { UserProfile } from "../types";
import { Shield, Check, X, User, Loader2 } from "lucide-react";

export default function AdminPage() {
    const { user, profile, loading } = useAuth();
    const router = useRouter();

    // sstate to store pending user
    const [pendingUsers, setPendingUsers] = useState<UserProfile[]>([]);
    const [loadingUsers, setLoadingUsers] = useState<boolean>(true);

    // state to track which user is being updated
    const [processingUserIds, setProcessingUserIds] = useState<string[]>([]);

    useEffect(() => {
        if (loading) return; // still loading auth state

        //TODO: check if user is logged in

        //TODO: check if user is an admin or not

        // defin a function to fetch pending users
        const fetchPendingUsers = async () => {
            try {
                const response = await databases.listRows(
                    {databaseId: process.env.NEXT_PUBLIC_DB_ID!,
                    tableId: process.env.NEXT_PUBLIC_PROFILES_COLLECTION_ID!,
                    queries: [Query.equal("role", "pending")]
                });
                setPendingUsers(response.rows as unknown as  UserProfile[]);
            } catch (error) {
                console.error("Error fetching pending users:", error);
            } finally {
                setLoadingUsers(false);
            }
        };

        fetchPendingUsers();
    }, [loading, user, profile]);

    // function to handle approving 
    const handleApprove = async (userId: string, rowId: string) => {
        setProcessingUserIds((prev => [...prev, userId]));

        try {
            await databases.updateRow({
                databaseId: process.env.NEXT_PUBLIC_DB_ID!,
                tableId: process.env.NEXT_PUBLIC_PROFILES_COLLECTION_ID!,
                rowId: rowId,
                data: { role: "scribe" }
            });

            // remove user from pendingUsers state
            setPendingUsers((prev) => prev.filter((user) => user.$id !== rowId));
        }
        catch (error) {
            console.error("Error updating user role:", error);
        }
        finally {
            setProcessingUserIds((prev) => prev.filter((id) => id !== userId));
        }
    };

    const handleReject  = async (userId: string, rowId: string) => {
        // To show loading state, we add current rowid to the procesing array
        setProcessingUserIds((prev => [...prev, userId]));

        try {
            await databases.updateRow({
                databaseId: process.env.NEXT_PUBLIC_DB_ID!,
                tableId: process.env.NEXT_PUBLIC_PROFILES_COLLECTION_ID!,
                rowId: rowId,
                data: { role: "rejected" }
            });

            // remove user from pending user state
            setPendingUsers((prev) => prev.filter((user) => user.$id !== rowId));
        }catch (error) {
            console.error("Error rejecting user:", error);
        }finally {
            setProcessingUserIds((prev) => prev.filter((id) => id !== userId));
        };
    }
    if (loading || loadingUsers) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="animate-spin h-10 w-10 text-gray-600" />
            </div>
        );
    }
    return (
        // Main container with max width and padding
        <div className="max-w-4xl mx-auto p-6">
          {/* Header section */}
          <div className="mb-8">
            {/* Page Title with Shield Icon */}
            <h1 className="text-3xl font-bold flex items-center gap-2">
              {/* Shield icon representing admin/security */}
              <Shield className="w-8 h-8 text-blue-600" />
              Admin Panel
            </h1>
            {/* Subtitle description */}
            <p className="text-gray-500 mt-2">
              Approve or reject pending scribe requests.
            </p>
          </div>
    
          {/* Conditional rendering: Show message if no pending users exist */}
          {pendingUsers.length === 0 ? (
            // Card displaying "no pending users" message
            <div className="bg-white p-8 rounded-xl shadow-sm border text-center">
              {/* User icon in gray */}
              <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              {/* Message text */}
              <p className="text-gray-600 text-lg">No pending users at this time.</p>
              {/* Additional helper text */}
              <p className="text-gray-400 text-sm mt-2">
                New scribe requests will appear here for approval.
              </p>
            </div>
          ) : (
            // Table displaying pending users when array is not empty
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
              {/* Responsive table wrapper for horizontal scroll on mobile */}
              <div className="overflow-x-auto">
                {/* Table element */}
                <table className="w-full">
                  {/* Table header */}
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      {/* Email column header */}
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      {/* User ID column header */}
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User ID
                      </th>
                      {/* Created date column header */}
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                      {/* Actions column header */}
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  {/* Table body */}
                  <tbody className="divide-y divide-gray-200">
                    {/* Map over pendingUsers array to create a row for each user */}
                    {pendingUsers.map((user) => {
                      // Check if this specific user is currently being processed
                      const isProcessing = processingUserIds.includes(user.$id);
                      
                      return (
                        // Table row for each user with unique key
                        <tr key={user.$id} className="hover:bg-gray-50">
                          {/* Email cell */}
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {user.email}
                          </td>
                          {/* User ID cell - truncated with ellipsis for long IDs */}
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                            {/* Show first 8 characters of user_id followed by ellipsis */}
                            {user.user_id.substring(0, 8)}...
                          </td>
                          {/* Created date cell - formatted to locale date string */}
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {/* Convert ISO timestamp to readable date format */}
                            {new Date(user.$createdAt).toLocaleDateString()}
                          </td>
                          {/* Actions cell with approve and reject buttons */}
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            {/* Flex container for buttons with gap */}
                            <div className="flex justify-center gap-2">
                              {/* Approve button - green color scheme */}
                              <button
                                onClick={() => handleApprove(user.user_id, user.$id)} // Call handleApprove on click
                                disabled={isProcessing} // Disable button while processing
                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {/* Show loader icon if processing, otherwise show check icon */}
                                {isProcessing ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Check className="w-4 h-4" />
                                )}
                                Approve
                              </button>
                              {/* Reject button - red color scheme */}
                              <button
                                onClick={() => handleReject(user.user_id, user.$id)} // Call handleReject on click
                                disabled={isProcessing} // Disable button while processing
                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {/* Show loader icon if processing, otherwise show X icon */}
                                {isProcessing ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <X className="w-4 h-4" />
                                )}
                                Reject
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      );
                
}

