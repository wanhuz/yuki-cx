import Image from "next/image";


export default function SeriesPoster({posterURL} : {posterURL: string}) {

    return (
        <div className="relative w-[230px] h-[320px] border-2 border-white">
            <Image fill src={posterURL}  alt={""}></Image>
        </div>
        
    );
  }