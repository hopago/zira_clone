import Image from "next/image";

import { cn } from "@/lib/utils";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface MemberAvatarProps {
  image?: string;
  name: string;
  className?: string;
  fallbackClassName?: string;
}

export const MemberAvatar = ({
  image,
  name,
  className,
  fallbackClassName,
}: MemberAvatarProps) => {
  if (image)
    return (
      <div
        className={cn(
          "size-5 relative rounded-full border border-neutral-300 overflow-hidden",
          className
        )}
      >
        <Image src={image} alt={name} fill className="object-cover" />
      </div>
    );

  return (
    <Avatar
      className={cn(
        "size-5 transition border border-neutral-300 rounded-full",
        className
      )}
    >
      <AvatarFallback
        className={cn(
          "bg-neutral-200 font-medium text-neutral-500 flex items-center justify-center",
          fallbackClassName
        )}
      >
        {name.charAt(0).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
};
