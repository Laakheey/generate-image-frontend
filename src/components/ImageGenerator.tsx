import { useRef, useState } from "react";

const ImageGenerator = () => {
  const [imgUrl, setImgUrl] = useState("/assets/placeholder.jpeg");
  let inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_HOSTED_API_URL;

  const imageGeneration = async () => {
    if (inputRef?.current?.value === "") {
      return 0;
    }

    setLoading(true);
    const response = await fetch(`${API_URL}/generate-image`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: inputRef?.current?.value }),
    });

    if (response.ok) {
      const blob = await response.blob();
      setImgUrl(URL.createObjectURL(blob));
    } else {
      const data = await response.json();
      if (data.name === "payment_required") {
        alert("Not enough credit");
      }
      console.error("Image generation failed");
    }
    setLoading(false);
  };

  const downloadImage = () => {
    const link = document.createElement("a");
    link.href = imgUrl;
    link.download = "generated-image.jpg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="ai-image-generator flex flex-col m-auto items-center mt-[80px] mb-[20px] gap-[30px]">
      <div className="header text-[70px] font-[300] pb-[30px]">
        Ai Image <span className="text-[#de1b89] font-[600]">Generator</span>
      </div>
      <div className="image-loading flex flex-col">
        <div className="image">
          <img src={imgUrl} alt="image" className="w-[512px]" />
          <div className="loading">
            <div
              className={
                loading
                  ? "loading-bar w-[512px] h-[8px] bg-[#de1b89] transition-[15s]"
                  : "loading-bar w-0 h-[8px] bg-[#de1b89]"
              }
            ></div>
            <div className={loading ? "loading-text text-[18px]" : "hidden"}>
              Loading...
            </div>
          </div>
          <button onClick={downloadImage}>Download</button>
        </div>
      </div>
      <div className="search-box flex w-[1000px] h-[95px] justify-around items-center rounded-[50px] bg-[#1f3540]">
        <input
          ref={inputRef}
          type="text"
          className="search-input w-[600px] h-[50px] bg-transparent rounded-none outline-none text-[18px] text-white pl-[35px] mr-[35px] placeholder:text-[#999]"
          placeholder="Enter prompt to generate image"
        />
        <div
          className="generate-btn flex items-center justify-center w-[300px] h-[85px] text-[20px] rounded-[50px] bg-[#de1b89] cursor-pointer"
          onClick={imageGeneration}
        >
          Generate
        </div>
      </div>
    </div>
  );
};

export default ImageGenerator;
