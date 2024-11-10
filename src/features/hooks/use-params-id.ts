import { useParams } from "next/navigation";

export const useParamsId = (name?: string) => {
  const params = useParams();

  if (name) return params[`${name}`];

  return params.id as string;
};
