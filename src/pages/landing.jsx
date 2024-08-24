import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const LandingPage = () => {
  const ref = useRef(null);
  const [longUrl, setLongUrl] = useState("");
  const navigate = useNavigate();

  const handleShorten = (e) => {
    e.preventDefault();
    if (longUrl) navigate(`/auth?createNew=${longUrl}`);
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="md:mb-10 mb-12 text-3xl md:text-5xl lg:text-6xl text-white text-center font-bold">
        The only URL Shortener <br /> you&rsquo;ll ever need! 👇
      </h2>
      <form
        onSubmit={handleShorten}
        className="sm:h-14 flex flex-col sm:flex-row md:w-4/6 w-5/6 gap-3"
      >
        <Input
          ref={ref}
          type="url"
          placeholder="Enter your loooong URL"
          value={longUrl}
          onChange={(e) => setLongUrl(e.target.value)}
          className="h-full bg-gray-800 flex-1 py-4 px-4"
        />
        <Button
          type="submit"
          onClick={() => ref.current?.focus()}
          className="h-full bg-red-800 text-white md:text-lg text-base font-bold hover:bg-red-400 hover:translate-y-[0.5px]"
        >
          Shorten
        </Button>
      </form>
      <img
        src="/TrimUrl.jpeg" // replace with 2 in small screens
        className="w-5/6 my-11 md:px-11 md:mt-16 mt-8"
      />
      <Accordion
        type="multiple"
        collapsible
        className="w-5/6 md:px-11 md:mt-auto -mt-6"
      >
        <AccordionItem value="item-1">
          <AccordionTrigger className="md:text-xl text-base">
            How does the Trimrr URL shortener works?
          </AccordionTrigger>
          <AccordionContent className="text-gray-300 md:text-base text-sm text-wrap">
            When you enter a long URL, our system generates a shorter version of
            that URL. This shortened URL redirects to the original long URL when
            accessed.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger className="md:text-xl text-base">
            Do I need an account to use the app?
          </AccordionTrigger>
          <AccordionContent className="text-gray-300 md:text-base text-sm text-wrap">
            Yes. Creating an account allows you to manage your URLs, view
            analytics, and customize your short URLs.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3" className="text-nowrap">
          <AccordionTrigger className="md:text-xl text-base">
            What analytics are available for my shortened URLs?
          </AccordionTrigger>
          <AccordionContent className="text-gray-300 md:text-base text-sm text-wrap">
            You can view the number of clicks, geolocation data of the clicks
            and device types (mobile/desktop) for each of your shortened URLs.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default LandingPage;
