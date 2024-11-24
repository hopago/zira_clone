import { InferRequestType, InferResponseType } from "hono";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.members)[":memberId"]["$delete"]
>;
type RequestType = InferRequestType<
  (typeof client.api.members)[":memberId"]["$delete"]
>;

export const useDeleteMember = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.members[":memberId"].$delete({
        param,
      });

      return await response.json();
    },
    onSuccess: (response) => {
      if ("data" in response) {
        toast.success("해당 맴버가 성공적으로 제외 됐습니다");
        queryClient.invalidateQueries({ queryKey: ["members"] });
      } else {
        toast.error("이미 제외된 맴버거나 일시적 서버 오류입니다");
      }
    },
    onError: () => {
      toast.error(
        "해당 권한이 없거나 일시적 서버 오류입니다, 잠시 후 다시 시도해주세요"
      );
    },
  });

  return mutation;
};
