import { InferRequestType, InferResponseType } from "hono";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

import { toast } from "sonner";

type ResponseType = InferResponseType<(typeof client.api.projects)["$post"]>;
type RequestType = InferRequestType<(typeof client.api.projects)["$post"]>;

export const useCreateProject = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form }) => {
      const response = await client.api.projects.$post({ form });
      if (!response) throw new Error("프로젝트를 생성 오류입니다");

      return await response.json();
    },
    onSuccess: (response) => {
      if ("data" in response) {
        toast.success("프로젝트가 생성 됐습니다");

        queryClient.invalidateQueries({ queryKey: ["projects"] });
      } else {
        toast.error("프로젝트 생성 권한이 없거나 서버 오류입니다");
      }
    },
    onError: () => {
      toast.error("서버 오류이니 잠시 후 다시 시도해주세요");
    },
  });

  return mutation;
};
