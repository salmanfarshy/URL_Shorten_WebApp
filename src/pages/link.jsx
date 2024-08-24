import DeviceStats from "@/components/device-stats";
import Location from "@/components/location-stats";
import TooltipBtn from "@/components/TooltipBtn";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UrlState } from "@/context";
import { getClicksForUrl } from "@/db/apiClicks";
import { deleteUrl, getUrl } from "@/db/apiUrls";
import useFetch from "@/hooks/use-fetch";
import { Copy, Download, Trash } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BarLoader, BeatLoader } from "react-spinners";
import { useToast } from "@/components/ui/use-toast";

const LinkPage = () => {
  const ref = useRef(null);
  const { toast } = useToast();
  const [isCopied, setIsCopied] = useState(false);
  const copyTextRef = useRef(null);

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

  const navigate = useNavigate();
  const { user } = UrlState();
  const { id } = useParams();
  const {
    loading,
    data: url,
    fn,
    error,
  } = useFetch(getUrl, { id, user_id: user?.id });

  const {
    loading: loadingStats,
    data: stats,
    fn: fnStats,
  } = useFetch(getClicksForUrl, id);

  const { loading: loadingDelete, fn: fnDelete } = useFetch(deleteUrl, {
    id,
    qr_url: url?.qr,
  });

  useEffect(() => {
    fn();
  }, []);

  useEffect(() => {
    if (!error && loading === false) fnStats();
  }, [loading, error]);

  if (error) {
    navigate("/dashboard");
  }

  if (ref.current) {
    ref.current.addEventListener("click", fnStats);
  }

  let link = "";
  if (url) {
    link = url?.short_url;
  }

  return (
    <>
      {(loading || loadingStats) && (
        <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />
      )}
      <div className="flex flex-col gap-8 sm:flex-row justify-between mt-8">
        <div className="flex flex-col items-start rounded-lg sm:w-2/5">
          <div className="flex gap-20 items-center">
            <span className="md:text-5xl text-4xl font-semibold">
              {url?.title}
            </span>
            <div className="flex gap-2">
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
                  loadingDelete ? (
                    <BeatLoader size={5} color="white" />
                  ) : (
                    <Trash />
                  )
                }
                loadingDelete={loadingDelete}
              />
            </div>
          </div>

          <div className="flex gap-2 items-center text-xl md:text-2xl text-blue-400 font-bold mt-8">
            <span className="text-white">Short URL:</span>
            <a
              ref={ref}
              href={`${import.meta.env.VITE_APP_URL}/${link}`}
              target="_blank"
              className="hover:underline cursor-pointer"
            >
              https://trimrr.in/
              {link}
            </a>
          </div>

          <div className="text-lg font-bold mt-4">
            <span className="text-white me-1">Long URL: </span>

            <a
              href={url?.original_url}
              target="_blank"
              className="hover:underline cursor-pointer"
            >
              <span className="text-gray-300 text-wrap">
                {url?.original_url}
              </span>
            </a>
          </div>

          <span className="mt-7 text-gray-400 font-medium md:text-base text-sm">
            Created Date:
          </span>
          <span className="flex items-end font-medium text-gray-200 md:text-base text-sm">
            {new Date(url?.created_at).toLocaleString()}
          </span>

          <img
            src={url?.qr}
            className="md:w-3/5 md:mt-8 mt-5 self-start ring ring-blue-500 p-1 object-contain"
            alt="qr code"
          />
        </div>

        <Card className="sm:w-3/5">
          <CardHeader>
            <CardTitle className="text-4xl font-bold">Stats</CardTitle>
          </CardHeader>
          {stats && stats.length ? (
            <CardContent className="flex flex-col gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Total Clicks</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-medium">{stats?.length}</p>
                </CardContent>
              </Card>

              <CardTitle>Location Data</CardTitle>
              <Location stats={stats} />
              <CardTitle>Device Info</CardTitle>
              <DeviceStats stats={stats} />
            </CardContent>
          ) : (
            <CardContent>
              {loadingStats === false
                ? "No Statistics yet"
                : "Loading Statistics.."}
            </CardContent>
          )}
        </Card>
      </div>
    </>
  );
};

export default LinkPage;
