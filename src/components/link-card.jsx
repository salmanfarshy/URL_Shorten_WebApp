/* eslint-disable react/prop-types */
import { Copy, Download, Trash } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import useFetch from "@/hooks/use-fetch";
import { deleteUrl } from "@/db/apiUrls";
import { BeatLoader } from "react-spinners";
import TooltipBtn from "@/components/TooltipBtn";
import { useRef, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const LinkCard = ({ url = [], fetchUrls, fetchClicks }) => {
  const [isCopied, setIsCopied] = useState(false);
  const copyTextRef = useRef(null);
  const { toast } = useToast();

  const downloadImage = async () => {
    const imageUrl = url?.qr;
    const fileName = url?.title;
    try {
      const response = await fetch(imageUrl, {
        method: "GET",
        headers: {
          "Content-Type": "image/jpeg",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch the image.");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("An error occurred while downloading the image:", error);
    }
  };

  const handleCopy = () => {
    if (copyTextRef.current) {
      try {
        setIsCopied(true);
      } catch (err) {
        console.error("Failed to copy text: ", err);
      }
    }

    // Hide the copied message after a few seconds
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  const { loading: loadingDelete, fn: fnDelete } = useFetch(deleteUrl, {
    id: url?.id,
    qr_url: url?.qr,
  });

  // if (url) console.log("suck!");

  const navigate = useNavigate();

  return (
    <div className="flex flex-col md:flex-row gap-5 border p-4 bg-gray-900 rounded-lg hover:translate-y-[0.6px] hover:translate-x-[0.6px] w-full h-42">
      <div className="flex justify-between">
        {url ? (
          <img
            src={url?.qr}
            className="h-32 w-32 object-contain ring ring-blue-500 self-start"
            alt="qr code"
          />
        ) : (
          <Skeleton className="h-32 w-32 rounded-none" />
        )}

        <div className="flex gap-2 md:hidden">
          <div
            ref={copyTextRef}
            onClick={() => {
              handleCopy();
              navigator.clipboard.writeText(
                `https://trimrr.in/${url?.short_url}`
              );
            }}
            className="relative"
          >
            {isCopied && (
              <p className="absolute -top-10 -left-2 text-sm font-normal bg-gray-900 py-2 px-4 rounded-md border-slate-800 border z-20">
                Copied
              </p>
            )}
            <TooltipBtn
              handleFunc={null}
              content="Copy"
              icon={<Copy />}
              loadingDelete={null}
            />
          </div>

          <TooltipBtn
            handleFunc={downloadImage}
            content="Download"
            icon={<Download />}
            loadingDelete={null}
          />

          <TooltipBtn
            handleFunc={() =>
              fnDelete().then(() => {
                fetchUrls();
                fetchClicks();
                toast({
                  variant: "success",
                  description: "URL has been deleted.",
                  className:
                    "bg-gray-800 font-extrabold top-4 md:right-10 right-6 fixed w-60",
                  duration: "3000",
                });
                navigate("/dashboard");
              })
            }
            content="Delete"
            icon={
              loadingDelete ? <BeatLoader size={5} color="white" /> : <Trash />
            }
            loadingDelete={loadingDelete}
          />
        </div>
      </div>

      <Link
        to={`/link/${url?.id}`}
        className="flex flex-col flex-1 md:ms-1 ms-0"
      >
        <span className="text-3xl md:-mt-[1px] -mt-3 md:font-bold font-medium cursor-pointer">
          {url?.title}
        </span>

        <span className="text-xl text-blue-400 mt-2 font-bold flex gap-2 items-center">
          <span className="text-white font-bold">Short URL: </span>
          {url ? (
            "https://trimrr.in/" + url?.short_url
          ) : (
            <span>
              <Skeleton className="h-6 w-44 rounded-none" />
            </span>
          )}
        </span>

        <span className="mt-3 text-sm text-gray-300">Created Date:</span>
        <span className="text-gray-200 text-sm font-medium tracking-wide">
          {new Date(url?.created_at).toLocaleString()}
        </span>
      </Link>
      <div className="md:flex gap-2 hidden">
        <div
          ref={copyTextRef}
          onClick={() => {
            handleCopy();
            navigator.clipboard.writeText(
              `https://trimrr.in/${url?.short_url}`
            );
          }}
          className="relative"
        >
          {isCopied && (
            <p className="absolute -top-10 -left-3 text-sm font-normal bg-gray-900 py-2 px-4 rounded-md border-slate-800 border z-20">
              Copied
            </p>
          )}
          <TooltipBtn
            handleFunc={null}
            content="Copy"
            icon={<Copy />}
            loadingDelete={null}
          />
        </div>

        <TooltipBtn
          handleFunc={downloadImage}
          content="Download"
          icon={<Download />}
          loadingDelete={null}
        />

        <TooltipBtn
          handleFunc={() =>
            fnDelete().then(() => {
              fetchUrls();
              fetchClicks();
              toast({
                variant: "success",
                description: "URL has been deleted.",
                className:
                  "bg-gray-800 font-extrabold top-4 md:right-10 right-6 fixed w-60",

                duration: "3000",
              });
              navigate("/dashboard");
            })
          }
          content="Delete"
          icon={
            loadingDelete ? <BeatLoader size={5} color="white" /> : <Trash />
          }
          loadingDelete={loadingDelete}
        />
      </div>
    </div>
  );
};

export default LinkCard;
