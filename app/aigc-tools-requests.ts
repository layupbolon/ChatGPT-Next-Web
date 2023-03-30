async function fetchImpl(url: string, body: Record<string, unknown>) {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (res.status !== 200) {
    return Promise.reject(res.json());
  }
  return Promise.resolve(res.json());
}

export async function login(account: string, password: string) {
  return fetchImpl("/api/user/login", { account, password });
}

export async function register(
  account: string,
  password: string,
  validateCode: string,
) {
  return fetchImpl("/api/user/regist", { account, password, validateCode });
}

export async function requestValidateCode(account: string) {
  return fetchImpl("/api/user/validate", { account });
}
