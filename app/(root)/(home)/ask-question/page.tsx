import Question from "@/components/forms/Question";
import { getUserById } from "@/lib/actions/user.action";
// import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

const Page = async () => {
  // const { userId } = auth();

  const userId = "12345"; // Bu ID'yi dinamik hale getirirken auth() kullanacaksınız.
  if (!userId) redirect("/sign-in");

  const mongoUser = await getUserById({ userId });

  if (!mongoUser) {
    console.log("Kullanıcı bulunamadı");
  } else {
    console.log("Bulunan kullanıcı:", mongoUser);
  }

  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">Ask Question</h1>
      <div className="mt-9">
        <Question mongoUserId={JSON.stringify(mongoUser._id)} />
        <div>hello</div>
      </div>
    </div>
  );
};

export default Page;
