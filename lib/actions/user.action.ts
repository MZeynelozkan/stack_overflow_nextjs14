"use server";

import User from "@/database/user.model";
import { connectToDB } from "../mongoose";

export async function getUserById(userId: any) {
  try {
    await connectToDB();
    console.log(`Veritabanına bağlanıldı, userId: ${userId}`);

    // Kullanıcının olup olmadığını kontrol etmek için ek logging
    const user = await User.findOne({ clerkId: userId });
    console.log(`Kullanıcı: ${user}`);

    return user;
  } catch (error) {
    console.log("Hata oluştu:", error);
    throw error;
  }
}
