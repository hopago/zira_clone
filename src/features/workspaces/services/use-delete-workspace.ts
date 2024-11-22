import { InferRequestType, InferResponseType } from "hono";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.workspaces)[":workspaceId"]["$delete"]
>;
type RequestType = InferRequestType<
  (typeof client.api.workspaces)[":workspaceId"]["$delete"]
>;

export const useDeleteWorkspace = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.workspaces[":workspaceId"].$delete({
        param,
      });

      return await response.json();
    },
    onSuccess: (response) => {
      if ("data" in response) {
        toast.success("작업 공간이 삭제 됐습니다");
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
      toast.error("서버 오류이니 잠시 후 다시 시도해주세요");
    },
  });

  return mutation;
};
