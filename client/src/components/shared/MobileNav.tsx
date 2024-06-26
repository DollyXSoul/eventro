import { IoMdMenu } from "react-icons/io";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import NavItems from "./NavItems";
const MobileNav = () => {
  return (
    <nav className="md:hidden">
      <Sheet>
        <SheetTrigger>
          <IoMdMenu size={30} />
        </SheetTrigger>
        <SheetContent className="flex flex-col gap-6 bg-white md:hidden font-poppins">
          <img
            src="/assets/images/trace-1.svg"
            alt="Evently logo"
            width={128}
          />

          <Separator className="border border-gray-50" />
          <NavItems />
        </SheetContent>
      </Sheet>
    </nav>
  );
};
export default MobileNav;
