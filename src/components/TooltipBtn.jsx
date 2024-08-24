import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function TooltipBtn({ handleFunc, content, icon, loadingDelete }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" onClick={handleFunc} disable={loadingDelete}>
            {/* {loadingDelete ? <BeatLoader size={5} color="white" /> : <Trash />} */}
            {icon}
          </Button>
        </TooltipTrigger>
        <TooltipContent className="bg-gray-900 z-10">
          <p>{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default TooltipBtn;
