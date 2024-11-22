import { InferRequestType, InferResponseType } from "hono";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.workspaces)[":workspaceId"]["invite-code"]["$put"]
>;
type RequestType = InferRequestType<
  (typeof client.api.workspaces)[":workspaceId"]["invite-code"]["$put"]
>;

export const useResetInviteCode = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.workspaces[":workspaceId"][
        "invite-code"
      ].$put({
        param,
      });
      if (!response.ok) throw new Error("초대 코드를 재생성하지 못했습니다");

      return await response.json();
    },
    onSuccess: (response) => {
      if ("data" in response) {
        toast.success("초대 코드가 새로 생성됐습니다");
        queryClient.invalidateQueries({ queryKey: ["workspaces"] });
        queryClient.invalidateQueries({
          queryKey: ["workspace", response.data.$id],
        });
      } else {
        toast.error(
          "작업 공간을 지울 권한이 없거나 이미 삭제된 작업 공간입니다"
        );
      }
    },
    onError: () => {
      toast.error("초대 코드를 재생성하지 못했습니다");
    },
  });

  return mutation;
};
