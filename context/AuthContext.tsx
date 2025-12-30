"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { account, databases, DATABASE_ID, PROFILES_COLLECTION_ID } from "@/lib/appwrite";
import { ID, Models } from "appwrite";
import { useRouter } from "next/navigation";
import { OAuthProvider, Query } from 'appwrite';

interface UserProfile {
    user_id: string;
    email: string;
    role: "viewer" | "pending" | "scribe" | "admin";
    selected_courses: string[]; // array of course codes
}

interface AuthContextType {
    user: Models.User<Models.Preferences> | null;
    profile: UserProfile | null;
    loading: boolean;
    refreshProfile: () => Promise<void>;
    login: () => void;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);



export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const login = () => {
        account.createOAuth2Session({
            provider: OAuthProvider.Google,
            success: 'http://localhost:3000/dashboard',
            failure: 'http://localhost:3000/login'
        });
    };

    const logout = async () => {
        await account.deleteSession('current');
        setUser(null);
        setProfile(null);
        router.push('/login');
        console.log("Logged out");
    };
    const refreshProfile = async () => {
        if (!user) return;
        
        try {
          const response = await databases.listRows({
            databaseId: process.env.NEXT_PUBLIC_DB_ID!,
            tableId: process.env.NEXT_PUBLIC_PROFILES_COLLECTION_ID!,
            queries: [Query.equal("user_id", user.$id)]
          });
          
          if (response.rows.length > 0) {
            setProfile(response.rows[0] as unknown as UserProfile);
          }
        } catch (error) {
          console.error("Error refreshing profile:", error);
        }
      };
      

    const checkUserStatus = async () => {
        try {
            // Check for an existing session
            const currentUser = await account.get();
            setUser(currentUser);

            // Try to get the user's profile from the database
            try {
                const existingProfile = await databases.getRow({
                    databaseId: DATABASE_ID,
                    tableId: PROFILES_COLLECTION_ID,
                    rowId: currentUser.$id
                });
                setProfile(existingProfile as unknown as UserProfile);
            } catch (err) {
                console.log("User exists but no profile assigned");

                // Create a new profile if one doesn't exist
                const newProfile = await databases.createRow({
                    databaseId: DATABASE_ID,
                    tableId: PROFILES_COLLECTION_ID,
                    rowId: currentUser.$id,
                    data: {
                        user_id: currentUser.$id,
                        email: currentUser.email,
                        role: "pending",
                    }
                });
                setProfile(newProfile as unknown as UserProfile);
            }
        } catch (err) {
            // No active session
            setUser(null);
            setProfile(null);
        } finally {
            setLoading(false);
        }
    };

    // Check user status on mount
    useEffect(() => {
        checkUserStatus();
    }, []);
    

    return (
        <AuthContext.Provider value={{ user, profile, loading, refreshProfile, login, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};