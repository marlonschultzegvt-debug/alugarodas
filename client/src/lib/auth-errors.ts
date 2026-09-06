type TrpcLikeError = {
  data?: {
    code?: string;
  };
};

/** Never render database, transport, or stack details in an authentication form. */
export function getSafeLoginErrorMessage(error: unknown) {
  const code = (error as TrpcLikeError | null)?.data?.code;
  if (code === "UNAUTHORIZED") return "E-mail ou senha inválidos.";
  return "Não foi possível entrar agora. Tente novamente em alguns instantes.";
}
