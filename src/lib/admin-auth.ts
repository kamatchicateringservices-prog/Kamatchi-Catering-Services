import { supabase } from "@/integrations/supabase/client";

export type AdminLoginPayload = {
  userId: string;
  password: string;
};

export async function adminLoginServerFn({ data }: { data: AdminLoginPayload }) {
  try {
    const { data: isValid, error } = await supabase.rpc("verify_admin", {
      p_user_id: data.userId,
      p_password: data.password,
    });

    if (error) {
      console.error("Admin verification error:", error);
      return {
        success: false,
        error: "உள்நுழைவு சரிபார்ப்பு தோல்வியடைந்தது · Authentication failed",
      };
    }

    if (isValid === true) {
      const token =
        "admin_session_" +
        btoa(Date.now().toString() + "_" + Math.random().toString(36).substring(2));
      return {
        success: true,
        token,
      };
    }

    return {
      success: false,
      error: "தவறான பயனர் எண் அல்லது கடவுச்சொல் · Invalid User ID or Password",
    };
  } catch (err) {
    console.error("Login unexpected error:", err);
    return {
      success: false,
      error: "உள்நுழைவு பிழை · Login error",
    };
  }
}
