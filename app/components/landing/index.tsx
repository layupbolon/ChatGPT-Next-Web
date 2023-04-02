"use client";

import * as React from "react";
import styles from "./landing.module.scss";
import ChatGPTIcon from "../../icons/chatgpt.svg";
import Link from "next/link";

export const Landing = () => {
  React.useEffect(() => {
    window.localStorage.setItem("aiconnectworld-landing", "true");
  }, []);
  return (
    <div className={styles["container"]}>
      <div className={styles.bg}></div>
      <header className={styles["header"]}>
        <span className={styles.logo}>
          <ChatGPTIcon />
          <h1>ChatGPT 国内版</h1>
        </span>

        {/* <button type="button"></button> */}
        <Link href="/chat">立即使用</Link>
      </header>
      <div className={styles["content"]}>
        <div className={styles["feature"]}>
          <h2>功能介绍</h2>
          <ul>
            <li>ChatGPT 国内入口，无需魔法直接使用</li>
            <li>精心设计的 UI，响应式设计，支持深色模式</li>
            <li>海量的内置咒语列表</li>
            <li>一键导出聊天记录，完整的 Markdown 支持</li>
          </ul>
          <h2>ChatGPT 能做什么</h2>
          <ul>
            <li>智能回答、续写、承接上下文</li>
            <li>
              可以回答各种问题，包括但不限于：学术论文、创意写作、内容创作等
            </li>
            <li>
              <a
                href="https://github.com/PlexPt/awesome-chatgpt-prompts-zh/blob/main/USEAGE.md"
                target="_blank"
                rel="noreferrer"
              >
                一些有趣的玩法
              </a>
            </li>
          </ul>
        </div>
        <div className={styles.cover}></div>
      </div>
    </div>
  );
};
