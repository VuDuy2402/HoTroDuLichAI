import { useEffect, useState } from "react";
import { localStorageService } from "../services/localstorageService";
import { toast } from "react-toastify";
import * as signalR from "@microsoft/signalr";
const useSignalR = (hubUrl, eventHubName, eventHub = {}) => {
  const [connection, setConnection] = useState(null);
  useEffect(() => {
    const connectHub = async () => {
      const token = localStorageService.getAccessToken();
      const newConnection = new signalR.HubConnectionBuilder()
        .withUrl(hubUrl, {
          accessTokenFactory: () => token,
        })
        .withAutomaticReconnect()
        .build();
      newConnection.on(eventHubName, eventHub);
      try {
        await newConnection.start();
        setConnection(newConnection);
      } catch (error) {
        console.error("Error Connect Hub: ", error);
        toast.error("Failed to connect: ", error);
      }
    };
    connectHub();
    return () => {
      connection?.stop();
    };
  }, []);
  return { connection };
};

export default useSignalR;
