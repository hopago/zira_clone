import { InferRequestType, InferResponseType } from "hono";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.projects)[":projectId"]["$delete"]
>;
type RequestType = InferRequestType<
  (typeof client.api.projects)[":projectId"]["$delete"]
>;

export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.projects[":projectId"].$delete({
        param,
      });

      return await response.json();
    },
    onSuccess: (response) => {
      if ("data" in response) {
        toast.success("프로젝트가 삭제 됐습니다");
        queryClient.invalidateQueries({ queryKey: ["workspaces"] });
        queryClient.invalidateQueries({
          queryKey: ["workspace", response.data.$id],
        });
      } else {
        toast.error("프로젝트를 지울 권한이 없거나 이미 삭제된 프로젝트입니다");
      }
    },
    onError: () => {
      toast.error("서버 오류이니 잠시 후 다시 시도해주세요");
    },
  });

  return mutation;
};
