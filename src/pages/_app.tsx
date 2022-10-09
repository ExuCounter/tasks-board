import "react-toastify/dist/ReactToastify.css";
import "styles/globals.css";
import Head from "next/head";
import type { AppProps } from "next/app";
import { wrapper } from "store/index";
import { ToastContainer } from "react-toastify";
import { Provider } from "react-redux";

function MyApp({ Component, ...rest }: AppProps) {
  const { store, props } = wrapper.useWrappedStore(rest);

  return (
    <Provider store={store}>
      <Head>
        {/* <meta */}
        {/*   name="viewport" */}
        {/*   content="user-scalable=no, width=1300px, initial-scale=1.0" */}
        {/* /> */}
      </Head>
      <Component {...props.pageProps} />
      <ToastContainer
        autoClose={1000}
        hideProgressBar={true}
        newestOnTop={true}
      />
    </Provider>
  );
}

export default MyApp;
