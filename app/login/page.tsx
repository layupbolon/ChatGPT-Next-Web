"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./login.module.scss";
import { login } from "../aigc-tools-requests";

import { showToast } from "../components/ui-lib";

interface Props {}

const Login: React.FC<Props> = ({}) => {
  const [account, setAccount] = useState<string>();
  const [pwd, setPwd] = useState<string>();

  const router = useRouter();

  const handleLogin = useCallback(() => {
    login(account!, pwd!).then((res) => {
      showToast("登录成功");
      router.replace("/");
    });
  }, [account, pwd, router]);

  return (
    <div className={styles["container"]}>
      {/* logo */}
      <h1 className={styles.title}>登 录</h1>
      <div className={styles["login-container"]}>
        <input
          type="text"
          placeholder="手机号/邮箱"
          value={account}
          onChange={(e) => setAccount(e.currentTarget.value)}
        />
        <input
          type="password"
          placeholder="密码"
          value={pwd}
          onChange={(e) => setPwd(e.currentTarget.value)}
        />
        <Link href="/register" replace>
          注册
        </Link>

        <button
          type="submit"
          onClick={handleLogin}
          disabled={!account || !account.length || !pwd || !pwd.length}
        >
          登 录
        </button>
      </div>
    </div>
  );
};
export default Login;
