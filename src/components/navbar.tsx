import { UserButton } from "@/features/auth/_components/user-button";
import { MobileSidebar } from "./mobile-sidebar";

export const Navbar = () => {
  return (
    <nav className="pt-4 px-6 flex items-center justify-between">
      <MobileSidebar />
      <div className="flex-col hidden lg:flex">
        <h1 className="text-2xl font-semibold">홈</h1>
        <p className="text-muted-foreground">
          현재 진행 중인 프로젝트와 업무들을 한 눈에 확인해보세요!
        </p>
      </div>
      <UserButton />
    </nav>
  );
};
