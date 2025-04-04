import InterviewLive from "@/components/InterviewLive";


const page = async () => {




  return (
    <div className="pt-6 space-y-10 px-16">
      <div className="flex justify-between">
     
       
        <div className="fc text-xl rounded-lg px-4 py-3 bg-[#24273A]">
         generate your  Interview
        </div>
      </div>
      <InterviewLive type="generate" data={null} />
    </div>
  );
};
export default page;
