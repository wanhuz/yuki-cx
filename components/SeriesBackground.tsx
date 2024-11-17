import Image from "next/image";


export default function SeriesBackground({imgUrl} : {imgUrl: string}) {

    return (
        <div className="-z-50 h-96 w-full absolute">
          <div>
              <Image fill={true} className="object-cover object-half-top" src={imgUrl? imgUrl : ""}  alt=""></Image>
              <div  className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
          </div>
        </div>
    );
  }