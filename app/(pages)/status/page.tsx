import StatusCheckComponent from "@/components/StatusCheckComponent";

export default function Page() {
    return (
      <div className="container-md my-8 sm:px-4 md:px-4">
          <div className="container px-5 sm:px-0 sm:mx-auto flex flex-wrap flex-1 md:gap-3">
              <StatusCheckComponent/>
          </div>
      </div>
    );
  }