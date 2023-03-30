"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./register.module.scss";
import { register, requestValidateCode } from "../aigc-tools-requests";

import { showToast } from "../components/ui-lib";

interface Props {}

const Login: React.FC<Props> = ({}) => {
  const [account, setAccount] = useState<string>();
  const [validateCode, setValidateCode] = useState<string>();
  const [pwd, setPwd] = useState<string>();
  const [pwd2, setPwd2] = useState<string>();

  const [countdown, setCountdown] = useState<number>();
  const [timerId, setTimerId] = useState<NodeJS.Timer>();

  const router = useRouter();

  useEffect(() => {
    return () => {
      if (timerId) {
        clearInterval(timerId);
      }
    };
  }, [timerId]);

  const startCountdown = () => {
    if (timerId) {
      clearInterval(timerId);
    }

    let secondsRemaining = 60;
    setCountdown(secondsRemaining);

    const newTimerId = setInterval(() => {
      secondsRemaining -= 1;
      setCountdown(secondsRemaining);

      if (secondsRemaining <= 0) {
        clearInterval(newTimerId);
        setTimerId(undefined);
        setCountdown(undefined);
      }
    }, 1000);

    setTimerId(newTimerId);
  };

  const handleRequestValidateCode = () => {
    requestValidateCode(account!).then(() => {
      showToast("验证码已发送");
      startCountdown();
    });
  };

  const handleRegister = () => {
    register(account!, pwd!, validateCode!).then(() => {
      showToast("注册成功");
      router.push("/login");
    });
  };

  return (
    <div className={styles["container"]}>
      {/* logo */}
      <h1 className={styles.title}>注 册</h1>
      <div className={styles["register-container"]}>
        <input
          type="text"
          placeholder="手机号/邮箱"
          value={account}
          onChange={(e) => setAccount(e.currentTarget.value)}
        />
        <div className={styles.group}>
          <input
            type="text"
            placeholder="验证码"
            value={validateCode}
            onChange={(e) => setValidateCode(e.currentTarget.value)}
          />
          <button
            type="button"
            onClick={handleRequestValidateCode}
            disabled={countdown !== undefined || !account || !account.length}
          >
            {countdown === undefined
              ? "发送验证码"
              : `${countdown}秒后可重新发送`}
          </button>
        </div>
        <input
          type="password"
          placeholder="密码"
          value={pwd}
          onChange={(e) => setPwd(e.target.value)}
        />
        <input
          type="password"
          placeholder="确认密码"
          value={pwd2}
          onChange={(e) => setPwd2(e.target.value)}
        />
        <button
          type="submit"
          onClick={handleRegister}
          disabled={
            !account ||
            !account.length ||
            !validateCode ||
            !validateCode.length ||
            !pwd ||
            !pwd.length ||
            !pwd2 ||
            !pwd2.length ||
            pwd !== pwd2
          }
        >
          注 册
        </button>
        <Link href="/login" replace>
          去登录
        </Link>
      </div>
    </div>
  );
};
export default Login;
