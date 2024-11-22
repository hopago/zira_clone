import { InferRequestType, InferResponseType } from "hono";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.workspaces)[":workspaceId"]["join"]["$post"]
>;
type RequestType = InferRequestType<
  (typeof client.api.workspaces)[":workspaceId"]["join"]["$post"]
>;

export const useJoinWorkspace = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param, json }) => {
      const response = await client.api.workspaces[":workspaceId"][
        "join"
      ].$post({ param, json });
      if (!response.ok)
        throw new Error("참여에 실패했습니다, 다시 시도해주세요");

      return await response.json();
    },
    onSuccess: (response) => {
      if ("data" in response) {
        toast.success("작업 공간에 참여했습니다");
        queryClient.invalidateQueries({ queryKey: ["workspaces"] });
        queryClient.invalidateQueries({
          queryKey: ["workspace", response.data.$id],
        });
      } else {
        toast.error("이미 참여했거나 유효하지 않은 초대 코드입니다");
      }
    },
    onError: () => {
      toast.error("참여에 실패했습니다, 다시 시도해주세요");
    },
  });

  return mutation;
};
