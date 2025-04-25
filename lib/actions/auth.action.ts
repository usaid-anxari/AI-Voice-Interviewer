"use server";

import { auth, db } from "@/firebase/admin";
import { cookies } from "next/headers";

// import { db } from "@/firebase/admin";

const ONE_WEEK = 60 * 60 * 24 * 7;

export async function signUp(params: SignUpParams) {
  const { uid, name, email } = params;

  try {
    const userRecord = await db.collection("user").doc(uid).get();
    if (userRecord.exists) {
      return {
        success: false,
        message: "User already exists",
      };
    }

    await db.collection("user").doc(uid).set({
      name,
      email,
    });

    return {
      success: true,
      message: "Account created successfully. Please Sign in.",
    };
  } catch (e: any) {
    console.error("Error creating a user ", e);

    if (e.code === "auth/email-already-exists") {
      return {
        success: false,
        message: "This email is already in use",
      };
    }

    return {
      success: false,
      message: "Failed to create an account",
    };
  }
}

export async function signIn(params: SignInParams) {
  const { email, idToken } = params;

  try {
    const userRecord = await auth.getUserByEmail(email);

    if (!userRecord) {
      return {
        success: false,
        message: "User does not exist. Create an account First",
      };
    }

    await setSessionCookie(idToken);
  } catch (error) {
    console.log(error);

    return {
      success: false,
      message: "Faild to log into an account.",
    };
  }
}

export async function setSessionCookie(idToken: string) {
  const cookieStore = await cookies();

  const sessionCokie = await auth.createSessionCookie(idToken, {
    expiresIn: ONE_WEEK * 1000,
  });

  cookieStore.set("session", sessionCokie, {
    maxAge: ONE_WEEK,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
  });
}
export async function signOut(){
    const clearCookie = await cookies();

    clearCookie.delete("session",)
    

}

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();

  const sessionCookie = cookieStore.get("session")?.value;

  if (!sessionCookie) return null;

  try {
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);

    const userRecord = await db.collection("user").doc(decodedClaims.uid).get();

    if (!userRecord.exists) return null;

    return {
      ...userRecord.data(),
      id: userRecord.id,
    } as User;
  } catch (error) {
    console.log(error);

    return null;
  }
}


export async function isAuthenticated() {
  const user = await getCurrentUser();

  return !!user;
}

// export async function getInterviewByUserId(
//   userId: string
// ): Promise<Interview[] | null> {
//   const interview = await db
//     .collection("interview")
//     .where("userId", "==", userId)
//     .orderBy("createdAt", "desc")
//     .get();
//   return interview.docs.map((doc) => ({
//     id: doc.id,
//     ...doc.data(),
//   })) as Interview[];
// }

// export async function getLatestInterview(
//   params: GetLatestInterviewsParams
// ): Promise<Interview[] | null> {
//   const { userId, limit = 20 } = params;

//   const interview = await db
//     .collection("interview")
//     .orderBy("createdAt", "desc")
//     .where("finalized", "==", true)
//     .where('userId','!=',userId)
//     .limit(limit)
//     .get();
//   return interview.docs.map((doc) => ({
//     id: doc.id,
//     ...doc.data(),
//   })) as Interview[];
// }
