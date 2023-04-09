"use client";

require("../polyfill");

import { useState, useEffect } from "react";

import { IconButton } from "./button";
import styles from "./home.module.scss";

import SettingsIcon from "../icons/settings.svg";
import GithubIcon from "../icons/github.svg";
import ChatGptIcon from "../icons/chatgpt.svg";

import BotIcon from "../icons/bot.svg";
import AddIcon from "../icons/add.svg";
import LoadingIcon from "../icons/three-dots.svg";
import CloseIcon from "../icons/close.svg";
import CopyIcon from "../icons/copy.svg";
import DownloadIcon from "../icons/download.svg";
import PaymentIcon from "../icons/payment.svg";
import QrcodeIcon from "../icons/qrcode.svg";
import wechatgroup from "../icons/wechatgroup.jpeg";

import { useChatStore } from "../store";
import { isMobileScreen } from "../utils";
import Locale from "../locales";
import { Chat } from "./chat";

import dynamic from "next/dynamic";
import { REPO_URL } from "../constant";
import { ControllerPool } from "../requests";
import { Prompt, usePromptStore } from "../store/prompt";
import type { UserInfo } from "../aigc-typings";
import Image from "next/image";
import { ErrorBoundary } from "./error";

export function Loading(props: { noLogo?: boolean }) {
  return (
    <div className={styles["loading-content"]}>
      {!props.noLogo && <BotIcon />}
      <LoadingIcon />
    </div>
  );
}

const Settings = dynamic(async () => (await import("./settings")).Settings, {
  loading: () => <Loading noLogo />,
});

const ChatList = dynamic(async () => (await import("./chat-list")).ChatList, {
  loading: () => <Loading noLogo />,
});

function useSwitchTheme() {
  const config = useChatStore((state) => state.config);

  useEffect(() => {
    document.body.classList.remove("light");
    document.body.classList.remove("dark");

    if (config.theme === "dark") {
      document.body.classList.add("dark");
    } else if (config.theme === "light") {
      document.body.classList.add("light");
    }

    const metaDescriptionDark = document.querySelector(
      'meta[name="theme-color"][media]',
    );
    const metaDescriptionLight = document.querySelector(
      'meta[name="theme-color"]:not([media])',
    );

    if (config.theme === "auto") {
      metaDescriptionDark?.setAttribute("content", "#151515");
      metaDescriptionLight?.setAttribute("content", "#fafafa");
    } else {
      const themeColor = getComputedStyle(document.body)
        .getPropertyValue("--theme-color")
        .trim();
      metaDescriptionDark?.setAttribute("content", themeColor);
      metaDescriptionLight?.setAttribute("content", themeColor);
    }
  }, [config.theme]);
}

function exportMessages(messages: Message[], topic: string) {
  const mdText =
    `# ${topic}\n\n` +
    messages
      .map((m) => {
        return m.role === "user" ? `## ${m.content}` : m.content.trim();
      })
      .join("\n\n");
  const filename = `${topic}.md`;

  showModal({
    title: Locale.Export.Title,
    children: (
      <div className="markdown-body">
        <pre className={styles["export-content"]}>{mdText}</pre>
      </div>
    ),
    actions: [
      <IconButton
        key="copy"
        icon={<CopyIcon />}
        bordered
        text={Locale.Export.Copy}
        onClick={() => copyToClipboard(mdText)}
      />,
      <IconButton
        key="download"
        icon={<DownloadIcon />}
        bordered
        text={Locale.Export.Download}
        onClick={() => downloadAs(mdText, filename)}
      />,
    ],
  });
}

function showMemoryPrompt(session: ChatSession) {
  showModal({
    title: `${Locale.Memory.Title} (${session.lastSummarizeIndex} of ${session.messages.length})`,
    children: (
      <div className="markdown-body">
        <pre className={styles["export-content"]}>
          {session.memoryPrompt || Locale.Memory.EmptyContent}
        </pre>
      </div>
    ),
    actions: [
      <IconButton
        key="copy"
        icon={<CopyIcon />}
        bordered
        text={Locale.Memory.Copy}
        onClick={() => copyToClipboard(session.memoryPrompt)}
      />,
    ],
  });
}

const Payment = () => {
  const [packageNumber, setPackageNumber] = useState<number>(1);
  return (
    <div className="markdown-body">
      <div className={styles["payment-wrapper"]}>
        <div
          className={`${styles["payment-item"]} ${styles["discount"]} ${
            packageNumber === 1 ? styles["selected"] : ""
          }`}
          onClick={() => {
            setPackageNumber(1);
          }}
        >
          <span className={styles["package-name"]}>一个月VIP</span>
          <span className={styles["package-price"]}>
            ￥<b>59</b>
          </span>
          <del>原价 ￥69</del>
        </div>
        <div
          className={`${styles["payment-item"]} ${
            packageNumber === 2 ? styles["selected"] : ""
          }`}
          onClick={() => {
            setPackageNumber(2);
          }}
        >
          <span className={styles["package-name"]}>三个月VIP</span>
          <span className={styles["package-price"]}>
            ￥<b>89</b>
          </span>
          <del>原价 ￥128</del>
        </div>
        <div
          className={`${styles["payment-item"]} ${styles["recommend"]} ${
            packageNumber === 3 ? styles["selected"] : ""
          }`}
          onClick={() => {
            setPackageNumber(3);
          }}
        >
          <span className={styles["package-name"]}>一年VIP</span>
          <span className={styles["package-price"]}>
            ￥<b>169</b>
          </span>
          <del>原价 ￥288</del>
        </div>
      </div>
      <button className={styles["payment-btn"]} disabled>
        立即支付
      </button>
    </div>
  );
};

function showPayment() {
  showModal({
    title: `成为会员`,
    children: <Payment />,
  });
}

const useHasHydrated = () => {
  const [hasHydrated, setHasHydrated] = useState<boolean>(false);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  return hasHydrated;
};

function _Home() {
  const [createNewSession, currentIndex, removeSession] = useChatStore(
    (state) => [
      state.newSession,
      state.currentSessionIndex,
      state.removeSession,
    ],
  );
  const chatStore = useChatStore();
  const loading = !useHasHydrated();
  const [showSideBar, setShowSideBar] = useState(true);

  // setting
  const [openSettings, setOpenSettings] = useState(false);
  const config = useChatStore((state) => state.config);

  useSwitchTheme();

  if (loading) {
    return <Loading />;
  }

  const checkLogin = () => {
    // todo 验证 token 有效性
    try {
      return JSON.parse(localStorage.getItem("aiconnectworld-userinfo") ?? "")
        .user as UserInfo;
    } catch {
      location.href = "/login";
    }
  };
  // const user = checkLogin();

  return (
    <div
      className={`${
        config.tightBorder && !isMobileScreen()
          ? styles["tight-container"]
          : styles.container
      }`}
    >
      <div
        className={styles.sidebar + ` ${showSideBar && styles["sidebar-show"]}`}
      >
        <div className={styles["sidebar-header"]}>
          <div className={styles["sidebar-title"]}>AI Connect World</div>
          <div className={styles["sidebar-sub-title"]}>
            Build your own AI assistant.
          </div>
          <div className={styles["sidebar-logo"]}>
            <ChatGptIcon />
          </div>
        </div>

        <div
          className={styles["sidebar-body"]}
          onClick={() => {
            setOpenSettings(false);
            setShowSideBar(false);
          }}
        >
          <ChatList />
        </div>

        <div className={styles["sidebar-tail"]}>
          <div className={styles["sidebar-actions"]}>
            <div className={styles["sidebar-action"] + " " + styles.mobile}>
              <IconButton
                icon={<CloseIcon />}
                onClick={chatStore.deleteSession}
              />
            </div>
            <div className={styles["sidebar-action"]}>
              <IconButton
                icon={<SettingsIcon />}
                onClick={() => {
                  setOpenSettings(true);
                  setShowSideBar(false);
                }}
                shadow
              />
            </div>
            {/* <div className={styles["sidebar-action"]}>
              <a href={REPO_URL} target="_blank">
                <IconButton icon={<GithubIcon />} shadow />
              </a>
            </div> */}
            <div>
              <IconButton
                icon={<QrcodeIcon />}
                text="加入群聊"
                onClick={() => {
                  showModal({
                    title: "加入群聊",
                    children: (
                      <div
                        className="markdown-body"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Image
                          src={wechatgroup}
                          width={320}
                          height={420}
                          alt="wechat-group"
                        ></Image>
                      </div>
                    ),
                  });
                }}
              />
            </div>
          </div>
          <div>
            <IconButton
              icon={<AddIcon />}
              text={Locale.Home.NewChat}
              onClick={() => {
                createNewSession();
                setShowSideBar(false);
              }}
              shadow
            />
          </div>
        </div>
      </div>

      <div className={styles["window-content"]}>
        {openSettings ? (
          <Settings
            closeSettings={() => {
              setOpenSettings(false);
              setShowSideBar(true);
            }}
            // user={user!}
          />
        ) : (
          <Chat
            key="chat"
            showSideBar={() => setShowSideBar(true)}
            sideBarShowing={showSideBar}
          />
        )}
      </div>
    </div>
  );
}

export function Home() {
  return (
    <ErrorBoundary>
      <_Home></_Home>
    </ErrorBoundary>
  );
}
