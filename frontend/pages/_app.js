import "@/styles/globals.css";
import { AppProps } from "next/app";
import { ToastContainer } from "react-toastify";
import { SocketProvider } from "@/context/socket.provider";
import "react-toastify/dist/ReactToastify.css";
import React from "react";
import { Provider } from "react-redux";
import { store } from "../redux/store";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Provider store={store}>
        <SocketProvider>
          <ToastContainer></ToastContainer>
          <Component {...pageProps} />
        </SocketProvider>
      </Provider>
    </>
  );
}
