// can add sonner from shadcn ui after link created

import { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";
import { Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CreateLink } from "@/components/create-link";
import LinkCard from "@/components/link-card";
import Error from "@/components/error";
import useFetch from "@/hooks/use-fetch";
import { getUrls } from "@/db/apiUrls";
import { getClicksForUrls } from "@/db/apiClicks";
import { UrlState } from "@/context";

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = UrlState();
  const { loading, error, data: urls, fn: fnUrls } = useFetch(getUrls, user.id);
  const {
    loading: loadingClicks,
    data: clicks,
    fn: fnClicks,
  } = useFetch(
    getClicksForUrls,
    urls?.map((url) => url.id)
  );

  useEffect(() => {
    fnUrls();
    fnClicks();
  }, []);

  const filteredUrls = urls?.filter((url) =>
    url.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (urls?.length) fnClicks();
  }, [urls?.length]);

  return (
    <div className="flex flex-col gap-8 mt-3">
      {(loading || loadingClicks) && (
        <BarLoader width={"100%"} color="#36d7b7" />
      )}
      <div className="grid md:grid-cols-2 grid-cols-1 md:gap-8 gap-4">
        <Card className="bg-gray-900">
          <CardHeader>
            <CardTitle className="md:text-3xl text-2xl">
              {urls?.length == 1 ? "Link Created" : "Links Created"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="md:text-2xl text-xl">{urls?.length}</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-900">
          <CardHeader>
            <CardTitle className="md:text-3xl text-2xl">Total Clicks</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="md:text-2xl text-xl">{clicks?.length || 0}</p>
          </CardContent>
        </Card>
      </div>
      <div className="flex justify-between mt-6">
        <h1 className="md:text-3xl text-2xl font-bold">My Links</h1>
        <CreateLink />
      </div>
      <div className="relative mb-5">
        <Input
          type="text"
          className="bg-gray-900"
          placeholder="Filter Links..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Filter className="absolute top-2 right-2 p-1" />
      </div>
      {error && <Error message={error?.message} />}
      {(filteredUrls || []).map((url, i) => (
        <LinkCard key={i} url={url} fetchUrls={fnUrls} fetchClicks={fnClicks} />
      ))}
    </div>
  );
};

export default Dashboard;
