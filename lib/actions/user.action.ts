"use server";

import User from "@/database/user.model";
import { connectToDB } from "../mongoose";
import {
  CreateUserParams,
  DeleteAnswerParams,
  UpdateUserParams,
} from "./shared.types";
import { revalidatePath } from "next/cache";

import Question from "@/database/question.model";

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

export async function createUser(userData: CreateUserParams) {
  try {
    await connectToDB();
    const newUser = await User.create(userData);

    return newUser;
  } catch (error) {
    console.log("Hata oluştu:", error);
    throw error;
  }
}

export async function updateUser(params: UpdateUserParams) {
  try {
    await connectToDB();

    const { clerkId, updateData, path } = params;

    await User.findOneAndUpdate({ clerkId }, updateData, { new: true });

    revalidatePath(path);
  } catch (error) {
    console.log("Hata oluştu:", error);
    throw error;
  }
}

export async function deleteUser(params: DeleteAnswerParams) {
  try {
    await connectToDB();

    const { clerkId } = params;

    const user = await User.findOneAndDelete({ clerkId });

    if (!user) {
      throw new Error("User Not Found");
    }

    // Delete User from database
    // and questions,answers,comments,etc.

    // get user question ids
    const userQuestionIds = await Question.find({ author: user._id }).distinct(
      "_id"
    );

    await Question.deleteMany({ author: user._id });

    // TODO: delete user answers

    const deletedUser = await User.findByIdAndDelete(user._id);

    return deletedUser;
  } catch (error) {
    console.log("Hata oluştu:", error);
    throw error;
  }
}
