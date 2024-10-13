"use server";

import Question from "@/database/question.model";
import Tag from "@/database/tags.model";
import { connectToDB } from "../mongoose";
import { CreateQuestionParams, GetQuestionsParams } from "./shared.types";
import User from "@/database/user.model";
import { revalidatePath } from "next/cache";

export async function getQuestions(params: GetQuestionsParams) {
  try {
    connectToDB();

    const questions = await Question.find({})
      .populate({
        path: "author",
        model: User,
      })
      .populate({ path: "tags", model: Tag })
      .sort({ createdAt: -1 });

    return { questions };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function createQuestion(params: CreateQuestionParams) {
  try {
    // connect to database
    connectToDB();

    const { title, content, tags, author, path } = params;

    // create new question

    const question = await Question.create({
      title,
      content,
      author,
    });

    const tagDocuments = [];

    // Create the tags or get them if they already exist

    for (const tag of tags) {
      const existingTag = await Tag.findOne(
        {
          name: { $regex: new RegExp(`^${tag}$`, "i") },
        },
        { $setOnInsert: { name: tag }, $push: { questions: question._id } },
        { upsert: true, new: true }
      );
      tagDocuments.push(existingTag._id);

      await Question.findByIdAndUpdate(question._id, {
        $push: { tags: { $each: tagDocuments } },
      });
    }

    // Create an interaction reocrd for users ask_question action

    // Increment authors reputation by +5  points for creating a new question

    revalidatePath(path);
  } catch (error) {}
}
