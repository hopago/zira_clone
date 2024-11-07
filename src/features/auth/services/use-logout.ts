import { useRouter } from "next/navigation";

import { InferRequestType, InferResponseType } from "hono";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

import { toast } from "sonner";

type ResponseType = InferResponseType<(typeof client.api.auth.logout)["$post"]>;
type RequestType = InferRequestType<(typeof client.api.auth.logout)["$post"]>;

export const useLogout = () => {
  const router = useRouter();

  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async () => {
      const response = await client.api.auth.logout.$post();

      return await response.json();
    },
    onSuccess: () => {
      toast.success("로그아웃 성공, 로그인 페이지로 이동합니다");
      
      router.refresh();

      queryClient.invalidateQueries({ queryKey: ["current"] });
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    },
    onError: (err) => {
      console.log(err);
      toast.error("서버 오류이니 잠시 후 다시 시도해주세요");
    },
  });

  return mutation;
};
