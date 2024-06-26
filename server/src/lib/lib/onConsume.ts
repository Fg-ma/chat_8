import { Router, RtpCapabilities } from "mediasoup/node/lib/types";
import { Server as SocketIOServer } from "socket.io";
import createConsumer from "../createConsumer";
import { roomProducers, roomConsumers, workersMap } from "../mediasoupVars";
import { getWorkerByIdx } from "../workerManager";

const onConsume = async (
  event: {
    type: string;
    rtpCapabilities: RtpCapabilities;
    table_id: string;
    username: string;
    producerId?: string;
  },
  io: SocketIOServer
) => {
  // Get the next available worker and router
  const { router: mediasoupRouter } = getWorkerByIdx(
    workersMap[event.table_id]
  );

  const consumers = await createConsumer(
    event.table_id,
    event.username,
    roomProducers[event.table_id],
    event.rtpCapabilities,
    mediasoupRouter
  );

  if (!roomConsumers[event.table_id]) {
    roomConsumers[event.table_id] = {};
  }
  if (consumers) {
    roomConsumers[event.table_id][event.username] = consumers;
  } else {
    if (roomConsumers[event.table_id][event.username]) {
      delete roomConsumers[event.table_id][event.username];
    }
  }

  let newConsumers: {
    [username: string]: {
      webcam?: {
        [webcamId: string]: {
          producerId: string;
          id: string;
          kind: string;
          rtpParameters: any;
          type: string;
          producerPaused: boolean;
        };
      };
      screen?: {
        [screenId: string]: {
          producerId: string;
          id: string;
          kind: string;
          rtpParameters: any;
          type: string;
          producerPaused: boolean;
        };
      };
      audio?: {
        producerId: string;
        id: string;
        kind: string;
        rtpParameters: any;
        type: string;
        producerPaused: boolean;
      };
    };
  } = {};

  for (const producerUsername in consumers) {
    if (consumers[producerUsername].webcam) {
      if (!newConsumers[producerUsername]) {
        newConsumers[producerUsername] = {};
      }
      if (!newConsumers[producerUsername].webcam) {
        newConsumers[producerUsername].webcam = {};
      }
      for (const webcamId in consumers[producerUsername].webcam) {
        const webcam = consumers[producerUsername].webcam?.[webcamId];
        if (webcam)
          newConsumers[producerUsername].webcam![webcamId] = {
            producerId: webcam.producerId,
            id: webcam.id,
            kind: webcam.kind,
            rtpParameters: webcam.rtpParameters,
            type: webcam.type,
            producerPaused: webcam.producerPaused,
          };
      }
    }

    if (consumers[producerUsername].screen) {
      if (!newConsumers[producerUsername]) {
        newConsumers[producerUsername] = {};
      }
      if (!newConsumers[producerUsername].screen) {
        newConsumers[producerUsername].screen = {};
      }
      for (const screenId in consumers[producerUsername].screen) {
        const screen = consumers[producerUsername].screen?.[screenId];
        if (screen)
          newConsumers[producerUsername].screen![screenId] = {
            producerId: screen.producerId,
            id: screen.id,
            kind: screen.kind,
            rtpParameters: screen.rtpParameters,
            type: screen.type,
            producerPaused: screen.producerPaused,
          };
      }
    }

    if (consumers[producerUsername].audio) {
      const audioConsumerData = consumers[producerUsername].audio;

      if (!newConsumers[producerUsername]) {
        newConsumers[producerUsername] = {};
      }
      newConsumers[producerUsername].audio = {
        producerId: audioConsumerData!.producerId,
        id: audioConsumerData!.id,
        kind: audioConsumerData!.kind,
        rtpParameters: audioConsumerData!.rtpParameters,
        type: audioConsumerData!.type,
        producerPaused: audioConsumerData!.producerPaused,
      };
    }
  }

  io.to(`${event.table_id}_${event.username}`).emit("message", {
    type: "subscribed",
    data: newConsumers,
  });
};

export default onConsume;
