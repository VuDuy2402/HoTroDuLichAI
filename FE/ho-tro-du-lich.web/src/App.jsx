import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import { getPromptLoading } from "./redux/selectors/systemSelector";
import PromptLoading from "./common/components/PromptLoading/PromptLoading";
import { IKContext } from "imagekitio-react";
import { imageKitService } from "./services/imageKitService";
import SignalR from "./SignalR";

// const router = createBrowserRouter(renderRouter());
const App = () => {
  const promptLoading = useSelector(getPromptLoading);
  const authenticator = async () => {
    try {
      const response = await imageKitService.getAuth();
      const { signature, expire, token } = response;

      return { signature, expire, token };
    } catch (error) {
      throw new Error(`Authentication request failed: ${error.message}`);
    }
  };
  return (
    <>
      <IKContext
        publicKey={`${import.meta.env.VITE_PUBLIC_KEY_IMAGEKIT}`}
        urlEndpoint={`${import.meta.env.VITE_URL_ENDPOINT_IMAGEKIT}`}
        authenticator={authenticator}
      >
        <SignalR />
      </IKContext>
      <ToastContainer />
      {promptLoading && <PromptLoading />}
    </>
  );
};
export default App;
