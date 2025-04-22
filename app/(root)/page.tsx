import InterviewCard from "@/components/InterviewCard";
import { Button } from "@/components/ui/button";
import { dummyInterviews } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Page = () => {
  return (
    <>
      <section className="card-cta">
        <div className="flex flex-col gap-6 max-w-lg">
          <h2>Get Ready InterView With AI-Powered Practice & Feedback</h2>
          <p className="text-lg">
            Pratice on real interview questions, get instant feedback on your
          </p>
          
          <Button asChild className="btn-primary max-sm:w-full " >
            <Link  href={'/interview'}>Start an interview</Link>
          </Button>
        </div>
        <Image src={'/robot.png'} alt="robot-dude" width={400} height={400} className="max-sm:hidden" />
      </section>
      <section className="flex flex-col gap-6 mt-8">
        <h2>Your Interview</h2>
        <div className="interviews-section">
          {dummyInterviews.map((interview)=>(
            <InterviewCard key={interview.id} {...interview} />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-6 mt-8">
        <h2>Take an Interview</h2>
        <div className="interviews-section">
           {dummyInterviews.map((interview)=>(
            <InterviewCard key={interview.id} {...interview} />
          ))}
          {/* <p>You haven't taken any interview yet</p> */}
        </div>
      </section>
    </>
  );
};

export default Page;
