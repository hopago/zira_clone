import { useRouter } from "next/navigation";

import { InferRequestType, InferResponseType } from "hono";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.workspaces)[":workspaceId"]["$patch"]
>;
type RequestType = InferRequestType<
  (typeof client.api.workspaces)[":workspaceId"]["$patch"]
>;

export const useUpdateWorkspace = () => {
  const router = useRouter();

  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form, param }) => {
      const response = await client.api.workspaces[":workspaceId"]["$patch"]({
        form,
        param,
      });

      return await response.json();
    },
    onSuccess: (response) => {
      if ("data" in response) {
        toast.success("작업 공간이 수정 됐습니다");

        router.refresh();

        queryClient.invalidateQueries({ queryKey: ["workspaces"] });
        queryClient.invalidateQueries({
          queryKey: ["workspace", response.data.$id],
        });
      } else {
        toast.error("액세스 권한이 없거나 예기치 못한 서버 오류입니다");
      }
    },
    onError: () => {
      toast.error("서버 오류이니 잠시 후 다시 시도해주세요");
    },
  });

  return mutation;
};
