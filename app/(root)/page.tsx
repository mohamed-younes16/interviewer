import Hero from "@/components/Hero";
import InterviewCard from "@/components/InterviewCard";
import Loading from "@/components/Loading";
import { auth } from "@/lib/firebase";
import { adminDb } from "@/lib/firebaseAdmin";
import { Interview } from "@/types";


export default async function Home() {
  const user = auth.currentUser;
  console.log(user);
  let interviews: Interview[] | null = null;
  try {
    const interviewsFetch = await adminDb.collection("templates").get();

    interviews = interviewsFetch.docs.map((e) => ({
      ...e.data(),
      id: e.id,
    })) as Interview[];
  } catch (error) {
    console.log(error);
  }

  return (
    <div className="pt-6  px-16">
      {user ? (
        <>
          {" "}
          <Hero />
          <div className="flex max-w-[1200px] mx-auto  mt-6 gap-6 flex-wrap">
            {user &&
              !!interviews?.length &&
              interviews.map((e, i) => (
                <InterviewCard data={e} key={i} delay={i} mode="template" />
              ))}
          </div>
        </>
      ) : (
        <Loading />
      )}
    </div>
  );
}
