import * as signalR from "@microsoft/signalr";
import { signalRService } from "../services/signalRService";
export const initConnection = async (url, accessToken) => {
  try {
    if (!accessToken) {
      return;
    }
    const eventNames = [];
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(url, {
        accessTokenFactory: () => accessToken,
      })
      .withAutomaticReconnect()
      .build();

    Object.entries(signalRService.commonSignalR[url] || {}).forEach(
      ([eventName, handler]) => {
        connection.on(eventName, handler);
        eventNames.push(eventName);
      }
    );
    connection.onclose((error) => {
      console.error(`Connection closed for URL: ${url}`, error);
    });
    await connection.start();
    return eventNames;
  } catch (error) {
    console.error(error.toString());
  }
};

export const stopConnection = (connection) => {
  if (connection) {
    connection.stop();
  }
};

export const initObjectSignal = async () => {};
